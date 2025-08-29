import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
    const userId = req.headers.get("user-id");
    if (!userId) {
        return new Response("User ID is required", { status: 400 });
    }
    const { id } = await req.json()
}

export async function GET(req: NextRequest) {
    const event = await prisma.event.findMany();
    return NextResponse.json({ event }, { status: 200 })
}