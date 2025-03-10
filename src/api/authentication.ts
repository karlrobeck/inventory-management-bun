import { Hono } from "hono";

export default new Hono()
  .post("/register", (c) => {
    return c.text("register endpoint");
  })
  .post("/login", (c) => c.text("login endpoint"))
  .delete("/logout", (c) => c.text("logout endpoint"))
  .get("/users", (c) => c.text("users info endpoint"));
