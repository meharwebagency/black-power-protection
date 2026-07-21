"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Search, ChevronDown, Car } from "lucide-react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { VEHICLE_MAKES } from "@/lib/constants";
import { easings } from "@/lib/motion";
import type { Vehicle } from "@/types/vehicle";
import type { Locale } from "@/types";

interface SearchBarSectionProps {
  locale: Locale;
}

const GOLD = "#D4AF37";

/* Max-price presets in KWD — map to the inventory's `priceTo` param */
const PRICE_OPTIONS = [5000, 10000, 15000, 20000, 30000, 50000];

export function SearchBarSection({ locale }: SearchBarSectionProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [selectedMake, setSelectedMake] = React.useState("");
  const [selectedModel, setSelectedModel] = React.useState("");
  const [maxPrice, setMaxPrice] = React.useState("");
  const [activeTab, setActiveTab] = React.useState(0);
  const CONDITION_TABS: (string | undefined)[] = [undefined, "new", "used"];

  /* Live inventory pool — powers the Models dropdown (distinct models,
     narrowed by the selected make) via the existing public vehicles API,
     the same source SearchSuggestions uses. */
  const [pool, setPool] = React.useState<Vehicle[]>([]);
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/vehicles?limit=100&status=available");
        const json = await res.json();
        if (!cancelled && json.success) setPool(json.data as Vehicle[]);
      } catch {
        /* dropdown falls back to the "All Models" option only */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const models = React.useMemo(() => {
    const source = selectedMake ? pool.filter((v) => v.make === selectedMake) : pool;
    const seen = new Map<string, string>();
    for (const v of source) {
      if (v.model && !seen.has(v.model)) seen.set(v.model, v.modelAr || v.model);
    }
    return [...seen.entries()]
      .map(([value, labelAr]) => ({ value, labelAr }))
      .sort((a, b) => a.value.localeCompare(b.value));
  }, [pool, selectedMake]);

  const isAr = locale === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);

  const tabs = [
    t("بحث السيارات", "Search Cars"),
    t("سيارات جديدة", "New Cars"),
    t("سيارات مستعملة", "Used Cars"),
  ];

  const handleMakeChange = (value: string) => {
    setSelectedMake(value);
    setSelectedModel("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedMake) params.set("make", selectedMake);
    if (selectedModel) params.set("model", selectedModel);
    if (maxPrice) params.set("priceTo", maxPrice);
    const condition = CONDITION_TABS[activeTab];
    if (condition) params.set("condition", condition);
    router.push(`/${locale}/vehicles?${params.toString()}`);
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat(isAr ? "ar-KW" : "en-US").format(n);

  const selectedModelLabel = selectedModel
    ? (isAr && models.find((m) => m.value === selectedModel)?.labelAr) || selectedModel
    : "";

  return (
    <section className="relative z-20 -mt-6 bg-[#000000] pb-4 md:-mt-8 md:pb-6">
      <Container size="xl">
        <motion.form
          onSubmit={handleSearch}
          role="search"
          aria-label={t("البحث في السيارات", "Search vehicles")}
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.8, ease: easings.luxury, delay: 0.2 }
          }
          className={cn(
            "rounded-2xl bg-[#111111] text-white",
            "border border-white/[0.08]",
            "shadow-[0_24px_60px_-12px_rgba(0,0,0,0.55)]",
            "p-5 md:p-6"
          )}
        >
          {/* ── Tabs ── */}
          <div className="flex items-center gap-2 border-b border-white/[0.08]">
            <Car
              aria-hidden="true"
              strokeWidth={1.5}
              className="me-2 hidden h-5 w-5 text-white/60 sm:block"
            />
            <div role="tablist" aria-label={t("نوع البحث", "Search type")} className="flex gap-1 overflow-x-auto scrollbar-hidden">
              {tabs.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === i}
                  onClick={() => setActiveTab(i)}
                  className={cn(
                    "relative whitespace-nowrap px-4 py-4 text-sm transition-colors duration-200",
                    activeTab === i
                      ? "font-semibold text-white"
                      : "text-white/55 hover:text-white",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-lg"
                  )}
                >
                  {label}
                  {activeTab === i && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3 -bottom-px h-0.5 rounded-full"
                      style={{ backgroundColor: GOLD }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Filters row ── */}
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1fr_auto] md:gap-4">
            {/* Make */}
            <FilterField
              ariaLabel={t("الماركة", "Make")}
              title={selectedMake || t("جميع الماركات", "All Makes")}
              hint={t("اختر الماركة", "Select Make")}
              value={selectedMake}
              onChange={handleMakeChange}
            >
              <option value="">{t("جميع الماركات", "All Makes")}</option>
              {VEHICLE_MAKES.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </FilterField>

            {/* Model — distinct live-inventory models for the chosen make */}
            <FilterField
              ariaLabel={t("الطراز", "Model")}
              title={selectedModelLabel || t("جميع الطرازات", "All Models")}
              hint={t("اختر الطراز", "Select Model")}
              value={selectedModel}
              onChange={setSelectedModel}
            >
              <option value="">{t("جميع الطرازات", "All Models")}</option>
              {models.map((m) => (
                <option key={m.value} value={m.value}>
                  {isAr ? m.labelAr : m.value}
                </option>
              ))}
            </FilterField>

            {/* Max price */}
            <FilterField
              ariaLabel={t("أقصى سعر", "Max Price")}
              title={maxPrice ? t(`${fmt(Number(maxPrice))} د.ك`, `${fmt(Number(maxPrice))} KWD`) : t("أقصى سعر", "Max Price")}
              hint={t("أي سعر", "Any Price")}
              value={maxPrice}
              onChange={setMaxPrice}
            >
              <option value="">{t("أي سعر", "Any Price")}</option>
              {PRICE_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {t(`${fmt(p)} د.ك`, `${fmt(p)} KWD`)}
                </option>
              ))}
            </FilterField>

            {/* Submit */}
            <button
              type="submit"
              className={cn(
                "inline-flex h-[72px] items-center justify-center gap-2.5 rounded-xl px-10",
                "bg-gradient-to-r from-gold-700 to-gold-500 text-[#1a1408] font-semibold",
                isAr ? "text-sm" : "text-body-sm uppercase tracking-[0.08em]",
                "transition-all duration-300 hover:brightness-110 active:scale-[0.98]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]"
              )}
            >
              <Search aria-hidden="true" strokeWidth={2} className="h-4 w-4" />
              {t("بحث", "Search")}
            </button>
          </div>
        </motion.form>
      </Container>
    </section>
  );
}

/* Reference-style filter field: bold title line over a muted hint line, with
   an invisible native <select> overlaid so the dropdown is fully functional
   on every platform. */
interface FilterFieldProps {
  ariaLabel: string;
  title: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

function FilterField({ ariaLabel, title, hint, value, onChange, children }: FilterFieldProps) {
  return (
    <div className="relative h-[72px] rounded-xl border border-white/[0.08] bg-white/[0.04] transition-colors duration-200 focus-within:border-[#D4AF37]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-1 pe-10 ps-4"
      >
        <span className="truncate text-body-md font-semibold text-white">{title}</span>
        <span className="truncate text-body-sm text-white/50">{hint}</span>
      </span>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-xl opacity-0 focus-visible:outline-none [&>option]:bg-[#111111] [&>option]:text-white"
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        strokeWidth={1.75}
        className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50"
      />
    </div>
  );
}
