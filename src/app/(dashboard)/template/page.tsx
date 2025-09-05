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
      cache: "no-store", // optional: always fetch fresh
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch templates");
  }

  const result: IAPIResponse<Template> = await response.json();
  return result;
}

export default async function TemplatePage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    per_page?: number;
    search?: string;
    sort?: string;
    order?: string;
  };
}) {
  const page = Number(searchParams?.page) || 1;
  const pageSize = Number(searchParams?.per_page) || 10;
  const search = searchParams?.search || "";
  const sort = searchParams?.sort || "";
  const order = searchParams?.order || "";

  const { data, meta } = await getData(page, pageSize, search, sort, order);

  return (
    <div className="h-full flex-1 flex-col gap-2 p-4">
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
