import { z } from "@hono/zod-openapi";

export const createUserDTOSchema = z.object({
  name: z.string().openapi({ example: "John doe" }),
  email: z.string().email().openapi({ example: "johndoe@gmail.com" }),
  password: z.string().openapi({ example: "Randompassword1" }),
  role: z.enum(["admin", "manager", "supplier", "customer"]).default("customer")
    .optional().openapi({
      default: "customer",
    }),
}).openapi("CreateUserDTO");

export const selectUserDTOSchema = createUserDTOSchema.pick({
  name: true,
  email: true,
  role: true,
}).extend({
  id: z.coerce.number().nonnegative().openapi({
    param: { name: "id", in: "path" },
    example: 1,
  }),
  created_at: z.string().transform((v) => new Date(v)),
  updated_at: z.string().transform((v) => new Date(v)),
}).openapi("SelectUserDTO");

export const updateUserDTOSchema = createUserDTOSchema.partial();

export const deleteUserDTOSchema = selectUserDTOSchema.pick({ id: true });
