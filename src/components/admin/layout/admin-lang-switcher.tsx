"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";

// Shared key so the admin layout can read the remembered preference on load.
export const ADMIN_LOCALE_KEY = "admin-locale";

interface AdminLangSwitcherProps {
  locale: Locale;
}

/**
 * Admin-only language switcher (EN / AR).
 * - Swaps only the leading locale segment of the current admin URL.
 * - Persists the choice to localStorage so it is remembered next visit.
 * This is scoped to the admin panel and does not touch the public site.
 */
export function AdminLangSwitcher({ locale }: AdminLangSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    try {
      window.localStorage.setItem(ADMIN_LOCALE_KEY, next);
    } catch {
      // localStorage may be unavailable (private mode) — switching still works.
    }
    const nextPath =
      pathname.replace(new RegExp(`^/${locale}(?=/|$)`), `/${next}`) ||
      `/${next}/admin`;
    router.push(nextPath);
  };

  const options: { code: Locale; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "ar", label: "ع" },
  ];

  return (
    <div className="flex items-center rounded-lg border border-border bg-background p-0.5">
      {options.map((opt) => {
        const active = opt.code === locale;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => switchTo(opt.code)}
            aria-pressed={active}
            aria-label={opt.code === "ar" ? "العربية" : "English"}
            className={cn(
              "min-w-8 rounded-md px-2 py-1 text-xs font-semibold transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
