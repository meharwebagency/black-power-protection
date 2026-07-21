"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Calendar, Gauge, Fuel, Settings2, Palette, Sofa,
  Cpu, Zap, FileText, Check, Hash, Car,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Vehicle } from "@/types/vehicle";
import type { Locale } from "@/types";

interface VehicleSpecsProps {
  vehicle: Vehicle;
  locale: Locale;
}

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const;

export function VehicleSpecs({ vehicle, locale }: VehicleSpecsProps) {
  const t = (ar: string, en: string) => (locale === "ar" ? ar : en);
  const reduceMotion = useReducedMotion();

  const specs = [
    { icon: Calendar, label: t("السنة", "Year"), value: String(vehicle.year) },
    { icon: Gauge, label: t("المسافة", "Mileage"), value: `${new Intl.NumberFormat(locale === "ar" ? "ar-KW" : "en-US").format(vehicle.mileage)} ${t("كم", "km")}` },
    { icon: Car, label: t("الحالة", "Condition"), value: locale === "ar" ? (vehicle.condition === "new" ? "جديدة" : "مستعملة") : (vehicle.condition === "new" ? "New" : "Used") },
    { icon: Fuel, label: t("الوقود", "Fuel"), value: locale === "ar" ? vehicle.fuelTypeAr : vehicle.fuelType },
    { icon: Settings2, label: t("ناقل الحركة", "Transmission"), value: locale === "ar" ? vehicle.transmissionAr : vehicle.transmission },
    { icon: Cpu, label: t("المحرك", "Engine"), value: vehicle.engineSize },
    { icon: Zap, label: t("القوة", "Horsepower"), value: vehicle.horsepower ? `${vehicle.horsepower} HP` : "—" },
    { icon: Palette, label: t("اللون الخارجي", "Exterior"), value: locale === "ar" ? vehicle.colorAr : vehicle.color },
    { icon: Sofa, label: t("اللون الداخلي", "Interior"), value: locale === "ar" ? vehicle.interiorColorAr : vehicle.interiorColor },
    { icon: FileText, label: t("نوع الهيكل", "Body"), value: locale === "ar" ? vehicle.bodyTypeAr : vehicle.bodyType },
  ];

  if (vehicle.vin) {
    specs.push({ icon: Hash, label: "VIN", value: vehicle.vin });
  }

  const description = locale === "ar" ? vehicle.descriptionAr : vehicle.description;
  const features = locale === "ar" ? vehicle.featuresAr : vehicle.features;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: EASE_LUXURY }}
    >
      <Tabs defaultValue="specs">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="specs">{t("المواصفات", "Specifications")}</TabsTrigger>
          <TabsTrigger value="features">{t("المميزات", "Features")}</TabsTrigger>
          <TabsTrigger value="description">{t("الوصف", "Description")}</TabsTrigger>
        </TabsList>

        {/* Specifications — clean two-column key/value rows */}
        <TabsContent value="specs">
          <dl className="grid grid-cols-1 overflow-hidden rounded-xl border border-border/60 sm:grid-cols-2">
            {specs.map((spec, index) => {
              const Icon = spec.icon;
              return (
                <div
                  key={spec.label}
                  className="flex items-center gap-3.5 border-b border-border/50 bg-card px-4 py-3.5 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0 sm:odd:border-e sm:odd:border-e-border/50"
                >
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex min-w-0 flex-1 items-baseline justify-between gap-3">
                    <dt className="text-body-xs text-muted-foreground">{spec.label}</dt>
                    <dd className="truncate text-body-sm font-medium text-foreground">{spec.value}</dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </TabsContent>

        {/* Features */}
        <TabsContent value="features">
          {features.length > 0 ? (
            <ul className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
              {features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 border-b border-border/40 py-3 text-body-sm text-foreground last:border-b-0"
                >
                  <Check className="h-4 w-4 shrink-0 text-accent" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-10 text-center text-body-sm text-muted-foreground">
              {t("لا توجد مميزات إضافية", "No additional features listed")}
            </p>
          )}
        </TabsContent>

        {/* Description */}
        <TabsContent value="description">
          <p className="max-w-prose whitespace-pre-line text-body-md leading-loose text-muted-foreground">
            {description || t("لا يوجد وصف", "No description available")}
          </p>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
