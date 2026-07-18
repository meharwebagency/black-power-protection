import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
});

export const createAdminSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
  full_name: z.string().min(2).max(100),
  full_name_ar: z.string().max(100).optional(),
  role: z.enum(["super_admin", "admin", "editor"]).default("editor"),
  phone: z.string().max(20).optional(),
});

export const updateProfileSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  full_name_ar: z.string().max(100).optional(),
  avatar_url: z.string().url().optional().nullable(),
  phone: z.string().max(20).optional(),
});

export const updateAdminRoleSchema = z.object({
  user_id: z.string().uuid(),
  role: z.enum(["super_admin", "admin", "editor"]),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
