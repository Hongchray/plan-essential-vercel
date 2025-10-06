import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Role } from "@/enums/roles";
import { Plan } from "@/interfaces/plan";

export async function GET(req: Request, context: any) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    let isFreePlan = false;

    if (session.user.role !== Role.ADMIN) {
      // check plan
      if (session.user?.plans?.length) {
        const plan = session.user.plans[0] as Plan;
        if (plan.price === 0) {
          isFreePlan = true;
        }
      } else {
        return NextResponse.json(
          { success: false, message: "Not authorized" },
          { status: 403 }
        );
      }
    }

    const { id: eventId } = await context.params;

    // ✅ Dynamic condition
    const whereCondition = isFreePlan ? { isFree: true } : {};

    const templates = await prisma.template.findMany({
      where: whereCondition,
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
