"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Phone, Clock, Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { CONTACT_INFO } from "@/lib/constants";
import { staggerContainer, fadeUp } from "@/lib/motion";
import type { Locale } from "@/types";

interface ContactMapSectionProps {
  locale: Locale;
}

export function ContactMapSection({ locale }: ContactMapSectionProps) {
  return (
    <section className="pt-3 pb-10 md:pt-4 md:pb-16">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="mb-12 text-center">
            <span className="mb-3 block text-label-md uppercase tracking-wider text-gold-600 dark:text-gold-400">
              {locale === "ar" ? "تواصل معنا" : "Contact Us"}
            </span>
            <h2 className="font-display text-display-xs md:text-display-sm font-bold text-foreground">
              {locale === "ar" ? "معلومات التواصل" : "Get in Touch"}
            </h2>
          </motion.div>

          {/* Contact cards */}
          <motion.div variants={fadeUp} className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <ContactCard
              icon={Phone}
              title={locale === "ar" ? "الهاتف" : "Phone"}
              content={CONTACT_INFO.phoneFormatted}
              href={`tel:${CONTACT_INFO.phone}`}
              locale={locale}
            />
            <ContactCard
              icon={Mail}
              title={locale === "ar" ? "البريد الإلكتروني" : "Email"}
              content={CONTACT_INFO.email}
              href={`mailto:${CONTACT_INFO.email}`}
              locale={locale}
            />
            <ContactCard
              icon={Clock}
              title={locale === "ar" ? "ساعات العمل" : "Working Hours"}
              content={locale === "ar" ? CONTACT_INFO.workingHoursAr : CONTACT_INFO.workingHours}
              locale={locale}
            />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

function ContactCard({
  icon: Icon,
  title,
  content,
  href,
  locale,
}: {
  icon: React.ElementType;
  title: string;
  content: string;
  href?: string;
  locale: Locale;
}) {
  const Wrapper = href ? "a" : "div";
  const wrapperProps = href ? { href, target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Wrapper {...wrapperProps}>
      <div className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-500 hover:shadow-elevated hover:border-gold-400/20">
        <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 transition-colors duration-500 group-hover:bg-gold-400/20">
          <Icon className="h-5 w-5 text-gold-600 dark:text-gold-400" />
        </div>
        <div className="min-w-0">
          <p className="text-label-sm text-muted-foreground">{title}</p>
          <p className="mt-0.5 text-body-sm font-medium text-foreground break-words">{content}</p>
        </div>
      </div>
    </Wrapper>
  );
}
