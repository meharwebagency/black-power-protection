import { createClient, getServiceClient } from "@/lib/supabase/server";
import { modelsCache } from "@/lib/cache";
import { slugify } from "@/lib/utils";
import type { Database } from "@/types/database";
import type { CreateModelInput, UpdateModelInput } from "@/lib/validation/model.schema";

type ModelRow = Database["public"]["Tables"]["models"]["Row"];

export class ModelService {
  static async listByBrand(brandId: string): Promise<ModelRow[]> {
    const cacheKey = `models:brand:${brandId}`;
    const cached = modelsCache.get(cacheKey);
    if (cached) return cached as ModelRow[];

    const supabase = await getServiceClient();
    const { data, error } = await supabase
      .from("models")
      .select("*")
      .eq("brand_id", brandId)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) throw new Error(error.message);

    modelsCache.set(cacheKey, data || [], 3_600_000);
    return data || [];
  }

  static async listAll(): Promise<ModelRow[]> {
    const supabase = await getServiceClient();
    const { data, error } = await supabase
      .from("models")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  }

  static async getById(id: string): Promise<ModelRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("models")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  }

  static async create(input: CreateModelInput): Promise<ModelRow> {
    const supabase = await getServiceClient();
    const { data, error } = await supabase
      .from("models")
      .insert(input)
      .select()
      .single();

    if (error) throw new Error(error.message);
    modelsCache.clear();
    return data;
  }

  /**
   * Resolve a free-typed model name (scoped to a brand) to a real model row,
   * reusing an existing model when one matches (case-insensitive) within that
   * brand and creating a new one otherwise. Backs the vehicle form's
   * "Other / Custom" model option so a typed model becomes a valid model_id.
   */
  static async findOrCreateByName(
    brandId: string,
    rawName: string
  ): Promise<ModelRow> {
    const name = rawName.trim();
    if (!name) throw new Error("Model name is required");

    const supabase = await getServiceClient();

    // Match an existing model within this brand (English OR Arabic name).
    // Two simple .ilike queries (not a composed .or string) so names with
    // commas/parentheses can't break PostgREST filter parsing.
    const { data: byName } = await supabase
      .from("models")
      .select("*")
      .eq("brand_id", brandId)
      .ilike("name", name)
      .limit(1)
      .maybeSingle();
    if (byName) return byName;

    const { data: byNameAr } = await supabase
      .from("models")
      .select("*")
      .eq("brand_id", brandId)
      .ilike("name_ar", name)
      .limit(1)
      .maybeSingle();
    if (byNameAr) return byNameAr;

    // Ensure a unique slug (model slugs are globally unique in the schema).
    const baseSlug = slugify(name) || "model";
    let slug = baseSlug;
    for (let i = 2; ; i++) {
      const { data: clash } = await supabase
        .from("models")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (!clash) break;
      slug = `${baseSlug}-${i}`;
    }

    const { data, error } = await supabase
      .from("models")
      .insert({
        brand_id: brandId,
        name,
        name_ar: name,
        slug,
        is_active: true,
        sort_order: 999,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    modelsCache.clear();
    return data;
  }

  static async update(id: string, input: UpdateModelInput): Promise<ModelRow> {
    const supabase = await getServiceClient();
    const { data, error } = await supabase
      .from("models")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    modelsCache.clear();
    return data;
  }

  static async delete(id: string): Promise<void> {
    const supabase = await getServiceClient();
    const { error } = await supabase.from("models").delete().eq("id", id);
    if (error) throw new Error(error.message);
    modelsCache.clear();
  }
}
