import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function GET( req: NextRequest, context: { params: Promise<{ id: string }> }) {
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
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                ],
            },
        });

        const data = await prisma.expense.findMany({
            where: {
                eventId: id,
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                ],
            },
            skip: (page - 1) * per_page,
            take: per_page,
            orderBy: { [sort]: order },
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
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const data = await req.json();
  try {
    const response = await prisma.expense.create({
      data: {
        name: data.name,
        budget_amount: data.budget_amount,
        actual_amount: data.actual_amount,
        description: data.description,
        eventId: id,
      },
    });
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
