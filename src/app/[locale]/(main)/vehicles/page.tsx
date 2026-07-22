"use client";

import * as React from "react";
import { Suspense } from "react";
import { VehicleInventory } from "@/components/vehicles/vehicle-inventory";
import type { Locale } from "@/types";

interface VehiclesPageProps {
  params: Promise<{ locale: Locale }>;
}

export default function VehiclesPage({ params }: VehiclesPageProps) {
  const { locale } = React.use(params);

  return (
    <Suspense fallback={<VehiclesFallback />}>
      <VehicleInventory locale={locale} />
    </Suspense>
  );
}

function VehiclesFallback() {
  return (
    <div className="min-h-screen pt-16 sm:pt-20 md:pt-24 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="py-8 md:py-12">
          {/* Search bar */}
          <div className="mb-6 h-11 w-full animate-pulse rounded-xl bg-secondary/60" />

          <div className="flex gap-6 md:gap-8">
            {/* Sidebar */}
            <div className="hidden w-72 shrink-0 space-y-3 lg:block">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-secondary/60" />
              ))}
            </div>

            {/* Grid */}
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-card">
                    <div className="aspect-[16/10] animate-pulse bg-secondary/60" />
                    <div className="space-y-3 p-3 sm:p-4">
                      <div className="h-5 w-3/4 animate-pulse rounded-md bg-secondary/60" />
                      <div className="h-4 w-1/3 animate-pulse rounded-md bg-secondary/60" />
                      <div className="border-t border-border pt-3">
                        <div className="h-6 w-1/3 animate-pulse rounded-md bg-secondary/60" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
