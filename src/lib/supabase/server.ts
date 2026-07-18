import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// NOTE: @supabase/ssr@0.5.x ships type declarations that import from a
// `@supabase/supabase-js/dist/module/lib/types` path that no longer exists in
// supabase-js v2.110+. That broken import makes the SSR client's generic
// resolve to `any`/`never`, which collapses every query builder to `never`.
// We annotate the return type with the intact `SupabaseClient<Database>` from
// supabase-js so query results are typed correctly everywhere.
export async function createClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies();

  const client = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            // Called from a Server Component — cookies are read-only here.
            // Session refresh is handled by the middleware, so this is safe to ignore.
          }
        },
      },
    }
  );

  return client as unknown as SupabaseClient<Database>;
}

export async function getServiceClient() {
  const { createClient: createServiceClient } = await import(
    "@supabase/supabase-js"
  );

  return createServiceClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
