"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  X,
  LogOut,
  Shield,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ADMIN_NAV_ITEMS,
  ADMIN_NAV_SECONDARY,
  ADMIN_ROLE_LABELS,
  isNavItemActive,
  type AdminNavItem,
} from "@/lib/constants/admin";
import type { Locale } from "@/types";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  locale: Locale;
  user: {
    email: string;
    role: string;
    full_name: string;
  } | null;
  onLogout: () => void;
}

export function AdminSidebar({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
  locale,
  user,
  onLogout,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const isArabic = locale === "ar";

  const renderNavItem = (item: AdminNavItem) => {
    const href = `/${locale}${item.href}`;
    const isActive = isNavItemActive(item, pathname, locale);
    const Icon = item.icon;
    const label = isArabic ? item.labelAr : item.label;

    return (
      <li key={item.href}>
        <Link
          href={href}
          onClick={onClose}
          title={isCollapsed ? label : undefined}
          className={cn(
            "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
            isCollapsed && "lg:justify-center lg:px-0",
            isActive
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          <Icon className="h-5 w-5 shrink-0" />
          <span className={cn(isCollapsed && "lg:hidden")}>{label}</span>
          {isActive && (
            <motion.span
              layoutId="admin-nav-indicator"
              className={cn(
                "absolute h-6 w-1 rounded-e-full bg-primary",
                isArabic ? "end-0" : "start-0"
              )}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
        </Link>
      </li>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : isArabic ? "100%" : "-100%",
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-y-0 z-50 flex flex-col border-e border-border bg-background transition-[width] duration-300",
          "lg:relative lg:translate-x-0",
          isCollapsed ? "w-72 lg:w-20" : "w-72",
          "start-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link
            href={`/${locale}/admin`}
            className={cn(
              "flex items-center gap-3 overflow-hidden",
              isCollapsed && "lg:w-full lg:justify-center"
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl gold-gradient">
              <span className="font-display text-sm font-medium text-white">
                D
              </span>
            </div>
            <div className={cn("min-w-0", isCollapsed && "lg:hidden")}>
              <p className={cn(
                "truncate font-display text-sm text-foreground",
                isArabic ? "font-bold" : "font-medium"
              )}>
                {isArabic ? "ديمو موقع بيع السيارات" : "Demo of Car Selling Website"}
              </p>
              <p className="truncate text-body-xs text-muted-foreground">
                {isArabic ? "لوحة التحكم" : "Admin Panel"}
              </p>
            </div>
          </Link>

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className={cn(
              "hidden rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground lg:block",
              isCollapsed && "lg:hidden"
            )}
            aria-label={isArabic ? "طي القائمة" : "Collapse sidebar"}
          >
            <PanelLeftClose className={cn("h-5 w-5", isArabic && "rotate-180")} />
          </button>

          {/* Mobile close */}
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground lg:hidden"
            aria-label={isArabic ? "إغلاق" : "Close"}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Expand button shown only when collapsed (desktop) */}
        {isCollapsed && (
          <button
            onClick={onToggleCollapse}
            className="mx-auto mt-3 hidden rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground lg:block"
            aria-label={isArabic ? "توسيع القائمة" : "Expand sidebar"}
          >
            <PanelLeftOpen className={cn("h-5 w-5", isArabic && "rotate-180")} />
          </button>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">{ADMIN_NAV_ITEMS.map(renderNavItem)}</ul>

          <div className="my-4 border-t border-border" />
          <p
            className={cn(
              "px-3 pb-2 text-2xs font-semibold uppercase tracking-wider text-muted-foreground/70",
              isCollapsed && "lg:hidden"
            )}
          >
            {isArabic ? "الكتالوج" : "Catalog"}
          </p>
          <ul className="space-y-1">{ADMIN_NAV_SECONDARY.map(renderNavItem)}</ul>
        </nav>

        {/* User section */}
        <div className="border-t border-border p-4">
          <div
            className={cn(
              "flex items-center gap-3",
              isCollapsed && "lg:flex-col lg:gap-2"
            )}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div
              className={cn(
                "flex-1 overflow-hidden",
                isCollapsed && "lg:hidden"
              )}
            >
              <p className="truncate text-sm font-medium text-foreground">
                {user?.full_name || "Admin"}
              </p>
              <p className="truncate text-body-xs text-muted-foreground">
                {user
                  ? isArabic
                    ? ADMIN_ROLE_LABELS[user.role]?.ar
                    : ADMIN_ROLE_LABELS[user.role]?.en
                  : ""}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onLogout}
              className="shrink-0 text-muted-foreground hover:text-destructive"
              aria-label={isArabic ? "تسجيل الخروج" : "Logout"}
              title={isArabic ? "تسجيل الخروج" : "Logout"}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
