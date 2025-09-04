import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, context: { params: Promise<{ guestId: string }> }) {
    const { guestId } = await context.params;
    const guest = await prisma.guest.findUnique({
        where: { id: guestId },
        include: {
            guestTag: { include: { tag: true } },
            guestGroup: { include: { group: true } },
        },
    });
    if (guest) {

        const transformedGuest = {
            ...guest,
            tags: guest.guestTag.map(gt => gt.tag.id),
            groups: guest.guestGroup.map(gg => gg.group.id),
        };

        return NextResponse.json(transformedGuest, { status: 200 });
    } else {
        return NextResponse.json({ message: "guest not found" }, { status: 404 });
    }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ guestId: string }> }) {
    const { guestId } = await context.params;
    const data = await req.json();

    try {
        //Delete guestTag
        await prisma.guestTag.deleteMany({
            where: { guestId },
        });
        //Delete guestGroup
        await prisma.guestGroup.deleteMany({
            where: { guestId },
        });
        const response = await prisma.guest.update({
        where: { id: guestId },
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            note: data.note,
            address: data.address,
            image: data.image,
            guestTag: {
                create: data.tags.map((tagId: string) => ({
                    tag: { connect: { id: tagId } },
                })),
            },
            guestGroup: {
                create: data.groups.map((groupId: string) => ({
                    group: { connect: { id: groupId } },
                })),
            },
        },
        include: {
            guestTag: { include: { tag: true } },
            guestGroup: { include: { group: true } },
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

export async function DELETE(req: NextRequest, context: { params: Promise<{ guestId: string }> }) {
    const { guestId } = await context.params;

    //Delete guestTag
    await prisma.guestTag.deleteMany({
        where: { guestId },
    });
    //Delete guestGroup
    await prisma.guestGroup.deleteMany({
        where: { guestId },
    });
    const group = await prisma.guest.delete({
        where: { id: guestId },
    });

    if (group) {
        return NextResponse.json(group, { status: 200 });
    } else {
        return NextResponse.json({ message: "guest not found" }, { status: 404 });
    }
}
