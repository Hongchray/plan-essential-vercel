// File: app/api/admin/user/[id]/plan/[planId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT /api/admin/user/[id]/plan/[planId] - Update user plan limits
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; planId: string } }
) {
  try {
    const userId = params.id;
    const userPlanId = params.planId;
    const body = await request.json();
    const { limit_guests, limit_template, limit_export_excel } = body;

    // Check if user plan exists
    const existingUserPlan = await prisma.userPlan.findUnique({
      where: {
        id: userPlanId,
      },
      include: {
        plan: true,
      },
    });

    if (!existingUserPlan || existingUserPlan.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "User plan not found" },
        { status: 404 }
      );
    }

    // Update user plan
    const updatedUserPlan = await prisma.userPlan.update({
      where: {
        id: userPlanId,
      },
      data: {
        limit_guests:
          limit_guests !== undefined
            ? limit_guests
            : existingUserPlan.limit_guests,
        limit_template:
          limit_template !== undefined
            ? limit_template
            : existingUserPlan.limit_template,
        limit_export_excel:
          limit_export_excel !== undefined
            ? limit_export_excel
            : existingUserPlan.limit_export_excel,
      },
      include: {
        plan: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUserPlan,
      message: "Plan limits updated successfully",
    });
  } catch (error) {
    console.error("Error updating user plan:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update plan limits" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/user/[id]/plan/[planId] - Remove plan from user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; planId: string } }
) {
  try {
    const userId = params.id;
    const userPlanId = params.planId;

    // Check if user plan exists
    const existingUserPlan = await prisma.userPlan.findUnique({
      where: {
        id: userPlanId,
      },
    });

    if (!existingUserPlan || existingUserPlan.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "User plan not found" },
        { status: 404 }
      );
    }

    // Delete user plan
    await prisma.userPlan.delete({
      where: {
        id: userPlanId,
      },
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
