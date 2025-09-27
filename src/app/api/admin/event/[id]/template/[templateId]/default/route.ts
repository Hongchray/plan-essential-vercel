import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string; templateId: string }> }
) {
  const { id, templateId } = await context.params;
  const eventTemplate = await prisma.eventTemplate.update({
    where: { id: templateId, eventId: id },
    data: {
      isDefault: true,
    },
  });
  await prisma.eventTemplate.updateMany({
    where: {
      eventId: id,
      NOT: { id: templateId },
    },
    data: { isDefault: false },
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
