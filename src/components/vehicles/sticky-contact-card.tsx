"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Phone, MessageCircle, MapPin, Clock, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT_INFO } from "@/lib/constants";
import type { Vehicle } from "@/types/vehicle";
import type { Locale } from "@/types";

interface StickyContactCardProps {
  vehicle: Vehicle;
  locale: Locale;
}

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const;

export function StickyContactCard({ vehicle, locale }: StickyContactCardProps) {
  const t = (ar: string, en: string) => (locale === "ar" ? ar : en);
  const reduceMotion = useReducedMotion();

  const vehicleName = `${locale === "ar" ? vehicle.makeAr : vehicle.make} ${locale === "ar" ? vehicle.modelAr : vehicle.model}`;
  const whatsappMessage = encodeURIComponent(
    t(
      `مرحباً، أريد الاستفسار عن ${vehicleName} ${vehicle.year}`,
      `Hello, I'd like to inquire about the ${vehicleName} ${vehicle.year}`
    )
  );
  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, "")}?text=${whatsappMessage}`;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: EASE_LUXURY }}
      className="sticky top-24 rounded-xl border border-border/70 bg-card p-6"
    >
      {/* Heading */}
      <div className="flex items-center gap-3">
        <span className="h-px w-6 bg-accent" aria-hidden />
        <span className="text-2xs font-medium uppercase tracking-[0.18em] text-muted-foreground ltr:tracking-[0.18em] rtl:tracking-normal">
          {t("مهتم بهذه السيارة؟", "Interested?")}
        </span>
      </div>
      <p className="mt-4 text-body-sm text-muted-foreground">
        {t(
          "تواصل مع فريقنا للحصول على أسعار الخصوصية وحجز معاينة.",
          "Speak with our team for private pricing and to arrange a viewing."
        )}
      </p>

      {/* CTAs */}
      <div className="mt-6 space-y-2.5">
        {/* WhatsApp */}
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            className="gap-2 bg-[#25D366] text-white hover:bg-[#20BA5C]"
          >
            <MessageCircle className="h-4 w-4" />
            {t("تواصل عبر واتساب", "Chat on WhatsApp")}
          </Button>
        </a>

        {/* Call */}
        <a href={`tel:${CONTACT_INFO.phone}`} className="block">
          <Button variant="outline" size="lg" fullWidth className="gap-2">
            <Phone className="h-4 w-4" />
            <span dir="ltr">{CONTACT_INFO.phoneFormatted}</span>
          </Button>
        </a>

        {/* Google Maps */}
        <a href={CONTACT_INFO.googleMaps} target="_blank" rel="noopener noreferrer" className="block">
          <Button variant="ghost" size="lg" fullWidth className="gap-2 text-muted-foreground hover:text-foreground">
            <MapPin className="h-4 w-4" />
            {t("موقعنا على الخريطة", "View on Map")}
            <ExternalLink className="h-3 w-3 opacity-50" />
          </Button>
        </a>
      </div>

      {/* Working hours */}
      <div className="mt-6 flex items-start gap-2.5 border-t border-border/60 pt-5 text-body-xs text-muted-foreground">
        <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <div>
          <p className="font-medium text-foreground">{t("ساعات العمل", "Working Hours")}</p>
          <p className="mt-0.5">{t(CONTACT_INFO.workingHoursAr, CONTACT_INFO.workingHours)}</p>
        </div>
      </div>

      {/* Trust points */}
      <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-border/60 pt-5">
        {[
          { label: t("فحص ١٥٠ نقطة", "150-Point Check") },
          { label: t("ضمان السعر", "Price Guarantee") },
          { label: t("توصيل آمن", "Safe Delivery") },
          { label: t("خدمة ما بعد البيع", "After-Sales Service") },
        ].map((badge) => (
          <li key={badge.label} className="flex items-center gap-2 text-2xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-accent" />
            <span>{badge.label}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
