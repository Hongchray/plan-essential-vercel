import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ params is now a Promise
) {
  const { id } = await params; // ✅ await the params

  try {
    const profile = await prisma.user.findUnique({
      where: { id },
      include: {
        events: true,
        userPlan: { include: { plan: true } },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ params is now a Promise
) {
  const { id } = await params; // ✅ await the params

  try {
    const body = await req.json();
    const updated = await prisma.user.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        username: body.username,
        photoUrl: body.photoUrl,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
