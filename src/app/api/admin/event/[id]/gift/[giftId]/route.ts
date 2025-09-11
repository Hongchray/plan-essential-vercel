import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, context: { params: Promise<{ giftId: string }> }) {
    const { giftId } = await context.params;
    const gift = await prisma.gift.findUnique({
        where: { id: giftId },
    });
    if (gift) {

        return NextResponse.json(gift, { status: 200 });
    } else {
        return NextResponse.json({ message: "guest not found" }, { status: 404 });
    }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ giftId: string }> }) {
    const { giftId } = await context.params;
    const data = await req.json();

    try {
        const response = await prisma.gift.update({
        where: { id: giftId },
            data:{
                note: data.note,
                payment_type: data.payment_type,
                currency_type: data.currency_type,
                amount: data.amount,
            }
        });

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
        {
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ giftId: string }> }) {
    const { giftId } = await context.params;

    //Delete guestTag
    const gift = await prisma.gift.delete({
        where: { id: giftId },
    });

    return NextResponse.json(gift, { status: 200 });
}

