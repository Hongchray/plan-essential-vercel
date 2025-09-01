import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { phone, otp_code } = await req.json();

    if (!phone || phone.trim() === "") {
      return NextResponse.json({ error: "Phone is required" }, { status: 400 });
    }

    if (!otp_code || otp_code.length !== 6) {
      return NextResponse.json(
        { error: "OTP must be 6 digits" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user || !user.otp_code || !user.otp_expires_at) {
      return NextResponse.json({ error: "OTP not found" }, { status: 404 });
    }

    if (user.otp_expires_at < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    if (user.otp_code !== otp_code) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // OTP correct → clear OTP
    await prisma.user.update({
      where: { phone },
      data: {
        otp_code: null,
        otp_expires_at: null,
      },
    });

    // Next step: redirect to set new password
    return NextResponse.json({
      success: true,
      next: `/admin/forgot-password/set-password?phone=${phone}`,
    });
  } catch (error: any) {
    console.error("❌ Forgot Password Verify OTP error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
