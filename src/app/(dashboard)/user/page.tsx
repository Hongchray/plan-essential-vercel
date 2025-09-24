"use client";

import { useUserColumns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { User } from "./data/schema";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IAPIResponse } from "@/interfaces/comon/api-response";
import { useTranslation } from "react-i18next";

export default function UserPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, i18n } = useTranslation("common");

  const page = Number(searchParams.get("page")) || 1;
  const per_page = Number(searchParams.get("per_page")) || 10;
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";
  const order = searchParams.get("order") || "";

  const columns = useUserColumns();
  const [data, setData] = useState<User[]>([]);
  const [meta, setMeta] = useState<any>({ pageCount: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Mark component as client after hydration
  useEffect(() => setIsClient(true), []);

  // Fetch data whenever search params change
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/admin/user?page=${page}&per_page=${per_page}&search=${search}&sort=${sort}&order=${order}`
        );
        const result: IAPIResponse<User> = await res.json();
        setData(result.data || []);
        setMeta(result.meta || { pageCount: 1, total: 0 });
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setData([]);
        setMeta({ pageCount: 1, total: 0 });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page, per_page, search, sort, order]);

  // Server-render fallback to prevent hydration error
  if (!isClient || !i18n.isInitialized) {
    return (
      <div className="space-y-6">
        <h1 className="text-lg font-semibold mb-4">User Management</h1>
        <DataTable
          data={[]}
          columns={columns}
          pageCount={1}
          total={0}
          serverPagination={true}
          loading={true}
        />
      </div>
    );
  }

  // Client-rendered content with translations
  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold mb-4">{t("user.title")}</h1>
      <DataTable
        data={data}
        columns={columns}
        pageCount={meta.pageCount || 1}
        total={meta.total || 0}
        serverPagination={true}
        loading={loading}
      />
    </div>
  );
}
