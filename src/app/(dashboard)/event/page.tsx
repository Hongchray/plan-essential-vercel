import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Event } from "./data/schema";
import { headers } from "next/headers";
import { IAPIResponse } from "@/interfaces/comon/api-response";
import EventCard from "./components/event-card"; // you will create this
import Link from "next/link";
import CreateEventButton from "./components/create-button"; // you will create this
// Mock function - replace with your actual user fetching logic
async function getCurrentUser() {
  // Example: fetch('/api/auth/session') or prisma.user.findUnique...
  return { role: "user" }; // or "admin"
}

async function getData(
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  sort: string,
  order: string
) {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/admin/event?page=${page}&per_page=${pageSize}&search=${search}&sort=${sort}&order=${order}`,
    {
      method: "GET",
      headers: new Headers(await headers()),
    }
  );
  const result: IAPIResponse<Event> = await response.json();
  return result;
}

export default async function EventPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    per_page?: number;
    search?: string;
    sort?: string;
    order?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";
  const sort = params.sort || "";
  const order = params.order || "";
  const pageSize = params.per_page;

  const user = await getCurrentUser();
  const { data, meta } = await getData(page, pageSize, search, sort, order);

  return (
    <div className="h-full flex-1 flex-col gap-4 p-4">
      {/* Welcome Section */}
      <div className="flex justify-between ">
        <div>
          <h1 className="text-2xl font-semibold mb-2 text-rose-700">
            Welcome! We're glad to have you here.
          </h1>
          <p className="text-rose-600 mb-4">
            Explore your events below or create a new one to get started.
          </p>
        </div>
        <div className="flex justify-end mb-4">
          <CreateEventButton />
        </div>
      </div>

      {/* Event List */}
      {user.role === "admin" ? (
        <DataTable
          data={data}
          columns={columns}
          pageCount={meta?.pageCount ?? 1}
          total={meta.total}
          serverPagination={true}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
