// src/app/(dashboard)/user/components/user-client-page.tsx
"use client";

import { useUserColumns } from "../components/columns";
import { DataTable } from "../components/data-table";
import { User } from "../data/schema";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { IAPIResponse } from "@/interfaces/comon/api-response";
import { useTranslation } from "react-i18next";

export default function UserClientPage() {
  const searchParams = useSearchParams();
  const { t, i18n } = useTranslation("common");

  const page = Number(searchParams.get("page")) || 1;
  const per_page = Number(searchParams.get("per_page")) || 10;
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";
  const order = searchParams.get("order") || "";
  const [isClient, setIsClient] = useState(false);

  const columns = useUserColumns();
  const [data, setData] = useState<User[]>([]);
  const [meta, setMeta] = useState({ pageCount: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsClient(true);
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
    };
    fetchData();
  }, [page, per_page, search, sort, order]);

  return (
    <div className="space-y-4 p-2">
      {isClient && i18n.isInitialized ? (
        <h1 className="text-xl font-bold">{t("user.title")}</h1>
      ) : (
        <h1 className="text-xl font-bold">User Management</h1>
      )}{" "}
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
