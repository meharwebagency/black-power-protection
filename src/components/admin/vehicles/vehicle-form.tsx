"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save, X, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/admin/shared/page-header";
import { ImageUpload } from "@/components/admin/vehicles/image-upload";
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { fadeUp, staggerContainer } from "@/lib/motion";
import type { Locale } from "@/types";

interface VehicleFormProps {
  locale: Locale;
  initialData?: any;
  mode: "create" | "edit";
}

interface BrandOption {
  id: string;
  name: string;
  name_ar: string;
}

interface ModelOption {
  id: string;
  name: string;
  name_ar: string;
  brand_id: string;
}

// Sentinel value for the "Other / Custom" <option>. Not a real UUID, so the
// save flow knows to resolve the typed name into a real brand/model row first.
const CUSTOM_VALUE = "__custom__";

const TRANSLATIONS = {
  ar: {
    basicInfo: "المعلومات الأساسية",
    specifications: "المواصفات",
    description: "الوصف",
    images: "الصور",
    seo: "تحسين محركات البحث",
    settings: "الإعدادات",
    brand: "العلامة التجارية",
    model: "الموديل",
    year: "السنة",
    price: "السعر (KWD)",
    mileage: "المسافة المقطوعة (كم)",
    fuelType: "نوع الوقود",
    transmission: "ناقل الحركة",
    bodyType: "نوع الهيكل",
    color: "اللون",
    colorAr: "اللون (عربي)",
    engineSize: "حجم المحرك",
    horsepower: "القوة الحصانية",
    vin: "رقم الهيكل (VIN)",
    descriptionEn: "الوصف (EN)",
    descriptionAr: "الوصف (AR)",
    features: "المميزات",
    addFeature: "إضافة مميزة",
    seoTitle: "عنوان SEO",
    seoDescription: "وصف SEO",
    status: "الحالة",
    featured: "مميزة",
    save: "حفظ",
    cancel: "إلغاء",
    saving: "جاري الحفظ...",
    select: "اختر",
    other: "أخرى / مخصص",
    customBrandPlaceholder: "اكتب اسم الشركة المصنعة",
    customModelPlaceholder: "اكتب اسم الموديل",
    noBrands: "لا توجد علامات تجارية. أضف علامة تجارية أولاً.",
    noModels: "لا توجد موديلات لهذه العلامة. أضف موديلاً أولاً.",
    savedSuccess: "تم حفظ السيارة بنجاح",
    savedError: "فشل حفظ السيارة",
    requiredError: "يرجى ملء جميع الحقول المطلوبة",
    existingImages: "الصور الحالية",
    newImages: "إضافة صور جديدة",
    deleteImage: "حذف الصورة",
    deleteImageConfirm: "هل أنت متأكد أنك تريد حذف هذه الصورة؟",
    deleteImageDesc: "سيتم حذف هذه الصورة نهائياً من التخزين وقاعدة البيانات.",
    imageDeleted: "تم حذف الصورة",
    imageDeleteError: "فشل حذف الصورة",
    lastImageWarning: "لا يمكن حذف الصورة الأخيرة. قم برفع صورة أخرى أولاً.",
    delete: "حذف",
    primary: "رئيسية",
  },
  en: {
    basicInfo: "Basic Information",
    specifications: "Specifications",
    description: "Description",
    images: "Images",
    seo: "SEO",
    settings: "Settings",
    brand: "Brand",
    model: "Model",
    year: "Year",
    price: "Price (KWD)",
    mileage: "Mileage (km)",
    fuelType: "Fuel Type",
    transmission: "Transmission",
    bodyType: "Body Type",
    color: "Color",
    colorAr: "Color (Arabic)",
    engineSize: "Engine Size",
    horsepower: "Horsepower",
    vin: "VIN",
    descriptionEn: "Description (EN)",
    descriptionAr: "Description (AR)",
    features: "Features",
    addFeature: "Add Feature",
    seoTitle: "SEO Title",
    seoDescription: "SEO Description",
    status: "Status",
    featured: "Featured",
    save: "Save",
    cancel: "Cancel",
    saving: "Saving...",
    select: "Select",
    other: "Other / Custom",
    customBrandPlaceholder: "Type the manufacturer name",
    customModelPlaceholder: "Type the model name",
    noBrands: "No brands found. Please add a brand first.",
    noModels: "No models for this brand. Please add a model first.",
    savedSuccess: "Vehicle saved successfully",
    savedError: "Failed to save vehicle",
    requiredError: "Please fill in all required fields",
    existingImages: "Current Images",
    newImages: "Add New Images",
    deleteImage: "Delete image",
    deleteImageConfirm: "Are you sure you want to delete this image?",
    deleteImageDesc: "This image will be permanently removed from storage and the database.",
    imageDeleted: "Image deleted",
    imageDeleteError: "Failed to delete image",
    lastImageWarning: "Cannot delete the last image. Upload another image first.",
    delete: "Delete",
    primary: "Primary",
  },
};

export function VehicleForm({ locale, initialData, mode }: VehicleFormProps) {
  const isArabic = locale === "ar";
  const t = isArabic ? TRANSLATIONS.ar : TRANSLATIONS.en;
  const router = useRouter();
  const { toast } = useToast();

  const [isSaving, setIsSaving] = React.useState(false);

  // Reference data
  const [brands, setBrands] = React.useState<BrandOption[]>([]);
  const [models, setModels] = React.useState<ModelOption[]>([]);
  const [brandsLoaded, setBrandsLoaded] = React.useState(false);

  // Form fields
  const [brandId, setBrandId] = React.useState<string>(initialData?.brand_id || "");
  const [modelId, setModelId] = React.useState<string>(initialData?.model_id || "");
  // "Other / Custom" free-text entry. When the brand/model select is set to the
  // CUSTOM sentinel, these hold the typed name; on save they are resolved to a
  // real brand/model row (find-or-create) so the vehicle gets valid UUID FKs.
  const [customBrand, setCustomBrand] = React.useState<string>("");
  const [customModel, setCustomModel] = React.useState<string>("");
  const [year, setYear] = React.useState<string>(initialData?.year?.toString() || "");
  const [price, setPrice] = React.useState<string>(initialData?.price?.toString() || "");
  const [mileage, setMileage] = React.useState<string>(
    initialData?.mileage?.toString() || ""
  );
  const [fuelType, setFuelType] = React.useState<string>(initialData?.fuel_type || "");
  const [transmission, setTransmission] = React.useState<string>(
    initialData?.transmission || ""
  );
  const [bodyType, setBodyType] = React.useState<string>(initialData?.body_type || "");
  const [color, setColor] = React.useState<string>(initialData?.color || "");
  const [colorAr, setColorAr] = React.useState<string>(initialData?.color_ar || "");
  const [engineSize, setEngineSize] = React.useState<string>(
    initialData?.engine_size || ""
  );
  const [vin, setVin] = React.useState<string>(initialData?.vin || "");
  const [descriptionEn, setDescriptionEn] = React.useState<string>(
    initialData?.description || ""
  );
  const [descriptionAr, setDescriptionAr] = React.useState<string>(
    initialData?.description_ar || ""
  );
  const [status, setStatus] = React.useState<string>(initialData?.status || "draft");
  const [isFeatured, setIsFeatured] = React.useState<boolean>(
    initialData?.is_featured || false
  );
  const [seoTitle, setSeoTitle] = React.useState<string>(initialData?.seo_title || "");
  const [seoDescription, setSeoDescription] = React.useState<string>(
    initialData?.seo_description || ""
  );

  const [featureInput, setFeatureInput] = React.useState("");
  const [features, setFeatures] = React.useState<string[]>(
    initialData?.features || []
  );

  const [images, setImages] = React.useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);

  // Existing images already saved for this vehicle (edit mode). Loaded from
  // initialData so they can be shown as thumbnails and individually deleted.
  interface ExistingImage {
    id: string;
    url: string;
    is_primary: boolean;
  }
  const [existingImages, setExistingImages] = React.useState<ExistingImage[]>(
    () =>
      (initialData?.vehicle_images || [])
        .slice()
        .sort(
          (a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
        )
        .map((img: any) => ({
          id: img.id,
          url: img.url,
          is_primary: img.is_primary,
        }))
  );
  // Which existing image is pending confirmation, and which is mid-delete.
  const [imageToDelete, setImageToDelete] = React.useState<ExistingImage | null>(
    null
  );
  const [deletingImageId, setDeletingImageId] = React.useState<string | null>(
    null
  );

  // Fetch brands on mount
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/brands");
        const data = await res.json();
        if (!cancelled && data.success) {
          setBrands(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch brands:", err);
      } finally {
        if (!cancelled) setBrandsLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch models when brand changes
  React.useEffect(() => {
    // No brand chosen, or a custom manufacturer typed → no DB models to load.
    if (!brandId || brandId === CUSTOM_VALUE) {
      setModels([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/models?brand_id=${brandId}`);
        const data = await res.json();
        if (!cancelled && data.success) {
          setModels(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch models:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [brandId]);

  const addFeature = () => {
    if (featureInput.trim()) {
      setFeatures((prev) => [...prev, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  // Delete an already-saved image (Storage + DB) and drop its thumbnail from
  // the UI immediately. The last-image guard is enforced client-side (below,
  // in the render) and again by the API for safety.
  const confirmDeleteImage = async () => {
    const target = imageToDelete;
    if (!target) return;

    setImageToDelete(null);
    setDeletingImageId(target.id);

    try {
      const res = await fetch(
        `/api/admin/vehicles/${initialData.id}/images?imageId=${target.id}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        toast({
          type: "error",
          title: t.imageDeleteError,
          description: data?.error || undefined,
        });
        return;
      }

      // Remove from state so the thumbnail disappears without a page refresh.
      setExistingImages((prev) => prev.filter((img) => img.id !== target.id));
      toast({ type: "success", title: t.imageDeleted });
    } catch (err) {
      console.error("Failed to delete image:", err);
      toast({
        type: "error",
        title: t.imageDeleteError,
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setDeletingImageId(null);
    }
  };

  // Deleting the last remaining image is only safe if the user has queued a
  // new upload that will replace it after save.
  const canDeleteExisting =
    existingImages.length > 1 || images.length > 0;

  const handleSave = async () => {
    const isCustomBrand = brandId === CUSTOM_VALUE;
    const isCustomModel = modelId === CUSTOM_VALUE;

    // Client-side required validation (matches DB schema). For custom entries
    // the free-text field must be filled instead of a selected id.
    const brandOk = isCustomBrand ? !!customBrand.trim() : !!brandId;
    const modelOk = isCustomModel ? !!customModel.trim() : !!modelId;

    if (
      !brandOk ||
      !modelOk ||
      !year ||
      !price ||
      mileage === "" ||
      !fuelType ||
      !transmission ||
      !bodyType ||
      !color.trim() ||
      !colorAr.trim()
    ) {
      toast({ type: "error", title: t.requiredError });
      return;
    }

    setIsSaving(true);

    try {
      // Resolve "Other / Custom" free-text into real brand/model rows so the
      // vehicle insert gets valid UUID foreign keys. Existing rows are reused.
      let resolvedBrandId = brandId;
      let resolvedModelId = modelId;

      if (isCustomBrand) {
        const res = await fetch("/api/admin/brands/resolve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: customBrand.trim() }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          toast({
            type: "error",
            title: t.savedError,
            description: data?.error || "Failed to add manufacturer",
          });
          setIsSaving(false);
          return;
        }
        resolvedBrandId = data.data.id;
      }

      if (isCustomModel) {
        const res = await fetch("/api/admin/models/resolve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            brand_id: resolvedBrandId,
            name: customModel.trim(),
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          toast({
            type: "error",
            title: t.savedError,
            description: data?.error || "Failed to add model",
          });
          setIsSaving(false);
          return;
        }
        resolvedModelId = data.data.id;
      }

      const payload = {
        brand_id: resolvedBrandId,
        model_id: resolvedModelId,
        year: Number(year),
        price: Number(price),
        currency: "KWD",
        mileage: Number(mileage),
        fuel_type: fuelType,
        transmission,
        body_type: bodyType,
        engine_size: engineSize.trim() || null,
        color: color.trim(),
        color_ar: colorAr.trim(),
        description: descriptionEn,
        description_ar: descriptionAr,
        features,
        features_ar: [],
        vin: vin.trim() || null,
        status,
        is_featured: isFeatured,
        seo_title: seoTitle.trim() || null,
        seo_description: seoDescription.trim() || null,
      };

      // In edit mode, UPDATE the existing record (PUT /vehicles/:id). In create
      // mode, INSERT a new record (POST /vehicles). Using the wrong verb here is
      // what previously made "Edit" create a duplicate instead of updating.
      const isEdit = mode === "edit" && initialData?.id;
      const res = await fetch(
        isEdit ? `/api/admin/vehicles/${initialData.id}` : "/api/admin/vehicles",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        const detail =
          data?.details?.[0]?.message || data?.error || t.savedError;
        toast({ type: "error", title: t.savedError, description: detail });
        setIsSaving(false);
        return;
      }

      const vehicleId = data.data.id;

      // Upload images (if any) now that the vehicle exists
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((file) => formData.append("images", file));

        const imgRes = await fetch(
          `/api/admin/vehicles/${vehicleId}/images`,
          { method: "POST", body: formData }
        );
        const imgData = await imgRes.json();

        if (!imgRes.ok || !imgData.success) {
          toast({
            type: "warning",
            title: t.savedSuccess,
            description: imgData?.error || "Some images failed to upload",
          });
          router.push(`/${locale}/admin/vehicles`);
          return;
        }
      }

      toast({ type: "success", title: t.savedSuccess });
      router.push(`/${locale}/admin/vehicles`);
    } catch (err) {
      console.error("Save failed:", err);
      toast({
        type: "error",
        title: t.savedError,
        description: err instanceof Error ? err.message : undefined,
      });
      setIsSaving(false);
    }
  };

  const noBrands = brandsLoaded && brands.length === 0;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeUp}>
        <PageHeader
          locale={locale}
          back
          breadcrumbs={[
            {
              label: isArabic ? "لوحة التحكم" : "Dashboard",
              href: `/${locale}/admin`,
            },
            {
              label: isArabic ? "السيارات" : "Vehicles",
              href: `/${locale}/admin/vehicles`,
            },
            {
              label:
                mode === "create"
                  ? isArabic
                    ? "إضافة سيارة"
                    : "Add Vehicle"
                  : isArabic
                    ? "تعديل"
                    : "Edit",
            },
          ]}
          title={
            mode === "create"
              ? isArabic
                ? "إضافة سيارة جديدة"
                : "Add New Vehicle"
              : isArabic
                ? "تعديل السيارة"
                : "Edit Vehicle"
          }
        />
      </motion.div>

      {noBrands && (
        <motion.div variants={fadeUp}>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm font-medium text-destructive">
                {t.noBrands}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Main form */}
        <div className="space-y-6 xl:col-span-2">
          {/* Basic Info */}
          <motion.div variants={fadeUp}>
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-body-lg font-semibold text-foreground">
                  {t.basicInfo}
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {t.brand} <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={brandId}
                      onChange={(e) => {
                        setBrandId(e.target.value);
                        // Reset model whenever the brand changes; clear any
                        // custom brand text when leaving the custom option.
                        setModelId("");
                        setCustomModel("");
                        if (e.target.value !== CUSTOM_VALUE) setCustomBrand("");
                      }}
                      className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground"
                    >
                      <option value="">{t.select}</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                          {isArabic ? b.name_ar : b.name}
                        </option>
                      ))}
                      <option value={CUSTOM_VALUE}>{t.other}</option>
                    </select>
                    {brandId === CUSTOM_VALUE && (
                      <Input
                        value={customBrand}
                        onChange={(e) => setCustomBrand(e.target.value)}
                        placeholder={t.customBrandPlaceholder}
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {t.model} <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={modelId}
                      onChange={(e) => {
                        setModelId(e.target.value);
                        if (e.target.value !== CUSTOM_VALUE) setCustomModel("");
                      }}
                      disabled={!brandId}
                      className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground disabled:opacity-50"
                    >
                      <option value="">{t.select}</option>
                      {models.map((m) => (
                        <option key={m.id} value={m.id}>
                          {isArabic ? m.name_ar : m.name}
                        </option>
                      ))}
                      {brandId && <option value={CUSTOM_VALUE}>{t.other}</option>}
                    </select>
                    {modelId === CUSTOM_VALUE && (
                      <Input
                        value={customModel}
                        onChange={(e) => setCustomModel(e.target.value)}
                        placeholder={t.customModelPlaceholder}
                      />
                    )}
                    {brandId &&
                      brandId !== CUSTOM_VALUE &&
                      modelId !== CUSTOM_VALUE &&
                      models.length === 0 && (
                        <p className="text-body-xs text-destructive">
                          {t.noModels}
                        </p>
                      )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {t.year} <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="number"
                      placeholder="2024"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {t.price} <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Specifications */}
          <motion.div variants={fadeUp}>
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-body-lg font-semibold text-foreground">
                  {t.specifications}
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {t.mileage} <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={mileage}
                      onChange={(e) => setMileage(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {t.fuelType} <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={fuelType}
                      onChange={(e) => setFuelType(e.target.value)}
                      className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground"
                    >
                      <option value="">{t.select}</option>
                      <option value="gasoline">{isArabic ? "بنزين" : "Gasoline"}</option>
                      <option value="diesel">{isArabic ? "ديزل" : "Diesel"}</option>
                      <option value="electric">{isArabic ? "كهرباء" : "Electric"}</option>
                      <option value="hybrid">{isArabic ? "هايبرد" : "Hybrid"}</option>
                      <option value="plug_in_hybrid">
                        {isArabic ? "هايبرد بلج إن" : "Plug-in Hybrid"}
                      </option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {t.transmission} <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={transmission}
                      onChange={(e) => setTransmission(e.target.value)}
                      className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground"
                    >
                      <option value="">{t.select}</option>
                      <option value="automatic">{isArabic ? "أوتوماتيك" : "Automatic"}</option>
                      <option value="manual">{isArabic ? "يدوي" : "Manual"}</option>
                      <option value="cvt">CVT</option>
                      <option value="dual_clutch">
                        {isArabic ? "مزدوج القابض" : "Dual Clutch"}
                      </option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {t.bodyType} <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={bodyType}
                      onChange={(e) => setBodyType(e.target.value)}
                      className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground"
                    >
                      <option value="">{t.select}</option>
                      <option value="sedan">{isArabic ? "سيدان" : "Sedan"}</option>
                      <option value="suv">SUV</option>
                      <option value="coupe">{isArabic ? "كوبيه" : "Coupe"}</option>
                      <option value="convertible">{isArabic ? "كابريو" : "Convertible"}</option>
                      <option value="hatchback">{isArabic ? "هاتشباك" : "Hatchback"}</option>
                      <option value="truck">{isArabic ? "شاحنة" : "Truck"}</option>
                      <option value="van">{isArabic ? "فان" : "Van"}</option>
                      <option value="wagon">{isArabic ? "ستيشن" : "Wagon"}</option>
                      <option value="pickup">{isArabic ? "بيك أب" : "Pickup"}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {t.color} <span className="text-destructive">*</span>
                    </label>
                    <Input
                      placeholder={isArabic ? "Black" : "Black"}
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {t.colorAr} <span className="text-destructive">*</span>
                    </label>
                    <Input
                      dir="rtl"
                      placeholder="أسود"
                      value={colorAr}
                      onChange={(e) => setColorAr(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {t.engineSize}
                    </label>
                    <Input
                      placeholder="3.0L"
                      value={engineSize}
                      onChange={(e) => setEngineSize(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {t.vin}
                    </label>
                    <Input
                      placeholder="17 characters"
                      maxLength={17}
                      value={vin}
                      onChange={(e) => setVin(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Description */}
          <motion.div variants={fadeUp}>
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-body-lg font-semibold text-foreground">
                  {t.description}
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {t.descriptionEn}
                    </label>
                    <textarea
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      className="min-h-[120px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder={isArabic ? "وصف السيارة بالإنجليزية" : "Vehicle description in English"}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {t.descriptionAr}
                    </label>
                    <textarea
                      dir="rtl"
                      value={descriptionAr}
                      onChange={(e) => setDescriptionAr(e.target.value)}
                      className="min-h-[120px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder={isArabic ? "وصف السيارة بالعربية" : "Vehicle description in Arabic"}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Images */}
          <motion.div variants={fadeUp}>
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-body-lg font-semibold text-foreground">
                  {t.images}
                </h3>

                {/* Existing (already-saved) images — edit mode only */}
                {existingImages.length > 0 && (
                  <div className="mb-6">
                    <p className="mb-3 text-sm font-medium text-muted-foreground">
                      {t.existingImages}
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {existingImages.map((img) => {
                        const isDeleting = deletingImageId === img.id;
                        return (
                          <div
                            key={img.id}
                            className="group relative aspect-square overflow-hidden rounded-xl border border-input bg-secondary"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.url}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                            {img.is_primary && (
                              <Badge
                                variant="secondary"
                                className="absolute start-2 top-2"
                              >
                                {t.primary}
                              </Badge>
                            )}
                            {/* Delete button */}
                            <button
                              type="button"
                              aria-label={t.deleteImage}
                              disabled={isDeleting || !canDeleteExisting}
                              onClick={() => setImageToDelete(img)}
                              className="absolute end-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-white shadow-sm transition-opacity hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                            {isDeleting && (
                              <div className="absolute inset-0 bg-background/50" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {!canDeleteExisting && existingImages.length === 1 && (
                      <p className="mt-2 text-body-xs text-muted-foreground">
                        {t.lastImageWarning}
                      </p>
                    )}
                  </div>
                )}

                {existingImages.length > 0 && (
                  <p className="mb-3 text-sm font-medium text-muted-foreground">
                    {t.newImages}
                  </p>
                )}
                <ImageUpload
                  images={images}
                  previews={imagePreviews}
                  onImagesChange={setImages}
                  onPreviewsChange={setImagePreviews}
                  locale={locale}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Features */}
          <motion.div variants={fadeUp}>
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-body-lg font-semibold text-foreground">
                  {t.features}
                </h3>
                <div className="flex gap-2">
                  <Input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder={isArabic ? "أضف مميزة..." : "Add a feature..."}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                  />
                  <Button variant="outline" onClick={addFeature}>
                    {isArabic ? "إضافة" : "Add"}
                  </Button>
                </div>
                {features.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {feature}
                        <button
                          onClick={() => removeFeature(index)}
                          className="ml-1 rounded-full p-0.5 hover:bg-foreground/10"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <motion.div variants={fadeUp}>
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-body-lg font-semibold text-foreground">
                  {t.settings}
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {t.status}
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground"
                    >
                      <option value="draft">{isArabic ? "مسودة" : "Draft"}</option>
                      <option value="available">{isArabic ? "متاح" : "Available"}</option>
                      <option value="reserved">{isArabic ? "محجوز" : "Reserved"}</option>
                      <option value="sold">{isArabic ? "مباع" : "Sold"}</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">
                      {t.featured}
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsFeatured((v) => !v)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        isFeatured ? "bg-primary" : "bg-secondary hover:bg-secondary/80"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                          isFeatured ? "start-6" : "start-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* SEO */}
          <motion.div variants={fadeUp}>
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-body-lg font-semibold text-foreground">
                  {t.seo}
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {t.seoTitle}
                    </label>
                    <Input
                      placeholder={t.seoTitle}
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {t.seoDescription}
                    </label>
                    <textarea
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      className="min-h-[80px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder={t.seoDescription}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Save button */}
          <motion.div variants={fadeUp}>
            <div className="flex gap-3">
              <Button variant="outline" fullWidth onClick={() => router.back()}>
                {t.cancel}
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={handleSave}
                isLoading={isSaving}
                disabled={noBrands}
              >
                <Save className="h-4 w-4" />
                {isSaving ? t.saving : t.save}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <ConfirmDialog
        open={imageToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setImageToDelete(null);
        }}
        title={t.deleteImageConfirm}
        description={t.deleteImageDesc}
        confirmText={t.delete}
        cancelText={t.cancel}
        variant="destructive"
        onConfirm={confirmDeleteImage}
      />
    </motion.div>
  );
}
