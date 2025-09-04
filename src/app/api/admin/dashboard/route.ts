import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action"); // ?action=totalUsers

  if (action === "totalUsers") {
    return getTotalUsers();
  }

  if (action === "monthlyData") {
    return getMonthlyData();
  }

  if (action === "templates") {
    return getTemplates();
  }
  if (action === "events") {
    return getEvents();
  }
  return NextResponse.json(
    { success: false, error: "Invalid action" },
    { status: 400 }
  );
}

// Function to get total users
async function getTotalUsers() {
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

  return NextResponse.json({
    success: true,
    data: { totalUsers, percentageChange },
  });
}

async function getTemplates() {
  const totalTemplates = await prisma.template.count();
  return NextResponse.json({ success: true, data: totalTemplates });
}
async function getEvents() {
  const totalEvents = await prisma.event.count();
  return NextResponse.json({ success: true, data: totalEvents });
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
  const users = await prisma.user.findMany(); // adjust as needed

  // Example: build data per month
  const monthlyData = months.map((month, i) => ({
    month,
    users: 0, // you can calculate users per month here
    templates: 0,
    earnings: 0,
  }));

  return NextResponse.json({ success: true, data: monthlyData });
}
