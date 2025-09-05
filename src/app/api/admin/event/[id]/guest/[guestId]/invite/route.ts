import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, context: { params: Promise<{ guestId: string }> }) {
    const { guestId } = await context.params;
    try {
        const response = await prisma.guest.update({
        where: { id: guestId },
        data: {
            is_invited: true,
        },
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
