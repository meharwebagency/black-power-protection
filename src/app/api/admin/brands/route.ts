import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/middleware";
import { BrandService } from "@/lib/services/brand.service";
import { createBrandSchema } from "@/lib/validation/brand.schema";
import { z } from "zod";

export async function GET() {
  const { user, error } = await requireAdmin();
  if (error || !user) {
    return NextResponse.json(
      { success: false, error: error || "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const brands = await BrandService.listAll();
    return NextResponse.json({
      success: true,
      data: brands,
    });
  } catch (err) {
    console.error("Error fetching brands:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to fetch brands",
      },
      { status: 500 }
    );
  }
}

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
    const validatedData = createBrandSchema.parse(body);
    const brand = await BrandService.create(validatedData);

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

    console.error("Error creating brand:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to create brand",
      },
      { status: 500 }
    );
  }
}
