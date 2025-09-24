import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import EventUserView from "./components/event-user-view";
import EventTableClient from "./components/event-table-client";
import { Suspense } from "react";
import { Loading } from "@/components/composable/loading/loading";

// Get current logged-in user
async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return { id: session.user.id, role: session.user.role };
}

// Fetch events from DB
async function getEvents(
  userId: string,
  role: string,
  page: number,
  per_page: number,
  search: string,
  sort: string,
  order: "asc" | "desc"
) {
  const where: any = {};
  if (role !== "admin") where.userId = userId;

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const total = await prisma.event.count({ where });
  const data = await prisma.event.findMany({
    where,
    skip: (page - 1) * per_page,
    take: per_page,
    orderBy: { [sort]: order },
  });

  const tableData = data.map((e) => ({
    ...e,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
    startTime: e.startTime?.toISOString() || "",
    endTime: e.endTime?.toISOString() || "",
    owner: e.owner || "",
    bride: e.bride || "",
    groom: e.groom || "",
    image: e.image || "",
  }));

  return {
    data: tableData,
    meta: { total, page, per_page, pageCount: Math.ceil(total / per_page) },
  };
}

export default async function EventPage({
  searchParams,
}: {
  searchParams?: any;
}) {
  const resolved = await searchParams;
  const page = Number(resolved?.page) || 1;
  const per_page = Number(resolved?.per_page) || 10;
  const search = resolved?.search || "";
  const sort = resolved?.sort || "createdAt";
  const order = (resolved?.order as "asc" | "desc") || "desc";

  const user = await getCurrentUser();
  if (!user) return <div>Please log in to view events.</div>;

  const { data, meta } = await getEvents(
    user.id,
    user.role,
    page,
    per_page,
    search,
    sort,
    order
  );

  return (
    <div className="h-full flex-1 flex-col gap-4 p-4">
      {user.role === "admin" ? (
        <EventTableClient data={data} meta={meta} />
      ) : (
        <EventUserView data={data} />
      )}
    </div>
  );
}
