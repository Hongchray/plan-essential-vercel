import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const eventTemplate = await prisma.eventTemplate.findFirst({
    where: { eventId: id, isDefault: true },
    include: {
      template: true,
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
