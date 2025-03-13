import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { CreateInventoryDTO, InventoryDTO } from "../db/dto/inventory";

export default new OpenAPIHono()
  .openapi(
    createRoute({
      tags: ["Inventory management"],
      security: [{ "bearerAuth": [] }],
      method: "post",
      path: "/",
      request: {
        body: {
          content: {
            "application/json": {
              schema: CreateInventoryDTO,
            },
          },
        },
      },
      responses: {
        200: {
          description: "create inventory information",
          content: {
            "application/json": {
              schema: InventoryDTO,
            },
          },
        },
      },
    }),
    async (c) => {
      const payload = c.req.valid("json");

      return c.json("inventory");
    },
  )
  .openapi(
    createRoute({
      tags: ["Inventory management"],
      security: [{ "bearerAuth": [] }],
      method: "get",
      path: "/",
      request: {
        query: z.object({
          limit: z.number().default(100),
          page: z.number().default(1),
        }),
      },
      responses: {
        200: {
          description: "get inventory information",
          content: {
            "application/json": {
              schema: z.object({
                total: z.number(),
                page: z.number(),
                items: z.array(InventoryDTO),
              }),
            },
          },
        },
      },
    }),
    async (c) => {
      return c.text("inventory");
    },
  )
  .openapi(
    createRoute({
      tags: ["Inventory management"],
      security: [{ "bearerAuth": [] }],
      method: "get",
      path: "/search",
      request: {
        query: z.object({
          query: z.string(),
          by: z.enum(["product", "warehouse"]).default("product"),
          limit: z.number().max(100).default(20),
        }),
      },
      responses: {
        200: {
          description: "get inventory information",
          content: {
            "application/json": {
              schema: z.object({
                total: z.number(),
                items: z.array(InventoryDTO),
              }),
            },
          },
        },
      },
    }),
    async (c) => {
      return c.text("inventory");
    },
  )
  .openapi(
    createRoute({
      tags: ["Inventory management"],
      security: [{ "bearerAuth": [] }],
      method: "get",
      path: "/:id",
      security: [],
      responses: {
        200: {
          description: "get inventory information",
          content: {
            "application/json": {
              schema: InventoryDTO,
            },
          },
        },
      },
    }),
    async (c) => {
      return c.text("inventory");
    },
  )
  .openapi(
    createRoute({
      tags: ["Inventory management"],
      security: [{ "bearerAuth": [] }],
      method: "patch",
      path: "/:id",
      responses: {
        200: {
          description: "get inventory information",
          content: {
            "application/json": {
              schema: InventoryDTO,
            },
          },
        },
      },
    }),
    async (c) => {
      return c.text("inventory");
    },
  )
  .openapi(
    createRoute({
      tags: ["Inventory management"],
      security: [{ "bearerAuth": [] }],
      method: "delete",
      path: "/:id",
      responses: {
        200: {
          description: "get inventory information",
          content: {
            "application/json": {
              schema: z.object({}),
            },
          },
        },
      },
    }),
    async (c) => {
      return c.text("inventory");
    },
  );
