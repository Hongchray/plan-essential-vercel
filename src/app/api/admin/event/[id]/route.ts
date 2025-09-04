import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (event) {
    return NextResponse.json(event, { status: 200 });
  } else {
    return NextResponse.json({ message: "event not found" }, { status: 404 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const data = await req.json();
  const event = await prisma.event.update({
    where: { id },
    data,
  });

  if (event) {
    return NextResponse.json(event, { status: 200 });
  } else {
    return NextResponse.json({ message: "event not found" }, { status: 404 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const event = await prisma.event.delete({
    where: { id },
  });

  if (event) {
    //delete event groups
    await prisma.group.deleteMany({
      where: {
        eventId: id,
      },
    });
    //delete event tags
    await prisma.tag.deleteMany({
      where: {
        eventId: id,
      },
    });
    //delete event schedules
    await prisma.schedule.deleteMany({
      where: {
        eventId: id,
      },
    });
    //delete event templates
    await prisma.eventTemplate.deleteMany({
      where: {
        eventId: id,
      },
    });
    //delete guests
    await prisma.guest.deleteMany({
      where: {
        eventId: id,
      },
    });

    return NextResponse.json(event, { status: 200 });
  } else {
    return NextResponse.json({ message: "event not found" }, { status: 404 });
  }
}
