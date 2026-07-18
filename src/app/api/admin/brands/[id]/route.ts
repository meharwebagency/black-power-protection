import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/middleware";
import { BrandService } from "@/lib/services/brand.service";
import { updateBrandSchema } from "@/lib/validation/brand.schema";
import { z } from "zod";

interface RouteParams {
  params: Promise<{ id: string }>;
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
    const validatedData = updateBrandSchema.parse(body);
    const brand = await BrandService.update(id, validatedData);

    return NextResponse.json({
      success: true,
      data: brand,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: err.errors },
        { status: 400 }
      );
    }

    console.error("Error updating brand:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to update brand",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { user, error } = await requireAdmin();
  if (error || !user) {
    return NextResponse.json(
      { success: false, error: error || "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    await BrandService.delete(id);

    return NextResponse.json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting brand:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to delete brand",
      },
      { status: 500 }
    );
  }
}
