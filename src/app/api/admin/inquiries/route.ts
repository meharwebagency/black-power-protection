import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/middleware";
import { InquiryService } from "@/lib/services/inquiry.service";
import { inquiryFilterSchema, updateInquirySchema } from "@/lib/validation/inquiry.schema";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const { user, error } = await requireAdmin();
  if (error || !user) {
    return NextResponse.json(
      { success: false, error: error || "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = request.nextUrl;
    const filters = {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 20,
      status: searchParams.get("status") || undefined,
      search: searchParams.get("search") || undefined,
      vehicle_id: searchParams.get("vehicle_id") || undefined,
    };

    const result = await InquiryService.list(filters as any);

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to fetch inquiries",
      },
      { status: 500 }
    );
  }
}
