import { createClient, getServiceClient } from "@/lib/supabase/server";
import { settingsCache } from "@/lib/cache";

interface SettingRow {
  key: string;
  value: unknown;
  category: string;
  description: string | null;
  updated_at: string;
  updated_by: string | null;
}

export class SettingsService {
  static async getPublic(): Promise<Record<string, unknown>> {
    const cacheKey = "settings:public";
    const cached = settingsCache.get(cacheKey);
    if (cached) return cached;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("settings")
      .select("key, value, category")
      .in("category", ["general", "contact", "social", "seo"]);

    if (error) throw new Error(error.message);

    const settings: Record<string, unknown> = {};
    for (const row of data || []) {
      settings[row.key] = row.value;
    }

    settingsCache.set(cacheKey, settings, 5 * 60_000);
    return settings;
  }

  static async getByCategory(category: string): Promise<SettingRow[]> {
    const supabase = await getServiceClient();
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("category", category)
      .order("key", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  }

  static async get(key: string): Promise<unknown> {
    const supabase = await getServiceClient();
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", key)
      .single();

    if (error) return null;
    return data?.value;
  }

  static async set(
    key: string,
    value: unknown,
    options?: {
      category?: string;
      description?: string;
      updatedBy?: string;
    }
  ): Promise<void> {
    const supabase = await getServiceClient();

    const { error } = await supabase.from("settings").upsert(
      {
        key,
        value,
        category: options?.category || "general",
        description: options?.description || null,
        updated_by: options?.updatedBy || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );

    if (error) throw new Error(error.message);
    settingsCache.clear();
  }

  static async setMultiple(
    entries: Array<{
      key: string;
      value: unknown;
      category?: string;
      description?: string;
    }>,
    updatedBy?: string
  ): Promise<void> {
    const supabase = await getServiceClient();

    const rows = entries.map((entry) => ({
      key: entry.key,
      value: entry.value,
      category: entry.category || "general",
      description: entry.description || null,
      updated_by: updatedBy || null,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("settings").upsert(rows, {
      onConflict: "key",
    });

    if (error) throw new Error(error.message);
    settingsCache.clear();
  }

  static async delete(key: string): Promise<void> {
    const supabase = await getServiceClient();
    const { error } = await supabase.from("settings").delete().eq("key", key);
    if (error) throw new Error(error.message);
    settingsCache.clear();
  }
}
