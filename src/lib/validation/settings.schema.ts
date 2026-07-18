import { z } from "zod";

export const updateSettingSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.any(),
  category: z
    .enum(["general", "contact", "social", "seo", "appearance"])
    .optional(),
  description: z.string().max(500).optional(),
});

export const bulkUpdateSettingsSchema = z.object({
  settings: z.array(updateSettingSchema).min(1).max(50),
});

export type UpdateSettingInput = z.infer<typeof updateSettingSchema>;
export type BulkUpdateSettingsInput = z.infer<typeof bulkUpdateSettingsSchema>;
