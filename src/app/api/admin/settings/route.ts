import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/middleware";
import { SettingsService } from "@/lib/services/settings.service";

export async function GET() {
  const { user, error } = await requireAdmin();
  if (error || !user) {
    return NextResponse.json(
      { success: false, error: error || "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const categories = ["general", "contact", "social", "seo", "appearance"];
    const allSettings: Record<string, any[]> = {};

    for (const category of categories) {
      allSettings[category] = await SettingsService.getByCategory(category);
    }

    return NextResponse.json({
      success: true,
      data: allSettings,
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

export async function PUT(request: NextRequest) {
  const { user, error } = await requireAdmin();
  if (error || !user) {
    return NextResponse.json(
      { success: false, error: error || "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { settings } = body;

    if (!Array.isArray(settings)) {
      return NextResponse.json(
        { success: false, error: "Settings must be an array" },
        { status: 400 }
      );
    }

    await SettingsService.setMultiple(settings, user.id);

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
