"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { easings } from "@/lib/motion";
import type { Locale } from "@/types";

interface PremiumBrandsSectionProps {
  locale: Locale;
}

/* Display list — `make` values must match VEHICLE_MAKES so the
   /vehicles?make= filter works. Labels are the short reference names.
   Official SVG logos live in /public/images/brands, normalized from the
   downloaded originals in /public/brands by scripts/normalize-brand-svgs.mjs
   (viewBox tightened to visible bounds so one sizing rule fits every brand). */
const BRANDS = [
  { make: "Mercedes-Benz", label: "Mercedes", labelAr: "مرسيدس", slug: "mercedes-benz" },
  { make: "BMW", label: "BMW", labelAr: "بي إم دبليو", slug: "bmw" },
  { make: "Lexus", label: "Lexus", labelAr: "لكزس", slug: "lexus" },
  { make: "Toyota", label: "Toyota", labelAr: "تويوتا", slug: "toyota" },
  { make: "Nissan", label: "Nissan", labelAr: "نيسان", slug: "nissan" },
  { make: "Porsche", label: "Porsche", labelAr: "بورشه", slug: "porsche" },
  { make: "Range Rover", label: "Land Rover", labelAr: "رينج روفر", slug: "land-rover" },
  { make: "Audi", label: "Audi", labelAr: "أودي", slug: "audi" },
];

export function PremiumBrandsSection({ locale }: PremiumBrandsSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const isAr = locale === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const stage: Variants = {
    hidden: {},
    visible: {
      transition: prefersReducedMotion ? {} : { staggerChildren: 0.06, delayChildren: 0.05 },
    },
  };

  const reveal: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.6, ease: easings.luxury },
    },
  };

  return (
    <section className="bg-[#000000] py-5">
      <Container size="xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stage}
        >
          {/* Header — gold title start, "View all" end, aligned to heading height */}
          <motion.div variants={reveal} className="mb-6 flex items-center justify-between gap-4">
            <h2
              className={cn(
                "font-display font-bold text-gold-400",
                isAr ? "text-lg md:text-xl" : "text-lg uppercase tracking-wide md:text-xl"
              )}
            >
              {t("الماركات الشهيرة", "Popular Brands")}
            </h2>
            <Link
              href={`/${locale}/vehicles`}
              className="group inline-flex shrink-0 items-center gap-1.5 text-sm text-white/70 transition-colors duration-200 hover:text-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
            >
              {t("عرض الكل", "View all")}
              <ArrowIcon
                strokeWidth={1.75}
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
              />
            </Link>
          </motion.div>

          {/* One horizontal row — swipeable on mobile, evenly spaced on desktop */}
          <div className="flex gap-6 overflow-x-auto pb-1 scroll-snap-x lg:grid lg:grid-cols-8 lg:gap-6 lg:overflow-visible lg:pb-0">
            {BRANDS.map((brand) => (
              <motion.div key={brand.make} variants={reveal} className="shrink-0 snap-start">
                <Link
                  href={`/${locale}/vehicles?make=${encodeURIComponent(brand.make)}`}
                  className="group flex w-20 flex-col items-center gap-2.5 focus-visible:outline-none"
                >
                  {/* Fixed 80px transparent circle with thin gray border */}
                  <span
                    className={cn(
                      "flex h-20 w-20 items-center justify-center rounded-full",
                      "border border-white/15 bg-transparent",
                      "transition-all duration-[250ms] ease-luxury",
                      "group-hover:scale-105 group-hover:border-[#D4AF37]",
                      "group-focus-visible:scale-105 group-focus-visible:border-[#D4AF37]"
                    )}
                  >
                    <BrandLogo slug={brand.slug} label={brand.label} />
                  </span>
                  {/* Name below */}
                  <span className="text-center text-xs font-medium text-white transition-colors duration-[250ms] group-hover:text-gold-400">
                    {isAr ? brand.labelAr : brand.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

/* Official marque SVG — serif-monogram fallback, never renders a broken image.
   SVG viewBoxes are pre-tightened to visible bounds, so constraining the
   longest side to the 64px box fills ~80% of the 80px circle for every brand.
   Porsche's crest reads visually left-heavy, so it alone gets a 3px nudge. */
function BrandLogo({ slug, label }: { slug: string; label: string }) {
  const [failed, setFailed] = React.useState(false);

  if (failed) {
    return (
      <span aria-hidden="true" className="font-display text-2xl font-semibold text-white/85">
        {label.charAt(0)}
      </span>
    );
  }

  return (
    <span className="flex h-16 w-16 items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/images/brands/${slug}.svg`}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
        className={cn(
          "max-h-full max-w-full object-contain",
          slug === "porsche" && "translate-x-[3px]"
        )}
      />
    </span>
  );
}
