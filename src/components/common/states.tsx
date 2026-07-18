"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SearchX, AlertTriangle, CheckCircle2, FileQuestion, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/motion";

/* ── Empty State ── */
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className
      )}
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-secondary">
        {icon || <Inbox className="h-10 w-10 text-muted-foreground" />}
      </div>
      <h3 className="mb-2 font-display text-display-xs font-bold text-foreground">
        {title}
      </h3>
      {description && (
        <p className="mb-6 max-w-sm text-body-sm text-muted-foreground">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="primary" size="lg">
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}

/* ── Error State ── */
interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

function ErrorState({
  title = "حدث خطأ",
  message,
  onRetry,
  retryLabel = "حاول مرة أخرى",
  className,
}: ErrorStateProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className
      )}
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-destructive/10">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h3 className="mb-2 font-display text-display-xs font-bold text-foreground">
        {title}
      </h3>
      <p className="mb-6 max-w-sm text-body-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="lg">
          {retryLabel}
        </Button>
      )}
    </motion.div>
  );
}

/* ── Not Found 404 ── */
interface NotFoundProps {
  title?: string;
  description?: string;
  backLabel?: string;
  onBack?: () => void;
  className?: string;
}

function NotFound404({
  title = "404",
  description = "الصفحة غير موجودة",
  backLabel = "العودة إلى الرئيسية",
  onBack,
  className,
}: NotFoundProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex min-h-[50vh] flex-col items-center justify-center py-16 text-center",
        className
      )}
    >
      <span className="mb-2 font-display text-display-2xl font-bold text-gold-gradient">
        {title}
      </span>
      <p className="mb-8 text-body-lg text-muted-foreground">{description}</p>
      <Button
        onClick={onBack || (() => (window.location.href = "/"))}
        size="lg"
      >
        {backLabel}
      </Button>
    </motion.div>
  );
}

/* ── Success State ── */
interface SuccessStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

function SuccessState({ title, description, action, className }: SuccessStateProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className
      )}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-success/10"
      >
        <CheckCircle2 className="h-10 w-10 text-success" />
      </motion.div>
      <h3 className="mb-2 font-display text-display-xs font-bold text-foreground">
        {title}
      </h3>
      {description && (
        <p className="mb-6 max-w-sm text-body-sm text-muted-foreground">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} size="lg">
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}

/* ── No Results ── */
function NoResults({
  title = "لا توجد نتائج",
  description = "لم نتمكن من العثور على نتائج مطابقة لبحثك",
  className,
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<SearchX className="h-10 w-10 text-muted-foreground" />}
      title={title}
      description={description}
      className={className}
    />
  );
}

export {
  EmptyState,
  ErrorState,
  NotFound404,
  SuccessState,
  NoResults,
};
