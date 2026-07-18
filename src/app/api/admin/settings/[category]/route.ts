import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/middleware";
import { SettingsService } from "@/lib/services/settings.service";

interface RouteParams {
  params: Promise<{ category: string }>;
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
    const { category } = await params;
    const settings = await SettingsService.getByCategory(category);

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (err) {
    console.error("Error fetching settings:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to fetch settings",
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
    const { category } = await params;
    const body = await request.json();
    const { settings } = body;

    if (!Array.isArray(settings)) {
      return NextResponse.json(
        { success: false, error: "Settings must be an array" },
        { status: 400 }
      );
    }

    const entries = settings.map((s: any) => ({
      ...s,
      category,
    }));

    await SettingsService.setMultiple(entries, user.id);

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
    });
  } catch (err) {
    console.error("Error updating settings:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to update settings",
      },
      { status: 500 }
    );
  }
}
