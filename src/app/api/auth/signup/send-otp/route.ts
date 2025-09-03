import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const sendOtpSchema = z.object({
  phone: z
    .string()
    .min(1, { message: "signup.error_phone_required" })
    .regex(/^\d{8,15}$/, { message: "signup.error_invalid_phone" }),
  purpose: z.enum(["register", "forgot"], {
    message: "signup.error_invalid_purpose",
  }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, purpose } = sendOtpSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { phone } });

    // Registration flow: phone must NOT exist
    if (purpose === "register" && user) {
      return NextResponse.json(
        { error: "signup.error_phone_already_registered" },
        { status: 400 }
      );
    }

    // Forgot password flow: phone must exist
    if (purpose === "forgot" && !user) {
      return NextResponse.json(
        { error: "signup.error_user_not_found" },
        { status: 404 }
      );
    }

    // Check if previous OTP exists and is still valid
    const now = new Date();
    if (user?.otp_code && user?.otp_expires_at && user.otp_expires_at > now) {
      const secondsLeft = Math.ceil(
        (user.otp_expires_at.getTime() - now.getTime()) / 1000
      );
      return NextResponse.json(
        { error: `signup.error_otp_already_sent_${secondsLeft}` },
        { status: 429 }
      );
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 min

    // Upsert OTP
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

    // Send OTP via SMS (PlasGate)
    const message = `Your verification code for Plan Essential is: ${otp}`;

    const apiUrl = process.env.PLASGATE_API_URL;
    const privateKey = process.env.PLASGATE_API_PRIVATE_KEY;
    const xSecret = process.env.PLASGATE_API_X_SECRET;
    const sender = process.env.PLASGATE_SENDER || "PlasGateUAT";

    if (!apiUrl || !privateKey || !xSecret) {
      throw new Error("signup.error_missing_plasgate_config");
    }

    const response = await fetch(`${apiUrl}?private_key=${privateKey}`, {
      method: "POST",
      headers: { "X-Secret": xSecret, "Content-Type": "application/json" },
      body: JSON.stringify({ sender, to: phone, content: message }),
    });

    let data: any;
    try {
      data = await response.json();
    } catch {
      data = await response.text();
    }

    if (!response.ok || (typeof data === "object" && data.success === false)) {
      return NextResponse.json(
        { error: "signup.error_failed_to_send_otp", details: data },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "signup.success_otp_sent",
      otp, // For testing only; remove in production
    });
  } catch (error: any) {
    console.error("❌ Send OTP error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "signup.error_server" }, { status: 500 });
  }
}
