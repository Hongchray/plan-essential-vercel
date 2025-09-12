"use client";

import { useUserColumns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { User } from "./data/schema";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { IAPIResponse } from "@/interfaces/comon/api-response";
import { useTranslation } from "react-i18next";
import { Loading } from "@/components/composable/loading/loading";

export default function UserPage() {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("per_page")) || 10;
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";
  const order = searchParams.get("order") || "";

  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("common");

  const columns = useUserColumns();
  const [data, setData] = useState<User[]>([]);
  const [meta, setMeta] = useState<any>({});

  useEffect(() => {
    async function fetchData() {
      setLoading(true); // start loading
      try {
        const res = await fetch(
          `/api/admin/user?page=${page}&per_page=${pageSize}&search=${search}&sort=${sort}&order=${order}`
        );
        const result: IAPIResponse<User> = await res.json();
        setData(result.data);
        setMeta(result.meta);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false); // stop loading
      }
    }
    fetchData();
  }, [page, pageSize, search, sort, order]);

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loading variant="circle" size="lg" />
        </div>
      ) : (
        <>
          <h3 className="text-lg font-semibold mb-4">User Management</h3>
          <DataTable
            data={data}
            columns={columns}
            pageCount={meta.pageCount}
            total={meta.total}
            serverPagination={true}
          />
        </>
      )}
    </div>
  );
}
