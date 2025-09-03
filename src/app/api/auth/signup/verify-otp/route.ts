import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { phone, otp_code } = await req.json();

    if (!phone || phone.trim() === "") {
      return NextResponse.json(
        { error: "otp_verification.error_phone_required" },
        { status: 400 }
      );
    }

    // Validate OTP
    if (!otp_code || otp_code.length !== 6) {
      return NextResponse.json(
        { error: "otp_verification.error_invalid_otp_length" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user || !user.otp_code || !user.otp_expires_at) {
      return NextResponse.json(
        { error: "otp_verification.error_otp_not_found" },
        { status: 404 }
      );
    }

    if (user.otp_expires_at < new Date()) {
      return NextResponse.json(
        { error: "otp_verification.error_otp_expired" },
        { status: 400 }
      );
    }

    if (user.otp_code !== otp_code) {
      return NextResponse.json(
        { error: "otp_verification.error_invalid_otp" },
        { status: 400 }
      );
    }

    // Success → mark phone as verified
    await prisma.user.update({
      where: { phone },
      data: {
        phone_verified: true,
        phone_verified_at: new Date(),
        otp_code: null,
        otp_expires_at: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "otp_verification.success_phone_verified",
    });
  } catch (error: any) {
    console.error("❌ Verify OTP error:", error);
    return NextResponse.json(
      { error: "otp_verification.error_server" },
      { status: 500 }
    );
  }
}
