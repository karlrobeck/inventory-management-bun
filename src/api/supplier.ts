import { OpenAPIHono, z, createRoute } from "@hono/zod-openapi";
import { CreateSupplierDTO, SupplierDTO } from "../db/dto/supplier";
import { db } from "../db";
import { suppliers } from "../db/schema";
import { eq, like } from "drizzle-orm";

export default new OpenAPIHono()
  .openapi(
    {
      tags: ["Supplier Management"],
      method: "post",
      path: "/",
      request: {
        body: {
          content: {
            "application/json": {
              schema: CreateSupplierDTO,
            },
          },
        },
      },
      responses: {
        201: {
          description: "Successfully created a supplier",
          content: {
            "application/json": {
              schema: SupplierDTO,
            },
          },
        },
      },
    },
    async (c) => {
      const payload = c.req.valid("json");

      const supplier = await db
        .insert(suppliers)
        .values(payload)
        .returning()
        .execute();

      return c.json(SupplierDTO.parse(supplier[0]), 201);
    }
  )
  .openapi(
    {
      tags: ["Supplier Management"],
      method: "get",
      path: "/",
      request: {
        query: z.object({
          limit: z.coerce.number().max(100).default(5),
          page: z.coerce.number().default(0),
        }),
      },
      responses: {
        200: {
          description: "Successfully created a supplier",
          content: {
            "application/json": {
              schema: z.object({
                total: z.number(),
                page: z.number(),
                items: z.array(SupplierDTO),
              }),
            },
          },
        },
      },
    },
    async (c) => {
      const query = c.req.valid("query");

      const dbSuppliers = db
        .select()
        .from(suppliers)
        .limit(query.limit)
        .offset((query.page - 1) * query.limit)
        .all();

      return c.json(
        {
          total: dbSuppliers.length,
          page: query.page,
          items: dbSuppliers,
        },
        200
      );
    }
  )

  .openapi(
    {
      tags: ["Supplier Management"],
      method: "get",
      path: "/search",
      request: {
        query: z.object({
          query: z.coerce.string(),
          limit: z.coerce.number().max(100).default(5),
          searchBy: z.enum(["name", "address", "contact_info"]).default("name"),
        }),
      },
      responses: {
        200: {
          description: "Successfully created a supplier",
          content: {
            "application/json": {
              schema: z.object({
                total: z.number(),
                items: z.array(SupplierDTO),
              }),
            },
          },
        },
      },
    },
    async (c) => {
      const query = c.req.valid("query");

      const dbSuppliers = db
        .select()
        .from(suppliers)
        .where(like(suppliers.name, `%${query.query}%`))
        .limit(query.limit)
        .all();

      return c.json(
        {
          total: dbSuppliers.length,
          items: dbSuppliers,
        },
        200
      );
    }
  )
  .openapi(
    {
      tags: ["Supplier Management"],
      method: "get",
      path: "/:id",
      request: {
        params: z.object({ id: z.coerce.number() }),
      },
      responses: {
        200: {
          description: "Successfully created a supplier",
          content: {
            "application/json": {
              schema: SupplierDTO,
            },
          },
        },
      },
    },
    async (c) => {
      const params = c.req.valid("param");

      const supplier = db
        .select()
        .from(suppliers)
        .where(eq(suppliers.id, params.id))
        .all()[0];

      return c.json(SupplierDTO.parse(supplier), 200);
    }
  );
