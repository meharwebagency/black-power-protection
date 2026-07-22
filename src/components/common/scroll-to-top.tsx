"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollToTopProps {
  className?: string;
}

export function ScrollToTop({ className }: ScrollToTopProps) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.button
      initial={false}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.8, pointerEvents: visible ? "auto" : "none" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-4 start-4 z-40 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-elevated transition-all duration-300 hover:shadow-elevated-lg hover:scale-105 sm:bottom-5 sm:start-5 md:bottom-6 md:start-6",
        className
      )}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-4 w-4" />
    </motion.button>
  );
}
