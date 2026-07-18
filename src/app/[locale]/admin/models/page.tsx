"use client";

import * as React from "react";
import { Plus, Pencil, Trash2, Smartphone } from "lucide-react";
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

interface ModelsPageProps {
  params: Promise<{ locale: Locale }>;
}

interface Model {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  brandId: string;
  brandName?: string;
  sortOrder: number;
  isActive: boolean;
}

export default function ModelsPage({ params }: ModelsPageProps) {
  const { locale } = React.use(params);
  const isArabic = locale === "ar";
  const [models, setModels] = React.useState<Model[]>([]);
  const [brands, setBrands] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editModel, setEditModel] = React.useState<Model | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [brandFilter, setBrandFilter] = React.useState("all");
  const [form, setForm] = React.useState({ name: "", nameAr: "", slug: "", brandId: "", sortOrder: 0, isActive: true });

  const fetchModels = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const url = brandFilter !== "all" ? `/api/admin/models?brand_id=${brandFilter}` : "/api/admin/models";
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setModels(data.data);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, [brandFilter]);

  React.useEffect(() => {
    fetch("/api/admin/brands").then(r => r.json()).then(d => { if (d.success) setBrands(d.data); });
  }, []);

  React.useEffect(() => { fetchModels(); }, [fetchModels]);

  const openCreate = () => {
    setEditModel(null);
    setForm({ name: "", nameAr: "", slug: "", brandId: brands[0]?.id || "", sortOrder: 0, isActive: true });
    setDialogOpen(true);
  };

  const openEdit = (model: Model) => {
    setEditModel(model);
    setForm({ name: model.name, nameAr: model.nameAr, slug: model.slug, brandId: model.brandId, sortOrder: model.sortOrder, isActive: model.isActive });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const method = editModel ? "PUT" : "POST";
    const url = editModel ? `/api/admin/models/${editModel.id}` : "/api/admin/models";
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { setDialogOpen(false); fetchModels(); }
    } catch (e) { console.error(e); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/admin/models/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      fetchModels();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isArabic ? "الموديلات" : "Models"}
        description={isArabic ? "إدارة الموديلات" : "Manage vehicle models"}
        locale={locale}
        breadcrumbs={[
          { label: isArabic ? "لوحة التحكم" : "Dashboard", href: `/${locale}/admin` },
          { label: isArabic ? "الموديلات" : "Models" },
        ]}
        actions={<Button variant="primary" onClick={openCreate}><Plus className="h-4 w-4" />{isArabic ? "إضافة موديل" : "Add Model"}</Button>}
      />

      <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)} className="h-10 rounded-xl border border-border bg-background px-3 text-sm">
        <option value="all">{isArabic ? "جميع الماركات" : "All Brands"}</option>
        {brands.map((b: any) => <option key={b.id} value={b.id}>{isArabic ? b.nameAr || b.name : b.name}</option>)}
      </select>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <div key={i} className="h-32 animate-pulse rounded-2xl bg-secondary" />)}
        </div>
      ) : models.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-12">
          <Smartphone className="mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-body-sm text-muted-foreground">{isArabic ? "لا توجد موديلات" : "No models yet"}</p>
        </CardContent></Card>
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {models.map(model => (
            <motion.div key={model.id} variants={fadeUp}>
              <Card className="transition-shadow hover:shadow-elevated">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary"><Smartphone className="h-6 w-6 text-muted-foreground" /></div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{isArabic ? model.nameAr || model.name : model.name}</p>
                    <p className="text-body-xs text-muted-foreground">{model.brandName}</p>
                  </div>
                  <Badge variant={model.isActive ? "default" : "secondary"}>
                    {model.isActive ? (isArabic ? "نشط" : "Active") : (isArabic ? "غير نشط" : "Inactive")}
                  </Badge>
                  <Button variant="ghost" size="icon-sm" onClick={() => openEdit(model)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon-sm" className="text-destructive" onClick={() => setDeleteId(model.id)}><Trash2 className="h-4 w-4" /></Button>
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
              {editModel ? (isArabic ? "تعديل الموديل" : "Edit Model") : (isArabic ? "إضافة موديل" : "Add Model")}
            </h3>
            <div className="space-y-4">
              <div><Label>{isArabic ? "الماركة" : "Brand"}</Label>
                <select value={form.brandId} onChange={e => setForm({ ...form, brandId: e.target.value })} className="flex h-10 w-full rounded-xl border border-border bg-background px-3 text-sm">
                  {brands.map((b: any) => <option key={b.id} value={b.id}>{isArabic ? b.nameAr || b.name : b.name}</option>)}
                </select>
              </div>
              <div><Label>{isArabic ? "الاسم بالإنجليزية" : "Name (EN)"}</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>{isArabic ? "الاسم بالعربية" : "Name (AR)"}</Label><Input value={form.nameAr} onChange={e => setForm({ ...form, nameAr: e.target.value })} /></div>
              <div><Label>Slug</Label><Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} /></div>
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
        title={isArabic ? "حذف الموديل" : "Delete Model"}
        description={isArabic ? "هل أنت متأكد؟" : "Are you sure?"}
        confirmText={isArabic ? "حذف" : "Delete"} variant="destructive" />
    </div>
  );
}
