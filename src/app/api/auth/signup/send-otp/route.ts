import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { phone, purpose } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone is required" }, { status: 400 });
    }

    if (!purpose || !["register", "forgot"].includes(purpose)) {
      return NextResponse.json({ error: "Invalid purpose" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { phone } });

    // Registration flow: phone must NOT exist
    if (purpose === "register" && user) {
      return NextResponse.json(
        { error: "Phone already registered" },
        { status: 400 }
      );
    }

    // Forgot password flow: phone must exist
    if (purpose === "forgot" && !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if previous OTP exists and is still valid
    const now = new Date();
    if (user?.otp_code && user?.otp_expires_at && user.otp_expires_at > now) {
      // Optional: prevent spamming OTPs, e.g., only allow resend every 30s
      const secondsLeft = Math.ceil(
        (user.otp_expires_at.getTime() - now.getTime()) / 1000
      );
      return NextResponse.json(
        {
          error: `OTP already sent. Try again in ${secondsLeft} seconds.`,
        },
        { status: 429 }
      );
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 1 min

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

    if (!apiUrl || !privateKey || !xSecret)
      throw new Error("Missing PlasGate API environment variables");

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
        { error: "Failed to send OTP", details: data },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "OTP sent", otp }); // otp for testing
  } catch (error: any) {
    console.error("❌ Send OTP error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
