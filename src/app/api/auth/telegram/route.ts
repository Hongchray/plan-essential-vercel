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

  // Upsert user in DB
  const user = await prisma.user.upsert({
    where: { id: String(data.id) },
    update: {
      name: data.first_name,
      photoUrl: data.photo_url,
    },
    create: {
      id: String(data.id),
      email: `${data.id}@telegram.local`, // fake email (Telegram doesn’t give email)
      password: "", // not needed for Telegram login
      name: data.first_name,
      phone: null,
      photoUrl: data.photo_url,
    },
  });

  // (optional) start a session or JWT here
  return NextResponse.json({ success: true, user });
}
