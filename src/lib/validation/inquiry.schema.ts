import { z } from "zod";
import { inquiryStatusEnum } from "./enums";

export const createInquirySchema = z.object({
  vehicle_id: z.string().uuid("Invalid vehicle"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(8, "Phone must be at least 8 digits")
    .max(20)
    .regex(/^[\d\s+\-()]+$/, "Invalid phone format"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export const updateInquirySchema = z.object({
  status: inquiryStatusEnum.optional(),
  notes: z.string().max(5000).optional(),
  responded_at: z.string().datetime().optional(),
});

export const inquiryFilterSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  status: inquiryStatusEnum.optional(),
  vehicle_id: z.string().uuid().optional(),
  search: z.string().max(200).optional(),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
export type UpdateInquiryInput = z.infer<typeof updateInquirySchema>;
export type InquiryFilterInput = z.infer<typeof inquiryFilterSchema>;
