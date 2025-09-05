import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET( req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const per_page = parseInt(searchParams.get("per_page") || "10");
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";
    try {
        const total = await prisma.gift.count({
            where: {
                eventId: id,
            },
        });

        const data = await prisma.gift.findMany({
            where: {
                eventId: id,
            },
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

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { guestId, note, payment_type, currency_type, amount } = await req.json();
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
