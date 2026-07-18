import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth.service";
import { loginSchema } from "@/lib/validation/auth.schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    const result = await AuthService.login(
      validatedData.email,
      validatedData.password
    );

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
        },
        session: {
          access_token: result.session?.access_token,
          expires_at: result.session?.expires_at,
        },
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message.includes("Invalid login")
            ? "Invalid email or password"
            : error.message,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    );
  }
}
