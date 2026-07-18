"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/breadcrumbs";
import type { Locale } from "@/types";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  locale?: Locale;
  // Breadcrumb trail rendered above the title.
  breadcrumbs?: BreadcrumbItem[];
  // When set, renders a Back button. `true` uses router.back(); a string is
  // treated as an explicit href to navigate to.
  back?: boolean | string;
  backLabel?: string;
}

export function PageHeader({
  title,
  description,
  children,
  actions,
  locale = "en",
  breadcrumbs,
  back,
  backLabel,
}: PageHeaderProps) {
  const router = useRouter();
  const trailing = actions ?? children;
  const isArabic = locale === "ar";
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  const backText = backLabel ?? (isArabic ? "رجوع" : "Back");

  const backButton = back ? (
    typeof back === "string" ? (
      <Link
        href={back}
        className="inline-flex w-fit items-center gap-1.5 text-body-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <BackIcon className="h-4 w-4" />
        {backText}
      </Link>
    ) : (
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex w-fit items-center gap-1.5 text-body-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <BackIcon className="h-4 w-4" />
        {backText}
      </button>
    )
  ) : null;

  return (
    <div className="space-y-3">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} locale={locale} />
      )}
      {backButton}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-display-xs font-bold text-foreground">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-body-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {trailing && (
          <div className={cn("flex items-center gap-3")}>{trailing}</div>
        )}
      </div>
    </div>
  );
}
