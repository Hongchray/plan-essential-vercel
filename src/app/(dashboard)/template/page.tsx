"use client";

import { useTemplateColumns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Template } from "./data/schema";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IAPIResponse } from "@/interfaces/comon/api-response";

export default function TemplatePage() {
  const columns = useTemplateColumns();

  const searchParams = useSearchParams(); // ✅ use the hook in client component

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("per_page")) || 10;
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";
  const order = searchParams.get("order") || "";

  const [data, setData] = useState<Template[]>([]);
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/admin/template?page=${page}&per_page=${pageSize}&search=${search}&sort=${sort}&order=${order}`,
          { cache: "no-store" }
        );
        const result: IAPIResponse<Template> = await res.json();
        setData(result.data);
        setTotal(result.meta?.total ?? 0);
        setPageCount(result.meta?.pageCount ?? 1);
      } catch (error) {
        console.error("Failed to fetch templates", error);
      }
    };

    fetchData();
  }, [page, pageSize, search, sort, order]);

  return (
    <div className="h-full flex-1 flex-col gap-2 p-4">
      <DataTable
        data={data}
        columns={columns}
        pageCount={pageCount}
        total={total}
        serverPagination={true}
      />
    </div>
  );
}
