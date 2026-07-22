"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { easings } from "@/lib/motion";
import type { Locale } from "@/types";

interface HeroSectionProps {
  locale: Locale;
}

/* One cinematic photograph carries the hero, exactly like the reference:
   black Mercedes sedan on the right, dealership building behind, dusk lighting.
   Drop the clean photo (no text) at public/images/hero-bg.jpg — until it exists,
   the black/gold gradient stage below keeps the section presentable. */
const HERO_BG = "/images/hero-bg.jpg";

export function HeroSection({ locale }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const isAr = locale === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);

  const reveal: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 18 },
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
        : { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  return (
    <section className="relative overflow-hidden bg-[#000000] text-white">
      {/* ── Background: cinematic showroom photo with layered overlays ── */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        {/* Hero photograph — car biased toward the right */}
        <img
          src={HERO_BG}
          alt=""
          className="w-full h-full object-cover object-[82%_center] sm:object-[75%_center] md:object-center opacity-90 saturate-[1.3] contrast-[1.15] transition-all duration-500"
        />
        {/* Gradients — cinematic dark ambient shading */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-transparent h-1/2" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/75 to-transparent md:via-[#050505]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
        {/* Ambient golden glow near the vehicle */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_45%,rgba(197,168,128,0.18),transparent_55%)]" />
        {/* Soft golden atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(197,168,128,0.08),transparent_50%)]" />
      </div>

      {/* ── Content: left column over the photo, reference proportions ── */}
      <Container size="xl" className="relative z-10">
        <motion.div
          variants={stage}
          initial="hidden"
          animate="visible"
          className="flex min-h-[380px] max-w-xl flex-col justify-center py-12 text-start sm:min-h-[440px] md:min-h-[500px] md:py-16 lg:min-h-[560px]"
        >
          {/* Location */}
          <motion.p
            variants={reveal}
            className={cn(
              "text-gold-400",
              isAr ? "text-sm font-medium" : "text-xs uppercase tracking-[0.4em]"
            )}
          >
            {t("الكويت", "Kuwait")}
          </motion.p>

          {/* Heading — two lines, white then gold, serif, title case */}
          <motion.h1
            variants={reveal}
            className={cn(
              "mt-5 font-display leading-[1.12]",
              "text-4xl sm:text-5xl lg:text-6xl",
              isAr ? "font-bold" : "font-medium"
            )}
          >
            <span className="block text-white">
              {t("قُد الفخامة.", "Drive Luxury.")}
            </span>
            <span className="block text-gold-400">
              {t("عِش التميّز.", "Live Excellence.")}
            </span>
          </motion.h1>

          {/* Description — short, two lines */}
          <motion.p
            variants={reveal}
            className="mt-6 max-w-xs text-base leading-relaxed text-white/75 md:text-lg"
          >
            {t(
              "اكتشف أفضل مجموعة من السيارات الفاخرة والمميزة في الكويت.",
              "Discover Kuwait's finest collection of luxury and premium cars."
            )}
          </motion.p>

          {/* Buttons — solid gold + white outline, same destinations as before */}
          <motion.div variants={reveal} className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href={`/${locale}/vehicles`}
              className={cn(
                "inline-flex h-12 items-center justify-center rounded-md px-7",
                "bg-gradient-to-r from-gold-700 to-gold-500 text-[#1a1408] font-semibold",
                isAr ? "text-sm" : "text-body-sm uppercase tracking-[0.08em]",
                "transition-all duration-300 hover:brightness-110 active:scale-[0.98]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#000000]"
              )}
            >
              {t("استعرض المعروض", "Browse Inventory")}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className={cn(
                "inline-flex h-12 items-center justify-center rounded-md px-7",
                "border border-white/60 text-white font-medium",
                isAr ? "text-sm" : "text-body-sm uppercase tracking-[0.08em]",
                "transition-all duration-300 hover:border-[#D4AF37] hover:text-gold-400 active:scale-[0.98]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#000000]"
              )}
            >
              {t("تواصل معنا", "Contact Us")}
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
