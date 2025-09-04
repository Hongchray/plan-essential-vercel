import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { phone, purpose } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { error: "forgot_password.error_phone_required" },
        { status: 400 }
      );
    }

    if (!purpose || !["register", "forgot"].includes(purpose)) {
      return NextResponse.json(
        { error: "forgot_password.error_invalid_purpose" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { phone } });

    if (purpose === "register" && existingUser) {
      return NextResponse.json(
        { error: "forgot_password.error_phone_registered" },
        { status: 400 }
      );
    }

    if (purpose === "forgot" && !existingUser) {
      return NextResponse.json(
        { error: "forgot_password.error_user_not_found" },
        { status: 404 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await prisma.user.upsert({
      where: { phone },
      update: { otp_code: otp, otp_expires_at: expiresAt },
      create: {
        phone,
        otp_code: otp,
        otp_expires_at: expiresAt,
        email: "",
        password: "",
      },
    });

    // Build SMS message (can also use i18n here if multi-language SMS is required)
    const message = `${otp} is your reset password OTP code.`;

    const apiUrl = process.env.PLASGATE_API_URL;
    const privateKey = process.env.PLASGATE_API_PRIVATE_KEY;
    const xSecret = process.env.PLASGATE_API_X_SECRET;
    const sender = process.env.PLASGATE_SENDER || "PlasGateUAT";

    if (!apiUrl || !privateKey || !xSecret) {
      throw new Error("forgot_password.error_missing_env");
    }

    const response = await fetch(`${apiUrl}?private_key=${privateKey}`, {
      method: "POST",
      headers: { "X-Secret": xSecret, "Content-Type": "application/json" },
      body: JSON.stringify({ sender, to: phone, content: message }),
    });

    let data: any;
    try {
      data = await response.json();
    } catch (err) {
      data = await response.text();
      console.warn("⚠️ Response is not JSON:", data);
    }

    if (!response.ok || (typeof data === "object" && data.success === false)) {
      console.error("❌ Failed to send OTP:", data);
      return NextResponse.json(
        { error: "forgot_password.error_failed_to_send_otp", details: data },
        { status: 500 }
      );
    }

    (globalThis as any).otpStore = (globalThis as any).otpStore || {};
    (globalThis as any).otpStore[phone] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
    };

    return NextResponse.json({
      success: true,
      message: "forgot_password.otp_sent_success",
    });
  } catch (error: any) {
    console.error("❌ Send OTP error:", error);
    return NextResponse.json(
      { error: "forgot_password.error_generic" },
      { status: 500 }
    );
  }
}
