import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  if (action === "totalUsers") return getTotalUsers();
  if (action === "monthlyData") return getMonthlyData();
  if (action === "templates") return getTemplates();
  if (action === "events") return getEvents();

  if (!action || action === "all") {
    const [
      users,
      templates,
      events,
      monthlyData,
      weeklyActivity,
      upcomingEvents,
    ] = await Promise.all([
      getTotalUsersRaw(),
      getTemplatesRaw(),
      getEventsRaw(),
      getMonthlyDataRaw(),
      getWeeklyActivityRaw(),
      getUpcomingEventsRaw(), // <-- add this
    ]);

    return NextResponse.json({
      success: true,
      data: {
        users,
        templates,
        events,
        monthlyData,
        weeklyActivity,
        upcomingEvents,
      },
    });
  }

  return NextResponse.json(
    { success: false, error: "Invalid action" },
    { status: 400 }
  );
}

// --- Internal helpers returning JSON ---
async function getTotalUsers() {
  const users = await getTotalUsersRaw();
  return NextResponse.json({ success: true, data: users });
}
async function getTemplates() {
  const templates = await getTemplatesRaw();
  return NextResponse.json({ success: true, data: templates });
}
async function getEvents() {
  const events = await getEventsRaw();
  return NextResponse.json({ success: true, data: events });
}

// --- Raw versions returning plain data ---
async function getTotalUsersRaw() {
  const totalUsers = await prisma.user.count();

  const now = new Date();
  const firstDayOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );
  const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const usersLastMonth = await prisma.user.count({
    where: { createdAt: { gte: firstDayOfLastMonth, lte: lastDayOfLastMonth } },
  });

  const percentageChange =
    usersLastMonth > 0
      ? Math.round(((totalUsers - usersLastMonth) / usersLastMonth) * 100)
      : 0;

  return { totalUsers, percentageChange };
}

async function getTemplatesRaw() {
  return await prisma.template.count();
}

async function getEventsRaw() {
  return await prisma.event.count();
}

async function getMonthlyData() {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthlyData = months.map((month) => ({
    month,
    users: 0,
    templates: 0,
    earnings: 0,
  }));
  return NextResponse.json({ success: true, data: monthlyData });
}

async function getMonthlyDataRaw() {
  const users = await prisma.user.findMany({ select: { createdAt: true } });
  const counts: Record<number, number> = {};

  users.forEach((u) => {
    const month = u.createdAt.getMonth();
    counts[month] = (counts[month] || 0) + 1;
  });

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return months.map((month, i) => ({
    month,
    users: counts[i] || 0,
  }));
}

async function getWeeklyActivityRaw() {
  // Calculate start (Monday) and end (Sunday) of current week
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7); // next Sunday
  endOfWeek.setHours(23, 59, 59, 999);

  // Fetch only events for this week (based on startTime)
  const events = await prisma.event.findMany({
    where: {
      startTime: {
        gte: startOfWeek,
        lte: endOfWeek,
      },
    },
    select: { startTime: true },
  });

  // Count events per day of week
  const counts: Record<number, number> = {};
  events.forEach((e) => {
    const day = e.startTime.getDay(); // 0=Sun .. 6=Sat
    counts[day] = (counts[day] || 0) + 1;
  });

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days.map((day, i) => ({
    day,
    events: counts[i] || 0,
  }));
}

async function getUpcomingEventsRaw() {
  const now = new Date();

  const events = await prisma.event.findMany({
    where: {
      startTime: {
        gte: now,
      },
    },
    orderBy: { startTime: "asc" },
    take: 5,
    include: {
      user: true, // include all user fields
      schedules: true, // optional, include related schedules if needed
      guests: true, // optional, include related guests if needed
    },
  });

  console.log("Ebgfvhgcnerhcb", events);

  // Map to frontend-friendly format
  return events.map((e) => ({
    id: e.id,
    name: e.name,
    date: e.startTime.toISOString().split("T")[0],
    location: e.location || "Unknown",
    user: e.user
      ? `${e.user.name ?? "No Name"} (${e.user.phone ?? "No Phone"})`
      : "Unknown",
    description: e.description,
    type: e.type,
  }));
}
