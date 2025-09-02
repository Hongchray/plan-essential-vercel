import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Template } from "./data/schema";
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
    `${process.env.NEXTAUTH_URL}/api/admin/template?page=${page}&per_page=${pageSize}&search=${search}&sort=${sort}&order=${order}`,
    {
      method: "GET",
      headers: new Headers(await headers()),
    }
  );

  const result: IAPIResponse<Template> = await response.json();
  return result;
}

export default async function Page({
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
  const pageSize = params.per_page ?? 10;

  const { data, meta } = await getData(page, pageSize, search, sort, order);

  return (
    <div className="h-full flex-1 flex-col gap-2 p-4">
      <DataTable
        data={data}
        columns={columns}
        pageCount={meta?.pageCount ?? 1}
        total={meta.total}
        serverPagination={true}
      />
    </div>
  );
}
