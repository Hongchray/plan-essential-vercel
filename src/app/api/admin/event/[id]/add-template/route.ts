import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Params {
  id: string;
}

export async function GET(req: Request, context: any) {
  try {
    const { id: eventId } = await context.params;

    const templates = await prisma.template.findMany({
      orderBy: { createdAt: "desc" },
    });

    const addedTemplates = await prisma.eventTemplate.findMany({
      where: { eventId },
      select: { templateId: true },
    });

    const addedTemplateIds = new Set(addedTemplates.map((t) => t.templateId));

    const templatesWithAddedFlag = templates.map((tpl) => ({
      ...tpl,
      added: addedTemplateIds.has(tpl.id),
    }));

    return NextResponse.json({ success: true, data: templatesWithAddedFlag });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request, context: any) {
  try {
    const { id: eventId } = await context.params; // ✅ await here
    const { templateId } = await req.json();

    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return NextResponse.json(
        { success: false, message: "Template not found" },
        { status: 404 }
      );
    }

    const existing = await prisma.eventTemplate.findFirst({
      where: { eventId, templateId },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Template already added to this event" },
        { status: 400 }
      );
    }

    const eventTemplate = await prisma.eventTemplate.create({
      data: {
        eventId,
        templateId,
        config: template.defaultConfig || {},
      },
    });

    return NextResponse.json({ success: true, data: eventTemplate });
  } catch (error) {
    console.error("Error adding template to event:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add template" },
      { status: 500 }
    );
  }
}
