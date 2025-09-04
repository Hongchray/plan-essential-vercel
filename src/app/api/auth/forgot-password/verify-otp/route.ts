import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { phone, otp_code } = await req.json();

    if (!phone || phone.trim() === "") {
      return NextResponse.json(
        { error: "forgot_password.error_phone_required" },
        { status: 400 }
      );
    }

    if (!otp_code || otp_code.length !== 6) {
      return NextResponse.json(
        { error: "forgot_password.error_otp_invalid" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user || !user.otp_code || !user.otp_expires_at) {
      return NextResponse.json(
        { error: "forgot_password.error_not_found" },
        { status: 404 }
      );
    }

    if (user.otp_expires_at < new Date()) {
      return NextResponse.json(
        { error: "forgot_password.error_expired" },
        { status: 400 }
      );
    }

    if (user.otp_code !== otp_code) {
      return NextResponse.json(
        { error: "forgot_password.error_incorrect" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { phone },
      data: {
        otp_code: null,
        otp_expires_at: null,
      },
    });

    return NextResponse.json({
      success: true,
      next: `/forgot-password/set-password?phone=${phone}`,
    });
  } catch (error: any) {
    console.error("❌ Forgot Password Verify OTP error:", error);
    return NextResponse.json(
      { error: "forgot_password.toast_failed" },
      { status: 500 }
    );
  }
}
