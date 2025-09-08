import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GuestStatus } from "@/enums/guests";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } // <--- params is now a Promise
) {
  try {
    const { id } = await context.params; // <--- await the params

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        user: true,
        schedules: true,
        eventTemplates: true,
        guests: true,
        tags: true,
        groups: true,
        expenses: true,
        gifts: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const total_guest = event.guests.length;
    const total_gift = event.gifts.length;

    const guestStatusData = [
      {
        name: "Confirmed",
        value: event.guests.filter((g) => g.status === GuestStatus.CONFIRMED)
          .length,
        color: "#10b981",
      },
      {
        name: "Pending",
        value: event.guests.filter((g) => g.status === GuestStatus.PENDING)
          .length,
        color: "#f59e0b",
      },
      {
        name: "Declined",
        value: event.guests.filter((g) => g.status === GuestStatus.REJECTED)
          .length,
        color: "#ef4444",
      },
    ];

    const guest_summary = event.guests.reduce(
      (acc, guest) => {
        if (guest.status === GuestStatus.CONFIRMED) acc.confirmed++;
        else if (guest.status === GuestStatus.PENDING) acc.pending++;
        else if (guest.status === GuestStatus.REJECTED) acc.declined++;
        return acc;
      },
      { confirmed: 0, pending: 0, declined: 0 }
    );

    const total_gift_income = event.gifts.reduce(
      (sum, exp) => sum + (exp.amount || 0),
      0
    );

    const total_expend_actual = event.expenses.reduce(
      (sum, exp) => sum + (exp.actual_amount || 0),
      0
    );

    const total_expend_budget = event.expenses.reduce(
      (sum, exp) => sum + (exp.budget_amount || 0),
      0
    );

    const netAmount = total_gift_income - total_expend_actual;

    const total_confirmed = event.guests.filter(
      (g) => g.status === GuestStatus.CONFIRMED
    ).length;

    return NextResponse.json({
      ...event,
      total_guest,
      total_gift,
      guestStatusData,
      total_expend_actual,
      total_expend_budget,
      total_confirmed,
      guest_summary,
      total_gift_income,
      netAmount,
    });
  } catch (error: any) {
    console.error("Error fetching event dashboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch event dashboard" },
      { status: 500 }
    );
  }
}
