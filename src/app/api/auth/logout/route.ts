import { NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth.service";

export async function POST() {
  try {
    await AuthService.logout();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Logout failed" },
      { status: 500 }
    );
  }
}
