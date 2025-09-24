import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  //get first event
  const event = await prisma.event.findFirst({
    include: {
      schedules: {
        include: {
          shifts: {
            include: {
              timeLine: true,
            },
          },
        },
      },
    },
  });
  if (!event)
    return NextResponse.json({ message: "No event found" }, { status: 404 });
  return NextResponse.json(event, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const { guestId, status, number_guest, message } = await req.json();

    if (!guestId) {
      return NextResponse.json(
        { error: "Guest ID is required" },
        { status: 400 }
      );
    }

    const guest = await prisma.guest.update({
      where: { id: guestId },
      data: {
        number_of_guests: number_guest,
        status,
        wishing_note: message,
        sentAt: new Date(),
      },
    });

    return NextResponse.json(guest, { status: 200 });
  } catch (error: any) {
    console.error("Error updating guest:", error);
    return NextResponse.json(
      { error: "Failed to update guest" },
      { status: 500 }
    );
  }
}
