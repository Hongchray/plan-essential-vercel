import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ✅ await since it's a Promise
  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const per_page = parseInt(searchParams.get("per_page") || "10", 10);
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") || "desc";

  try {
    // 1️⃣ Get total gifts count and sum of amounts
    const aggregates = await prisma.gift.aggregate({
      where: { eventId: id },
      _count: true, // total gifts
      _sum: { amount: true }, // sum of gift amounts
    });

    // 2️⃣ Fetch paginated gifts
    const data = await prisma.gift.findMany({
      where: { eventId: id },
      include: {
        guest: {
          include: {
            guestTag: { include: { tag: true } },
            guestGroup: { include: { group: true } },
          },
        },
      },
      skip: (page - 1) * per_page,
      take: per_page,
      orderBy: { [sort]: order },
    });

    return NextResponse.json(
      {
        message: "Get data successfully",
        data,
        meta: {
          total: aggregates._count, // total gifts
          page,
          per_page,
          pageCount: Math.ceil((aggregates._count ?? 0) / per_page),
        },
        aggregates: {
          received: aggregates._count ?? 0,
          value: aggregates._sum.amount ?? 0,
        },
      },
      { status: 200 }
    );
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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ✅ await here too
  const { guestId, note, payment_type, currency_type, amount } =
    await req.json();

  const gift = await prisma.gift.create({
    data: {
      eventId: id,
      guestId,
      note,
      payment_type,
      currency_type,
      amount,
    },
  });

  return NextResponse.json(gift);
}
