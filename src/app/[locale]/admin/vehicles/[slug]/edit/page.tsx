"use client";

import * as React from "react";
import { VehicleForm } from "@/components/admin/vehicles/vehicle-form";
import type { Locale } from "@/types";

interface EditVehiclePageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export default function EditVehiclePage({ params }: EditVehiclePageProps) {
  const { locale, slug: id } = React.use(params);
  const [vehicle, setVehicle] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchVehicle() {
      try {
        const response = await fetch(`/api/admin/vehicles/${id}`);
        const data = await response.json();
        if (data.success) {
          setVehicle(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch vehicle:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchVehicle();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 rounded-full border-2 border-gold-400/10" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold-500 animate-spin" />
          </div>
          <p className="text-body-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <VehicleForm locale={locale} mode="edit" initialData={vehicle} />
  );
}
