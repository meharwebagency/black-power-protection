"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PriceRangeSlider } from "@/components/ui/price-range-slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  VEHICLE_MAKES,
  VEHICLE_BODY_TYPES,
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  VEHICLE_STATUSES,
  VEHICLE_COLORS,
} from "@/lib/constants";
import type { VehicleFilter } from "@/types/vehicle";
import type { Locale } from "@/types";

interface VehicleFiltersProps {
  filters: VehicleFilter;
  onFilterChange: (filters: VehicleFilter) => void;
  locale: Locale;
  resultCount: number;
}

const PRICE_MIN = 0;
const PRICE_MAX = 200000;
const YEAR_MIN = 2015;
const YEAR_MAX = 2025;
const MILEAGE_MIN = 0;
const MILEAGE_MAX = 200000;

export function VehicleFilters({ filters, onFilterChange, locale, resultCount }: VehicleFiltersProps) {
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    make: true,
    price: true,
    year: false,
    mileage: false,
    bodyType: false,
    fuelType: false,
    transmission: false,
    color: false,
    status: false,
  });

  const t = (ar: string, en: string) => (locale === "ar" ? ar : en);

  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const updateFilter = <K extends keyof VehicleFilter>(key: K, value: VehicleFilter[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const activeCount = [
    filters.make,
    filters.bodyType,
    filters.fuelType,
    filters.transmission,
    filters.status,
    filters.color,
    filters.yearFrom,
    filters.yearTo,
    filters.priceFrom,
    filters.priceTo,
    filters.mileageFrom,
    filters.mileageTo,
  ].filter(Boolean).length;

  const clearAll = () => {
    onFilterChange({});
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pb-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="text-label-md font-semibold text-foreground">
            {t("الفلاتر", "Filters")}
          </span>
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1.5 text-2xs font-bold text-white">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-2xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            {t("مسح الكل", "Clear all")}
          </button>
        )}
      </div>

      <Separator className="mb-2" />

      {/* Result count */}
      <p className="px-1 text-body-xs text-muted-foreground">
        {t(`${resultCount} نتيجة`, `${resultCount} results`)}
      </p>

      {/* Make */}
      <FilterSection
        title={t("الماركة", "Make")}
        isOpen={openSections.make}
        onToggle={() => toggleSection("make")}
      >
        <ScrollArea maxHeight={200}>
          <div className="flex flex-wrap gap-1.5">
            {VEHICLE_MAKES.map((make) => (
              <FilterPill
                key={make}
                label={make}
                active={filters.make === make}
                onClick={() => updateFilter("make", filters.make === make ? undefined : make)}
              />
            ))}
          </div>
        </ScrollArea>
      </FilterSection>

      {/* Price Range */}
      <FilterSection
        title={t("نطاق السعر", "Price Range")}
        isOpen={openSections.price}
        onToggle={() => toggleSection("price")}
      >
        <PriceRangeSlider
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={1000}
          value={[filters.priceFrom || PRICE_MIN, filters.priceTo || PRICE_MAX]}
          onChange={([min, max]) => {
            onFilterChange({
              ...filters,
              priceFrom: min === PRICE_MIN ? undefined : min,
              priceTo: max === PRICE_MAX ? undefined : max,
            });
          }}
          locale={locale}
        />
      </FilterSection>

      {/* Year Range */}
      <FilterSection
        title={t("السنة", "Year")}
        isOpen={openSections.year}
        onToggle={() => toggleSection("year")}
      >
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={YEAR_MIN}
            max={YEAR_MAX}
            placeholder={t("من", "From")}
            value={filters.yearFrom || ""}
            onChange={(e) => updateFilter("yearFrom", e.target.value ? Number(e.target.value) : undefined)}
            className="h-9 text-body-xs"
          />
          <span className="text-muted-foreground">—</span>
          <Input
            type="number"
            min={YEAR_MIN}
            max={YEAR_MAX}
            placeholder={t("إلى", "To")}
            value={filters.yearTo || ""}
            onChange={(e) => updateFilter("yearTo", e.target.value ? Number(e.target.value) : undefined)}
            className="h-9 text-body-xs"
          />
        </div>
      </FilterSection>

      {/* Mileage Range */}
      <FilterSection
        title={t("المسافة", "Mileage")}
        isOpen={openSections.mileage}
        onToggle={() => toggleSection("mileage")}
      >
        <PriceRangeSlider
          min={MILEAGE_MIN}
          max={MILEAGE_MAX}
          step={5000}
          value={[filters.mileageFrom || MILEAGE_MIN, filters.mileageTo || MILEAGE_MAX]}
          onChange={([min, max]) => {
            onFilterChange({
              ...filters,
              mileageFrom: min === MILEAGE_MIN ? undefined : min,
              mileageTo: max === MILEAGE_MAX ? undefined : max,
            });
          }}
          locale={locale}
        />
      </FilterSection>

      {/* Body Type */}
      <FilterSection
        title={t("نوع السيارة", "Body Type")}
        isOpen={openSections.bodyType}
        onToggle={() => toggleSection("bodyType")}
      >
        <div className="flex flex-wrap gap-1.5">
          {VEHICLE_BODY_TYPES.map((bt) => (
            <FilterPill
              key={bt.value}
              label={t(bt.labelAr, bt.label)}
              active={filters.bodyType === bt.value}
              onClick={() => updateFilter("bodyType", filters.bodyType === bt.value ? undefined : bt.value)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Fuel Type */}
      <FilterSection
        title={t("نوع الوقود", "Fuel Type")}
        isOpen={openSections.fuelType}
        onToggle={() => toggleSection("fuelType")}
      >
        <div className="flex flex-wrap gap-1.5">
          {FUEL_TYPES.map((ft) => (
            <FilterPill
              key={ft.value}
              label={t(ft.labelAr, ft.label)}
              active={filters.fuelType === ft.value}
              onClick={() => updateFilter("fuelType", filters.fuelType === ft.value ? undefined : ft.value)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Transmission */}
      <FilterSection
        title={t("ناقل الحركة", "Transmission")}
        isOpen={openSections.transmission}
        onToggle={() => toggleSection("transmission")}
      >
        <div className="flex flex-wrap gap-1.5">
          {TRANSMISSION_TYPES.map((tr) => (
            <FilterPill
              key={tr.value}
              label={t(tr.labelAr, tr.label)}
              active={filters.transmission === tr.value}
              onClick={() => updateFilter("transmission", filters.transmission === tr.value ? undefined : tr.value)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Color */}
      <FilterSection
        title={t("اللون", "Color")}
        isOpen={openSections.color}
        onToggle={() => toggleSection("color")}
      >
        <ScrollArea maxHeight={180}>
          <div className="flex flex-wrap gap-1.5">
            {VEHICLE_COLORS.map((c) => (
              <FilterPill
                key={c.value}
                label={t(c.labelAr, c.label)}
                active={filters.color === c.value}
                onClick={() => updateFilter("color", filters.color === c.value ? undefined : c.value)}
              />
            ))}
          </div>
        </ScrollArea>
      </FilterSection>

      {/* Status */}
      <FilterSection
        title={t("الحالة", "Status")}
        isOpen={openSections.status}
        onToggle={() => toggleSection("status")}
      >
        <div className="flex flex-wrap gap-1.5">
          {VEHICLE_STATUSES.map((s) => (
            <FilterPill
              key={s.value}
              label={t(s.labelAr, s.label)}
              active={filters.status === s.value}
              onClick={() => updateFilter("status", filters.status === s.value ? undefined : s.value)}
            />
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

/* ── Reusable Filter Pill ── */
function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      role="checkbox"
      aria-checked={active}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "rounded-lg border px-3 py-1.5 text-2xs font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 focus-visible:ring-offset-1",
        active
          ? "border-gold-500 bg-gold-500/10 text-gold-600 dark:text-gold-400"
          : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

/* ── Collapsible Filter Section ── */
function FilterSection({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <button
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className="flex w-full items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 focus-visible:ring-inset rounded-lg"
        aria-expanded={isOpen}
      >
        <span className="text-label-sm font-medium text-foreground">{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
