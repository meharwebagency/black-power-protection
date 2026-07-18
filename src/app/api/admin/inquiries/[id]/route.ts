import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/middleware";
import { InquiryService } from "@/lib/services/inquiry.service";
import { updateInquirySchema } from "@/lib/validation/inquiry.schema";
import { z } from "zod";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { user, error } = await requireAdmin();
  if (error || !user) {
    return NextResponse.json(
      { success: false, error: error || "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data, error: fetchError } = await supabase
      .from("inquiries")
      .select("*, vehicles!inner(id, slug, make, make_ar, model, model_ar, year)")
      .eq("id", id)
      .single();

    if (fetchError || !data) {
      return NextResponse.json(
        { success: false, error: "Inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("Error fetching inquiry:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to fetch inquiry",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { user, error } = await requireAdmin();
  if (error || !user) {
    return NextResponse.json(
      { success: false, error: error || "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateInquirySchema.parse(body);
    const inquiry = await InquiryService.update(id, validatedData);

    return NextResponse.json({
      success: true,
      data: inquiry,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: err.errors },
        { status: 400 }
      );
    }

    console.error("Error updating inquiry:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to update inquiry",
      },
      { status: 500 }
    );
  }
}
