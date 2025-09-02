import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const group = await prisma.group.findMany({
        where: { eventId: id },
    });

    if (group) {
        return NextResponse.json(group, { status: 200 });
    } else {
        return NextResponse.json({ message: "group not found" }, { status: 404 });
    }
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const { name_en, name_kh } = await req.json();
    const group = await prisma.group.create({
        data: {
            name_en,
            name_kh,
            eventId: id,
        },
    });

    if (group) {
        return NextResponse.json(group, { status: 200 });
    } else {
        return NextResponse.json({ message: "group not found" }, { status: 404 });
    }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const group = await prisma.group.delete({
        where: { id },
    });

    if (group) {
        return NextResponse.json(group, { status: 200 });
    } else {
        return NextResponse.json({ message: "group not found" }, { status: 404 });
    }
}
