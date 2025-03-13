import { z } from "@hono/zod-openapi";

export const ErrorSchema = z.object({
  code: z.number().openapi({ description: "Code Number", example: 400 }),
  message: z.string().openapi({
    description: "Code message",
    example: "NOT FOUND",
  }),
});
