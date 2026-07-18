"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, TrendingUp, X, ArrowRight, ArrowLeft } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, cn } from "@/lib/utils";
import { CURRENCY } from "@/lib/constants";
import type { Vehicle } from "@/types/vehicle";
import type { Locale } from "@/types";

interface SearchSuggestionsProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  locale: Locale;
  className?: string;
}

const POPULAR_SEARCHES_AR = ["مرسيدس", "بي إم دبليو", "بورش", "SUV", "كهربائية"];
const POPULAR_SEARCHES_EN = ["Mercedes", "BMW", "Porsche", "SUV", "Electric"];

export function SearchSuggestions({ value, onChange, onSubmit, locale, className }: SearchSuggestionsProps) {
  const [focused, setFocused] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Load live inventory once for client-side suggestion matching.
  const [pool, setPool] = React.useState<Vehicle[]>([]);
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/vehicles?limit=100&status=available");
        const json = await res.json();
        if (!cancelled && json.success) {
          setPool(json.data as Vehicle[]);
        }
      } catch (err) {
        console.error("Failed to load search suggestions:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const suggestions = React.useMemo(() => {
    if (!value || value.length < 2) return [];
    const q = value.toLowerCase();
    return pool.filter((v) => {
      const searchStr = `${v.make} ${v.makeAr} ${v.model} ${v.modelAr} ${v.color} ${v.colorAr} ${v.bodyType} ${v.bodyTypeAr}`.toLowerCase();
      return searchStr.includes(q);
    }).slice(0, 5);
  }, [value, pool]);

  const popularSearches = locale === "ar" ? POPULAR_SEARCHES_AR : POPULAR_SEARCHES_EN;
  const showDropdown = focused;

  const totalResults = suggestions.length;

  // Keyboard navigation
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      const items = suggestions.length > 0 ? suggestions : [];
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          onChange(suggestions[selectedIndex].make + " " + suggestions[selectedIndex].model);
          onSubmit(suggestions[selectedIndex].make + " " + suggestions[selectedIndex].model);
        } else {
          onSubmit(value);
        }
        setFocused(false);
        inputRef.current?.blur();
      } else if (e.key === "Escape") {
        setFocused(false);
        inputRef.current?.blur();
      }
    },
    [suggestions, selectedIndex, value, onChange, onSubmit]
  );

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Reset selected index when suggestions change
  React.useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  const t = (ar: string, en: string) => (locale === "ar" ? ar : en);
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Input */}
      <div className="relative">
        <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={t("ابحث عن ماركة، طراز، لون...", "Search make, model, color...")}
          className="h-12 w-full rounded-xl border border-border bg-background ps-11 pe-10 text-body-sm text-foreground placeholder:text-muted-foreground/70 transition-all duration-200 focus:border-gold-400/50 focus:outline-none focus:ring-2 focus:ring-gold-400/20"
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
        />
        {value && (
          <button
            onClick={() => { onChange(""); inputRef.current?.focus(); }}
            className="absolute end-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-popover shadow-elevated-lg"
          >
            {/* Search suggestions */}
            {suggestions.length > 0 && (
              <div className="p-2">
                <p className="px-2 pb-1.5 pt-1 text-2xs font-medium text-muted-foreground">
                  {t(`${totalResults} نتيجة`, `${totalResults} results`)}
                </p>
                {suggestions.map((vehicle, index) => {
                  const make = locale === "ar" ? vehicle.makeAr : vehicle.make;
                  const model = locale === "ar" ? vehicle.modelAr : vehicle.model;
                  return (
                    <Link
                      key={vehicle.id}
                      href={`/${locale}/vehicles/${vehicle.slug}`}
                      onClick={() => { setFocused(false); }}
                      id={`suggestion-${index}`}
                      role="option"
                      aria-selected={index === selectedIndex}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors",
                        index === selectedIndex ? "bg-secondary" : "hover:bg-secondary/50"
                      )}
                    >
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                        <ImagePlaceholder fill alt={`${make} ${model}`} rounded="none" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-body-sm font-medium text-foreground truncate">
                          {make} {model}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-2xs text-muted-foreground">{vehicle.year}</span>
                          <span className="text-2xs text-muted-foreground">·</span>
                          <span className="text-2xs font-medium text-gold-600 dark:text-gold-400">
                            {formatCurrency(vehicle.price)} {CURRENCY.symbol}
                          </span>
                        </div>
                      </div>
                      <Arrow className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Popular searches (when no input) */}
            {!value && (
              <div className="p-2">
                <p className="px-2 pb-1.5 pt-1 text-2xs font-medium text-muted-foreground">
                  {t("عمليات بحث شائعة", "Popular Searches")}
                </p>
                <div className="flex flex-wrap gap-1.5 px-2 pb-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => { onChange(term); onSubmit(term); setFocused(false); }}
                      className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-2xs text-muted-foreground transition-colors hover:border-gold-400/30 hover:text-foreground"
                    >
                      <TrendingUp className="h-3 w-3" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent searches placeholder */}
            {value && suggestions.length === 0 && (
              <div className="p-4 text-center">
                <p className="text-body-sm text-muted-foreground">
                  {t("لا توجد نتائج لـ", "No results for")} &ldquo;{value}&rdquo;
                </p>
              </div>
            )}

            {/* Quick submit */}
            {value && suggestions.length > 0 && (
              <div className="border-t border-border p-2">
                <button
                  onClick={() => { onSubmit(value); setFocused(false); }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary/50 px-4 py-2.5 text-body-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  <Search className="h-3.5 w-3.5" />
                  {t("عرض كل النتائج لـ", "View all results for")} &ldquo;{value}&rdquo;
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
