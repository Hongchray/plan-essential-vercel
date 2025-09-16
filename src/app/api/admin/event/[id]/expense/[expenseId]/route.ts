import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string; expenseId: string }> }
) {
  try {
    const { expenseId } = await context.params;

    const expense = await prisma.expense.findUnique({
      where: {
        id: expenseId,
      },
      include: {
        payments: {
          orderBy: {
            paidAt: "desc",
          },
        },
      },
    });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error("Error fetching expense:", error);
    return NextResponse.json(
      { error: "Failed to fetch expense" },
      { status: 500 }
    );
  }
}
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string; expenseId: string }> }
) {
  try {
    const { expenseId } = await context.params;
    const body = await request.json();
    const { name, description, budget_amount, payments = [] } = body;

    // Calculate actual_amount from payments
    const actual_amount = payments.reduce((sum: number, payment: any) => {
      return sum + (Number(payment.amount) || 0);
    }, 0);

    // Get existing payments to determine which ones to delete
    const existingExpense = await prisma.expense.findUnique({
      where: { id: expenseId },
      include: { payments: true },
    });

    if (!existingExpense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Update the expense basic info
    await prisma.expense.update({
      where: { id: expenseId },
      data: {
        name,
        description,
        budget_amount: Number(budget_amount),
        actual_amount: actual_amount,
      },
    });

    // Get payment IDs from the request
    const submittedPaymentIds = payments
      .filter((p: any) => p.id)
      .map((p: any) => p.id);

    // Delete payments that are no longer in the submitted list
    const paymentsToDelete = existingExpense.payments.filter(
      (p) => !submittedPaymentIds.includes(p.id)
    );

    if (paymentsToDelete.length > 0) {
      await prisma.expensePayment.deleteMany({
        where: {
          id: {
            in: paymentsToDelete.map((p) => p.id),
          },
        },
      });
    }

    // Process each submitted payment
    for (const payment of payments) {
      if (payment.id) {
        // Update existing payment
        await prisma.expensePayment.update({
          where: { id: payment.id },
          data: {
            name: payment.name,
            amount: Number(payment.amount),
            paidAt: payment.paidAt ? new Date(payment.paidAt) : new Date(),
            note: payment.note || null,
          },
        });
      } else {
        // Create new payment
        await prisma.expensePayment.create({
          data: {
            expenseId: expenseId,
            name: payment.name,
            amount: Number(payment.amount),
            paidAt: payment.paidAt ? new Date(payment.paidAt) : new Date(),
            note: payment.note || null,
          },
        });
      }
    }

    // Return updated expense with payments
    const updatedExpense = await prisma.expense.findUnique({
      where: { id: expenseId },
      include: {
        payments: {
          orderBy: {
            paidAt: "desc",
          },
        },
      },
    });

    return NextResponse.json(updatedExpense);
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; expenseId: string }> }
) {
  try {
    const { expenseId } = await context.params;

    // Check if expense exists
    const existingExpense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!existingExpense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Delete all payments first (if not using cascade delete)
    await prisma.expensePayment.deleteMany({
      where: { expenseId: expenseId },
    });

    // Delete the expense
    await prisma.expense.delete({
      where: { id: expenseId },
    });

    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
