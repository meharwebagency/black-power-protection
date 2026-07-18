import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";

export async function GET() {
  const { user, error } = await getAuthUser();

  if (error || !user) {
    return NextResponse.json(
      { success: false, error: error || "Not authenticated" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    data: user,
  });
}
