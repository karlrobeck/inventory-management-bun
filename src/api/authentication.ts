import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createUserDTOSchema, selectUserDTOSchema } from "../db/dto/user";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { createRoute } from "@hono/zod-openapi";
import { resolver } from "hono-openapi/zod";
import { z } from "@hono/zod-openapi";
import { OpenAPIHono } from "@hono/zod-openapi";

export default new OpenAPIHono()
  .openapi(
    createRoute({
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
      method: "post",
      path: "/login",
      request: {
        body: {
          description: "Email login",
          required: true,
          content: {
            "application/json": {
              schema: createUserDTOSchema.pick({ email: true, password: true }),
            },
          },
        },
      },
      responses: {
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
        200: {
          description: "Sucessfull registration, redirecting to /login",
        },
      },
    }),
    async (c) => {
      const payload = c.req.valid("json");

      const user = await db.query.users.findFirst({
        where: eq(users.email, payload.email),
      });

      if (!user) return c.text("invalid email or password", 400);

      if (await Bun.password.verify(payload.password, user.password_hash)) {
        return c.text("invalid email or password", 400);
      }

      // TODO: generate token here and return jwt

      return c.text("login endpoint");
    },
  )
  .openapi(
    createRoute({
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
  )
  .delete("/logout", (c) => c.text("logout endpoint"));
