import { NextRequest, NextResponse } from "next/server";
import { getVehicleBySlug } from "@/lib/supabase/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const vehicle = await getVehicleBySlug(slug);

    return NextResponse.json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Vehicle not found",
      },
      { status: 404 }
    );
  }
}
