"use client";

import * as React from "react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/admin/shared/page-header";
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { motion } from "framer-motion";
import type { Locale } from "@/types";

interface BrandsPageProps {
  params: Promise<{ locale: Locale }>;
}

interface Brand {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  logoUrl: string;
  sortOrder: number;
  isActive: boolean;
  modelCount?: number;
}

export default function BrandsPage({ params }: BrandsPageProps) {
  const { locale } = React.use(params);
  const isArabic = locale === "ar";
  const [brands, setBrands] = React.useState<Brand[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editBrand, setEditBrand] = React.useState<Brand | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({ name: "", nameAr: "", slug: "", logoUrl: "", sortOrder: 0, isActive: true });

  const fetchBrands = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/brands");
      const data = await res.json();
      if (data.success) setBrands(data.data);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, []);

  React.useEffect(() => { fetchBrands(); }, [fetchBrands]);

  const openCreate = () => {
    setEditBrand(null);
    setForm({ name: "", nameAr: "", slug: "", logoUrl: "", sortOrder: 0, isActive: true });
    setDialogOpen(true);
  };

  const openEdit = (brand: Brand) => {
    setEditBrand(brand);
    setForm({ name: brand.name, nameAr: brand.nameAr, slug: brand.slug, logoUrl: brand.logoUrl, sortOrder: brand.sortOrder, isActive: brand.isActive });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const method = editBrand ? "PUT" : "POST";
    const url = editBrand ? `/api/admin/brands/${editBrand.id}` : "/api/admin/brands";
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { setDialogOpen(false); fetchBrands(); }
    } catch (e) { console.error(e); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/admin/brands/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      fetchBrands();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isArabic ? "العلامات التجارية" : "Brands"}
        description={isArabic ? "إدارة العلامات التجارية" : "Manage vehicle brands"}
        locale={locale}
        breadcrumbs={[
          { label: isArabic ? "لوحة التحكم" : "Dashboard", href: `/${locale}/admin` },
          { label: isArabic ? "العلامات التجارية" : "Brands" },
        ]}
        actions={
          <Button variant="primary" onClick={openCreate}>
            <Plus className="h-4 w-4" />{isArabic ? "إضافة ماركة" : "Add Brand"}
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <div key={i} className="h-40 animate-pulse rounded-2xl bg-secondary" />)}
        </div>
      ) : brands.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-12">
          <Tag className="mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-body-sm text-muted-foreground">{isArabic ? "لا توجد علامات تجارية" : "No brands yet"}</p>
        </CardContent></Card>
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map(brand => (
            <motion.div key={brand.id} variants={fadeUp}>
              <Card className="transition-shadow hover:shadow-elevated">
                <CardContent className="flex items-center gap-4 p-5">
                  {brand.logoUrl ? (
                    <img src={brand.logoUrl} alt={brand.name} className="h-12 w-12 rounded-xl object-contain" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary"><Tag className="h-6 w-6 text-muted-foreground" /></div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{isArabic ? brand.nameAr || brand.name : brand.name}</p>
                    <p className="text-body-xs text-muted-foreground">{brand.modelCount || 0} {isArabic ? "موديل" : "models"}</p>
                  </div>
                  <Badge variant={brand.isActive ? "default" : "secondary"}>
                    {brand.isActive ? (isArabic ? "نشط" : "Active") : (isArabic ? "غير نشط" : "Inactive")}
                  </Badge>
                  <Button variant="ghost" size="icon-sm" onClick={() => openEdit(brand)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon-sm" className="text-destructive" onClick={() => setDeleteId(brand.id)}><Trash2 className="h-4 w-4" /></Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDialogOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-elevated" onClick={e => e.stopPropagation()}>
            <h3 className="mb-4 text-body-lg font-semibold text-foreground">
              {editBrand ? (isArabic ? "تعديل الماركة" : "Edit Brand") : (isArabic ? "إضافة ماركة" : "Add Brand")}
            </h3>
            <div className="space-y-4">
              <div><Label>{isArabic ? "الاسم بالإنجليزية" : "Name (EN)"}</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>{isArabic ? "الاسم بالعربية" : "Name (AR)"}</Label><Input value={form.nameAr} onChange={e => setForm({ ...form, nameAr: e.target.value })} /></div>
              <div><Label>Slug</Label><Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} /></div>
              <div><Label>{isArabic ? "رابط الشعار" : "Logo URL"}</Label><Input value={form.logoUrl} onChange={e => setForm({ ...form, logoUrl: e.target.value })} /></div>
              <div><Label>{isArabic ? "ترتيب العرض" : "Sort Order"}</Label><Input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) })} /></div>
              <div className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4 rounded" /><Label>{isArabic ? "نشط" : "Active"}</Label></div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>{isArabic ? "إلغاء" : "Cancel"}</Button>
              <Button variant="primary" onClick={handleSave}>{isArabic ? "حفظ" : "Save"}</Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} onConfirm={handleDelete}
        title={isArabic ? "حذف الماركة" : "Delete Brand"}
        description={isArabic ? "هل أنت متأكد؟" : "Are you sure?"}
        confirmText={isArabic ? "حذف" : "Delete"} variant="destructive" />
    </div>
  );
}
