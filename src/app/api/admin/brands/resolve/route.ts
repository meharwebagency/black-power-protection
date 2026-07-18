import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/middleware";
import { BrandService } from "@/lib/services/brand.service";

/**
 * Resolve a free-typed manufacturer name to a real brand row (find-or-create).
 * Backs the vehicle form's "Other / Custom" brand option: the client sends the
 * typed name and receives a brand with a real UUID it can use as brand_id.
 */
export async function POST(request: NextRequest) {
  const { user, error } = await requireAdmin();
  if (error || !user) {
    return NextResponse.json(
      { success: false, error: error || "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Manufacturer name is required" },
        { status: 400 }
      );
    }

    const brand = await BrandService.findOrCreateByName(name);
    return NextResponse.json({ success: true, data: brand });
  } catch (err) {
    console.error("Error resolving brand:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to resolve brand",
      },
      { status: 500 }
    );
  }
}
