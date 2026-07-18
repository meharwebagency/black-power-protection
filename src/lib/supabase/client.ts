import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// See src/lib/supabase/server.ts for why we re-assert the return type: the
// @supabase/ssr@0.5.x type declarations reference a supabase-js internal path
// that no longer exists in v2.110+, collapsing query builders to `never`.
export function createClient(): SupabaseClient<Database> {
  const client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return client as unknown as SupabaseClient<Database>;
}
