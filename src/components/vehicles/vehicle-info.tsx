"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  MapPin, Heart, Star, Copy, Check,
  Facebook, Send,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { formatCurrency, cn } from "@/lib/utils";
import { CURRENCY } from "@/lib/constants";
import type { Vehicle } from "@/types/vehicle";
import type { Locale } from "@/types";

interface VehicleInfoProps {
  vehicle: Vehicle;
  locale: Locale;
}

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const;

export function VehicleInfo({ vehicle, locale }: VehicleInfoProps) {
  const [copied, setCopied] = React.useState(false);
  const [wishlisted, setWishlisted] = React.useState(false);
  const reduceMotion = useReducedMotion();

  const make = locale === "ar" ? vehicle.makeAr : vehicle.make;
  const model = locale === "ar" ? vehicle.modelAr : vehicle.model;
  const location = locale === "ar" ? vehicle.locationAr : vehicle.location;

  const statusLabel = (() => {
    switch (vehicle.status) {
      case "available": return locale === "ar" ? "متاحة" : "Available";
      case "sold": return locale === "ar" ? "مباعة" : "Sold";
      case "reserved": return locale === "ar" ? "محجوزة" : "Reserved";
      case "pending": return locale === "ar" ? "قيد المراجعة" : "Pending";
      default: return vehicle.status;
    }
  })();

  const statusVariant = (() => {
    switch (vehicle.status) {
      case "available": return "available" as const;
      case "sold": return "sold" as const;
      case "reserved": return "reserved" as const;
      default: return "pending" as const;
    }
  })();

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `${make} ${model} ${vehicle.year} - ${formatCurrency(vehicle.price)} ${CURRENCY.symbol}`;

  const handleShare = async (platform: string) => {
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      copy: "",
    };

    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
      return;
    }

    window.open(urls[platform], "_blank", "width=600,height=400");
  };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: EASE_LUXURY }}
    >
      {/* Status / featured */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={statusVariant} dot size="lg">
          {statusLabel}
        </Badge>
        {vehicle.featured && (
          <Badge variant="gold" size="lg" className="gap-1">
            <Star className="h-3 w-3 fill-current" />
            {locale === "ar" ? "مميزة" : "Featured"}
          </Badge>
        )}
      </div>

      {/* Make · year eyebrow */}
      <p className="mt-5 text-body-xs uppercase tracking-[0.16em] text-muted-foreground ltr:tracking-[0.16em] rtl:tracking-normal">
        {make} <span className="opacity-40">·</span> {vehicle.year}
      </p>

      {/* Title */}
      <h1 className="mt-1.5 font-display text-display-sm font-semibold leading-[1.1] text-foreground md:text-display-md">
        {model}
      </h1>

      {/* Location */}
      {location && (
        <div className="mt-3 flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span className="text-body-sm">{location}</span>
        </div>
      )}

      {/* Price — framed by a single accent hairline */}
      <div className="mt-6 border-t border-border/60 pt-6">
        <p className="text-2xs uppercase tracking-[0.18em] text-muted-foreground ltr:tracking-[0.18em] rtl:tracking-normal">
          {locale === "ar" ? "السعر" : "Price"}
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <span
            className={cn(
              "font-display text-display-sm font-semibold leading-none md:text-display-md",
              vehicle.status === "sold" ? "text-muted-foreground line-through" : "text-foreground"
            )}
          >
            {formatCurrency(vehicle.price)}
          </span>
          <span className="text-body-lg font-medium text-muted-foreground">{CURRENCY.symbol}</span>
        </div>
      </div>

      {/* Secondary actions */}
      <div className="mt-6 flex items-center gap-2">
        <Tooltip content={locale === "ar" ? "حفظ" : "Wishlist"} side="top">
          <Button
            variant="outline"
            size="icon"
            aria-pressed={wishlisted}
            aria-label={locale === "ar" ? "حفظ" : "Wishlist"}
            onClick={() => setWishlisted(!wishlisted)}
            className={cn(wishlisted && "border-red-500/50 bg-red-500/5 text-red-500")}
          >
            <Heart className={cn("h-4 w-4", wishlisted && "fill-current")} />
          </Button>
        </Tooltip>

        <Tooltip content={locale === "ar" ? "نسخ الرابط" : "Copy Link"} side="top">
          <Button variant="outline" size="icon" aria-label={locale === "ar" ? "نسخ الرابط" : "Copy Link"} onClick={() => handleShare("copy")}>
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </Tooltip>

        <Tooltip content="WhatsApp" side="top">
          <Button variant="outline" size="icon" aria-label="Share on WhatsApp" onClick={() => handleShare("whatsapp")}>
            <Send className="h-4 w-4" />
          </Button>
        </Tooltip>

        <Tooltip content="Facebook" side="top">
          <Button variant="outline" size="icon" aria-label="Share on Facebook" onClick={() => handleShare("facebook")}>
            <Facebook className="h-4 w-4" />
          </Button>
        </Tooltip>
      </div>
    </motion.div>
  );
}
