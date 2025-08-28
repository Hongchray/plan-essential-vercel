import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { phone, password } = await req.json();

    if (!phone || !phone.trim()) {
      return NextResponse.json({ error: "Phone is required" }, { status: 400 });
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user password
    await prisma.user.update({
      where: { phone },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password set successfully",
    });
  } catch (error: any) {
    console.error("❌ Set Password error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
