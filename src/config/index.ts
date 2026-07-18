export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "BLACK POWER PROTECTION",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Premium Luxury Car Marketplace in Kuwait",
} as const;

export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
} as const;
