import { createClient, getServiceClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type {
  CreateContactInput,
  UpdateContactInput,
  ContactFilterInput,
} from "@/lib/validation/contact.schema";

type ContactRow = Database["public"]["Tables"]["contact_messages"]["Row"];

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ContactService {
  static async list(
    filters: ContactFilterInput
  ): Promise<PaginatedResult<ContactRow>> {
    const supabase = await getServiceClient();
    const { page, limit, status, search } = filters;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("contact_messages")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%,message.ilike.%${search}%`
      );
    }

    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);

    return {
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  static async create(input: CreateContactInput): Promise<ContactRow> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("contact_messages")
      .insert({
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        subject: input.subject || null,
        message: input.message,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async update(
    id: string,
    input: UpdateContactInput
  ): Promise<ContactRow> {
    const supabase = await getServiceClient();

    const { data, error } = await supabase
      .from("contact_messages")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async getStats(): Promise<{
    total: number;
    unread: number;
    read: number;
    archived: number;
  }> {
    const supabase = await getServiceClient();

    const [total, unread, read, archived] = await Promise.all([
      supabase.from("contact_messages").select("*", { count: "exact", head: true }),
      supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("status", "unread"),
      supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("status", "read"),
      supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("status", "archived"),
    ]);

    return {
      total: total.count || 0,
      unread: unread.count || 0,
      read: read.count || 0,
      archived: archived.count || 0,
    };
  }
}
