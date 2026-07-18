"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { formatCurrency } from "@/lib/utils";
import { CURRENCY } from "@/lib/constants";
import { staggerContainer, fadeUp } from "@/lib/motion";
import type { Locale } from "@/types";

interface Vehicle {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  color: string;
  status: string;
  image: string;
}

interface FeaturedVehiclesSectionProps {
  locale: Locale;
}

export function FeaturedVehiclesSection({ locale }: FeaturedVehiclesSectionProps) {
  const ArrowIcon = locale === "ar" ? ArrowLeft : ArrowRight;

  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/vehicles?limit=100&status=available");
        const json = await res.json();
        if (!cancelled && json.success) {
          const mapped: Vehicle[] = (json.data as any[])
            .filter((v) => v.featured)
            .slice(0, 6)
            .map((v) => ({
              id: v.id,
              slug: v.slug,
              make: v.make,
              model: v.model,
              year: v.year,
              price: v.price,
              mileage: v.mileage,
              fuelType: v.fuelType,
              transmission: v.transmission,
              color: v.color,
              status: v.status,
              image: v.images?.[0]?.url ?? "",
            }));
          setVehicles(mapped);
        }
      } catch (err) {
        console.error("Failed to load featured vehicles:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Nothing featured yet — hide the section entirely rather than show mock data.
  if (vehicles.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
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
                {locale === "ar" ? "مميزة" : "Featured"}
              </span>
              <h2 className="font-display text-display-xs md:text-display-sm font-bold text-foreground">
                {locale === "ar" ? "السيارات المميزة" : "Featured Vehicles"}
              </h2>
            </div>
            <Link href={`/${locale}/vehicles`}>
              <Button variant="outline" size="sm" className="hidden gap-2 sm:inline-flex">
                {locale === "ar" ? "عرض الكل" : "View All"}
                <ArrowIcon className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </Link>
          </motion.div>

          {/* Vehicle Grid */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
          >
            {vehicles.map((vehicle) => (
              <motion.div key={vehicle.id} variants={fadeUp}>
                <Link href={`/${locale}/vehicles/${vehicle.slug}`}>
                  <motion.article
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:shadow-elevated-lg hover:border-gold-400/20"
                  >
                    {/* Image */}
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </div>

                    {/* Content */}
                    <div className="p-4 md:p-5">
                      <h3 className="font-display text-body-lg font-bold text-foreground transition-colors group-hover:text-primary line-clamp-1">
                        {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="mt-1 text-body-xs text-muted-foreground">{vehicle.year}</p>

                      {/* Specs */}
                      <div className="mt-3 md:mt-4 grid grid-cols-4 gap-1.5 md:gap-2">
                        <SpecChip label={String(vehicle.year)} />
                        <SpecChip label={`${new Intl.NumberFormat(locale === "ar" ? "ar-KW" : "en-US").format(vehicle.mileage)} km`} />
                        <SpecChip label={vehicle.fuelType} />
                        <SpecChip label={vehicle.transmission} />
                      </div>

                      {/* Price */}
                      <div className="mt-3 md:mt-4 flex items-center justify-between border-t border-border pt-3 md:pt-4">
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
          </motion.div>

          {/* Mobile view all */}
          <motion.div variants={fadeUp} className="mt-8 md:mt-10 text-center sm:hidden">
            <Link href={`/${locale}/vehicles`}>
              <Button variant="outline" size="lg" className="gap-2">
                {locale === "ar" ? "عرض كل السيارات" : "View All Vehicles"}
                <ArrowIcon className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

function SpecChip({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center rounded-lg bg-secondary/60 px-1 py-1.5 md:px-1.5 md:py-2 text-center transition-colors group-hover:bg-secondary">
      <span className="max-w-full truncate text-2xs text-muted-foreground">{label}</span>
    </div>
  );
}
