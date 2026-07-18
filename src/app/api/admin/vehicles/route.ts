import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/middleware";
import { VehicleService } from "@/lib/services/vehicle.service";
import { createVehicleSchema } from "@/lib/validation/vehicle.schema";
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
      limit: Number(searchParams.get("limit")) || 12,
      status: searchParams.get("status") || undefined,
      search: searchParams.get("search") || undefined,
      sort: (searchParams.get("sort") as string) || "newest",
    };

    const result = await VehicleService.listForAdmin(filters);

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch vehicles",
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
    const validatedData = createVehicleSchema.parse(body);

    const vehicle = await VehicleService.create(validatedData, user.id);

    return NextResponse.json({
      success: true,
      data: vehicle,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: err.errors,
        },
        { status: 400 }
      );
    }

    console.error("Error creating vehicle:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to create vehicle",
      },
      { status: 500 }
    );
  }
}
