import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createUserDTOSchema, selectUserDTOSchema } from "../db/dto/user";
import { z } from "zod";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export default new Hono()
  .post("/register", zValidator("json", createUserDTOSchema), async (c) => {
    const payload = c.req.valid("json");

    await db.transaction(async (tx) => {
      try {
        await tx.insert(users).values({
          ...payload,
          password_hash: Bun.password.hashSync(payload.password),
        }).execute();
      } catch (e) {
        console.error(e);
        tx.rollback();
      }
    });

    return c.redirect("/login", 302);
  })
  .post(
    "/login",
    zValidator(
      "json",
      createUserDTOSchema.pick({ email: true, password: true }),
    ),
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
  .delete("/logout", (c) => c.text("logout endpoint"))
  .get(
    "/users/:id",
    zValidator("param", selectUserDTOSchema.pick({ id: true })),
    async (c) => {
      const payload = c.req.valid("param");
      const user = await db.query.users.findFirst({
        where: eq(users.id, payload.id),
      });

      if (!user) return c.text("user not found", 404);

      return c.json(user);
    },
  );
