"use client";

import { useTemplateColumns } from "../components/columns";
import { DataTable } from "../components/data-table";
import { Template } from "../data/schema";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IAPIResponse } from "@/interfaces/comon/api-response";
import { useTranslation } from "react-i18next";

export default function TemplateClientPage() {
  const columns = useTemplateColumns();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("per_page")) || 10;
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";
  const order = searchParams.get("order") || "";

  const { t, i18n } = useTranslation("common");
  const [isClient, setIsClient] = useState(false); // Track hydration
  const [data, setData] = useState<Template[]>([]);
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);

  // Mark client after hydration
  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
        setData([]);
        setTotal(0);
        setPageCount(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize, search, sort, order]);

  return (
    <div className="h-full flex-1 flex-col gap-2 p-2">
      <h1 className="text-xl font-bold mb-4">
        {isClient && i18n.isInitialized
          ? t("template.title")
          : "Template Management"}
      </h1>

      <DataTable
        data={data}
        columns={columns}
        pageCount={pageCount}
        total={total}
        serverPagination={true}
        loading={loading}
      />
    </div>
  );
}
