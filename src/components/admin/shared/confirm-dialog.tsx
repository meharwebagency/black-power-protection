"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { overlayVariants, dialogVariants } from "@/lib/motion";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Alias for confirmLabel (used by admin pages). */
  confirmText?: string;
  /** Alias for cancelLabel (used by admin pages). */
  cancelText?: string;
  variant?: "destructive" | "default";
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  confirmText,
  cancelText,
  variant = "default",
  onConfirm,
}: ConfirmDialogProps) {
  const confirmContent = confirmLabel ?? confirmText ?? "Confirm";
  const cancelContent = cancelLabel ?? cancelText ?? "Cancel";
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-50 w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-elevated-lg"
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                  variant === "destructive"
                    ? "bg-destructive/10"
                    : "bg-primary/10"
                )}
              >
                <AlertTriangle
                  className={cn(
                    "h-6 w-6",
                    variant === "destructive"
                      ? "text-destructive"
                      : "text-primary"
                  )}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-body-lg font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-body-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {cancelContent}
              </Button>
              <Button
                variant={variant === "destructive" ? "destructive" : "primary"}
                onClick={onConfirm}
              >
                {confirmContent}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
