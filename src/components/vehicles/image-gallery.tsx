"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { cn } from "@/lib/utils";
import type { VehicleImage } from "@/types/vehicle";
import type { Locale } from "@/types";

interface ImageGalleryProps {
  images: VehicleImage[];
  make: string;
  model: string;
  year: number;
  locale: Locale;
}

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const;

export function ImageGallery({ images, make, model, year, locale }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);
  const thumbnailsRef = React.useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const allImages =
    images.length > 0
      ? images
      : [{ id: "placeholder", url: "", alt: `${make} ${model} ${year}`, isPrimary: true, sortOrder: 0 }];
  const mainImage = allImages[activeIndex];

  const goTo = (index: number) => {
    const next = ((index % allImages.length) + allImages.length) % allImages.length;
    setActiveIndex(next);
    if (thumbnailsRef.current) {
      const thumb = thumbnailsRef.current.children[next] as HTMLElement;
      thumb?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const lightboxGoTo = (index: number) => {
    setLightboxIndex(((index % allImages.length) + allImages.length) % allImages.length);
  };

  React.useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") lightboxGoTo(lightboxIndex - 1);
      if (e.key === "ArrowRight") lightboxGoTo(lightboxIndex + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, lightboxIndex]);

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Main image */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE_LUXURY }}
          className="group relative aspect-[16/10] w-full cursor-zoom-in overflow-hidden rounded-xl border border-border/60 bg-secondary/30"
          onClick={() => openLightbox(activeIndex)}
        >
          <ImagePlaceholder
            key={mainImage.id}
            src={mainImage.url}
            fill
            alt={mainImage.alt}
            rounded="none"
            sizes="(max-width: 1024px) 100vw, 60vw"
            className={cn(
              "transition-transform duration-[900ms] ease-out",
              !reduceMotion && "group-hover:scale-[1.03]"
            )}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Fullscreen affordance */}
          <div className="absolute bottom-4 end-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/40 px-3 py-1.5 text-2xs font-medium text-white backdrop-blur-md">
              <Maximize2 className="h-3.5 w-3.5" />
              {locale === "ar" ? "عرض كامل" : "View full"}
            </span>
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 start-4 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-2xs font-medium tabular-nums text-white backdrop-blur-md">
            {activeIndex + 1} <span className="opacity-50">/</span> {allImages.length}
          </div>

          {/* Nav arrows */}
          {allImages.length > 1 && (
            <>
              <button
                type="button"
                aria-label={locale === "ar" ? "السابق" : "Previous image"}
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(activeIndex - 1);
                }}
                className="absolute start-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:bg-black/55 group-hover:opacity-100"
              >
                <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
              </button>
              <button
                type="button"
                aria-label={locale === "ar" ? "التالي" : "Next image"}
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(activeIndex + 1);
                }}
                className="absolute end-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:bg-black/55 group-hover:opacity-100"
              >
                <ChevronRight className="h-5 w-5 rtl:rotate-180" />
              </button>
            </>
          )}
        </motion.div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div ref={thumbnailsRef} className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hidden">
            {allImages.map((img, index) => (
              <button
                key={img.id}
                type="button"
                aria-label={`${locale === "ar" ? "صورة" : "Image"} ${index + 1}`}
                aria-current={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg transition-all duration-300 sm:h-16 sm:w-24 md:h-[72px] md:w-28",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  index === activeIndex
                    ? "opacity-100 ring-1 ring-accent"
                    : "opacity-50 hover:opacity-90"
                )}
              >
                <ImagePlaceholder
                  src={img.url}
                  fill
                  alt={img.alt}
                  rounded="none"
                  showIcon={false}
                  sizes="112px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_LUXURY }}
            className="fixed inset-0 z-[200] flex flex-col bg-black/95 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={locale === "ar" ? "معرض الصور" : "Image viewer"}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-body-sm font-medium tabular-nums text-white/70">
                {lightboxIndex + 1} <span className="opacity-40">/</span> {allImages.length}
              </span>
              <button
                type="button"
                aria-label={locale === "ar" ? "إغلاق" : "Close"}
                onClick={() => setLightboxOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/15"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Image */}
            <div className="relative flex flex-1 items-center justify-center px-4">
              {allImages.length > 1 && (
                <button
                  type="button"
                  aria-label={locale === "ar" ? "السابق" : "Previous image"}
                  onClick={() => lightboxGoTo(lightboxIndex - 1)}
                  className="absolute start-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md transition-colors hover:bg-white/15"
                >
                  <ChevronLeft className="h-6 w-6 rtl:rotate-180" />
                </button>
              )}
              <AnimatePresence mode="wait">
                <motion.div
                  key={lightboxIndex}
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE_LUXURY }}
                  className="relative h-full max-h-[82vh] w-full max-w-6xl"
                >
                  <ImagePlaceholder
                    src={allImages[lightboxIndex].url}
                    fill
                    alt={allImages[lightboxIndex].alt}
                    rounded="none"
                    sizes="100vw"
                    className="[&_img]:object-contain"
                  />
                </motion.div>
              </AnimatePresence>
              {allImages.length > 1 && (
                <button
                  type="button"
                  aria-label={locale === "ar" ? "التالي" : "Next image"}
                  onClick={() => lightboxGoTo(lightboxIndex + 1)}
                  className="absolute end-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md transition-colors hover:bg-white/15"
                >
                  <ChevronRight className="h-6 w-6 rtl:rotate-180" />
                </button>
              )}
            </div>

            {/* Bottom thumbnails */}
            {allImages.length > 1 && (
              <div className="flex justify-center gap-2 overflow-x-auto px-4 py-5 scrollbar-hidden">
                {allImages.map((img, index) => (
                  <button
                    key={img.id}
                    type="button"
                    aria-label={`${locale === "ar" ? "صورة" : "Image"} ${index + 1}`}
                    onClick={() => setLightboxIndex(index)}
                    className={cn(
                      "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg transition-all duration-300",
                      index === lightboxIndex
                        ? "opacity-100 ring-1 ring-white"
                        : "opacity-40 hover:opacity-70"
                    )}
                  >
                    <ImagePlaceholder src={img.url} fill alt={img.alt} rounded="none" showIcon={false} sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
