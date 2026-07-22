"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ImageGallery } from "@/components/vehicles/image-gallery";
import { VehicleInfo } from "@/components/vehicles/vehicle-info";
import { VehicleSpecs } from "@/components/vehicles/vehicle-specs";
import { StickyContactCard } from "@/components/vehicles/sticky-contact-card";
import { InquiryForm } from "@/components/vehicles/inquiry-form";
import { RelatedVehicles } from "@/components/vehicles/related-vehicles";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/types";
import type { Vehicle } from "@/types/vehicle";

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const;

export default function VehicleDetailPage() {
  const params = useParams();
  const locale = (params.locale as Locale) || "ar";
  const slug = params.slug as string;
  const reduceMotion = useReducedMotion();

  const t = (ar: string, en: string) => (locale === "ar" ? ar : en);

  // Load the vehicle from Supabase (via the public API) by slug.
  const [vehicle, setVehicle] = React.useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/vehicles/${encodeURIComponent(slug)}`);
        const json = await res.json();
        if (!cancelled) {
          setVehicle(json.success ? (json.data as Vehicle) : null);
        }
      } catch (err) {
        console.error("Failed to load vehicle:", err);
        if (!cancelled) setVehicle(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 sm:pt-24">
        <Container size="xl">
          <div className="mt-4 grid grid-cols-1 gap-6 sm:mt-6 sm:gap-8 md:mt-8 lg:grid-cols-12 lg:gap-12">
            <div className="space-y-4 sm:space-y-6 lg:col-span-7">
              <div className="aspect-[3/2] w-full animate-pulse rounded-xl sm:rounded-2xl bg-muted/70" />
              <div className="h-6 w-2/3 animate-pulse rounded bg-muted/70" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted/50" />
              <div className="h-40 w-full animate-pulse rounded-xl bg-muted/60" />
            </div>
            <div className="lg:col-span-5">
              <div className="h-72 w-full animate-pulse rounded-xl sm:rounded-2xl bg-muted/60" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen pt-16 sm:pt-24">
        <Container size="xl">
          <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent" aria-hidden />
              <span className="text-2xs font-medium uppercase tracking-[0.22em] text-muted-foreground ltr:tracking-[0.22em] rtl:tracking-normal">
                {t("404", "404")}
              </span>
              <span className="h-px w-8 bg-accent" aria-hidden />
            </div>
            <p className="mt-6 font-display text-display-sm font-semibold text-foreground">
              {t("السيارة غير موجودة", "Vehicle Not Found")}
            </p>
            <p className="mt-3 max-w-md text-balance text-body-sm text-muted-foreground">
              {t(
                "السيارة التي تبحث عنها غير موجودة أو تم حذفها",
                "The vehicle you're looking for doesn't exist or has been removed"
              )}
            </p>
            <Link href={`/${locale}/vehicles`} className="mt-8">
              <Button variant="primary" size="lg">
                {t("العودة إلى السيارات", "Back to Vehicles")}
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const make = locale === "ar" ? vehicle.makeAr : vehicle.make;
  const model = locale === "ar" ? vehicle.modelAr : vehicle.model;

  const breadcrumbs = [
    { label: t("الرئيسية", "Home"), href: `/${locale}` },
    { label: t("السيارات", "Vehicles"), href: `/${locale}/vehicles` },
    { label: `${make} ${model}` },
  ];

  return (
    <div className="min-h-screen pb-6 pt-16 sm:pt-20 md:pt-24 lg:pb-8">
      <Container size="xl">
        {/* Breadcrumbs */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Breadcrumbs items={breadcrumbs} locale={locale} className="text-body-xs" />
        </motion.div>

        {/* Main content */}
        <div className="mt-6 grid grid-cols-1 gap-8 md:mt-8 lg:grid-cols-12 lg:gap-12">
          {/* Left: Gallery + Specs + Inquiry */}
          <div className="space-y-10 lg:col-span-7 lg:space-y-12">
            <ImageGallery
              images={vehicle.images}
              make={vehicle.make}
              model={vehicle.model}
              year={vehicle.year}
              locale={locale}
            />

            {/* Vehicle Info (mobile only — on desktop it lives in the sidebar) */}
            <div className="lg:hidden">
              <VehicleInfo vehicle={vehicle} locale={locale} />
            </div>

            {/* Specifications / Features / Description */}
            <VehicleSpecs vehicle={vehicle} locale={locale} />

            {/* Inquiry Form */}
            <InquiryForm vehicle={vehicle} locale={locale} />
          </div>

          {/* Right: Info + Sticky Contact */}
          <div className="lg:col-span-5">
            {/* Vehicle Info (desktop) */}
            <div className="hidden lg:block">
              <VehicleInfo vehicle={vehicle} locale={locale} />
              <div className="my-8 h-px bg-border/60" />
            </div>

            {/* Sticky Contact Card */}
            <StickyContactCard vehicle={vehicle} locale={locale} />
          </div>
        </div>
      </Container>

      {/* Related Vehicles */}
      <div className="mt-16 border-t border-border/60 md:mt-24">
        <RelatedVehicles currentVehicle={vehicle} locale={locale} />
      </div>
    </div>
  );
}
