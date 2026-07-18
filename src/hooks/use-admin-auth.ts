"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface AdminUser {
  id: string;
  email: string;
  role: "super_admin" | "admin" | "editor";
  full_name: string;
  is_active: boolean;
}

interface UseAdminAuthReturn {
  user: AdminUser | null;
  isLoading: boolean;
  error: string | null;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useAdminAuth(): UseAdminAuthReturn {
  const [user, setUser] = React.useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const fetchUser = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const supabase = createClient();
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError || !authUser) {
        console.error("[Auth] No user:", authError?.message);
        setUser(null);
        setError(authError?.message || "Not authenticated");
        return;
      }

      console.log("[Auth] User found:", authUser.email);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (profileError || !profile) {
        // Never fabricate a role here — a missing/failed profile means we
        // cannot authorize this user. Treat as unauthenticated. The server-side
        // requireAdmin() remains the real gate; this only drives the admin UI.
        console.error("[Auth] Profile query failed:", profileError?.message);
        setUser(null);
        setError("Your account is not authorized for the admin panel.");
        return;
      }

      if (!profile.is_active) {
        console.error("[Auth] Profile is inactive:", profile.email);
        setUser(null);
        setError("Your account has been deactivated.");
        return;
      }

      setUser({
        id: profile.id,
        email: profile.email,
        role: profile.role as AdminUser["role"],
        full_name: profile.full_name,
        is_active: profile.is_active,
      });
    } catch (e) {
      console.error("[Auth] Failed:", e);
      setUser(null);
      setError("Failed to fetch user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = React.useCallback(async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      window.location.href = "/ar/login";
    } catch {
      console.error("Logout failed");
    }
  }, []);

  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    isLoading,
    error,
    logout,
    refresh: fetchUser,
  };
}
