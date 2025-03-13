import { z } from "@hono/zod-openapi"
/* 
export const suppliers = sqliteTable("suppliers", {
  name: text("name").notNull(),
  contact_info: text("contact_info").notNull(),
  address: text("address").notNull(),
});
*/

export const CreateSupplierDTO = z.object({
    name: z.string().min(1).openapi({ description: "Name of the supplier", example: "Hardware LLC" }),
    contact_info: z.string().min(1).openapi({ description: "Contact information" }),
    address: z.string().min(1).openapi({ description: "Supplier Address" }),
})

export const SupplierDTO = CreateSupplierDTO.extend({
    id: z.number().openapi({description:"Supplier ID",example:1}),
})

export const UpdateSupplierDTO = CreateSupplierDTO.partial();

export const RemoveSupplierDTO = SupplierDTO.pick({ id: true })