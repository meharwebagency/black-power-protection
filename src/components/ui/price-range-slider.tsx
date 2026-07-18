"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  locale?: Locale;
  className?: string;
}

export function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
  step = 500,
  locale = "ar",
  className,
}: PriceRangeSliderProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = React.useState<"min" | "max" | null>(null);

  const toPercent = (val: number) => ((val - min) / (max - min)) * 100;
  const fromPercent = (pct: number) => Math.round((pct / 100) * (max - min) + min);

  const getValueFromPosition = React.useCallback(
    (clientX: number) => {
      if (!trackRef.current) return value[0];
      const rect = trackRef.current.getBoundingClientRect();
      const isRtl = locale === "ar";
      const rawPct = isRtl
        ? ((rect.right - clientX) / rect.width) * 100
        : ((clientX - rect.left) / rect.width) * 100;
      const clampedPct = Math.max(0, Math.min(100, rawPct));
      const stepped = Math.round(fromPercent(clampedPct) / step) * step;
      return Math.max(min, Math.min(max, stepped));
    },
    [min, max, step, value, locale]
  );

  const handlePointerDown = React.useCallback(
    (thumb: "min" | "max") => (e: React.PointerEvent) => {
      e.preventDefault();
      setDragging(thumb);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    []
  );

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const newVal = getValueFromPosition(e.clientX);
      if (dragging === "min") {
        onChange([Math.min(newVal, value[1] - step), value[1]]);
      } else {
        onChange([value[0], Math.max(newVal, value[0] + step)]);
      }
    },
    [dragging, getValueFromPosition, onChange, value, step]
  );

  const handlePointerUp = React.useCallback(() => {
    setDragging(null);
  }, []);

  const formatPrice = (v: number) =>
    new Intl.NumberFormat(locale === "ar" ? "ar-KW" : "en-US").format(v);

  return (
    <div className={cn("w-full", className)}>
      {/* Labels */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-body-xs text-muted-foreground">
          {formatPrice(value[0])} {locale === "ar" ? "د.ك" : "KWD"}
        </span>
        <span className="text-body-xs text-muted-foreground">
          {formatPrice(value[1])} {locale === "ar" ? "د.ك" : "KWD"}
        </span>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="relative h-2 w-full rounded-full bg-secondary"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Active range */}
        <div
          className="absolute h-full rounded-full bg-gold-500"
          style={{
            left: `${toPercent(value[0])}%`,
            right: `${100 - toPercent(value[1])}%`,
          }}
        />

        {/* Min thumb */}
        <div
          role="slider"
          tabIndex={0}
          aria-label={locale === "ar" ? "الحد الأدنى للسعر" : "Minimum price"}
          aria-valuenow={value[0]}
          aria-valuemin={min}
          aria-valuemax={value[1] - step}
          className={cn(
            "absolute top-1/2 z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold-500 bg-background shadow-md transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gold-500/50 cursor-grab active:cursor-grabbing",
            dragging === "min" && "shadow-lg scale-110"
          )}
          style={{ left: `${toPercent(value[0])}%` }}
          onPointerDown={handlePointerDown("min")}
        />

        {/* Max thumb */}
        <div
          role="slider"
          tabIndex={0}
          aria-label={locale === "ar" ? "الحد الأقصى للسعر" : "Maximum price"}
          aria-valuenow={value[1]}
          aria-valuemin={value[0] + step}
          aria-valuemax={max}
          className={cn(
            "absolute top-1/2 z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold-500 bg-background shadow-md transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gold-500/50 cursor-grab active:cursor-grabbing",
            dragging === "max" && "shadow-lg scale-110"
          )}
          style={{ left: `${toPercent(value[1])}%` }}
          onPointerDown={handlePointerDown("max")}
        />
      </div>

      {/* Min/Max labels */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-2xs text-muted-foreground">
          {locale === "ar" ? "الحد الأدنى" : "Min"}
        </span>
        <span className="text-2xs text-muted-foreground">
          {locale === "ar" ? "الحد الأقصى" : "Max"}
        </span>
      </div>
    </div>
  );
}
