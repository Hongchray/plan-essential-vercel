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
