import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Event } from "./data/schema";
import { headers } from "next/headers";
import { IAPIResponse } from "@/interfaces/comon/api-response";
import EventCard from "./components/event-card";
import CreateEventButton from "./components/create-button";

// Mock function - replace with actual user fetching logic
async function getCurrentUser() {
  return { role: "user" }; // or "admin"
}

// Fetch events from API
async function getData(
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  sort: string = "",
  order: string = ""
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

// Define type for searchParams - now as a Promise
type EventPageSearchParams = {
  page?: string;
  per_page?: string;
  search?: string;
  sort?: string;
  order?: string;
};

export default async function EventPage({
  searchParams,
}: {
  searchParams?: Promise<EventPageSearchParams>;
}) {
  // Await the searchParams Promise
  const resolvedSearchParams = await searchParams;

  // Convert searchParams to usable variables
  const page = Number(resolvedSearchParams?.page) || 1;
  const pageSize = Number(resolvedSearchParams?.per_page) || 10;
  const search = resolvedSearchParams?.search || "";
  const sort = resolvedSearchParams?.sort || "";
  const order = resolvedSearchParams?.order || "";

  // Fetch current user and events
  const user = await getCurrentUser();
  const { data, meta } = await getData(page, pageSize, search, sort, order);

  return (
    <div className="h-full flex-1 flex-col gap-4 p-4">
      {/* Welcome Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2 text-rose-700">
            Welcome! We're glad to have you here.
          </h1>
          <p className="text-rose-600">
            Explore your events below or create a new one to get started.
          </p>
        </div>
        <div className="flex justify-end">
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
