import { z } from "zod";

export const vehicleStatusEnum = z.enum([
  "available",
  "sold",
  "reserved",
  "pending",
  "draft",
]);

export const fuelTypeEnum = z.enum([
  "gasoline",
  "diesel",
  "electric",
  "hybrid",
  "plug_in_hybrid",
]);

export const transmissionEnum = z.enum([
  "automatic",
  "manual",
  "cvt",
  "dual_clutch",
]);

export const bodyTypeEnum = z.enum([
  "sedan",
  "suv",
  "coupe",
  "convertible",
  "hatchback",
  "truck",
  "van",
  "wagon",
  "pickup",
]);

export const imageTypeEnum = z.enum(["primary", "gallery", "detail", "interior"]);

export const inquiryStatusEnum = z.enum([
  "new",
  "contacted",
  "qualified",
  "closed_won",
  "closed_lost",
]);

export const messageStatusEnum = z.enum(["unread", "read", "archived"]);

export const userRoleEnum = z.enum(["super_admin", "admin", "editor"]);
