"use client";

import * as React from "react";
import { SearchBarSection } from "@/components/home/search-bar-section";
import { FeaturedVehiclesSection } from "@/components/home/featured-vehicles-section";
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
      <SearchBarSection locale={locale} />

      <LatestArrivalsSection locale={locale} />

      <div className="relative">
        <div className="mx-auto h-px max-w-xs bg-gradient-to-r from-transparent via-gold-400/25 to-transparent" />
      </div>

      <FeaturedVehiclesSection locale={locale} />

      <WhyChooseUsSection locale={locale} />

      <ContactMapSection locale={locale} />

      <WhatsAppButton locale={locale} />
      <ScrollToTop />
    </div>
  );
}
