import type { Locale } from "@/types";
import { APP_CONFIG } from "@/lib/constants";

export const locales = APP_CONFIG.locales;
export const defaultLocale = APP_CONFIG.defaultLocale;

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function getLangAttribute(locale: Locale): string {
  return locale === "ar" ? "ar" : "en";
}
