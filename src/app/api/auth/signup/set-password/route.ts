import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust import
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { phone, password, name } = await req.json();

    if (!phone || !password) {
      return NextResponse.json(
        { error: "Phone and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { phone },
      data: {
        password: hashedPassword,
        name: name || user.name,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
