import { createClient, getServiceClient } from "@/lib/supabase/server";
import { vehiclesCache, featuredCache } from "@/lib/cache";
import type { Database } from "@/types/database";
import type {
  CreateVehicleInput,
  VehicleFilterInput,
} from "@/lib/validation/vehicle.schema";
import { PAGINATION } from "@/lib/constants";

type VehicleRow = Database["public"]["Tables"]["vehicles"]["Row"];
type VehicleImageRow = Database["public"]["Tables"]["vehicle_images"]["Row"];

interface VehicleWithImages extends VehicleRow {
  vehicle_images: VehicleImageRow[];
}

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function buildSortClause(sort: string): { column: string; ascending: boolean } {
  const sortMap: Record<string, { column: string; ascending: boolean }> = {
    newest: { column: "created_at", ascending: false },
    oldest: { column: "created_at", ascending: true },
    price_asc: { column: "price", ascending: true },
    price_desc: { column: "price", ascending: false },
    mileage_asc: { column: "mileage", ascending: true },
    mileage_desc: { column: "mileage", ascending: false },
  };
  return sortMap[sort] || sortMap.newest;
}

function generateSlug(brand: string, model: string, year: number): string {
  return `${brand} ${model} ${year}`
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Return a slug that is unique across vehicles. If `baseSlug` is already free
 * (ignoring the record identified by `excludeId`), it is returned unchanged —
 * so a record keeps its own slug on update instead of colliding with itself.
 * Otherwise "-2", "-3", ... is appended until a free slug is found.
 */
async function ensureUniqueSlug(
  supabase: Awaited<ReturnType<typeof getServiceClient>>,
  baseSlug: string,
  excludeId?: string
): Promise<string> {
  let slug = baseSlug;
  for (let i = 2; ; i++) {
    let query = supabase.from("vehicles").select("id").eq("slug", slug);
    // Exclude the current record so it never conflicts with its own slug.
    if (excludeId) query = query.neq("id", excludeId);

    const { data } = await query.limit(1).maybeSingle();
    if (!data) return slug;
    slug = `${baseSlug}-${i}`;
  }
}

export class VehicleService {
  static async list(
    filters: VehicleFilterInput
  ): Promise<PaginatedResult<VehicleWithImages>> {
    const cacheKey = `vehicles:list:${JSON.stringify(filters)}`;
    const cached = vehiclesCache.get(cacheKey);
    if (cached) return cached as PaginatedResult<VehicleWithImages>;

    const supabase = await createClient();
    const { page, limit, sort, ...filterParams } = filters;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("vehicles")
      .select("*, vehicle_images(*)", { count: "exact" })
      .is("deleted_at", null)
      .eq("status", "available");

    if (filterParams.brand) {
      const { data: brand } = await supabase
        .from("brands")
        .select("id")
        .eq("slug", filterParams.brand)
        .single();
      if (brand) query = query.eq("brand_id", brand.id);
    }

    if (filterParams.model) {
      const { data: model } = await supabase
        .from("models")
        .select("id")
        .eq("slug", filterParams.model)
        .single();
      if (model) query = query.eq("model_id", model.id);
    }

    if (filterParams.year_from) query = query.gte("year", filterParams.year_from);
    if (filterParams.year_to) query = query.lte("year", filterParams.year_to);
    if (filterParams.price_from) query = query.gte("price", filterParams.price_from);
    if (filterParams.price_to) query = query.lte("price", filterParams.price_to);
    if (filterParams.fuel_type) query = query.eq("fuel_type", filterParams.fuel_type);
    if (filterParams.transmission) query = query.eq("transmission", filterParams.transmission);
    if (filterParams.body_type) query = query.eq("body_type", filterParams.body_type);

    if (filterParams.search) {
      query = query.or(
        `description.ilike.%${filterParams.search}%,description_ar.ilike.%${filterParams.search}%`
      );
    }

    const sortClause = buildSortClause(sort);
    query = query.order(sortClause.column, {
      ascending: sortClause.ascending,
    });

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw new Error(error.message);

    const result: PaginatedResult<VehicleWithImages> = {
      data: (data as VehicleWithImages[]) || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };

    vehiclesCache.set(cacheKey, result, 60_000);
    return result;
  }

  // Admin listing: shows ALL statuses (including draft) and soft-excludes
  // deleted rows. Does NOT force status=available like the public list().
  static async listForAdmin(filters: {
    page: number;
    limit: number;
    status?: string;
    search?: string;
    sort?: string;
  }): Promise<PaginatedResult<VehicleWithImages>> {
    const supabase = await getServiceClient();
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("vehicles")
      .select("*, vehicle_images(*)", { count: "exact" })
      .is("deleted_at", null);

    if (filters.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    if (filters.search) {
      const s = filters.search;
      query = query.or(
        `make.ilike.%${s}%,model.ilike.%${s}%,make_ar.ilike.%${s}%,model_ar.ilike.%${s}%`
      );
    }

    const sortClause = buildSortClause(filters.sort || "newest");
    query = query
      .order(sortClause.column, { ascending: sortClause.ascending })
      .range(from, to);

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);

    return {
      data: (data as VehicleWithImages[]) || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  static async getBySlug(slug: string): Promise<VehicleWithImages | null> {
    const cacheKey = `vehicle:slug:${slug}`;
    const cached = vehiclesCache.get(cacheKey);
    if (cached) return cached as VehicleWithImages;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vehicles")
      .select("*, vehicle_images(*)")
      .eq("slug", slug)
      .is("deleted_at", null)
      .single();

    if (error || !data) return null;

    vehiclesCache.set(cacheKey, data as VehicleWithImages, 300_000);
    return data as VehicleWithImages;
  }

  // Admin fetch by primary key (used by the edit page). Uses the service
  // client and does not filter by status so drafts are editable.
  static async getById(id: string): Promise<VehicleWithImages | null> {
    const supabase = await getServiceClient();
    const { data, error } = await supabase
      .from("vehicles")
      .select("*, vehicle_images(*)")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error || !data) return null;
    return data as VehicleWithImages;
  }

  static async getFeatured(limit: number = 6): Promise<VehicleWithImages[]> {
    const cacheKey = `vehicles:featured:${limit}`;
    const cached = featuredCache.get(cacheKey);
    if (cached) return cached as VehicleWithImages[];

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vehicles")
      .select("*, vehicle_images(*)")
      .eq("is_featured", true)
      .eq("status", "available")
      .is("deleted_at", null)
      .order("featured_order", { ascending: true, nullsFirst: false })
      .limit(limit);

    if (error) throw new Error(error.message);

    featuredCache.set(cacheKey, data || [], 120_000);
    return (data as VehicleWithImages[]) || [];
  }

  static async create(
    input: CreateVehicleInput,
    userId: string
  ): Promise<VehicleWithImages> {
    const supabase = await getServiceClient();

    const { data: brand } = await supabase
      .from("brands")
      .select("slug, name, name_ar")
      .eq("id", input.brand_id)
      .single();

    const { data: model } = await supabase
      .from("models")
      .select("slug, name, name_ar")
      .eq("id", input.model_id)
      .single();

    if (!brand || !model) {
      throw new Error("Selected brand or model was not found");
    }

    const slug = await ensureUniqueSlug(
      supabase,
      generateSlug(brand.slug, model.slug, input.year)
    );

    const { data, error } = await supabase
      .from("vehicles")
      .insert({
        ...input,
        // Denormalized display columns are NOT NULL in the DB — populate them
        // from the chosen brand/model so inserts don't violate constraints.
        make: brand.name,
        make_ar: brand.name_ar,
        model: model.name,
        model_ar: model.name_ar,
        slug,
        created_by: userId,
        updated_by: userId,
      })
      .select("*, vehicle_images(*)")
      .single();

    if (error) throw new Error(error.message);

    this.invalidateCache();
    return data as VehicleWithImages;
  }

  static async update(
    id: string,
    input: Database["public"]["Tables"]["vehicles"]["Update"],
    userId: string
  ): Promise<VehicleWithImages> {
    const supabase = await getServiceClient();

    // When the brand or model changes, refresh the denormalized display columns
    // (make/model text) and the slug so they don't go stale. Mirrors create().
    const derived: Record<string, unknown> = {};
    if (input.brand_id || input.model_id) {
      const { data: current } = await supabase
        .from("vehicles")
        .select("brand_id, model_id, year")
        .eq("id", id)
        .single();

      const brandId = input.brand_id ?? current?.brand_id;
      const modelId = input.model_id ?? current?.model_id;
      const year = input.year ?? current?.year;

      if (!brandId || !modelId) {
        throw new Error("Selected brand or model was not found");
      }

      const { data: brand } = await supabase
        .from("brands")
        .select("slug, name, name_ar")
        .eq("id", brandId)
        .single();

      const { data: model } = await supabase
        .from("models")
        .select("slug, name, name_ar")
        .eq("id", modelId)
        .single();

      if (!brand || !model) {
        throw new Error("Selected brand or model was not found");
      }

      derived.make = brand.name;
      derived.make_ar = brand.name_ar;
      derived.model = model.name;
      derived.model_ar = model.name_ar;
      derived.slug = await ensureUniqueSlug(
        supabase,
        generateSlug(brand.slug, model.slug, year as number),
        id // exclude this vehicle so its own slug never counts as a conflict
      );
    }

    const { data, error } = await supabase
      .from("vehicles")
      .update({ ...input, ...derived, updated_by: userId })
      .eq("id", id)
      .select("*, vehicle_images(*)")
      .single();

    if (error) throw new Error(error.message);

    this.invalidateCache();
    return data as VehicleWithImages;
  }

  static async softDelete(id: string, userId: string): Promise<void> {
    const supabase = await getServiceClient();

    const { error } = await supabase
      .from("vehicles")
      .update({ deleted_at: new Date().toISOString(), updated_by: userId })
      .eq("id", id);

    if (error) throw new Error(error.message);
    this.invalidateCache();
  }

  static async publish(id: string, userId: string): Promise<VehicleWithImages> {
    return this.update(
      id,
      {
        status: "available",
        published_at: new Date().toISOString(),
      },
      userId
    );
  }

  static async unpublish(id: string, userId: string): Promise<VehicleWithImages> {
    return this.update(id, { status: "draft" }, userId);
  }

  private static invalidateCache(): void {
    vehiclesCache.clear();
    featuredCache.clear();
  }
}
