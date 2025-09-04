import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, context: { params: Promise<{ tagId: string }> }) {
    const { tagId } = await context.params;
    const { name_en, name_kh } = await req.json();
    const tag = await prisma.tag.update({
        where: {id: tagId },
        data: {
            name_en,
            name_kh,
        },
    });

    if (tag) {
        return NextResponse.json(tag, { status: 200 });
    } else {
        return NextResponse.json({ message: "tag not found" }, { status: 404 });
    }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ tagId: string }> }) {
    const { tagId } = await context.params;

    //TODO::check if has been used
    const tag = await prisma.tag.delete({
        where: { id: tagId },
    });

    if (tag) {
        return NextResponse.json(tag, { status: 200 });
    } else {
        return NextResponse.json({ message: "tag not found" }, { status: 404 });
    }
}
