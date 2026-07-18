"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ShieldCheck, Award, Headphones, BadgeCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { easings } from "@/lib/motion";
import type { Locale } from "@/types";

interface WhyChooseUsSectionProps {
  locale: Locale;
}

const REASONS_AR = [
  { icon: ShieldCheck, title: "جودة مضمونة", description: "فحص 150 نقطة قبل كل عرض" },
  { icon: Award, title: "خبرة الكويت", description: "أكثر من 10 سنوات في السوق الفاخر" },
  { icon: Headphones, title: "دعم 24/7", description: "خدمة متواصلة عبر واتساب" },
  { icon: BadgeCheck, title: "أفضل الأسعار", description: "أسعار تنافسية مع مرونة كاملة" },
];

const REASONS_EN = [
  { icon: ShieldCheck, title: "Guaranteed Quality", description: "150-point inspection before listing" },
  { icon: Award, title: "Kuwait Expertise", description: "Over 10 years in the luxury market" },
  { icon: Headphones, title: "24/7 Support", description: "Always available via WhatsApp" },
  { icon: BadgeCheck, title: "Best Prices", description: "Competitive rates, full flexibility" },
];

export function WhyChooseUsSection({ locale }: WhyChooseUsSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const isAr = locale === "ar";
  const reasons = isAr ? REASONS_AR : REASONS_EN;

  const stage: Variants = {
    hidden: {},
    visible: {
      transition: prefersReducedMotion ? {} : { staggerChildren: 0.1, delayChildren: 0.05 },
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
    <section className="py-10 md:py-14">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stage}
        >
          {/* Header — compact */}
          <motion.div variants={reveal} className="mb-6 text-center md:mb-8">
            <span className="mb-2 block text-label-sm uppercase tracking-[0.2em] text-gold-600 dark:text-gold-400">
              {isAr ? "لماذا نحن" : "Why Us"}
            </span>
            <h2 className="font-display text-display-xs md:text-display-sm font-bold text-foreground">
              {isAr ? "لماذا تختارنا" : "Why Choose Us"}
            </h2>
          </motion.div>

          {/* 2×2 on mobile & tablet, single row on desktop */}
          <motion.ul
            variants={stage}
            className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5"
          >
            {reasons.map((reason) => {
              const Icon = reason.icon;
              return (
                <motion.li key={reason.title} variants={reveal}>
                  <div
                    className={cn(
                      "group flex h-full flex-col items-center rounded-2xl border border-border bg-card p-4 text-center sm:p-5",
                      "shadow-sm transition-all duration-500",
                      "hover:-translate-y-1 hover:border-gold-400/30 hover:shadow-elevated"
                    )}
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold-400/10 text-gold-600 transition-colors duration-500 group-hover:bg-gold-400/20 dark:text-gold-400 sm:h-12 sm:w-12">
                      <Icon strokeWidth={1.75} className="h-5 w-5 sm:h-6 sm:w-6" />
                    </span>
                    <h3 className="mt-3 font-display text-sm font-bold text-foreground sm:text-base">
                      {reason.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {reason.description}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        </motion.div>
      </Container>
    </section>
  );
}
