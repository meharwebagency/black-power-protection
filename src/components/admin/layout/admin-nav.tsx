"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_ITEMS } from "@/lib/constants/admin";
import type { Locale } from "@/types";

interface AdminNavProps {
  locale: Locale;
  className?: string;
}

export function AdminNav({ locale, className }: AdminNavProps) {
  const pathname = usePathname();
  const isArabic = locale === "ar";

  return (
    <nav className={cn("flex items-center gap-1", className)}>
      {ADMIN_NAV_ITEMS.map((item) => {
        const href = `/${locale}${item.href}`;
        const isActive =
          item.href === "/admin"
            ? pathname === `/${locale}/admin`
            : pathname.startsWith(href);

        return (
          <Link
            key={item.href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span className="hidden md:inline">
              {isArabic ? item.labelAr : item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
