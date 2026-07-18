import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/middleware";
import { ModelService } from "@/lib/services/model.service";

/**
 * Resolve a free-typed model name (scoped to a brand) to a real model row
 * (find-or-create). Backs the vehicle form's "Other / Custom" model option:
 * the client sends brand_id + typed name and receives a model with a real UUID
 * it can use as model_id.
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
    const brandId = typeof body?.brand_id === "string" ? body.brand_id : "";
    const name = typeof body?.name === "string" ? body.name.trim() : "";

    if (!brandId) {
      return NextResponse.json(
        { success: false, error: "A manufacturer must be selected first" },
        { status: 400 }
      );
    }
    if (!name) {
      return NextResponse.json(
        { success: false, error: "Model name is required" },
        { status: 400 }
      );
    }

    const model = await ModelService.findOrCreateByName(brandId, name);
    return NextResponse.json({ success: true, data: model });
  } catch (err) {
    console.error("Error resolving model:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to resolve model",
      },
      { status: 500 }
    );
  }
}
