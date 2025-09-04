import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const per_page = parseInt(searchParams.get("per_page") || "10");
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") || "desc";

  try {
    const total = await prisma.user.count({
      where: {
        OR: [{ name: { contains: search, mode: "insensitive" } }],
      },
    });

    const game = await prisma.user.findMany({
      where: {
        OR: [{ name: { contains: search, mode: "insensitive" } }],
      },
      skip: (page - 1) * per_page,
      take: per_page,
      orderBy: { [sort]: order },
    });

    const response = {
      message: "Get data successfully",
      data: game,
      meta: {
        total,
        page,
        per_page,
        pageCount: Math.ceil(total / per_page),
      },
    };

    return NextResponse.json(response, { status: 200 });
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
