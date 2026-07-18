"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { overlayVariants, drawerVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  direction?: "left" | "right" | "top" | "bottom";
}

function Drawer({
  open,
  onOpenChange,
  children,
  direction = "right",
}: DrawerProps) {
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

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            variants={drawerVariants[direction]}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "fixed z-50 bg-background shadow-elevated-lg",
              direction === "right" && "inset-y-0 end-0 h-full w-full max-w-md",
              direction === "left" && "inset-y-0 start-0 h-full w-full max-w-md",
              direction === "top" && "inset-x-0 top-0 h-auto max-h-[80vh]",
              direction === "bottom" && "inset-x-0 bottom-0 h-auto max-h-[80vh]"
            )}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

interface DrawerContentProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
  showClose?: boolean;
}

function DrawerContent({
  className,
  children,
  onClose,
  showClose = true,
  ...props
}: DrawerContentProps) {
  return (
    <div className={cn("flex h-full flex-col", className)} {...props}>
      {showClose && onClose && (
        <div className="flex items-center justify-end border-b border-border p-4">
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className="flex-1 overflow-auto p-6">{children}</div>
    </div>
  );
}

function DrawerHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-6 space-y-1.5", className)} {...props} />
  );
}

function DrawerTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("font-display text-display-xs font-bold text-foreground", className)}
      {...props}
    />
  );
}

function DrawerFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("border-t border-border p-6", className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
};
