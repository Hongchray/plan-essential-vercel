import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const per_page = parseInt(searchParams.get("per_page") || "10", 10);
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "createdAt";
    const order = (searchParams.get("order") as "asc" | "desc") || "desc";

    // 1️⃣ Aggregate total gifts
    const overall = await prisma.gift.aggregate({
      where: { eventId: id },
      _count: true,
      _sum: {
        amount_khr: true,
        amount_usd: true,
      },
    });

    // 2️⃣ Group by currency_type
    const byCurrency = await prisma.gift.groupBy({
      by: ["currency_type"],
      where: { eventId: id },
      _count: { _all: true },
      _sum: {
        amount_khr: true,
        amount_usd: true,
      },
    });

    // 3️⃣ Paginated gifts
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

    // 4️⃣ Prepare safe aggregates
    const safeByCurrency = byCurrency.map((bc) => ({
      ...bc,
      _sum: {
        amount_khr: bc._sum?.amount_khr ?? 0,
        amount_usd: bc._sum?.amount_usd ?? 0,
      },
    }));

    return NextResponse.json(
      {
        message: "Get data successfully",
        data,
        meta: {
          total: overall._count, // total gifts
          page,
          per_page,
          pageCount: Math.ceil((overall._count ?? 0) / per_page),
        },
        aggregates: {
          received: overall._count ?? 0,
          by_currency: safeByCurrency,
          total_amount_khr: overall._sum?.amount_khr ?? 0,
          total_amount_usd: overall._sum?.amount_usd ?? 0,
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
  const { guestId, note, payment_type, currency_type, amount_usd, amount_khr } =
    await req.json();

  const gift = await prisma.gift.create({
    data: {
      eventId: id,
      guestId,
      note,
      payment_type,
      currency_type,
      amount_usd,
      amount_khr,
    },
  });

  return NextResponse.json(gift);
}
