"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Fuel, Gauge, Settings2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { formatCurrency } from "@/lib/utils";
import { CURRENCY } from "@/lib/constants";
import { staggerContainer, fadeUp } from "@/lib/motion";
import type { Locale } from "@/types";

interface LatestVehicle {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  status: string;
  image: string;
}

interface LatestArrivalsSectionProps {
  locale: Locale;
}

export function LatestArrivalsSection({ locale }: LatestArrivalsSectionProps) {
  const ArrowIcon = locale === "ar" ? ArrowLeft : ArrowRight;

  const [vehicles, setVehicles] = React.useState<LatestVehicle[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // API already sorts newest-first (created_at desc).
        const res = await fetch("/api/vehicles?limit=3&status=available&sortField=createdAt&sortDirection=desc");
        const json = await res.json();
        if (!cancelled && json.success) {
          const mapped: LatestVehicle[] = (json.data as any[]).map((v) => ({
            id: v.id,
            slug: v.slug,
            make: v.make,
            model: v.model,
            year: v.year,
            price: v.price,
            mileage: v.mileage,
            fuelType: v.fuelType,
            transmission: v.transmission,
            status: v.status,
            image: v.images?.[0]?.url ?? "",
          }));
          setVehicles(mapped);
        }
      } catch (err) {
        console.error("Failed to load latest arrivals:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (vehicles.length === 0) return null;

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
          <motion.div variants={fadeUp} className="flex items-end justify-between gap-4 mb-10 md:mb-12">
            <div>
              <span className="mb-3 block text-label-md uppercase tracking-wider text-gold-600 dark:text-gold-400">
                {locale === "ar" ? "وصل حديثاً" : "Just Arrived"}
              </span>
              <h2 className="font-display text-display-xs md:text-display-sm font-bold text-foreground">
                {locale === "ar" ? "أحدث الوصولات" : "Latest Arrivals"}
              </h2>
            </div>
            <Link href={`/${locale}/vehicles`}>
              <Button variant="outline" size="sm" className="hidden gap-2 sm:inline-flex">
                {locale === "ar" ? "عرض الكل" : "View All"}
                <ArrowIcon className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </Link>
          </motion.div>

          {/* Horizontal scroll cards - mobile snap, desktop grid */}
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scroll-snap-x sm:overflow-visible sm:pb-0 sm:grid sm:grid-cols-3 sm:overflow-visible">
            {vehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="min-w-[280px] max-w-[320px] sm:min-w-0 sm:max-w-none sm:flex-1 shrink-0 snap-start"
              >
                <Link href={`/${locale}/vehicles/${vehicle.slug}`}>
                  <motion.article
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:shadow-elevated-lg hover:border-gold-400/20"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {vehicle.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={vehicle.image}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <ImagePlaceholder
                          fill
                          alt={`${vehicle.make} ${vehicle.model}`}
                          rounded="none"
                          className="transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      <Badge
                        variant={vehicle.status === "reserved" ? "reserved" : "available"}
                        className="absolute top-3 start-3 md:top-4 md:start-4 shadow-sm"
                        dot
                      >
                        {vehicle.status === "reserved"
                          ? (locale === "ar" ? "محجوزة" : "Reserved")
                          : (locale === "ar" ? "متاحة" : "Available")}
                      </Badge>
                    </div>
                    <div className="p-4 md:p-5">
                      <h3 className="font-display text-body-lg font-bold text-foreground transition-colors group-hover:text-primary line-clamp-1">
                        {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="mt-1 text-body-xs text-muted-foreground">{vehicle.year}</p>
                      <div className="mt-3 md:mt-4 flex items-center gap-3 md:gap-4 border-t border-border pt-3 md:pt-4 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Gauge className="h-3.5 w-3.5" />
                          <span className="text-2xs">{new Intl.NumberFormat(locale === "ar" ? "ar-KW" : "en-US").format(vehicle.mileage)} km</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Fuel className="h-3.5 w-3.5" />
                          <span className="text-2xs">{vehicle.fuelType}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Settings2 className="h-3.5 w-3.5" />
                          <span className="text-2xs">{vehicle.transmission}</span>
                        </div>
                      </div>
                      <div className="mt-3 md:mt-4">
                        <span className="font-display text-body-lg font-bold text-foreground">
                          {formatCurrency(vehicle.price)}{" "}
                          <span className="text-body-xs font-normal text-muted-foreground">{CURRENCY.symbol}</span>
                        </span>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile view all */}
          <motion.div variants={fadeUp} className="mt-8 md:mt-10 text-center sm:hidden">
            <Link href={`/${locale}/vehicles`}>
              <Button variant="outline" size="lg" className="gap-2">
                {locale === "ar" ? "عرض كل الوصولات" : "View All Arrivals"}
                <ArrowIcon className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
