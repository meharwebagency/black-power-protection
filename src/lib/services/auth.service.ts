import { createClient, getServiceClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { CreateAdminInput, UpdateProfileInput } from "@/lib/validation/auth.schema";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export class AuthService {
  static async getProfile(userId: string): Promise<ProfileRow | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) return null;
    return data;
  }

  static async listAdmins(): Promise<ProfileRow[]> {
    const supabase = await getServiceClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }

  static async updateProfile(
    userId: string,
    input: UpdateProfileInput
  ): Promise<ProfileRow> {
    const supabase = await getServiceClient();
    const { data, error } = await supabase
      .from("profiles")
      .update(input)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async updateRole(
    userId: string,
    role: "super_admin" | "admin" | "editor"
  ): Promise<ProfileRow> {
    const supabase = await getServiceClient();
    const { data, error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async deactivateUser(userId: string): Promise<void> {
    const supabase = await getServiceClient();
    const { error } = await supabase
      .from("profiles")
      .update({ is_active: false })
      .eq("id", userId);

    if (error) throw new Error(error.message);
  }

  static async login(email: string, password: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    return data;
  }

  static async logout() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  static async getCurrentUser() {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;
    return user;
  }
}
