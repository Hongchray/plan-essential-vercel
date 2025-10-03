import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const per_page = parseInt(searchParams.get("per_page") || "10");
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") || "desc";

  try {
    // Build search conditions for multiple fields
    const searchConditions = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search, mode: "insensitive" as const } },
            { address: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } }, // Added email for completeness
          ],
        }
      : {};

    const whereClause = {
      eventId: id,
      ...searchConditions,
    };

    const total = await prisma.guest.count({
      where: whereClause,
    });

    const data = await prisma.guest.findMany({
      where: whereClause,
      include: {
        guestTag: { include: { tag: true } },
        guestGroup: { include: { group: true } },
        event: true,
      },

      skip: (page - 1) * per_page,
      take: per_page,
      orderBy: { [sort]: order },
    });

    const response = {
      message: "Get data successfully",
      data: data,
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
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const data = await req.json();

  try {
    const response = await prisma.guest.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        note: data.note,
        address: data.address,
        image: data.image,
        eventId: id,
        guestTag: {
          create: data.tags.map((tagId: string) => ({
            tag: { connect: { id: tagId } },
          })),
        },
        guestGroup: {
          create: data.groups.map((groupId: string) => ({
            group: { connect: { id: groupId } },
          })),
        },
      },
      include: {
        guestTag: { include: { tag: true } },
        guestGroup: { include: { group: true } },
      },
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(error); // 👈 log to debug
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { ids } = body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: ids array is required" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const deletedTags = await tx.guestTag.deleteMany({
        where: {
          guestId: {
            in: ids,
          },
        },
      });

      const deletedGroups = await tx.guestGroup.deleteMany({
        where: {
          guestId: {
            in: ids,
          },
        },
      });
      const deletedGift = await tx.gift.deleteMany({
        where: {
          guestId: {
            in: ids,
          },
        },
      });

      const deletedGuests = await tx.guest.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });

      return {
        deletedGuests: deletedGuests.count,
        deletedTags: deletedTags.count,
        deletedGroups: deletedGroups.count,
        deletedGift: deletedGift.count,
      };
    });

    if (result.deletedGuests === 0) {
      return NextResponse.json(
        { error: "No guests found with the provided IDs" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: `Successfully deleted ${result.deletedGuests} guest(s)`,
        deletedCount: result.deletedGuests,
        deletedRelations: {
          tags: result.deletedTags,
          groups: result.deletedGroups,
        },
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting guests:", error);

    if (error instanceof Error && "code" in error && error.code === "P2025") {
      return NextResponse.json(
        { error: "Some guests were not found" },
        { status: 404 }
      );
    }

    if (error instanceof Error && "code" in error && error.code === "P2003") {
      return NextResponse.json(
        { error: "Cannot delete guests due to existing references" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
