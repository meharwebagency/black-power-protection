"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { formatCurrency, cn } from "@/lib/utils";
import { CURRENCY } from "@/lib/constants";
import { fadeUp } from "@/lib/motion";
import type { Vehicle } from "@/types/vehicle";
import type { Locale } from "@/types";

interface VehicleCardListingProps {
  vehicle: Vehicle;
  locale: Locale;
  onQuickView?: (vehicle: Vehicle) => void;
}

const FAVORITES_KEY = "bpp-favorites";

function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function VehicleCardListing({ vehicle, locale, onQuickView }: VehicleCardListingProps) {
  const isAr = locale === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);

  const [isFavorite, setIsFavorite] = React.useState(false);

  React.useEffect(() => {
    setIsFavorite(readFavorites().includes(vehicle.id));
  }, [vehicle.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const favorites = readFavorites();
    const next = favorites.includes(vehicle.id)
      ? favorites.filter((id) => id !== vehicle.id)
      : [...favorites, vehicle.id];
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    } catch {}
    setIsFavorite(next.includes(vehicle.id));
  };

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

  const detailHref = `/${locale}/vehicles/${vehicle.slug}`;

  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card",
        "transition-colors duration-500",
        !isSold && "hover:border-foreground/15"
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
      <Link
        href={detailHref}
        tabIndex={-1}
        aria-hidden="true"
        className="block focus-visible:outline-none"
      >
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

          {/* Status — quiet letterspaced chip, non-default states only */}
          {statusLabel && (
            <span
              className={cn(
                "absolute start-4 top-4 bg-background/85 px-2.5 py-1 backdrop-blur-sm",
                "text-[0.625rem] font-medium text-foreground",
                !isAr && "uppercase tracking-[0.14em]"
              )}
            >
              {statusLabel}
            </span>
          )}
        </div>
      </Link>

      {/* Favorite — appears on hover/focus, persisted locally */}
      <button
        type="button"
        onClick={toggleFavorite}
        aria-label={
          isFavorite
            ? t("إزالة من المفضلة", "Remove from favorites")
            : t("إضافة إلى المفضلة", "Add to favorites")
        }
        aria-pressed={isFavorite}
        className={cn(
          "absolute end-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full",
          "bg-background/85 text-foreground backdrop-blur-sm",
          "transition-opacity duration-300",
          "opacity-0 focus-visible:opacity-100 group-hover:opacity-100",
          isFavorite && "opacity-100",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
      >
        <Heart
          strokeWidth={1.75}
          className={cn(
            "h-4 w-4 transition-colors duration-300",
            isFavorite && "fill-current"
          )}
        />
      </button>

      {/* Content */}
      <div className="p-5">
        {/* Name — the card's primary accessible link */}
        <h3 className="font-display text-base font-medium leading-snug text-foreground">
          <Link
            href={detailHref}
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
        <div className="mt-4 flex items-baseline justify-between border-t border-border/60 pt-4">
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

          {/* Quick view — quiet text action, revealed on hover/focus */}
          {onQuickView && !isSold && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(vehicle);
              }}
              className={cn(
                "relative z-10 py-1 text-muted-foreground transition-all duration-300 hover:text-foreground",
                "sm:opacity-0 sm:focus-visible:opacity-100 sm:group-hover:opacity-100",
                isAr ? "text-xs font-medium" : "text-[0.6875rem] font-medium uppercase tracking-[0.08em]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              )}
            >
              {t("عرض سريع", "Quick View")}
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
