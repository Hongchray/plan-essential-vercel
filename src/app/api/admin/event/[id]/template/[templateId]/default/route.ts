import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ eventId: string; templateId: string }> }
) {
  const { eventId, templateId } = await context.params;
  const eventTemplate = await prisma.eventTemplate.update({
    where: { id: templateId },
    data: {
      isDefault: true,
    },
  });
  await prisma.eventTemplate.updateMany({
    where: {
      eventId: eventId,
      id: { not: templateId },
    },
    data: {
      isDefault: false,
    },
  });

  if (eventTemplate) {
    return NextResponse.json(eventTemplate, { status: 200 });
  } else {
    return NextResponse.json(
      { message: "template not found" },
      { status: 404 }
    );
  }
}
