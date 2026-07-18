"use client";

import * as React from "react";
import { VehicleForm } from "@/components/admin/vehicles/vehicle-form";
import type { Locale } from "@/types";

interface NewVehiclePageProps {
  params: Promise<{ locale: Locale }>;
}

export default function NewVehiclePage({ params }: NewVehiclePageProps) {
  const { locale } = React.use(params);
  return <VehicleForm locale={locale} mode="create" />;
}
