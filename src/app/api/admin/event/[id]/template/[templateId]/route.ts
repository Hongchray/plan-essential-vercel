import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ templateId: string }> }
) {
  const { templateId } = await context.params;
  const eventTemplate = await prisma.eventTemplate.findUnique({
    where: { id: templateId },
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
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ templateId: string }> }
) {
  const { templateId } = await context.params;
  const { config } = await req.json();
  const eventTemplate = await prisma.eventTemplate.update({
    where: { id: templateId },
    data: {
      config,
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
