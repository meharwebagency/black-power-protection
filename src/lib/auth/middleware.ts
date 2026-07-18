import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type UserRole = "super_admin" | "admin" | "editor";

interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  is_active: boolean;
}

interface AuthResult {
  user: AuthUser | null;
  error: string | null;
}

export async function getAuthUser(): Promise<AuthResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { user: null, error: "Not authenticated" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, is_active")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return { user: null, error: "Profile not found" };
  }

  if (!profile.is_active) {
    return { user: null, error: "Account is deactivated" };
  }

  return {
    user: {
      id: profile.id,
      email: profile.email,
      role: profile.role as UserRole,
      full_name: profile.full_name,
      is_active: profile.is_active,
    },
    error: null,
  };
}

export async function requireAdmin(): Promise<AuthResult> {
  const result = await getAuthUser();

  if (result.error) return result;
  if (!result.user) return { user: null, error: "Not authenticated" };

  if (!["super_admin", "admin"].includes(result.user.role)) {
    return { user: null, error: "Insufficient permissions" };
  }

  return result;
}

export async function requireSuperAdmin(): Promise<AuthResult> {
  const result = await getAuthUser();

  if (result.error) return result;
  if (!result.user) return { user: null, error: "Not authenticated" };

  if (result.user.role !== "super_admin") {
    return { user: null, error: "Super admin access required" };
  }

  return result;
}

export function hasPermission(
  user: AuthUser | null,
  action: "read" | "write" | "delete" | "manage_settings"
): boolean {
  if (!user || !user.is_active) return false;

  const permissions: Record<UserRole, string[]> = {
    super_admin: ["read", "write", "delete", "manage_settings"],
    admin: ["read", "write", "delete"],
    editor: ["read", "write"],
  };

  return permissions[user.role]?.includes(action) ?? false;
}
