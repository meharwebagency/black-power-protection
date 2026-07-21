"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { CONTACT_INFO } from "@/lib/constants";
import { staggerContainer, fadeUp } from "@/lib/motion";
import type { Locale } from "@/types";

interface ContactMapSectionProps {
  locale: Locale;
}

export function ContactMapSection({ locale }: ContactMapSectionProps) {
  const [mapLoaded, setMapLoaded] = React.useState(false);

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
              {locale === "ar" ? "زورنا في الكويت" : "Visit Us in Kuwait"}
            </h2>
          </motion.div>

          {/* Contact cards - shown on mobile above map */}
          <motion.div variants={fadeUp} className="flex flex-col gap-3 mb-8 lg:hidden">
            <ContactCard
              icon={MapPin}
              title={locale === "ar" ? "العنوان" : "Address"}
              content={locale === "ar" ? CONTACT_INFO.addressAr : CONTACT_INFO.address}
              locale={locale}
            />
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

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            {/* Map */}
            <motion.div variants={fadeUp} className="overflow-hidden rounded-2xl border border-border lg:col-span-3 relative">
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary/50 z-10">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
                    <span className="text-body-xs text-muted-foreground">
                      {locale === "ar" ? "جاري تحميل الخريطة..." : "Loading map..."}
                    </span>
                  </div>
                </div>
              )}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13846.891906079965!2d47.97!3d29.37!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fc535c4a7c1b0e3%3A0x1234567890abcdef!2sKuwait!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-[400px] w-full"
                title="Black Power Protection Location"
                onLoad={() => setMapLoaded(true)}
              />
            </motion.div>

            {/* Contact info - desktop only */}
            <motion.div variants={fadeUp} className="hidden lg:flex lg:flex-col lg:gap-4 lg:col-span-2">
              <ContactCard
                icon={MapPin}
                title={locale === "ar" ? "العنوان" : "Address"}
                content={locale === "ar" ? CONTACT_INFO.addressAr : CONTACT_INFO.address}
                locale={locale}
              />
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
          </div>
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
