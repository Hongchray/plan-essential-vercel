import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const tag = await prisma.tag.findMany({
        where: { eventId: id },
    });

    if (tag) {
        return NextResponse.json(tag, { status: 200 });
    } else {
        return NextResponse.json({ message: "tag not found" }, { status: 404 });
    }
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const { name_en, name_kh } = await req.json();
    const tag = await prisma.tag.create({
        data: {
            name_en,
            name_kh,
            eventId: id,
        },
    });

    if (tag) {
        return NextResponse.json(tag, { status: 200 });
    } else {
        return NextResponse.json({ message: "tag not found" }, { status: 404 });
    }
}

