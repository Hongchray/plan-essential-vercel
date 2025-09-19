import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
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

    if (event) {
      return NextResponse.json(event, { status: 200 });
    } else {
      return NextResponse.json({ message: "event not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch event",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const data = await req.json();

    // Extract schedule data from the request
    const { schedule, ...eventData } = data;

    // Update event data first
    const event = await prisma.event.update({
      where: { id },
      data: eventData,
    });

    // Handle schedule update/creation
    if (schedule) {
      // First, find existing schedule
      const existingSchedule = await prisma.schedule.findFirst({
        where: { eventId: id },
      });

      if (existingSchedule) {
        // Delete existing timelines first (due to foreign key constraints)
        await prisma.timeline.deleteMany({
          where: {
            shift: {
              scheduleId: existingSchedule.id,
            },
          },
        });

        // Delete existing shifts
        await prisma.shift.deleteMany({
          where: { scheduleId: existingSchedule.id },
        });

        // Delete the schedule
        await prisma.schedule.delete({
          where: { id: existingSchedule.id },
        });
      }

      // Create new schedule if shifts are provided
      if (schedule.shifts && schedule.shifts.length > 0) {
        await prisma.schedule.create({
          data: {
            eventId: id,
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
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      {
        message: "Failed to update event",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (event) {
      // Delete in proper order to handle foreign key constraints

      // Delete timeline records first
      await prisma.timeline.deleteMany({
        where: {
          shift: {
            schedule: {
              eventId: id,
            },
          },
        },
      });

      // Delete shift records
      await prisma.shift.deleteMany({
        where: {
          schedule: {
            eventId: id,
          },
        },
      });

      // Delete schedule records
      await prisma.schedule.deleteMany({
        where: {
          eventId: id,
        },
      });

      // Delete guest group associations
      await prisma.guestGroup.deleteMany({
        where: {
          group: {
            eventId: id,
          },
        },
      });

      // Delete guest tag associations
      await prisma.guestTag.deleteMany({
        where: {
          tag: {
            eventId: id,
          },
        },
      });

      // Delete guests
      await prisma.guest.deleteMany({
        where: {
          eventId: id,
        },
      });

      // Delete event groups
      await prisma.group.deleteMany({
        where: {
          eventId: id,
        },
      });

      // Delete event tags
      await prisma.tag.deleteMany({
        where: {
          eventId: id,
        },
      });

      // Delete event templates
      await prisma.eventTemplate.deleteMany({
        where: {
          eventId: id,
        },
      });

      // Finally delete the event
      await prisma.event.delete({
        where: { id },
      });

      return NextResponse.json(event, { status: 200 });
    } else {
      return NextResponse.json({ message: "event not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      {
        message: "Failed to delete event",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}