"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Search, ChevronDown, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { VEHICLE_MAKES } from "@/lib/constants";
import { easings } from "@/lib/motion";
import type { Locale } from "@/types";

interface SearchBarSectionProps {
  locale: Locale;
}

export function SearchBarSection({ locale }: SearchBarSectionProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedMake, setSelectedMake] = React.useState("");

  const isAr = locale === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedMake) params.set("brand", selectedMake);
    router.push(`/${locale}/vehicles?${params.toString()}`);
  };

  const reveal: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : { duration: 0.8, ease: easings.luxury },
    },
  };

  const stage: Variants = {
    hidden: {},
    visible: {
      transition: prefersReducedMotion
        ? {}
        : { staggerChildren: 0.12, delayChildren: 0.05 },
    },
  };

  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      {/* Quiet gold ambient */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-secondary/50 to-background" />
        <div className="absolute inset-x-0 top-[-20%] h-1/2 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(229,168,44,0.10),transparent_70%)]" />
      </div>

      <Container size="xl" className="relative z-10">
        <motion.div
          variants={stage}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl py-16 text-center md:py-20"
        >
          {/* Kicker */}
          <motion.p variants={reveal} className="flex items-center justify-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-gold-400" />
            <span
              className={cn(
                "text-gold-600 dark:text-gold-400",
                isAr ? "text-sm font-medium" : "text-[0.6875rem] uppercase tracking-[0.3em]"
              )}
            >
              {t("الكويت", "Kuwait")}
            </span>
            <span aria-hidden="true" className="h-px w-8 bg-gold-400" />
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={reveal}
            className={cn(
              "mt-6 font-display text-foreground leading-[1.08]",
              "text-3xl sm:text-4xl md:text-5xl",
              isAr ? "font-bold" : "font-semibold tracking-[-0.02em]"
            )}
          >
            {t("اعثر على سيارتك الفاخرة", "Find Your Luxury Vehicle")}
          </motion.h1>

          {/* Subline */}
          <motion.p
            variants={reveal}
            className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground"
          >
            {t(
              "ابحث في مجموعتنا المنتقاة من أرقى السيارات في الكويت.",
              "Search our curated collection of Kuwait's finest automobiles."
            )}
          </motion.p>

          {/* Search form */}
          <motion.form
            variants={reveal}
            onSubmit={handleSearch}
            role="search"
            aria-label={t("البحث في السيارات", "Search vehicles")}
            className="mx-auto mt-10 flex max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-elevated sm:h-16 sm:flex-row sm:items-stretch"
          >
            {/* Make */}
            <div className="relative flex items-center border-b border-border sm:w-52 sm:border-b-0 sm:border-e">
              <label htmlFor="home-make" className="sr-only">
                {t("الماركة", "Make")}
              </label>
              <select
                id="home-make"
                value={selectedMake}
                onChange={(e) => setSelectedMake(e.target.value)}
                className={cn(
                  "h-14 w-full appearance-none bg-transparent pe-10 ps-4 sm:h-full",
                  "text-sm text-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg",
                  !selectedMake && "text-muted-foreground"
                )}
              >
                <option value="">{t("جميع الماركات", "All Makes")}</option>
                {VEHICLE_MAKES.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                strokeWidth={1.75}
                className="pointer-events-none absolute end-3 h-4 w-4 text-muted-foreground"
              />
            </div>

            {/* Query */}
            <div className="relative flex flex-1 items-center">
              <label htmlFor="home-search" className="sr-only">
                {t("ابحث عن سيارة", "Search for a car")}
              </label>
              <Search
                aria-hidden="true"
                strokeWidth={1.75}
                className="pointer-events-none absolute start-4 h-4 w-4 text-muted-foreground"
              />
              <input
                id="home-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("ابحث بالماركة أو الطراز…", "Search by make or model…")}
                className={cn(
                  "h-14 w-full bg-transparent pe-4 ps-11 sm:h-full",
                  "text-sm text-foreground placeholder:text-muted-foreground/70",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
                )}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={cn(
                "group flex h-14 items-center justify-center gap-2 sm:h-auto sm:px-8",
                "gold-gradient text-[#1a1408]",
                "transition-all duration-300 hover:brightness-110",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-inset",
                isAr ? "text-sm font-semibold" : "text-[0.8125rem] font-semibold uppercase tracking-[0.08em]"
              )}
            >
              {t("بحث", "Search")}
              <ArrowRight
                aria-hidden="true"
                strokeWidth={2}
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
              />
            </button>
          </motion.form>
        </motion.div>
      </Container>
    </section>
  );
}
