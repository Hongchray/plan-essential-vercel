import { GroupEnglish, GroupKhmer } from "@/enums/groups";
import { TagEnglish, TagKhmer } from "@/enums/tags";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // if using NextAuth
import { authOptions } from "@/lib/authOptions"; // your auth config
export async function POST(req: Request) {
  const data = await req.json();
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  // Extract schedule data from the request
  const { schedule, ...eventData } = data;

  try {
    // Create event first
    const event = await prisma.event.create({
      data: {
        ...eventData,
        userId: session.user.id,
      },
    });

    // Create event groups
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
      ],
    });

    // Create event tags
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
      ],
    });

    // Create schedule if provided
    if (schedule && schedule.shifts && schedule.shifts.length > 0) {
      await prisma.schedule.create({
        data: {
          eventId: event.id,
          shifts: {
            create: schedule.shifts.map((shift: any) => ({
              name: shift.name,
              date: shift.date,
              timeLine: {
                create: shift.timelines.map((timeline: any) => ({
                  name: timeline.name,
                  time: timeline.time,
                })),
              },
            })),
          },
        },
      });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      {
        message: "Failed to create event",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Get logged-in user dynamically
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const currentUser = {
    id: session.user.id,
    role: session.user.role, // assume you store role in user object
  };

  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const per_page = parseInt(searchParams.get("per_page") || "10");
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "createdAt";
  const order = (searchParams.get("order") as "asc" | "desc") || "desc";

  try {
    const where: any = {};

    // Filter by userId if not admin
    if (currentUser.role !== "admin") {
      where.userId = currentUser.id;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const total = await prisma.event.count({ where });
    const events = await prisma.event.findMany({
      where,
      skip: (page - 1) * per_page,
      take: per_page,
      orderBy: { [sort]: order },
      include: {
        user: { select: { id: true, name: true, email: true } },
        // Include schedule data in list view (optional)
        schedules: {
          include: {
            shifts: {
              include: {
                timeLine: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      message: "Get data successfully",
      data: events,
      meta: { total, page, per_page, pageCount: Math.ceil(total / per_page) },
    });
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