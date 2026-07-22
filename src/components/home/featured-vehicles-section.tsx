"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CarFront, Heart } from "lucide-react";
import { Container } from "@/components/ui/container";
import { formatCurrency, cn } from "@/lib/utils";
import { staggerContainer, fadeUp } from "@/lib/motion";
import type { Locale } from "@/types";

interface Vehicle {
  id: string;
  slug: string;
  make: string;
  makeAr: string;
  model: string;
  modelAr: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  fuelTypeAr: string;
  transmission: string;
  transmissionAr: string;
  status: string;
  image: string;
}

interface FeaturedVehiclesSectionProps {
  locale: Locale;
}

const FAVORITES_KEY = "bpp-favorites";

function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function FeaturedVehiclesSection({ locale }: FeaturedVehiclesSectionProps) {
  const isAr = locale === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // API returns newest-first; featured cars (if any are flagged) lead,
        // but the section never hides available inventory behind the flag.
        const res = await fetch("/api/vehicles?limit=100&status=available");
        const json = await res.json();
        if (!cancelled && json.success) {
          const mapped: Vehicle[] = (json.data as any[])
            .sort((a, b) => Number(b.featured === true) - Number(a.featured === true))
            .slice(0, 6)
            .map((v) => ({
              id: v.id,
              slug: v.slug,
              make: v.make,
              makeAr: v.makeAr,
              model: v.model,
              modelAr: v.modelAr,
              year: v.year,
              price: v.price,
              mileage: v.mileage,
              fuelType: v.fuelType,
              fuelTypeAr: v.fuelTypeAr,
              transmission: v.transmission,
              transmissionAr: v.transmissionAr,
              status: v.status,
              image: v.images?.[0]?.url ?? "",
            }));
          setVehicles(mapped);
        }
      } catch (err) {
        console.error("Failed to load featured vehicles:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ── Carousel paging (dot indicators, as in the reference) ── */
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [pages, setPages] = React.useState(1);
  const [activePage, setActivePage] = React.useState(0);

  const recomputePages = React.useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setPages(Math.max(1, Math.round(el.scrollWidth / el.clientWidth)));
    setActivePage(Math.round(Math.abs(el.scrollLeft) / el.clientWidth));
  }, []);

  React.useEffect(() => {
    recomputePages();
    window.addEventListener("resize", recomputePages);
    return () => window.removeEventListener("resize", recomputePages);
  }, [recomputePages, vehicles.length]);

  const goToPage = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: (isAr ? -1 : 1) * i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <section className="bg-[#000000] py-14 text-white md:py-16">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          {/* ── Header: title + gold bar start, "View all cars" end ── */}
          <motion.div variants={fadeUp} className="mb-8 flex items-center justify-between gap-4 md:mb-10">
            <div>
              <h2
                className={cn(
                  "font-display text-display-sm md:text-display-lg font-bold text-white",
                  isAr ? "" : "uppercase tracking-wide"
                )}
              >
                {t("السيارات المميزة", "Featured Cars")}
              </h2>
              <span aria-hidden="true" className="mt-2 block h-[3px] w-12 rounded-full bg-[#D4AF37]" />
            </div>
            <Link
              href={`/${locale}/vehicles`}
              className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-gold-400 transition-all duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-lg"
            >
              {t("عرض كل السيارات", "View all cars")}
              <ArrowIcon
                strokeWidth={1.75}
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
              />
            </Link>
          </motion.div>

          {/* ── Loading skeletons ── */}
          {loading && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="animate-pulse overflow-hidden rounded-xl border border-white/[0.08] bg-[#111111]"
                >
                  <div className="aspect-[4/3] bg-white/[0.05]" />
                  <div className="space-y-3 p-5">
                    <div className="h-5 w-20 rounded bg-white/[0.06]" />
                    <div className="h-5 w-3/4 rounded bg-white/[0.08]" />
                    <div className="h-4 w-2/3 rounded bg-white/[0.05]" />
                    <div className="h-5 w-28 rounded bg-white/[0.08]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Empty state ── */}
          {!loading && vehicles.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.08] bg-[#111111] px-6 py-16 text-center">
              <CarFront aria-hidden="true" strokeWidth={1.25} className="h-10 w-10 text-white/30" />
              <p className="mt-4 text-base font-medium text-white/70">
                {t("لا توجد سيارات مميزة حالياً.", "No featured cars at the moment.")}
              </p>
              <Link
                href={`/${locale}/vehicles`}
                className="mt-2 text-sm text-gold-400 transition-all hover:brightness-110"
              >
                {t("تصفح جميع السيارات", "Browse all cars")}
              </Link>
            </div>
          )}

          {/* ── Card carousel: 3-up on desktop, swipeable, dot pagination ── */}
          {!loading && vehicles.length > 0 && (
            <>
              <motion.div
                ref={trackRef}
                variants={staggerContainer}
                onScroll={recomputePages}
                className="scrollbar-hidden -mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-1 sm:gap-6"
              >
                {vehicles.map((vehicle) => (
                  <motion.div
                    key={vehicle.id}
                    variants={fadeUp}
                    className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                  >
                    <FeaturedCard vehicle={vehicle} locale={locale} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Dots */}
              {pages > 1 && (
                <div className="mt-7 flex items-center justify-center gap-2.5">
                  {Array.from({ length: pages }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => goToPage(i)}
                      aria-label={t(`الصفحة ${i + 1}`, `Page ${i + 1}`)}
                      aria-current={activePage === i}
                      className={cn(
                        "h-2 w-2 rounded-full transition-colors duration-200",
                        activePage === i ? "bg-[#D4AF37]" : "bg-white/20 hover:bg-white/35"
                      )}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>
      </Container>
    </section>
  );
}

/* ── Reference card: image + heart, FEATURED badge, title, meta line, gold price ── */
function FeaturedCard({ vehicle, locale }: { vehicle: Vehicle; locale: Locale }) {
  const isAr = locale === "ar";
  const t = (ar: string, en: string) => (isAr ? ar : en);

  const [isFavorite, setIsFavorite] = React.useState(false);

  React.useEffect(() => {
    setIsFavorite(readFavorites().includes(vehicle.id));
  }, [vehicle.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const favorites = readFavorites();
    const next = favorites.includes(vehicle.id)
      ? favorites.filter((id) => id !== vehicle.id)
      : [...favorites, vehicle.id];
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    } catch {}
    setIsFavorite(next.includes(vehicle.id));
  };

  const make = isAr ? vehicle.makeAr : vehicle.make;
  const model = isAr ? vehicle.modelAr : vehicle.model;
  const fuelType = isAr ? vehicle.fuelTypeAr : vehicle.fuelType;
  const transmission = isAr ? vehicle.transmissionAr : vehicle.transmission;
  const mileage = new Intl.NumberFormat(isAr ? "ar-KW" : "en-US", { numberingSystem: "latn" }).format(vehicle.mileage);

  return (
    <Link href={`/${locale}/vehicles/${vehicle.slug}`} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-xl">
      <motion.article
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-xl",
          "border border-white/[0.08] bg-[#111111]",
          "transition-colors duration-500 hover:border-[#D4AF37]/40"
        )}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.03]">
          {vehicle.image ? (
            <Image
              src={vehicle.image}
              alt={`${make} ${model}`}
              fill
              sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <CarFront aria-hidden="true" strokeWidth={1} className="h-12 w-12 text-white/15" />
            </div>
          )}

          {/* Reserved/sold overlay badge — availability itself isn't announced */}
          {vehicle.status !== "available" && (
            <span className="absolute start-3 top-3 rounded-md bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {vehicle.status === "sold" ? t("مباعة", "Sold") : t("محجوزة", "Reserved")}
            </span>
          )}

          {/* Favorite */}
          <button
            type="button"
            onClick={toggleFavorite}
            aria-label={
              isFavorite
                ? t("إزالة من المفضلة", "Remove from favorites")
                : t("إضافة إلى المفضلة", "Add to favorites")
            }
            aria-pressed={isFavorite}
            className={cn(
              "absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full",
              "bg-black/55 backdrop-blur-sm transition-colors duration-200 hover:bg-black/75",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            )}
          >
            <Heart
              strokeWidth={1.75}
              className={cn(
                "h-4 w-4 transition-colors duration-200",
                isFavorite ? "fill-[#D4AF37] text-gold-400" : "text-white"
              )}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <span
            className={cn(
              "w-fit rounded-md border border-[#D4AF37]/60 px-2 py-0.5",
              "text-2xs font-semibold uppercase tracking-[0.1em] text-gold-400"
            )}
          >
            {t("مميزة", "Featured")}
          </span>

          <h3 className="mt-3 font-display text-body-lg font-bold text-white line-clamp-1">
            {make} {model}
          </h3>

          <p className="mt-2 text-body-sm text-white/55">
            {vehicle.year}
            <span className="mx-1.5 text-white/30">·</span>
            {mileage} {t("كم", "KM")}
            <span className="mx-1.5 text-white/30">·</span>
            {transmission}
            <span className="mx-1.5 text-white/30">·</span>
            {fuelType}
          </p>

          <p className="mt-auto pt-4 font-display text-lg font-bold text-gold-400">
            {formatCurrency(vehicle.price)}{" "}
            <span className="text-sm font-semibold">{t("د.ك", "KWD")}</span>
          </p>
        </div>
      </motion.article>
    </Link>
  );
}
