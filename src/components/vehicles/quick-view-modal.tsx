"use client";

import * as React from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { formatCurrency, cn } from "@/lib/utils";
import { CURRENCY } from "@/lib/constants";
import {
  MapPin,
  Fuel,
  Settings2,
  Gauge,
  Calendar,
  Palette,
  Star,
  MessageCircle,
} from "lucide-react";
import type { Vehicle } from "@/types/vehicle";
import type { Locale } from "@/types";

interface QuickViewModalProps {
  vehicle: Vehicle | null;
  open: boolean;
  onClose: () => void;
  locale: Locale;
}

export function QuickViewModal({ vehicle, open, onClose, locale }: QuickViewModalProps) {
  if (!vehicle) return null;

  const make = locale === "ar" ? vehicle.makeAr : vehicle.make;
  const model = locale === "ar" ? vehicle.modelAr : vehicle.model;
  const fuelType = locale === "ar" ? vehicle.fuelTypeAr : vehicle.fuelType;
  const transmission = locale === "ar" ? vehicle.transmissionAr : vehicle.transmission;
  const location = locale === "ar" ? vehicle.locationAr : vehicle.location;
  const color = locale === "ar" ? vehicle.colorAr : vehicle.color;
  const bodyType = locale === "ar" ? vehicle.bodyTypeAr : vehicle.bodyType;
  const description = locale === "ar" ? vehicle.descriptionAr : vehicle.description;
  const features = locale === "ar" ? vehicle.featuresAr : vehicle.features;

  const isSold = vehicle.status === "sold";

  const statusLabel = (() => {
    switch (vehicle.status) {
      case "available":
        return locale === "ar" ? "متاحة" : "Available";
      case "sold":
        return locale === "ar" ? "مباعة" : "Sold";
      case "reserved":
        return locale === "ar" ? "محجوزة" : "Reserved";
      case "pending":
        return locale === "ar" ? "قيد المراجعة" : "Pending";
      default:
        return vehicle.status;
    }
  })();

  const specs = [
    { icon: Calendar, label: locale === "ar" ? "السنة" : "Year", value: String(vehicle.year) },
    { icon: Gauge, label: locale === "ar" ? "المسافة" : "Mileage", value: `${new Intl.NumberFormat(locale === "ar" ? "ar-KW" : "en-US").format(vehicle.mileage)} ${locale === "ar" ? "كم" : "km"}` },
    { icon: Fuel, label: locale === "ar" ? "الوقود" : "Fuel", value: fuelType },
    { icon: Settings2, label: locale === "ar" ? "ناقل الحركة" : "Transmission", value: transmission },
    { icon: Palette, label: locale === "ar" ? "اللون" : "Color", value: color },
    { icon: MapPin, label: locale === "ar" ? "الموقع" : "Location", value: location },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto p-0">
        {/* Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary/30">
          <ImagePlaceholder
            fill
            alt={`${make} ${model}`}
            rounded="none"
            className="rounded-t-2xl"
          />
          {vehicle.featured && (
            <Badge variant="gold" className="absolute top-4 start-4 gap-1 shadow-sm">
              <Star className="h-3 w-3 fill-current" />
              {locale === "ar" ? "مميزة" : "Featured"}
            </Badge>
          )}
          <Badge
            variant={isSold ? "sold" : vehicle.status === "reserved" ? "reserved" : "available"}
            className="absolute top-4 end-4 shadow-sm"
            dot
          >
            {statusLabel}
          </Badge>
        </div>

        <div className="p-6">
          {/* Title + Price */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="font-display text-display-xs font-bold">
                {make} {model}
              </DialogTitle>
              <DialogDescription className="mt-1 text-body-sm text-muted-foreground">
                {bodyType} · {vehicle.engineSize} · {vehicle.horsepower} HP
              </DialogDescription>
            </div>
            <div className="text-start">
              <span className={cn(
                "font-display text-body-xl font-bold",
                isSold ? "text-muted-foreground line-through" : "text-foreground"
              )}>
                {formatCurrency(vehicle.price)}
              </span>
              <span className="block text-body-xs text-muted-foreground">{CURRENCY.symbol}</span>
            </div>
          </div>

          {/* Specs grid */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {specs.map((spec) => {
              const Icon = spec.icon;
              return (
                <div
                  key={spec.label}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-secondary/30 p-3 text-center"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-2xs text-muted-foreground">{spec.label}</span>
                  <span className="text-body-xs font-medium text-foreground">{spec.value}</span>
                </div>
              );
            })}
          </div>

          {/* Description */}
          {description && (
            <div className="mt-6">
              <h4 className="text-label-sm font-semibold text-foreground mb-2">
                {locale === "ar" ? "الوصف" : "Description"}
              </h4>
              <p className="text-body-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          )}

          {/* Features */}
          {features && features.length > 0 && (
            <div className="mt-6">
              <h4 className="text-label-sm font-semibold text-foreground mb-2">
                {locale === "ar" ? "المميزات" : "Features"}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {features.map((feature, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-secondary/60 px-2.5 py-1 text-2xs font-medium text-muted-foreground"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="border-t border-border p-6">
          <Button variant="outline" size="lg" className="flex-1" onClick={onClose}>
            {locale === "ar" ? "إغلاق" : "Close"}
          </Button>
          <Link
            href={`/${locale}/vehicles/${vehicle.slug}`}
            className="flex-1"
            onClick={onClose}
          >
            <Button variant="primary" size="lg" fullWidth>
              {locale === "ar" ? "عرض التفاصيل" : "View Details"}
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
