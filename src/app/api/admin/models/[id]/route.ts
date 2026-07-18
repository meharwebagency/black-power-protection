import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/middleware";
import { ModelService } from "@/lib/services/model.service";
import { updateModelSchema } from "@/lib/validation/model.schema";
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
    const validatedData = updateModelSchema.parse(body);
    const model = await ModelService.update(id, validatedData);

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

    console.error("Error updating model:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to update model",
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
    await ModelService.delete(id);

    return NextResponse.json({
      success: true,
      message: "Model deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting model:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to delete model",
      },
      { status: 500 }
    );
  }
}
