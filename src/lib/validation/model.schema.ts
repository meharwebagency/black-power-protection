import { z } from "zod";

export const createModelSchema = z.object({
  brand_id: z.string().uuid("Invalid brand"),
  name: z.string().min(1, "Model name is required").max(100).trim(),
  name_ar: z.string().min(1, "Arabic model name is required").max(100).trim(),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format")
    .trim(),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().min(0).default(0),
});

export const updateModelSchema = createModelSchema.partial();

export type CreateModelInput = z.infer<typeof createModelSchema>;
export type UpdateModelInput = z.infer<typeof updateModelSchema>;
