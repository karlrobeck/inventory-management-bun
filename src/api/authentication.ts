import {
  accessTokenDTOSchema,
  createUserDTOSchema,
  selectUserDTOSchema,
} from "../db/dto/user";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { createRoute } from "@hono/zod-openapi";
import { z } from "@hono/zod-openapi";
import { OpenAPIHono } from "@hono/zod-openapi";
import jwt from "jsonwebtoken";

export default new OpenAPIHono()
  .openapi(
    createRoute({
      tags: ["Authentication"],
      method: "post",
      path: "/register",
      request: {
        body: {
          description: "Create user payload",
          required: true,
          content: {
            "application/json": { schema: createUserDTOSchema },
          },
        },
      },
      responses: {
        302: {
          description: "Sucessfull registration, redirecting to /login",
        },
      },
    }),
    async (c) => {
      const payload = c.req.valid("json");

      await db.transaction(async (tx) => {
        try {
          await tx.insert(users).values({
            ...payload,
            role: payload.role || "customer",
            password_hash: Bun.password.hashSync(payload.password),
          }).execute();
        } catch (e) {
          console.error(e);
          tx.rollback();
        }
      });

      return c.redirect("/login", 302);
    },
  )
  .openapi(
    createRoute({
      tags: ["Authentication"],
      method: "post",
      path: "/login",
      request: {
        body: {
          description: "Email login",
          content: {
            "application/json": {
              schema: createUserDTOSchema.pick({ email: true, password: true }),
            },
          },
        },
      },
      responses: {
        200: {
          description: "Successful Login, returning access token object",
          content: {
            "application/json": {
              schema: accessTokenDTOSchema,
            },
          },
        },
        400: {
          description: "invalid email or password",
          content: {
            "text/plain": {
              schema: z.string().openapi({
                example: "invalid email or password",
              }),
            },
          },
        },
      },
    }),
    async (c) => {
      const payload = c.req.valid("json");

      const user = await db.query.users.findFirst({
        where: eq(users.email, payload.email),
      });

      if (!user) return c.text("invalid email or password", 400);

      if (!await Bun.password.verify(payload.password, user.password_hash)) {
        return c.text("invalid email or password", 400);
      }

      const claims = {
        sub: user.id,
        iss: Bun.env.JWT_ISSUER || "",
        aud: Bun.env.JWT_AUDIENCE || "",
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        nbf: Math.floor(Date.now() / 1000) - 3,
        iat: Date.now(),
        jti: crypto.randomUUID(),
      };

      const access_token = jwt.sign(
        claims,
        Bun.env.JWT_SECRET || "ssss",
      );

      const refresh_token = jwt.sign(
        { ...claims, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) },
        Bun.env.JWT_REFRESH_SECRET || "ssss",
      );

      return c.json(
        accessTokenDTOSchema.parse({
          access_token,
          refresh_token,
          token_type: "Bearer",
          exp: 60 * 60,
        }),
        200,
      );
    },
  )
  .openapi(
    createRoute({
      tags: ["Authentication", "User management"],
      method: "get",
      path: "/users/:id",
      request: {
        params: selectUserDTOSchema.pick({ id: true }),
      },
      responses: {
        200: {
          description: "User information",
          content: {
            "application/json": {
              schema: selectUserDTOSchema,
            },
          },
        },
        404: {
          description: "user not found",
          content: {
            "text/plain": {
              schema: z.string().openapi({
                example: "user not found",
              }),
            },
          },
        },
      },
    }),
    async (c) => {
      const payload = c.req.valid("param");
      const user = await db.query.users.findFirst({
        where: eq(users.id, payload.id),
      });

      if (!user) return c.text("user not found", 404);

      return c.json(selectUserDTOSchema.parse(user), 200);
    },
  );
