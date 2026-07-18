import * as React from "react";
import { cn } from "@/lib/utils";

/* ── Base Skeleton ── */
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
}

function Skeleton({ className, variant = "rectangular", ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "shimmer",
        variant === "text" && "h-4 w-full rounded-md",
        variant === "circular" && "rounded-full",
        variant === "rectangular" && "rounded-xl",
        className
      )}
      {...props}
    />
  );
}

/* ── Card Skeleton ── */
function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-card", className)}>
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <div className="grid grid-cols-4 gap-2 pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
        <div className="border-t border-border pt-4">
          <Skeleton className="h-6 w-1/3" />
        </div>
      </div>
    </div>
  );
}

/* ── Vehicle Grid Skeleton ── */
function VehicleGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ── Hero Skeleton ── */
function HeroSkeleton() {
  return (
    <div className="relative flex h-[80vh] w-full items-center justify-center">
      <Skeleton className="absolute inset-0" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <Skeleton className="mx-auto mb-4 h-4 w-32" />
        <Skeleton className="mx-auto mb-3 h-14 w-80 max-w-full" />
        <Skeleton className="mx-auto mb-3 h-12 w-64 max-w-full" />
        <Skeleton className="mx-auto mb-8 h-6 w-96 max-w-full" />
        <div className="flex items-center justify-center gap-4">
          <Skeleton className="h-12 w-40 rounded-xl" />
          <Skeleton className="h-12 w-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/* ── Header Skeleton ── */
function HeaderSkeleton() {
  return (
    <div className="fixed inset-x-0 top-0 z-50 h-20 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-8 w-36" />
        <div className="hidden items-center gap-4 md:flex">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-16" />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/* ── Text Block Skeleton ── */
function TextBlockSkeleton({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4 rounded-md"
          style={{ width: `${85 + Math.random() * 15}%` }}
        />
      ))}
    </div>
  );
}

/* ── Profile Skeleton ── */
function ProfileSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export {
  Skeleton,
  CardSkeleton,
  VehicleGridSkeleton,
  HeroSkeleton,
  HeaderSkeleton,
  TextBlockSkeleton,
  ProfileSkeleton,
};
