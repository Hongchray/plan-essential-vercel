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

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 5 min

    // Update user with new OTP
    await prisma.user.update({
      where: { phone },
      data: {
        otp_code: otp,
        otp_expires_at: expiresAt,
      },
    });

    // Send OTP via SMS (PlasGate)
    const message = `Your verification code for Plan Essential is: ${otp}`;

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
        { error: "Failed to resend OTP", details: data },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP resent successfully",
      otp,
    }); // OTP included for testing
  } catch (error: any) {
    console.error("❌ Resend OTP error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
