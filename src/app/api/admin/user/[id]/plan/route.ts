import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/admin/user/[id]/plan
export async function GET(
  request: NextRequest,
  context: { params: { userId: string } } // <-- params is a plain object
) {
  try {
    const { userId } = context.params;

    const userPlans = await prisma.userPlan.findMany({
      where: { userId },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: userPlans });
  } catch (error) {
    console.error("Error fetching user plans:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user plans" },
      { status: 500 }
    );
  }
}

// POST /api/admin/user/[id]/plan
export async function POST(
  request: NextRequest,
  context: { params: { userId: string } } // <-- match GET
) {
  try {
    const { userId } = context.params;
    const body = await request.json();
    const { planId, limit_guests, limit_template, limit_export_excel } = body;

    if (!planId)
      return NextResponse.json(
        { success: false, error: "Plan ID required" },
        { status: 400 }
      );

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );

    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan)
      return NextResponse.json(
        { success: false, error: "Plan not found" },
        { status: 404 }
      );

    const existingUserPlan = await prisma.userPlan.findFirst({
      where: { userId, planId },
    });
    if (existingUserPlan)
      return NextResponse.json(
        { success: false, error: "User already has this plan" },
        { status: 400 }
      );

    const userPlan = await prisma.userPlan.create({
      data: {
        userId,
        planId,
        limit_guests: limit_guests || 0,
        limit_template: limit_template || 0,
        limit_export_excel: limit_export_excel || false,
      },
      include: { plan: true },
    });

    return NextResponse.json({
      success: true,
      data: userPlan,
      message: "Plan assigned successfully",
    });
  } catch (error) {
    console.error("Error assigning plan:", error);
    return NextResponse.json(
      { success: false, error: "Failed to assign plan" },
      { status: 500 }
    );
  }
}
