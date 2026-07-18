export type Locale = "ar" | "en";

export interface AppConfig {
  name: string;
  nameAr: string;
  defaultLocale: Locale;
  locales: Locale[];
  description: string;
  descriptionAr: string;
  url: string;
}

export interface NavLink {
  label: string;
  labelAr: string;
  href: string;
  icon?: string;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationParams;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface SeoMetadata {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  keywords: string[];
  keywordsAr: string[];
  image?: string;
}

export type Direction = "ltr" | "rtl";
