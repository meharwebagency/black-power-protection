import { z } from "zod";
import {
  vehicleStatusEnum,
  fuelTypeEnum,
  transmissionEnum,
  bodyTypeEnum,
} from "./enums";

const currentYear = new Date().getFullYear();

export const createVehicleSchema = z.object({
  brand_id: z.string().uuid("Invalid brand"),
  model_id: z.string().uuid("Invalid model"),
  year: z
    .number()
    .int()
    .min(1950, "Year must be 1950 or later")
    .max(currentYear + 1, `Year cannot exceed ${currentYear + 1}`),
  price: z
    .number()
    .positive("Price must be positive")
    .max(999_999_999.999, "Price is too high"),
  currency: z.string().length(3).default("KWD"),
  mileage: z.number().int().min(0, "Mileage cannot be negative").max(999_999),
  fuel_type: fuelTypeEnum,
  transmission: transmissionEnum,
  body_type: bodyTypeEnum,
  engine_size: z.string().max(20).optional().nullable(),
  horsepower: z
    .number()
    .int()
    .min(0)
    .max(2000)
    .optional()
    .nullable(),
  color: z.string().min(1, "Color is required").max(50),
  color_ar: z.string().min(1, "Arabic color is required").max(50),
  interior_color: z.string().max(50).optional().nullable(),
  interior_color_ar: z.string().max(50).optional().nullable(),
  description: z.string().max(5000).default(""),
  description_ar: z.string().max(5000).default(""),
  features: z.array(z.string().max(100)).max(50).default([]),
  features_ar: z.array(z.string().max(100)).max(50).default([]),
  vin: z
    .string()
    .length(17, "VIN must be exactly 17 characters")
    .optional()
    .nullable(),
  status: vehicleStatusEnum.default("draft"),
  is_featured: z.boolean().default(false),
  featured_order: z.number().int().min(0).max(999).optional().nullable(),
  seo_title: z.string().max(70).optional().nullable(),
  seo_title_ar: z.string().max(70).optional().nullable(),
  seo_description: z.string().max(160).optional().nullable(),
  seo_description_ar: z.string().max(160).optional().nullable(),
});

export const updateVehicleSchema = createVehicleSchema.partial();

export const vehicleFilterSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(48).default(12),
  brand: z.string().optional(),
  model: z.string().optional(),
  year_from: z.coerce.number().int().min(1950).optional(),
  year_to: z.coerce.number().int().max(currentYear + 1).optional(),
  price_from: z.coerce.number().min(0).optional(),
  price_to: z.coerce.number().max(999_999_999).optional(),
  fuel_type: fuelTypeEnum.optional(),
  transmission: transmissionEnum.optional(),
  body_type: bodyTypeEnum.optional(),
  status: vehicleStatusEnum.optional(),
  search: z.string().max(200).optional(),
  sort: z
    .enum([
      "newest",
      "oldest",
      "price_asc",
      "price_desc",
      "mileage_asc",
      "mileage_desc",
    ])
    .default("newest"),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type VehicleFilterInput = z.infer<typeof vehicleFilterSchema>;
