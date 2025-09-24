import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const template = await prisma.template.findUnique({
    where: { id },
  });

  if (template) {
    return NextResponse.json(template, { status: 200 });
  } else {
    return NextResponse.json(
      { message: "Template not found" },
      { status: 404 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const data = await req.json();
  const template = await prisma.template.update({
    where: { id },
    data,
  });

  if (template) {
    return NextResponse.json(template, { status: 200 });
  } else {
    return NextResponse.json(
      { message: "Template not found" },
      { status: 404 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  //delete ralated template
  await prisma.eventTemplate.deleteMany({
    where: { templateId: id },
  });
  const template = await prisma.template.delete({
    where: { id },
  });

  if (template) {
    return NextResponse.json(template, { status: 200 });
  } else {
    return NextResponse.json(
      { message: "Template not found" },
      { status: 404 }
    );
  }
}
