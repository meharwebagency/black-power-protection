import { createClient, getServiceClient } from "@/lib/supabase/server";
import { brandsCache } from "@/lib/cache";
import { slugify } from "@/lib/utils";
import type { Database } from "@/types/database";
import type { CreateBrandInput, UpdateBrandInput } from "@/lib/validation/brand.schema";

type BrandRow = Database["public"]["Tables"]["brands"]["Row"];

export class BrandService {
  static async list(): Promise<BrandRow[]> {
    const cacheKey = "brands:all";
    const cached = brandsCache.get(cacheKey);
    if (cached) return cached as BrandRow[];

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) throw new Error(error.message);

    brandsCache.set(cacheKey, data || [], 3_600_000);
    return data || [];
  }

  static async listAll(): Promise<BrandRow[]> {
    const supabase = await getServiceClient();
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  }

  static async getBySlug(slug: string): Promise<BrandRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error) return null;
    return data;
  }

  static async getById(id: string): Promise<BrandRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  }

  static async create(input: CreateBrandInput): Promise<BrandRow> {
    const supabase = await getServiceClient();
    const { data, error } = await supabase
      .from("brands")
      .insert(input)
      .select()
      .single();

    if (error) throw new Error(error.message);
    brandsCache.clear();
    return data;
  }

  /**
   * Resolve a free-typed manufacturer name to a real brand row, reusing an
   * existing brand when one matches (case-insensitive) and creating a new one
   * otherwise. Used by the vehicle form's "Other / Custom" option so a typed
   * manufacturer becomes a real UUID before the vehicle insert (which requires
   * a valid brand_id foreign key).
   */
  static async findOrCreateByName(rawName: string): Promise<BrandRow> {
    const name = rawName.trim();
    if (!name) throw new Error("Brand name is required");

    const supabase = await getServiceClient();

    // Match an existing brand by case-insensitive English OR Arabic name.
    // Two simple .ilike queries (not a composed .or string) so names with
    // commas/parentheses can't break PostgREST filter parsing.
    const { data: byName } = await supabase
      .from("brands")
      .select("*")
      .ilike("name", name)
      .limit(1)
      .maybeSingle();
    if (byName) return byName;

    const { data: byNameAr } = await supabase
      .from("brands")
      .select("*")
      .ilike("name_ar", name)
      .limit(1)
      .maybeSingle();
    if (byNameAr) return byNameAr;

    // Ensure a unique slug (brand slugs are globally unique).
    const baseSlug = slugify(name) || "brand";
    let slug = baseSlug;
    for (let i = 2; ; i++) {
      const { data: clash } = await supabase
        .from("brands")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (!clash) break;
      slug = `${baseSlug}-${i}`;
    }

    const { data, error } = await supabase
      .from("brands")
      .insert({ name, name_ar: name, slug, is_active: true, sort_order: 999 })
      .select()
      .single();

    if (error) throw new Error(error.message);
    brandsCache.clear();
    return data;
  }

  static async update(id: string, input: UpdateBrandInput): Promise<BrandRow> {
    const supabase = await getServiceClient();
    const { data, error } = await supabase
      .from("brands")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    brandsCache.clear();
    return data;
  }

  static async delete(id: string): Promise<void> {
    const supabase = await getServiceClient();
    const { error } = await supabase.from("brands").delete().eq("id", id);
    if (error) throw new Error(error.message);
    brandsCache.clear();
  }
}
