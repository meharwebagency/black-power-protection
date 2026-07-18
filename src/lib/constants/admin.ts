import {
  LayoutDashboard,
  Car,
  MessageCircleQuestion,
  Mail,
  Tag,
  Smartphone,
  Settings,
  Plus,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  labelAr: string;
  href: string;
  icon: LucideIcon;
  // When true, the item is active only on an exact path match (not descendants).
  exact?: boolean;
}

// Primary navigation — the day-to-day admin actions.
export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    label: "Dashboard",
    labelAr: "لوحة التحكم",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Vehicles",
    labelAr: "السيارات",
    href: "/admin/vehicles",
    icon: Car,
  },
  {
    label: "Add Vehicle",
    labelAr: "إضافة سيارة",
    href: "/admin/vehicles/new",
    icon: Plus,
    exact: true,
  },
  {
    label: "Inquiries",
    labelAr: "الاستفسارات",
    href: "/admin/inquiries",
    icon: MessageCircleQuestion,
  },
  {
    label: "Messages",
    labelAr: "الرسائل",
    href: "/admin/messages",
    icon: Mail,
  },
  {
    label: "Settings",
    labelAr: "الإعدادات",
    href: "/admin/settings",
    icon: Settings,
  },
];

// Secondary navigation — catalog management, grouped separately so the
// primary list stays focused while these pages remain reachable.
export const ADMIN_NAV_SECONDARY: AdminNavItem[] = [
  {
    label: "Brands",
    labelAr: "العلامات التجارية",
    href: "/admin/brands",
    icon: Tag,
  },
  {
    label: "Models",
    labelAr: "الموديلات",
    href: "/admin/models",
    icon: Smartphone,
  },
];

/**
 * Whether a nav item should render as active for the current path.
 * `exact` items match only their own path; others also match descendants.
 * The "Vehicles" list is kept inactive on the "/vehicles/new" create route so
 * it doesn't light up alongside the dedicated "Add Vehicle" item.
 */
export function isNavItemActive(
  item: AdminNavItem,
  pathname: string,
  locale: string
): boolean {
  const full = `/${locale}${item.href}`;
  if (item.exact) return pathname === full;
  if (item.href === "/admin/vehicles") {
    return (
      pathname.startsWith(full) && pathname !== `/${locale}/admin/vehicles/new`
    );
  }
  return pathname === full || pathname.startsWith(`${full}/`);
}

export const ADMIN_ROLE_LABELS: Record<string, { en: string; ar: string }> = {
  super_admin: { en: "Super Admin", ar: "مدير عام" },
  admin: { en: "Admin", ar: "مدير" },
  editor: { en: "Editor", ar: "محرر" },
};

export const INQUIRY_STATUS_LABELS: Record<
  string,
  { en: string; ar: string; color: string }
> = {
  new: { en: "New", ar: "جديد", color: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  contacted: { en: "Contacted", ar: "تم الاتصال", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  qualified: { en: "Qualified", ar: "مؤهل", color: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  closed_won: { en: "Won", ar: "مكتسب", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  closed_lost: { en: "Lost", ar: "خاسر", color: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300" },
};

export const MESSAGE_STATUS_LABELS: Record<
  string,
  { en: string; ar: string; color: string }
> = {
  unread: { en: "Unread", ar: "غير مقروء", color: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  read: { en: "Read", ar: "مقروء", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  archived: { en: "Archived", ar: "مؤرشف", color: "bg-muted text-muted-foreground" },
};

export const VEHICLE_STATUS_LABELS: Record<
  string,
  { en: string; ar: string; color: string }
> = {
  available: { en: "Available", ar: "متاح", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  sold: { en: "Sold", ar: "مباع", color: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300" },
  reserved: { en: "Reserved", ar: "محجوز", color: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  pending: { en: "Pending", ar: "قيد الانتظار", color: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  draft: { en: "Draft", ar: "مسودة", color: "bg-muted text-muted-foreground" },
};
