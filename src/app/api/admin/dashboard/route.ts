import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/middleware";
import { VehicleService } from "@/lib/services/vehicle.service";
import { InquiryService } from "@/lib/services/inquiry.service";
import { ContactService } from "@/lib/services/contact.service";

export async function GET() {
  const { user, error } = await requireAdmin();
  if (error || !user) {
    return NextResponse.json(
      { success: false, error: error || "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const [vehicleStats, inquiryStats, messageStats] = await Promise.all([
      VehicleService.listForAdmin({ page: 1, limit: 1, sort: "newest" }).catch(() => ({
        pagination: { total: 0 },
      })),
      InquiryService.getStats().catch(() => ({
        total: 0,
        new: 0,
        contacted: 0,
        closed: 0,
      })),
      ContactService.getStats().catch(() => ({
        total: 0,
        unread: 0,
        read: 0,
        archived: 0,
      })),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        vehicles: {
          total: vehicleStats.pagination.total,
        },
        inquiries: inquiryStats,
        messages: messageStats,
      },
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to fetch stats",
      },
      { status: 500 }
    );
  }
}
