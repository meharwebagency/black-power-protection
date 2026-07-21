"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { formatCurrency, cn } from "@/lib/utils";
import { CURRENCY } from "@/lib/constants";
import { fadeUp } from "@/lib/motion";
import type { Vehicle } from "@/types/vehicle";
import type { Locale } from "@/types";

interface VehicleCardProps {
  vehicle: Vehicle;
  locale: Locale;
  className?: string;
}

export function VehicleCard({ vehicle, locale, className }: VehicleCardProps) {
  const isAr = locale === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);

  const isSold = vehicle.status === "sold";
  const isFeatured = vehicle.featured;

  const make = isAr ? vehicle.makeAr : vehicle.make;
  const model = isAr ? vehicle.modelAr : vehicle.model;
  const fuelType = isAr ? vehicle.fuelTypeAr : vehicle.fuelType;
  const transmission = isAr ? vehicle.transmissionAr : vehicle.transmission;

  const primaryImage =
    vehicle.images?.find((img) => img.isPrimary) || vehicle.images?.[0];

  const mileage = new Intl.NumberFormat(isAr ? "ar-KW" : "en-US").format(
    vehicle.mileage
  );

  /* Only non-default states are announced — availability is assumed */
  const statusLabel = (() => {
    switch (vehicle.status) {
      case "sold":
        return t("مباعة", "Sold");
      case "reserved":
        return t("محجوزة", "Reserved");
      case "pending":
        return t("قيد المراجعة", "Pending");
      default:
        return null;
    }
  })();

  return (
    <motion.article
      variants={fadeUp}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card",
        "transition-colors duration-500",
        !isSold && "hover:border-foreground/15",
        className
      )}
    >
      {/* Featured — a single gold hairline, no badge */}
      {isFeatured && !isSold && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-10 h-px bg-accent"
        />
      )}

      {/* Image — codified 3:2 catalog ratio */}
      <div className="relative aspect-[3/2] overflow-hidden bg-secondary/40">
        <div
          className={cn(
            "absolute inset-0 transition-transform duration-700 ease-luxury",
            !isSold && "group-hover:scale-[1.03]",
            isSold && "grayscale opacity-70"
          )}
        >
          <ImagePlaceholder
            src={primaryImage?.url || undefined}
            fill
            alt={primaryImage?.alt || `${make} ${model} ${vehicle.year}`}
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            rounded="none"
          />
        </div>

        {/* Status — quiet letterspaced chip, top-left, non-default states only */}
        {statusLabel && (
          <span
            className={cn(
              "absolute start-4 top-4 bg-background/85 px-2.5 py-1 backdrop-blur-sm",
              "text-2xs font-medium text-foreground",
              !isAr && "uppercase tracking-[0.14em]"
            )}
          >
            {statusLabel}
          </span>
        )}
        {/* Condition badge — premium pill, top-right */}
        <span
          className={cn(
            "absolute end-4 top-4 rounded-full px-2.5 py-0.5",
            "text-2xs font-semibold leading-5 backdrop-blur-sm",
            vehicle.condition === "new"
              ? "bg-[#16A34A] text-white"
              : "bg-[#D4AF37] text-black"
          )}
        >
          {vehicle.condition === "new" ? "NEW" : "USED"}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Name — the card's single link, stretched over the whole card */}
        <h3 className="font-display text-base font-semibold leading-snug text-foreground">
          <Link
            href={`/${locale}/vehicles/${vehicle.slug}`}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm after:absolute after:inset-0 after:content-['']"
          >
            <span className="line-clamp-1">
              {make} {model}
            </span>
          </Link>
        </h3>

        {/* Specs — one quiet metadata line, no icons, no chips */}
        <p className="mt-1.5 text-xs text-muted-foreground">
          {vehicle.year}
          <span aria-hidden="true" className="mx-1.5">·</span>
          {mileage} {t("كم", "km")}
          <span className="hidden sm:inline">
            <span aria-hidden="true" className="mx-1.5">·</span>
            {fuelType}
            <span aria-hidden="true" className="mx-1.5">·</span>
            {transmission}
          </span>
        </p>

        {/* Price row */}
        <div className="mt-4 border-t border-border/60 pt-4">
          {isSold ? (
            <span
              className={cn(
                "text-sm text-muted-foreground",
                !isAr && "uppercase tracking-[0.08em]"
              )}
            >
              {t("مباعة", "Sold")}
            </span>
          ) : (
            <span className="text-base font-semibold text-foreground">
              {formatCurrency(vehicle.price)}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                {CURRENCY.symbol}
              </span>
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export type { VehicleCardProps };
