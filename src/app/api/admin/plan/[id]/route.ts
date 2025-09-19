import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const plan = await prisma.plan.findUnique({
    where: { id },
  });

  if (plan) {
    return NextResponse.json(plan, { status: 200 });
  } else {
    return NextResponse.json({ message: "plan not found" }, { status: 404 });
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const data = await req.json();
  const plan = await prisma.plan.update({
    where: { id },
    data,
  });

  if (plan) {
    return NextResponse.json(plan, { status: 200 });
  } else {
    return NextResponse.json({ message: "plan not found" }, { status: 404 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const plan = await prisma.plan.delete({
    where: { id },
  });

  if (plan) {
    return NextResponse.json(plan, { status: 200 });
  } else {
    return NextResponse.json({ message: "plan not found" }, { status: 404 });
  }
}
