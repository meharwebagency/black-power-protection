"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { INQUIRY_STATUS_LABELS, MESSAGE_STATUS_LABELS, VEHICLE_STATUS_LABELS } from "@/lib/constants/admin";
import type { Locale } from "@/types";

type BadgeType = "inquiry" | "message" | "vehicle";

interface StatusBadgeProps {
  status: string;
  type: BadgeType;
  locale: Locale;
  className?: string;
}

const statusMap: Record<BadgeType, Record<string, { en: string; ar: string; color: string }>> = {
  inquiry: INQUIRY_STATUS_LABELS,
  message: MESSAGE_STATUS_LABELS,
  vehicle: VEHICLE_STATUS_LABELS,
};

export function StatusBadge({ status, type, locale, className }: StatusBadgeProps) {
  const labels = statusMap[type]?.[status];
  if (!labels) return null;

  const label = locale === "ar" ? labels.ar : labels.en;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        labels.color,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
