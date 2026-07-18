import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/middleware";
import { ModelService } from "@/lib/services/model.service";
import { createModelSchema } from "@/lib/validation/model.schema";
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
    const brandId = searchParams.get("brand_id");

    const models = brandId
      ? await ModelService.listByBrand(brandId)
      : await ModelService.listAll();

    return NextResponse.json({
      success: true,
      data: models,
    });
  } catch (err) {
    console.error("Error fetching models:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to fetch models",
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
    const validatedData = createModelSchema.parse(body);
    const model = await ModelService.create(validatedData);

    return NextResponse.json({
      success: true,
      data: model,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation error", details: err.errors },
        { status: 400 }
      );
    }

    console.error("Error creating model:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to create model",
      },
      { status: 500 }
    );
  }
}
