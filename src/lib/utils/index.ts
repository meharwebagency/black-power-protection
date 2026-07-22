import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, locale: string = "ar-KW"): string {
  return new Intl.NumberFormat(locale, {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
    numberingSystem: "latn",
  }).format(amount);
}

export function formatNumber(value: number, locale: string = "ar-KW"): string {
  return new Intl.NumberFormat(locale, {
    numberingSystem: "latn",
  }).format(value);
}

export function formatDate(date: string | Date, locale: string = "ar-KW"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateMetaTitle(pageTitle: string, locale: string): string {
  const siteName = locale === "ar" ? "بلاك باور بروتكشن" : "BLACK POWER PROTECTION";
  const separator = locale === "ar" ? " | " : " | ";
  return `${pageTitle}${separator}${siteName}`;
}

export function getLocalizedField<T extends { [key: string]: unknown }>(
  obj: T,
  field: string,
  locale: string
): string {
  const arField = locale === "ar" ? `${field}_ar` : field;
  return (obj[arField] as string) || (obj[field] as string) || "";
}
