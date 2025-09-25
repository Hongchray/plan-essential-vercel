import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const eventId = req.nextUrl.searchParams.get("eventId");

  if (!eventId) {
    return NextResponse.json(
      { message: "eventId is required" },
      { status: 400 }
    );
  }
  const guests = await prisma.guest.findMany({
    where: {
      eventId: eventId,
      wishing_note: { not: null },
      sentAt: { not: null },
    },
    orderBy: {
      sentAt: "desc",
    },
    take: 10,
  });
  if (!guests)
    return NextResponse.json({ message: "No guests found" }, { status: 404 });
  return NextResponse.json(guests, { status: 200 });
}
