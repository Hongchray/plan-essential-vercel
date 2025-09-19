import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Plan } from "@/interfaces/plan";
import { headers } from "next/headers";
import { IAPIResponse } from "@/interfaces/comon/api-response";

async function getData(
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  sort: string = "",
  order: string = ""
) {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/admin/plan?page=${page}&per_page=${pageSize}&search=${search}&sort=${sort}&order=${order}`,
    {
      method: "GET",
      headers: new Headers(await headers()),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch plan");
  }

  const result: IAPIResponse<Plan> = await response.json();
  return result;
}

export default async function PlanPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
    per_page?: string;
    search?: string;
    sort?: string;
    order?: string;
  }>;
}) {
  // ✅ await because searchParams is a Promise
  const params = (await searchParams) ?? {};

  const page = Number(params.page) || 1;
  const pageSize = Number(params.per_page) || 10;
  const search = params.search || "";
  const sort = params.sort || "";
  const order = params.order || "";

  const { data, meta } = await getData(page, pageSize, search, sort, order);

  return (
    <div className="h-full flex-1 flex-col gap-2 p-4 ">
      <DataTable
        data={data}
        columns={columns}
        pageCount={meta?.pageCount ?? 1}
        total={meta?.total ?? 0}
        serverPagination={true}
      />
    </div>
  );
}
