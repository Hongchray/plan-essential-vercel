import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const data = await req.json();
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

  // Extract and remove hash
  const checkHash = data.hash;
  delete data.hash;

  // Sort params
  const sorted = Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n");

  // Calculate secret key
  const secret = crypto.createHash("sha256").update(BOT_TOKEN).digest();

  // Calculate hash
  const hmac = crypto.createHmac("sha256", secret).update(sorted).digest("hex");

  if (hmac !== checkHash) {
    return NextResponse.json(
      { error: "Invalid Telegram signature" },
      { status: 403 }
    );
  }

  console.log("Telegram auth data verified:", data);
  // Upsert user by telegramId
  const user = await prisma.user.upsert({
    where: { telegramId: String(data.id) },
    update: {
      name: data.first_name,
      username: data.username,
      photoUrl: data.photo_url,
      updatedAt: new Date(),
    },
    create: {
      telegramId: String(data.id),
      name: data.first_name,
      username: data.username,
      email: `${data.id}@telegram.local`, // placeholder email
      password: "",
      photoUrl: data.photo_url,
      role: "user",
    },
  });
  //check if user have plan

  const userPlan = await prisma.userPlan.findMany({
    where: {
      userId: user.id,
    },
  });

  if (userPlan.length === 0) {
    // <-- check for empty array
    const freePlan = await prisma.plan.findFirst({
      where: {
        price: 0,
      },
    });
    if (freePlan) {
      await prisma.userPlan.create({
        data: {
          userId: user.id,
          planId: freePlan.id,
          limit_guests: 350,
          limit_template: 1,
          limit_export_excel: false,
        },
      });
    }
  }

  // TODO: Start session / issue JWT here if needed

  return NextResponse.json({ success: true, user });
}
