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

    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    // Registration flow: phone must NOT exist
    if (purpose === "register" && existingUser) {
      return NextResponse.json(
        { error: "Phone already registered" },
        { status: 400 }
      );
    }

    // Forgot password flow: phone must exist
    if (purpose === "forgot" && !existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 5 min

    // Create or update user OTP
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

    // Send OTP via your SMS provider
    const message = `${otp} is your reset password OTP code.`;
    const apiUrl = process.env.PLASGATE_API_URL;
    const privateKey = process.env.PLASGATE_API_PRIVATE_KEY;
    const xSecret = process.env.PLASGATE_API_X_SECRET;
    const sender = process.env.PLASGATE_SENDER || "PlasGateUAT";

    if (!apiUrl || !privateKey || !xSecret) {
      throw new Error("Missing PlasGate API environment variables");
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
        { error: "Failed to send OTP", details: data },
        { status: 500 }
      );
    }

    // Store OTP in memory for quick verification (optional)
    (globalThis as any).otpStore = (globalThis as any).otpStore || {};
    (globalThis as any).otpStore[phone] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
    };

    return NextResponse.json({ success: true, message: "OTP sent", otp }); // include OTP for testing only
  } catch (error: any) {
    console.error("❌ Send OTP error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
