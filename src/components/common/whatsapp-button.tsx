"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";

interface WhatsAppButtonProps {
  locale: Locale;
}

export function WhatsAppButton({ locale }: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const showTimer = setTimeout(() => setHasAnimated(true), 2000);
    const visibilityTimer = setTimeout(() => setIsVisible(true), 2500);
    return () => { clearTimeout(showTimer); clearTimeout(visibilityTimer); };
  }, []);

  // Show/hide on scroll direction
  React.useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll < 200) {
        setIsVisible(true);
      } else if (currentScroll > lastScroll && currentScroll > 400) {
        setIsOpen(false);
      }
      lastScroll = currentScroll;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const message = encodeURIComponent(
    locale === "ar"
      ? "مرحباً، أريد الاستفسار عن السيارات الفاخرة"
      : "Hello, I'd like to inquire about your luxury vehicles"
  );
  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp.replace(/[^0-9]/g, "")}?text=${message}`;

  return (
    <div className="fixed bottom-4 end-4 z-50 sm:bottom-5 sm:end-5 md:bottom-6 md:end-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-16 end-0 w-[calc(100vw-2.5rem)] max-w-72 overflow-hidden rounded-2xl border border-border bg-card shadow-elevated-lg"
          >
            {/* Header */}
            <div className="bg-[#25D366] p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white/20">
                  <img
                    src="https://res.cloudinary.com/dtsms0hhz/image/upload/cropped_circle_image_2_uwoybi.png"
                    alt="BPP"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-body-sm font-bold text-white">
                    {locale === "ar" ? "بلاك باور بروتيكشن" : "Black Power Protection"}
                  </p>
                  <p className="text-2xs text-white/80">
                    {locale === "ar" ? "عادةً يرد خلال دقائق" : "Usually replies within minutes"}
                  </p>
                </div>
              </div>
            </div>

            {/* Message bubble */}
            <div className="p-4">
              <div className="rounded-xl rounded-tl-none bg-secondary/50 p-3">
                <p className="text-body-xs text-muted-foreground">
                  {locale === "ar"
                    ? "مرحباً! كيف يمكننا مساعدتك اليوم؟"
                    : "Hello! How can we help you today?"}
                </p>
              </div>
            </div>

            {/* Input area */}
            <div className="border-t border-border p-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 items-center justify-center rounded-xl bg-[#25D366] text-body-sm font-semibold text-white transition-colors hover:bg-[#20BA5C]"
              >
                {locale === "ar" ? "بدء المحادثة" : "Start Chat"}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={hasAnimated ? false : { scale: 0 }}
        animate={{ scale: isVisible ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? (locale === "ar" ? "إغلاق المحادثة" : "Close chat") : "WhatsApp"}
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full shadow-elevated-lg transition-colors duration-300",
          isOpen
            ? "bg-foreground text-background"
            : "bg-[#25D366] text-white hover:bg-[#20BA5C]"
        )}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </motion.button>

      {/* Pulse animation */}
      {!isOpen && isVisible && (
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/20" />
      )}
    </div>
  );
}
