import { GroupEnglish, GroupKhmer } from "@/enums/groups";
import { TagEnglish, TagKhmer } from "@/enums/tags";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
    const data = await req.json();
    //get user id 
    const user = await prisma.user.findFirst();
    const event = await prisma.event.create({
        data: {
            ...data,
            userId: user?.id,
        },
    });

    //create event groups
    await prisma.group.createMany({
        data: [
            {
                name_en: GroupEnglish.GROOM_SIDE,
                name_kh: GroupKhmer.GROOM_SIDE,
                eventId: event.id,
            },
            {
                name_en: GroupEnglish.BRIDE_SIDE,
                name_kh: GroupKhmer.BRIDE_SIDE,
                eventId: event.id,
            },
        ]
    });
    //create event tags
    await prisma.tag.createMany({
        data: [
            {
                name_en: TagEnglish.HIGH_SCHOOL_FRIEND,
                name_kh: TagKhmer.HIGH_SCHOOL_FRIEND,
                eventId: event.id,
            },
            {
                name_en: TagEnglish.COLLEGE_FRIEND,
                name_kh: TagKhmer.COLLEGE_FRIEND,
                eventId: event.id,
            },
            {
                name_en: TagEnglish.FRIEND,
                name_kh: TagKhmer.FRIEND,
                eventId: event.id,
            },
            {
                name_en: TagEnglish.TEAMWORK,
                name_kh: TagKhmer.TEAMWORK,
                eventId: event.id,
            },
            {
                name_en: TagEnglish.RELATIVE,
                name_kh: TagKhmer.RELATIVE,
                eventId: event.id,
            },
            {
                name_en: TagEnglish.OTHERS,
                name_kh: TagKhmer.OTHERS,
                eventId: event.id,
            },
        ]
    });

    return NextResponse.json(event, { status: 200 })
}

export async function GET(req: NextRequest) {
    const event = await prisma.event.findMany();
    return NextResponse.json({ event }, { status: 200 })
}