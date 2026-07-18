"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";
import { AdminHeader } from "@/components/admin/layout/admin-header";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { ADMIN_LOCALE_KEY } from "@/components/admin/layout/admin-lang-switcher";
import { ToastProvider } from "@/components/ui/toast";
import { PageLoader } from "@/components/common/loading";
import type { Locale } from "@/types";

export default function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = React.use(params);
  const locale = localeParam as Locale;
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const { user, isLoading, error, logout } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Restore the desktop collapse preference on mount.
  React.useEffect(() => {
    try {
      setSidebarCollapsed(
        window.localStorage.getItem("admin-sidebar-collapsed") === "1"
      );
    } catch {
      // localStorage may be unavailable — default to expanded.
    }
  }, []);

  const toggleCollapse = React.useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(
          "admin-sidebar-collapsed",
          next ? "1" : "0"
        );
      } catch {
        // Ignore persistence failures; state still updates for this session.
      }
      return next;
    });
  }, []);

  // Remember the admin's language choice: if a preference was saved and the
  // current admin URL uses a different locale, redirect to the remembered one.
  // Scoped to /admin only, so the public site is unaffected.
  React.useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(ADMIN_LOCALE_KEY);
    } catch {
      saved = null;
    }
    if (
      (saved === "ar" || saved === "en") &&
      saved !== locale &&
      pathname.startsWith(`/${locale}`)
    ) {
      const nextPath = pathname.replace(
        new RegExp(`^/${locale}(?=/|$)`),
        `/${saved}`
      );
      router.replace(nextPath);
    }
  }, [locale, pathname, router]);

  React.useEffect(() => {
    if (!isLoading && error) {
      router.push(`/${locale}/login`);
    }
  }, [isLoading, error, router, locale]);

  React.useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <PageLoader text={locale === "ar" ? "جاري التحميل..." : "Loading..."} />
      </div>
    );
  }

  if (error || !user) {
    return null;
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-background">
        <AnimatePresence>
          <AdminSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={toggleCollapse}
            locale={locale}
            user={user}
            onLogout={logout}
          />
        </AnimatePresence>

        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader
            onMenuClick={() => setSidebarOpen(true)}
            locale={locale}
            user={user}
            onLogout={logout}
          />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
