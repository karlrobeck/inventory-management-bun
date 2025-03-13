import { Hono } from "hono";
import authentication from "./api/authentication";
import { logger } from "hono/logger";
import { swaggerUI } from "@hono/swagger-ui";
import { apiReference } from "@scalar/hono-api-reference";
import { openAPISpecs } from "hono-openapi";
import metadata from "../package.json";
import { OpenAPIHono } from "@hono/zod-openapi";
import inventory from "./api/inventory";
import supplier from "./api/supplier";
import type { db } from "./db";

type DrizzleDatabase = typeof db;

const app = new OpenAPIHono();

app.openAPIRegistry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

app.use(
  logger((message, ...rest) => console.log("INFO:", new Date(), message))
);

console.log(Bun.env.NODE_ENV);

if (Bun.env.NODE_ENV === "DEVELOPMENT") {
  app.get(
    "/scalar",
    apiReference({
      spec: { url: "/openapi" },
      theme: "deepSpace",
      // cdn: "https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.25.80",
    })
  );
  app.doc("/openapi", {
    openapi: "3.0.0",
    info: {
      title: metadata.name,
      version: metadata.version,
      description: metadata.description,
    },
    servers: [
      { url: "http://localhost:3000", description: "Local Server" },
      {
        url: "https://glowing-telegram-x5547rjx6rvc9xwx-3000.app.github.dev",
        description: "Github Codespace",
      },
    ],
  });
}

app.route("/auth", authentication);
app.route("/inventory", inventory);
app.route("/supplier", supplier);

console.log("INFO:", new Date(), "Starting server at port: 3000");
Bun.serve({ fetch: app.fetch });
