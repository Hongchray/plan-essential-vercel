
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    const templates = await prisma.template.findMany();
    return NextResponse.json({ templates }, { status: 200 })
}

export async function POST(req: NextRequest) {
    const data = await req.json();
    const template = await prisma.template.create({
        data,
    })
    return NextResponse.json(template, { status: 201 })
}
