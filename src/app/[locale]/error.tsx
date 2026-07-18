"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex min-h-[60vh] flex-col items-center justify-center text-center"
      >
        <div className="relative mb-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-destructive/5">
            <AlertTriangle className="h-12 w-12 text-destructive/60" />
          </div>
          <div className="absolute -inset-4 rounded-full bg-destructive/5 blur-xl" />
        </div>

        <h1 className="font-display text-display-xs md:text-display-sm font-bold text-foreground">
          حدث خطأ غير متوقع
        </h1>
        <p className="mt-3 max-w-md text-body-sm text-muted-foreground text-balance">
          عذراً، حدث خطأ أثناء تحميل الصفحة. يرجى المحاولة مرة أخرى.
        </p>

        <Button
          onClick={reset}
          size="lg"
          className="mt-8 gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          حاول مرة أخرى
        </Button>
      </motion.div>
    </Container>
  );
}
