import { Hono } from "hono";
import authentication from "./api/authentication";
import { logger } from "hono/logger";
import { swaggerUI } from "@hono/swagger-ui";
import { apiReference } from "@scalar/hono-api-reference";
import { openAPISpecs } from "hono-openapi";
import metadata from "../package.json";
import { OpenAPIHono } from "@hono/zod-openapi";

const app = new OpenAPIHono();
app.use(
  logger((message, ...rest) => console.log("INFO:", new Date(), message)),
);

console.log(Bun.env.NODE_ENV);

if (Bun.env.NODE_ENV === "DEVELOPMENT") {
  app.get(
    "/swagger",
    apiReference({
      spec: { url: "/openapi" },
      cdn: "https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.25.80",
    }),
  );
  app.doc(
    "/openapi",
    {
      openapi: "3.0.0",
      info: {
        title: metadata.name,
        version: metadata.version,
        description: metadata.description,
      },
      servers: [
        { url: "http://localhost:3000", description: "Local Server" },
      ],
    },
  );
}

app.route("/auth", authentication);

console.log("INFO:", new Date(), "Starting server at port: 3000");
Bun.serve({ fetch: app.fetch });
