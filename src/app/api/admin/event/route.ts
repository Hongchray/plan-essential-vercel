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
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const per_page = parseInt(searchParams.get("per_page") || "10");
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";

    try {
        const total = await prisma.event.count({
        where: {
            OR: [
            { name: { contains: search, mode: "insensitive" } },
            ],
        },
        });

        const game = await prisma.event.findMany({
        where: {
            OR: [
            { name: { contains: search, mode: "insensitive" } },

            ],
        },
        skip: (page - 1) * per_page,
        take: per_page,
        orderBy: { [sort]: order },
        });

        const response = {
        message: "Get data successfully",
        data: game,
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