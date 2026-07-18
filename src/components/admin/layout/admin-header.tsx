"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell, Sun, Moon, Search, ChevronDown, LogOut, Shield, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AdminLangSwitcher } from "@/components/admin/layout/admin-lang-switcher";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/breadcrumbs";
import {
  ADMIN_NAV_ITEMS,
  ADMIN_NAV_SECONDARY,
  ADMIN_ROLE_LABELS,
} from "@/lib/constants/admin";
import type { Locale } from "@/types";

interface AdminHeaderProps {
  onMenuClick: () => void;
  locale: Locale;
  user: {
    email: string;
    role: string;
    full_name: string;
  } | null;
  onLogout: () => void;
}

// Human-readable labels for path segments that aren't top-level nav items.
const SEGMENT_LABELS: Record<string, { en: string; ar: string }> = {
  new: { en: "Add Vehicle", ar: "إضافة سيارة" },
  edit: { en: "Edit", ar: "تعديل" },
};

export function AdminHeader({ onMenuClick, locale, user, onLogout }: AdminHeaderProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const isArabic = locale === "ar";
  const [profileOpen, setProfileOpen] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);

  const allNav = [...ADMIN_NAV_ITEMS, ...ADMIN_NAV_SECONDARY];

  // Resolve the current page title from the deepest matching nav item.
  const currentPage = allNav
    .filter((item) => {
      const full = `/${locale}${item.href}`;
      return pathname === full || pathname.startsWith(`${full}/`);
    })
    .sort((a, b) => b.href.length - a.href.length)[0];

  const pageTitle = currentPage
    ? isArabic
      ? currentPage.labelAr
      : currentPage.label
    : isArabic
      ? "لوحة التحكم"
      : "Dashboard";

  // Build breadcrumb trail from the admin path segments.
  const breadcrumbs = React.useMemo<BreadcrumbItem[]>(() => {
    const items: BreadcrumbItem[] = [
      { label: isArabic ? "لوحة التحكم" : "Dashboard", href: `/${locale}/admin` },
    ];
    const afterAdmin = pathname.split(`/${locale}/admin`)[1] || "";
    const segments = afterAdmin.split("/").filter(Boolean);

    let acc = `/${locale}/admin`;
    segments.forEach((seg, idx) => {
      acc += `/${seg}`;
      const navMatch = allNav.find((n) => `/${locale}${n.href}` === acc);
      const known = SEGMENT_LABELS[seg];
      let label: string;
      if (navMatch) label = isArabic ? navMatch.labelAr : navMatch.label;
      else if (known) label = isArabic ? known.ar : known.en;
      else label = seg.length > 12 ? `${seg.slice(0, 8)}…` : seg;
      const isLast = idx === segments.length - 1;
      items.push({ label, href: isLast ? undefined : acc });
    });
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, locale, isArabic]);

  // Close the profile menu on outside click.
  React.useEffect(() => {
    if (!profileOpen) return;
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileOpen]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Menu + Title + Breadcrumb */}
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onMenuClick}
          className="lg:hidden"
          aria-label={isArabic ? "فتح القائمة" : "Open menu"}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="min-w-0">
          <h1 className="truncate font-display text-body-lg font-bold text-foreground">
            {pageTitle}
          </h1>
          {breadcrumbs.length > 1 && (
            <Breadcrumbs
              items={breadcrumbs}
              locale={locale}
              className="mt-0.5 hidden sm:flex"
            />
          )}
        </div>
      </div>

      {/* Right: Search + Actions */}
      <div className="flex items-center gap-2">
        {/* Search bar */}
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder={isArabic ? "بحث..." : "Search..."}
            className="h-9 w-44 rounded-lg border border-border bg-secondary/40 ps-9 pe-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-background lg:w-56"
          />
        </div>

        <AdminLangSwitcher locale={locale} />

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="relative text-muted-foreground hover:text-foreground"
          aria-label={isArabic ? "الإشعارات" : "Notifications"}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute end-1 top-1 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-muted-foreground hover:text-foreground"
          aria-label={isArabic ? "تبديل المظهر" : "Toggle theme"}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* Profile menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg p-1 pe-2 transition-colors hover:bg-secondary"
            aria-label={isArabic ? "قائمة الحساب" : "Account menu"}
            aria-expanded={profileOpen}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <span className="hidden max-w-24 truncate text-sm font-medium text-foreground lg:inline">
              {user?.full_name || "Admin"}
            </span>
            <ChevronDown
              className={cn(
                "hidden h-4 w-4 text-muted-foreground transition-transform lg:block",
                profileOpen && "rotate-180"
              )}
            />
          </button>

          {profileOpen && (
            <div
              className={cn(
                "absolute top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-background shadow-elevated-lg",
                isArabic ? "start-0" : "end-0"
              )}
            >
              <div className="border-b border-border p-3">
                <p className="truncate text-sm font-medium text-foreground">
                  {user?.full_name || "Admin"}
                </p>
                <p className="truncate text-body-xs text-muted-foreground">
                  {user?.email}
                </p>
                {user && (
                  <span className="mt-1.5 inline-block rounded-md bg-primary/10 px-2 py-0.5 text-2xs font-medium text-primary">
                    {isArabic
                      ? ADMIN_ROLE_LABELS[user.role]?.ar
                      : ADMIN_ROLE_LABELS[user.role]?.en}
                  </span>
                )}
              </div>
              <div className="p-1.5">
                <Link
                  href={`/${locale}/admin/settings`}
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Settings className="h-4 w-4" />
                  {isArabic ? "الإعدادات" : "Settings"}
                </Link>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  {isArabic ? "تسجيل الخروج" : "Logout"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
