"use client";

import * as React from "react";
import { HeroSection } from "@/components/home/hero-section";
import { SearchBarSection } from "@/components/home/search-bar-section";
import { PremiumBrandsSection } from "@/components/home/premium-brands-section";
import { LatestArrivalsSection } from "@/components/home/latest-arrivals-section";
import { WhyChooseUsSection } from "@/components/home/why-choose-us-section";
import { ContactMapSection } from "@/components/home/contact-map-section";
import { WhatsAppButton } from "@/components/common/whatsapp-button";
import { ScrollToTop } from "@/components/common/scroll-to-top";
import type { Locale } from "@/types";

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
}

export default function HomePage({ params }: HomePageProps) {
  const { locale } = React.use(params);

  return (
    <div className="relative">
      <HeroSection locale={locale} />

      <SearchBarSection locale={locale} />

      <PremiumBrandsSection locale={locale} />

      <LatestArrivalsSection locale={locale} />

      <WhyChooseUsSection locale={locale} />

      <ContactMapSection locale={locale} />

      <WhatsAppButton locale={locale} />
      <ScrollToTop />
    </div>
  );
}
