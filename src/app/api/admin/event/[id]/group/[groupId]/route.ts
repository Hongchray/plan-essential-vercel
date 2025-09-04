import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, context: { params: Promise<{ groupId: string }> }) {
    const { groupId } = await context.params;
    const { name_en, name_kh } = await req.json();
    const group = await prisma.group.update({
        where: {id: groupId },
        data: {
            name_en,
            name_kh,
        },
    });

    if (group) {
        return NextResponse.json(group, { status: 200 });
    } else {
        return NextResponse.json({ message: "group not found" }, { status: 404 });
    }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ groupId: string }> }) {
    const { groupId } = await context.params;

    //TODO::check if has been used
    const group = await prisma.group.delete({
        where: { id: groupId },
    });

    if (group) {
        return NextResponse.json(group, { status: 200 });
    } else {
        return NextResponse.json({ message: "group not found" }, { status: 404 });
    }
}
