// File: app/api/admin/user/[id]/plan/[planId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface UpdatePlanBody {
  planId?: string;
  limit_guests?: number;
  limit_template?: number;
  limit_export_excel?: boolean;
}

// PUT /api/admin/user/[id]/plan/[planId] - Update user plan limits
export async function PUT(
  request: NextRequest,
  context: any // Let Next.js infer types
) {
  try {
    const { id: userId, planId: userPlanId } = context.params as {
      id: string;
      planId: string;
    };

    const body: UpdatePlanBody = await request.json();
    const {
      planId: newPlanId, // allow updating to a new plan
      limit_guests,
      limit_template,
      limit_export_excel,
    } = body;

    const existingUserPlan = await prisma.userPlan.findUnique({
      where: { id: userPlanId },
      include: { plan: true },
    });

    if (!existingUserPlan || existingUserPlan.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "User plan not found" },
        { status: 404 }
      );
    }

    const updatedUserPlan = await prisma.userPlan.update({
      where: { id: userPlanId },
      data: {
        planId: newPlanId ?? existingUserPlan.planId, // ✅ allow plan change
        limit_guests: limit_guests ?? existingUserPlan.limit_guests,
        limit_template: limit_template ?? existingUserPlan.limit_template,
        limit_export_excel:
          limit_export_excel ?? existingUserPlan.limit_export_excel,
      },
      include: { plan: true },
    });

    return NextResponse.json({
      success: true,
      data: updatedUserPlan,
      message: "Plan updated successfully",
    });
  } catch (error) {
    console.error("Error updating user plan:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update plan" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/user/[id]/plan/[planId] - Remove plan from user
export async function DELETE(request: NextRequest, context: any) {
  try {
    const { id: userId, planId: userPlanId } = context.params as {
      id: string;
      planId: string;
    };

    const existingUserPlan = await prisma.userPlan.findUnique({
      where: { id: userPlanId },
    });

    if (!existingUserPlan || existingUserPlan.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "User plan not found" },
        { status: 404 }
      );
    }

    await prisma.userPlan.delete({
      where: { id: userPlanId },
    });

    return NextResponse.json({
      success: true,
      message: "Plan removed successfully",
    });
  } catch (error) {
    console.error("Error removing user plan:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove plan" },
      { status: 500 }
    );
  }
}
