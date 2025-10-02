import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const passwordSchema = z.object({
  phone: z.string().min(1, { message: "setup_password.error_phone_required" }),
  password: z
    .string()
    .min(8, { message: "setup_password.error_password_too_short" })
    .regex(/[a-z]/, {
      message: "setup_password.error_password_missing_lowercase",
    })
    .regex(/[A-Z]/, {
      message: "setup_password.error_password_missing_uppercase",
    })
    .regex(/[0-9]/, {
      message: "setup_password.error_password_missing_number",
    }),
  name: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, password, name } = passwordSchema.parse(body);

    // Find user by phone
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      return NextResponse.json(
        { error: "setup_password.error_user_not_found" },
        { status: 404 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user info
    const updatedUser = await prisma.user.update({
      where: { phone },
      data: {
        password: hashedPassword,
        name: name || user.name,
      },
    });

    // Check if user already has a plan
    const userPlan = await prisma.userPlan.findFirst({
      where: { userId: user.id },
    });

    // Assign free plan if no plan exists
    if (!userPlan) {
      const freePlan = await prisma.plan.findFirst({ where: { price: 0 } });

      if (freePlan) {
        await prisma.userPlan.create({
          data: {
            userId: user.id,
            planId: freePlan.id,
            limit_guests: 50, // default limits
            limit_template: 1,
            limit_export_excel: false,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "setup_password.success_account_created",
      user: updatedUser,
    });
  } catch (err: any) {
    console.error("❌ Set Password error:", err);

    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "setup_password.error_server" },
      { status: 500 }
    );
  }
}
