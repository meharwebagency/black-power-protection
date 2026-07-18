"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from "framer-motion";
import { Search, X, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { SortSelect } from "@/components/ui/filter-bar";
import { EmptyState } from "@/components/common/states";
import { VehicleCardListing } from "./vehicle-card-listing";
import { VehicleFilters } from "./vehicle-filters";
import { MobileFilterDrawer } from "./mobile-filter-drawer";
import { QuickViewModal } from "./quick-view-modal";
import { PAGINATION } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useIsDesktop } from "@/hooks/use-media-query";
import type { Vehicle, VehicleFilter, VehicleSort } from "@/types/vehicle";
import type { Locale } from "@/types";

const ITEMS_PER_PAGE = PAGINATION.DEFAULT_LIMIT;
const EASE_LUXURY = [0.16, 1, 0.3, 1] as const;

const SORT_OPTIONS = [
  { value: "newest", labelAr: "الأحدث", label: "Newest" },
  { value: "oldest", labelAr: "الأقدم", label: "Oldest" },
  { value: "priceHigh", labelAr: "السعر: من الأعلى", label: "Price: High to Low" },
  { value: "priceLow", labelAr: "السعر: من الأقل", label: "Price: Low to High" },
  { value: "mileageLow", labelAr: "المسافة: من الأقل", label: "Mileage: Low to High" },
];

interface VehicleInventoryProps {
  locale: Locale;
}

export function VehicleInventory({ locale }: VehicleInventoryProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDesktop = useIsDesktop();
  const reduceMotion = useReducedMotion();

  const t = (ar: string, en: string) => (locale === "ar" ? ar : en);

  const [filters, setFilters] = React.useState<VehicleFilter>(() => ({
    search: searchParams.get("search") || undefined,
    make: searchParams.get("make") || undefined,
    model: searchParams.get("model") || undefined,
    bodyType: (searchParams.get("bodyType") as VehicleFilter["bodyType"]) || undefined,
    fuelType: (searchParams.get("fuelType") as VehicleFilter["fuelType"]) || undefined,
    transmission: (searchParams.get("transmission") as VehicleFilter["transmission"]) || undefined,
    status: (searchParams.get("status") as VehicleFilter["status"]) || undefined,
    color: searchParams.get("color") || undefined,
    yearFrom: searchParams.get("yearFrom") ? Number(searchParams.get("yearFrom")) : undefined,
    yearTo: searchParams.get("yearTo") ? Number(searchParams.get("yearTo")) : undefined,
    priceFrom: searchParams.get("priceFrom") ? Number(searchParams.get("priceFrom")) : undefined,
    priceTo: searchParams.get("priceTo") ? Number(searchParams.get("priceTo")) : undefined,
    mileageFrom: searchParams.get("mileageFrom") ? Number(searchParams.get("mileageFrom")) : undefined,
    mileageTo: searchParams.get("mileageTo") ? Number(searchParams.get("mileageTo")) : undefined,
  }));

  const [sort, setSort] = React.useState<VehicleSort>({ field: "createdAt", direction: "desc" });
  const [sortValue, setSortValue] = React.useState("newest");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState(filters.search || "");
  const [quickViewVehicle, setQuickViewVehicle] = React.useState<Vehicle | null>(null);
  const [isFiltering, setIsFiltering] = React.useState(false);

  // Live inventory loaded from Supabase (via the public API). Filtering and
  // sorting still happen client-side against this list.
  const [allVehicles, setAllVehicles] = React.useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/vehicles?limit=100&status=available");
        const json = await res.json();
        if (!cancelled && json.success) {
          setAllVehicles(json.data as Vehicle[]);
        }
      } catch (err) {
        console.error("Failed to load vehicles:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Debounced instant search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchQuery || undefined }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Show loading skeleton when filters change
  React.useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => setIsFiltering(false), 200);
    return () => clearTimeout(timer);
  }, [filters, sort]);

  // Sync URL
  React.useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.make) params.set("make", filters.make);
    if (filters.model) params.set("model", filters.model);
    if (filters.bodyType) params.set("bodyType", filters.bodyType);
    if (filters.fuelType) params.set("fuelType", filters.fuelType);
    if (filters.transmission) params.set("transmission", filters.transmission);
    if (filters.status) params.set("status", filters.status);
    if (filters.color) params.set("color", filters.color);
    if (filters.yearFrom) params.set("yearFrom", String(filters.yearFrom));
    if (filters.yearTo) params.set("yearTo", String(filters.yearTo));
    if (filters.priceFrom) params.set("priceFrom", String(filters.priceFrom));
    if (filters.priceTo) params.set("priceTo", String(filters.priceTo));
    if (filters.mileageFrom) params.set("mileageFrom", String(filters.mileageFrom));
    if (filters.mileageTo) params.set("mileageTo", String(filters.mileageTo));
    params.set("page", String(currentPage));
    const qs = params.toString();
    router.replace(`/${locale}/vehicles${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [filters, currentPage, locale, router]);

  // Filter
  const filteredVehicles = React.useMemo(() => {
    let result = [...allVehicles];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (v) =>
          v.make.toLowerCase().includes(q) ||
          v.makeAr.includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.modelAr.includes(q)
      );
    }
    if (filters.make) result = result.filter((v) => v.make === filters.make);
    if (filters.model) result = result.filter((v) => v.model.toLowerCase().includes(filters.model!.toLowerCase()));
    if (filters.bodyType) result = result.filter((v) => v.bodyType === filters.bodyType);
    if (filters.fuelType) result = result.filter((v) => v.fuelType === filters.fuelType);
    if (filters.transmission) result = result.filter((v) => v.transmission === filters.transmission);
    if (filters.status) result = result.filter((v) => v.status === filters.status);
    if (filters.color) result = result.filter((v) => v.color === filters.color);
    if (filters.yearFrom) result = result.filter((v) => v.year >= filters.yearFrom!);
    if (filters.yearTo) result = result.filter((v) => v.year <= filters.yearTo!);
    if (filters.priceFrom) result = result.filter((v) => v.price >= filters.priceFrom!);
    if (filters.priceTo) result = result.filter((v) => v.price <= filters.priceTo!);
    if (filters.mileageFrom) result = result.filter((v) => v.mileage >= filters.mileageFrom!);
    if (filters.mileageTo) result = result.filter((v) => v.mileage <= filters.mileageTo!);

    result.sort((a, b) => {
      switch (sort.field) {
        case "price":
          return sort.direction === "asc" ? a.price - b.price : b.price - a.price;
        case "year":
          return sort.direction === "asc" ? a.year - b.year : b.year - a.year;
        case "mileage":
          return sort.direction === "asc" ? a.mileage - b.mileage : b.mileage - a.mileage;
        case "createdAt":
        default:
          return sort.direction === "asc"
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    return result;
  }, [filters, sort, allVehicles]);

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  React.useEffect(() => { setCurrentPage(1); }, [filters, sort]);

  const handleFilterChange = (newFilters: VehicleFilter) => setFilters(newFilters);

  const handleSortChange = (value: string) => {
    const map: Record<string, VehicleSort> = {
      newest: { field: "createdAt", direction: "desc" },
      oldest: { field: "createdAt", direction: "asc" },
      priceHigh: { field: "price", direction: "desc" },
      priceLow: { field: "price", direction: "asc" },
      mileageLow: { field: "mileage", direction: "asc" },
    };
    setSortValue(value);
    setSort(map[value] || map.newest);
  };

  const activeFilterBadges = Object.entries(filters)
    .filter(([_, v]) => v !== undefined && v !== "")
    .map(([key, value]) => {
      const label = (() => {
        switch (key) {
          case "make":
          case "model":
          case "bodyType":
          case "fuelType":
          case "transmission":
          case "status":
          case "color":
            return String(value);
          case "yearFrom":
            return `${t("من", "From")} ${value}`;
          case "yearTo":
            return `${t("إلى", "To")} ${value}`;
          case "priceFrom":
            return `${t("من", "From")} ${new Intl.NumberFormat(locale === "ar" ? "ar-KW" : "en-US").format(Number(value))} KWD`;
          case "priceTo":
            return `${t("إلى", "To")} ${new Intl.NumberFormat(locale === "ar" ? "ar-KW" : "en-US").format(Number(value))} KWD`;
          case "mileageFrom":
            return `${t("من", "From")} ${new Intl.NumberFormat().format(Number(value))} km`;
          case "mileageTo":
            return `${t("إلى", "To")} ${new Intl.NumberFormat().format(Number(value))} km`;
          case "search":
            return `"${value}"`;
          default:
            return String(value);
        }
      })();
      return { key, label };
    });

  const clearFilter = (key: string) => {
    setFilters((prev) => {
      const next = { ...prev };
      delete (next as Record<string, unknown>)[key];
      return next;
    });
  };

  const resultCount = filteredVehicles.length;
  const countLabel = isLoading
    ? t("جارٍ التحميل…", "Loading…")
    : t(
        `${new Intl.NumberFormat("ar-KW").format(resultCount)} مركبة متاحة`,
        `${resultCount} ${resultCount === 1 ? "vehicle" : "vehicles"} available`
      );

  return (
    <div className="min-h-screen">
      {/* ── Page masthead ── */}
      <div className="border-b border-border/60">
        <Container size="xl" className="py-10 md:py-14">
          {/* Breadcrumb */}
          <motion.nav
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-body-xs text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <a
              href={`/${locale}`}
              className="transition-colors hover:text-foreground"
            >
              {t("الرئيسية", "Home")}
            </a>
            <ChevronRight className="h-3 w-3 opacity-60 rtl:rotate-180" />
            <span className="font-medium text-foreground">{t("السيارات", "Vehicles")}</span>
          </motion.nav>

          {/* Title block */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_LUXURY, delay: 0.05 }}
            className="mt-6 max-w-2xl"
          >
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent" aria-hidden />
              <span className="text-2xs font-medium uppercase tracking-[0.22em] text-muted-foreground ltr:tracking-[0.22em] rtl:tracking-normal">
                {t("المعرض", "The Collection")}
              </span>
            </div>
            <h1 className="mt-4 font-display text-display-md font-semibold leading-[1.1] text-foreground md:text-display-lg">
              {t("سيارات مختارة بعناية", "Curated Vehicles")}
            </h1>
            <p className="mt-4 text-body-md text-muted-foreground">
              {t(
                "تشكيلة منتقاة من السيارات الفاخرة، كل واحدة تم فحصها والتحقق منها بعناية.",
                "A hand-selected range of premium vehicles, each inspected and verified with care."
              )}
            </p>
          </motion.div>
        </Container>
      </div>

      <Container size="xl" className="py-8 md:py-10">
        {/* ── Toolbar: search + sort ── */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_LUXURY }}
          className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("ابحث بالماركة أو الطراز", "Search by make or model")}
              aria-label={t("ابحث عن سيارة", "Search vehicles")}
              className="h-12 rounded-xl ps-11 pe-11 text-body-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setFilters((prev) => ({ ...prev, search: undefined }));
                }}
                aria-label={t("مسح البحث", "Clear search")}
                className="absolute end-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 lg:justify-end">
            <span className="text-body-xs text-muted-foreground lg:hidden">
              {countLabel}
            </span>
            <div className="flex items-center gap-2">
              {!isDesktop && (
                <MobileFilterDrawer
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  locale={locale}
                  resultCount={resultCount}
                />
              )}
              <div className="flex items-center gap-2">
                <span className="hidden text-body-xs text-muted-foreground sm:inline">
                  {t("ترتيب", "Sort")}
                </span>
                <SortSelect
                  options={SORT_OPTIONS.map((o) => ({ value: o.value, label: t(o.labelAr, o.label) }))}
                  value={sortValue}
                  onChange={handleSortChange}
                  locale={locale}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Active filter badges ── */}
        <AnimatePresence initial={false}>
          {activeFilterBadges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: EASE_LUXURY }}
              className="overflow-hidden"
            >
              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/60 pt-5">
                <span className="text-2xs uppercase tracking-[0.16em] text-muted-foreground ltr:tracking-[0.16em] rtl:tracking-normal">
                  {t("مطبّق", "Applied")}
                </span>
                {activeFilterBadges.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => clearFilter(key)}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-body-xs text-foreground transition-colors hover:border-foreground/30"
                  >
                    <span className="truncate">{label}</span>
                    <X className="h-3 w-3 text-muted-foreground transition-colors group-hover:text-foreground" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setFilters({})}
                  className="ms-1 text-body-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  {t("مسح الكل", "Clear all")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main content ── */}
        <div className="mt-8 flex gap-10">
          {isDesktop && (
            <aside className="w-[264px] shrink-0">
              <div className="sticky top-28">
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px w-6 bg-accent" aria-hidden />
                  <span className="text-2xs font-medium uppercase tracking-[0.18em] text-muted-foreground ltr:tracking-[0.18em] rtl:tracking-normal">
                    {t("تحديد", "Refine")}
                  </span>
                </div>
                <VehicleFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  locale={locale}
                  resultCount={resultCount}
                />
              </div>
            </aside>
          )}

          <div className="min-w-0 flex-1">
            {/* Desktop result count */}
            {isDesktop && (
              <p className="mb-6 text-body-sm text-muted-foreground">{countLabel}</p>
            )}

            <LayoutGroup>
              <AnimatePresence mode="wait">
                {isFiltering || isLoading ? (
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3"
                    aria-hidden
                  >
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex flex-col gap-3">
                        <div className="aspect-[3/2] w-full animate-pulse rounded-xl bg-muted/70" />
                        <div className="h-4 w-3/4 animate-pulse rounded bg-muted/70" />
                        <div className="h-3 w-1/2 animate-pulse rounded bg-muted/50" />
                        <div className="h-4 w-1/3 animate-pulse rounded bg-muted/70" />
                      </div>
                    ))}
                  </motion.div>
                ) : filteredVehicles.length === 0 ? (
                  <motion.div
                    key="no-results"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE_LUXURY }}
                    className="rounded-2xl border border-dashed border-border/70"
                  >
                    <EmptyState
                      title={t("لا توجد نتائج", "Nothing to show yet")}
                      description={t(
                        "لم نتمكن من العثور على سيارات تطابق اختياراتك. جرّب تعديل الفلاتر أو توسيع نطاق البحث.",
                        "No vehicles match your current selection. Try adjusting the filters or widening your search."
                      )}
                      action={{
                        label: t("مسح جميع الفلاتر", "Clear all filters"),
                        onClick: () => {
                          setFilters({});
                          setSearchQuery("");
                        },
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={`grid-${currentPage}`}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={{
                      hidden: {},
                      visible: {
                        transition: { staggerChildren: reduceMotion ? 0 : 0.06 },
                      },
                    }}
                    className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3"
                  >
                    {paginatedVehicles.map((vehicle) => (
                      <motion.div
                        key={vehicle.id}
                        layout
                        variants={{
                          hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.7, ease: EASE_LUXURY },
                          },
                        }}
                      >
                        <VehicleCardListing
                          vehicle={vehicle}
                          locale={locale}
                          onQuickView={setQuickViewVehicle}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </LayoutGroup>

            {!isFiltering && !isLoading && totalPages > 1 && (
              <div className="mt-14 flex justify-center border-t border-border/60 pt-10">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  locale={locale}
                />
              </div>
            )}
          </div>
        </div>
      </Container>

      <QuickViewModal
        vehicle={quickViewVehicle}
        open={!!quickViewVehicle}
        onClose={() => setQuickViewVehicle(null)}
        locale={locale}
      />
    </div>
  );
}
