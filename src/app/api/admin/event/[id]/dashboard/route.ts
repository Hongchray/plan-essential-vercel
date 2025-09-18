import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GuestStatus } from "@/enums/guests";
import { EXCHANGE_RATES } from "@/utils/exchangeRates";

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
        name: "បានបញ្ជាក់",
        value: event.guests.filter((g) => g.status === GuestStatus.CONFIRMED)
          .length,
        color: "#10b981",
      },
      {
        name: "មិនទាន់ឆ្លើយតប",
        value: event.guests.filter((g) => g.status === GuestStatus.PENDING)
          .length,
        color: "#f59e0b",
      },
      {
        name: "បដិសេធ",
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

    //convert KHR to usd gift currency_type KHR
    const giftTotals = event.gifts.reduce((totals, gift) => {
      const currency = gift.currency_type;
      const amount = gift.amount_usd || 0;

      if (!totals[currency]) {
        totals[currency] = 0;
      }
      totals[currency] += amount;

      return totals;
    }, {} as Record<string, number>);

    const total_gift_income = event.gifts.reduce((sum, gift) => {
      if (gift.currency_type === "USD") {
        return sum + (gift.amount_usd ?? 0);
      }
      if (gift.currency_type === "KHR") {
        return sum + (gift.amount_khr ?? 0) * EXCHANGE_RATES.KHR_TO_USD;
      }
      return sum;
    }, 0);

    // --- Optionally keep raw totals per currency ---
    const total_income_usd = event.gifts
      .filter((g) => g.currency_type === "USD")
      .reduce((sum, g) => sum + (g.amount_usd ?? 0), 0);

    const total_income_khr = event.gifts
      .filter((g) => g.currency_type === "KHR")
      .reduce((sum, g) => sum + (g.amount_khr ?? 0), 0);

    // --- Calculate total expenditures ---
    const total_expend_actual = event.expenses.reduce(
      (sum, exp) => sum + (exp.actual_amount ?? 0),
      0
    );

    const total_expend_budget = event.expenses.reduce(
      (sum, exp) => sum + (exp.budget_amount ?? 0),
      0
    );

    // --- Net amount (USD equivalent) ---
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
      total_income_khr,
      total_income_usd,
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
