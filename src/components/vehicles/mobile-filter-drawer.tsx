"use client";

import * as React from "react";
import { SlidersHorizontal, X, RotateCcw } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { VehicleFilters } from "./vehicle-filters";
import type { VehicleFilter } from "@/types/vehicle";
import type { Locale } from "@/types";

interface MobileFilterDrawerProps {
  filters: VehicleFilter;
  onFilterChange: (filters: VehicleFilter) => void;
  locale: Locale;
  resultCount: number;
}

export function MobileFilterDrawer({
  filters,
  onFilterChange,
  locale,
  resultCount,
}: MobileFilterDrawerProps) {
  const [open, setOpen] = React.useState(false);
  const [stagingFilters, setStagingFilters] = React.useState<VehicleFilter>(filters);

  const activeCount = [
    filters.make,
    filters.bodyType,
    filters.fuelType,
    filters.transmission,
    filters.status,
    filters.condition,
    filters.color,
    filters.yearFrom,
    filters.yearTo,
    filters.priceFrom,
    filters.priceTo,
    filters.mileageFrom,
    filters.mileageTo,
  ].filter(Boolean).length;

  const handleOpen = () => {
    setStagingFilters(filters);
    setOpen(true);
  };

  const handleApply = () => {
    onFilterChange(stagingFilters);
    setOpen(false);
  };

  const handleClear = () => {
    setStagingFilters({});
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleOpen}
        className="gap-2"
      >
        <SlidersHorizontal className="h-4 w-4" />
        {locale === "ar" ? "الفلاتر" : "Filters"}
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1.5 text-2xs font-bold text-white">
            {activeCount}
          </span>
        )}
      </Button>

      <Drawer open={open} onOpenChange={setOpen} direction="bottom">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <span className="text-body-lg font-semibold text-foreground">
                {locale === "ar" ? "الفلاتر" : "Filters"}
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Filters content */}
          <div className="flex-1 overflow-y-auto p-4">
            <VehicleFilters
              filters={stagingFilters}
              onFilterChange={setStagingFilters}
              locale={locale}
              resultCount={resultCount}
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t border-border p-4">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 gap-2"
              onClick={handleClear}
            >
              <RotateCcw className="h-4 w-4" />
              {locale === "ar" ? "مسح الكل" : "Clear All"}
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleApply}
            >
              {locale === "ar" ? "تطبيق الفلاتر" : "Apply Filters"}
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
}
