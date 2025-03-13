import { z } from "@hono/zod-openapi";
/*
export const inventory = sqliteTable("inventory", {
  warehouse_id: integer("warehouse_id").references(() => warehouses.id)
    .notNull(),
  product_id: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
});
*/

export const CreateInventoryDTO = z.object({
  warehouse_id: z.number().openapi({ description: "Warehouse ID" }),
  product_id: z.number().openapi({ description: "Product ID" }),
  quantity: z.number().min(1),
});

export const SelectInventoryDTO = CreateInventoryDTO.pick({
  warehouse_id: true,
  product_id: true,
});

export const UpdateInventoryDTO = CreateInventoryDTO;

export const RemoveInventoryDTO = SelectInventoryDTO;

export const InventoryDTO = z.object({
  warehouse: z.object({}),
  product: z.object({}),
  quantity: z.number(),
}).openapi("InventorySchema");
