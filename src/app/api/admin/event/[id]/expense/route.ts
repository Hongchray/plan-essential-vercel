import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const per_page = parseInt(searchParams.get("per_page") || "10");
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") || "desc";

  try {
    const total = await prisma.expense.count({
      where: {
        eventId: id,
        OR: [{ name: { contains: search, mode: "insensitive" } }],
      },
    });

    const data = await prisma.expense.findMany({
      where: {
        eventId: id,
        OR: [{ name: { contains: search, mode: "insensitive" } }],
      },
      skip: (page - 1) * per_page,
      take: per_page,
      orderBy: { [sort]: order },
      include: {
        payments: {
          orderBy: {
            paidAt: "desc",
          },
        },
      },
    });

    const response = {
      message: "Get data successfully",
      data: data,
      meta: {
        total,
        page,
        per_page,
        pageCount: Math.ceil(total / per_page),
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await context.params;
    const body = await request.json();
    const { name, description, budget_amount, payments = [] } = body;

    // Calculate actual_amount from payments
    const actual_amount = payments.reduce((sum: number, payment: any) => {
      return sum + (Number(payment.amount) || 0);
    }, 0);

    // First create the expense
    const expense = await prisma.expense.create({
      data: {
        eventId,
        name,
        description,
        budget_amount: Number(budget_amount),
        actual_amount: actual_amount,
      },
    });

    // Then create the payments if any
    if (payments.length > 0) {
      await prisma.expensePayment.createMany({
        data: payments.map((payment: any) => ({
          expenseId: expense.id,
          name: payment.name,
          amount: Number(payment.amount),
          paidAt: payment.paidAt ? new Date(payment.paidAt) : new Date(),
          note: payment.note || null,
        })),
      });
    }

    // Return the expense with payments
    const expenseWithPayments = await prisma.expense.findUnique({
      where: { id: expense.id },
      include: {
        payments: true,
      },
    });

    return NextResponse.json(expenseWithPayments, { status: 201 });
  } catch (error: any) {
    console.error("Error creating expense:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
