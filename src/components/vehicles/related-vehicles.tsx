"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { VehicleCardListing } from "./vehicle-card-listing";
import type { Vehicle } from "@/types/vehicle";
import type { Locale } from "@/types";

interface RelatedVehiclesProps {
  currentVehicle: Vehicle;
  locale: Locale;
}

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const;

export function RelatedVehicles({ currentVehicle, locale }: RelatedVehiclesProps) {
  const ArrowIcon = locale === "ar" ? ArrowLeft : ArrowRight;
  const t = (ar: string, en: string) => (locale === "ar" ? ar : en);
  const reduceMotion = useReducedMotion();

  // Pull live inventory and pick vehicles that share the make or body type.
  const [pool, setPool] = React.useState<Vehicle[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/vehicles?limit=100&status=available");
        const json = await res.json();
        if (!cancelled && json.success) {
          setPool(json.data as Vehicle[]);
        }
      } catch (err) {
        console.error("Failed to load related vehicles:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const related = pool
    .filter(
      (v) =>
        v.id !== currentVehicle.id &&
        (v.make === currentVehicle.make || v.bodyType === currentVehicle.bodyType)
    )
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="py-10 md:py-16 lg:py-24">
      <Container size="xl">
        {/* Header */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE_LUXURY }}
          className="mb-6 sm:mb-10 flex items-end justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent" aria-hidden />
              <span className="text-2xs font-medium uppercase tracking-[0.22em] text-muted-foreground ltr:tracking-[0.22em] rtl:tracking-normal">
                {t("قد يعجبك", "You May Also Like")}
              </span>
            </div>
            <h2 className="mt-4 font-display text-display-sm font-semibold text-foreground md:text-display-md">
              {t("سيارات مشابهة", "Related Vehicles")}
            </h2>
          </div>
          <Link href={`/${locale}/vehicles`} className="hidden sm:inline-flex">
            <Button variant="outline" size="sm" className="gap-2">
              {t("عرض الكل", "View All")}
              <ArrowIcon className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </Link>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.08 } },
          }}
          className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {related.map((vehicle) => (
            <motion.div
              key={vehicle.id}
              variants={{
                hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_LUXURY } },
              }}
            >
              <VehicleCardListing vehicle={vehicle} locale={locale} />
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile view-all */}
        <div className="mt-8 sm:hidden">
          <Link href={`/${locale}/vehicles`}>
            <Button variant="outline" size="sm" fullWidth className="gap-2">
              {t("عرض الكل", "View All")}
              <ArrowIcon className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
