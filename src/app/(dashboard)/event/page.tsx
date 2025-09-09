import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Event } from "./data/schema";
import EventCard from "./components/event-card";
import CreateEventButton from "./components/create-button";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user) return null;

  return {
    id: session.user.id,
    role: session.user.role,
  };
}

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

  // Map Prisma Event to DataTable-friendly type
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
        <DataTable<any, any>
          data={data}
          columns={columns}
          pageCount={meta?.pageCount ?? 1}
          total={meta.total}
          serverPagination={true}
        />
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold mb-2 text-rose-700">
                Welcome! We're glad to have you here.
              </h1>
              <p className="text-rose-600">
                Explore your events below or create a new one to get started.
              </p>
            </div>
            <CreateEventButton />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((event: any) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
