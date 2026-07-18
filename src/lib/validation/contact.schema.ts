import { z } from "zod";
import { messageStatusEnum } from "./enums";

export const createContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .max(20)
    .regex(/^[\d\s+\-()]*$/, "Invalid phone format")
    .optional()
    .or(z.literal("")),
  subject: z.string().max(200).optional().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

export const updateContactSchema = z.object({
  status: messageStatusEnum.optional(),
  notes: z.string().max(5000).optional(),
});

export const contactFilterSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  status: messageStatusEnum.optional(),
  search: z.string().max(200).optional(),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
export type ContactFilterInput = z.infer<typeof contactFilterSchema>;
