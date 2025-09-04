import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, context: { params: Promise<{ expenseId: string }> }) {
    const { expenseId } = await context.params;
    const expense = await prisma.expense.findUnique({
        where: { id: expenseId },
    });

    if (expense) {
        return NextResponse.json(expense, { status: 200 });
    } else {
        return NextResponse.json({ message: "expense not found" }, { status: 404 });
    }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ expenseId: string }> }) {
    const { expenseId } = await context.params;
    const data = await req.json();
    const expense = await prisma.expense.update({
        where: { id: expenseId },
        data,
    });

    if (expense) {
        return NextResponse.json(expense, { status: 200 });
    } else {
        return NextResponse.json({ message: "expense not found" }, { status: 404 });
    }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ expenseId: string }> }) {
    const { expenseId } = await context.params;
    const expense = await prisma.expense.delete({
        where: { id: expenseId },
    });

    if (expense) {
        return NextResponse.json(expense, { status: 200 });
    } else {
        return NextResponse.json({ message: "expense not found" }, { status: 404 });
    }
}