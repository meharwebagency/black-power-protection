"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, Car } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/admin/shared/page-header";
import { StatusBadge } from "@/components/admin/shared/status-badge";
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { motion } from "framer-motion";
import type { Locale } from "@/types";

interface VehiclesPageProps {
  params: Promise<{ locale: Locale }>;
}

interface Vehicle {
  id: string;
  title: string;
  titleAr: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  status: string;
  images: string[];
}

export default function VehiclesPage({ params }: VehiclesPageProps) {
  const { locale } = React.use(params);
  const isArabic = locale === "ar";
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const fetchVehicles = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "10");
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/vehicles?${params}`);
      const data = await res.json();
      if (data.success) {
        const mapped: Vehicle[] = (data.data || []).map((v: any) => ({
          id: v.id,
          title: `${v.make ?? ""} ${v.model ?? ""}`.trim(),
          titleAr: `${v.make_ar ?? ""} ${v.model_ar ?? ""}`.trim(),
          brand: v.make ?? "",
          model: v.model ?? "",
          year: v.year,
          price: v.price,
          status: v.status,
          images: Array.isArray(v.vehicle_images)
            ? v.vehicle_images
                .slice()
                .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                .map((img: any) => img.url)
            : [],
        }));
        setVehicles(mapped);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter]);

  React.useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/admin/vehicles/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      fetchVehicles();
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isArabic ? "السيارات" : "Vehicles"}
        description={isArabic ? "إدارة مجموعتك من السيارات" : "Manage your vehicle inventory"}
        locale={locale}
        breadcrumbs={[
          { label: isArabic ? "لوحة التحكم" : "Dashboard", href: `/${locale}/admin` },
          { label: isArabic ? "السيارات" : "Vehicles" },
        ]}
        actions={
          <Link href={`/${locale}/admin/vehicles/new`}>
            <Button variant="primary">
              <Plus className="h-4 w-4" />
              {isArabic ? "إضافة سيارة" : "Add Vehicle"}
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={isArabic ? "بحث بالاسم..." : "Search by name..."}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="ps-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="h-10 rounded-xl border border-border bg-background px-3 text-sm"
        >
          <option value="all">{isArabic ? "جميع الحالات" : "All Status"}</option>
          <option value="available">{isArabic ? "متاح" : "Available"}</option>
          <option value="sold">{isArabic ? "مباع" : "Sold"}</option>
          <option value="reserved">{isArabic ? "محجوز" : "Reserved"}</option>
          <option value="pending">{isArabic ? "قيد الانتظار" : "Pending"}</option>
        </select>
      </div>

      {/* Vehicle list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-secondary" />
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <Car className="mb-3 h-12 w-12 text-muted-foreground/40" />
            <p className="text-body-sm text-muted-foreground">
              {isArabic ? "لا توجد سيارات" : "No vehicles found"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
          {vehicles.map((vehicle) => (
            <motion.div key={vehicle.id} variants={fadeUp}>
              <Card className="transition-shadow hover:shadow-elevated">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-secondary">
                    {vehicle.images?.[0] ? (
                      <img src={vehicle.images[0]} alt="" className="h-full w-full rounded-xl object-cover" />
                    ) : (
                      <Car className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate font-medium text-foreground">
                      {isArabic ? vehicle.titleAr || vehicle.title : vehicle.title}
                    </p>
                    <p className="text-body-xs text-muted-foreground">
                      {vehicle.brand} {vehicle.model} · {vehicle.year}
                    </p>
                  </div>
                  <p className="hidden text-sm font-semibold text-foreground sm:block">
                    {vehicle.price?.toLocaleString()} KWD
                  </p>
                  <StatusBadge status={vehicle.status} type="vehicle" locale={locale} />
                  <div className="flex items-center gap-1">
                    <Link href={`/${locale}/admin/vehicles/${vehicle.id}/edit`}>
                      <Button variant="ghost" size="icon-sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(vehicle.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === page ? "primary" : "outline"}
              size="sm"
              onClick={() => setPage(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={isArabic ? "حذف السيارة" : "Delete Vehicle"}
        description={isArabic ? "هل أنت متأكد من حذف هذه السيارة؟" : "Are you sure you want to delete this vehicle?"}
        confirmText={isArabic ? "حذف" : "Delete"}
        variant="destructive"
      />
    </div>
  );
}
