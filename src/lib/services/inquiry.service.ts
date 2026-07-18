import { createClient, getServiceClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type {
  CreateInquiryInput,
  UpdateInquiryInput,
  InquiryFilterInput,
} from "@/lib/validation/inquiry.schema";

type InquiryRow = Database["public"]["Tables"]["inquiries"]["Row"];

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class InquiryService {
  static async list(
    filters: InquiryFilterInput
  ): Promise<PaginatedResult<InquiryRow>> {
    const supabase = await getServiceClient();
    const { page, limit, status, vehicle_id, search } = filters;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("inquiries")
      .select("*, vehicles!inner(id, slug, make, make_ar, model, model_ar, year)", {
        count: "exact",
      })
      .order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);
    if (vehicle_id) query = query.eq("vehicle_id", vehicle_id);
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,message.ilike.%${search}%`
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

  static async create(input: CreateInquiryInput): Promise<InquiryRow> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("inquiries")
      .insert(input)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async update(
    id: string,
    input: UpdateInquiryInput
  ): Promise<InquiryRow> {
    const supabase = await getServiceClient();

    const { data, error } = await supabase
      .from("inquiries")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async getStats(): Promise<{
    total: number;
    new: number;
    contacted: number;
    closed: number;
  }> {
    const supabase = await getServiceClient();

    const [total, newCount, contacted, closed] = await Promise.all([
      supabase.from("inquiries").select("*", { count: "exact", head: true }),
      supabase
        .from("inquiries")
        .select("*", { count: "exact", head: true })
        .eq("status", "new"),
      supabase
        .from("inquiries")
        .select("*", { count: "exact", head: true })
        .eq("status", "contacted"),
      supabase
        .from("inquiries")
        .select("*", { count: "exact", head: true })
        .in("status", ["closed_won", "closed_lost"]),
    ]);

    return {
      total: total.count || 0,
      new: newCount.count || 0,
      contacted: contacted.count || 0,
      closed: closed.count || 0,
    };
  }
}
