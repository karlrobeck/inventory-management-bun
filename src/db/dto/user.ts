import { z } from "zod";

export const createUserDTOSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password_hash: z.string(),
  role: z.enum(["admin", "manager", "supplier", "customer"]),
});

export const selectUserDTOSchema = createUserDTOSchema.pick({
  name: true,
  email: true,
  role: true,
}).extend({
  id: z.number(),
  created_at: z.string().date(),
  updated_at: z.string().date(),
});

export const updateUserDTOSchema = createUserDTOSchema.partial();

export const deleteUserDTOSchema = selectUserDTOSchema.pick({ id: true });
