"use client";
import { useEffect, useState, use } from "react"; // 👈 import use()
import { useGuestColumns } from "./guest-table/columns";
import { DataTable } from "./guest-table/data-table";
import { IAPIResponse } from "@/interfaces/comon/api-response";
import { Guest } from "@/interfaces/guest";
import { Loading } from "@/components/composable/loading/loading";
import { useTranslation } from "react-i18next";

async function getData(
  id: string,
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  sort: string,
  order: string
) {
  const response = await fetch(
    `/api/admin/event/${id}/guest?page=${page}&per_page=${pageSize}&search=${search}&sort=${sort}&order=${order}`,
    { method: "GET" }
  );
  const result: IAPIResponse<Guest> = await response.json();
  return result;
}

export default function TabGuest({
  paramId,
  searchParams,
}: {
  paramId: string;
  searchParams: any;
}) {
  const params = use(searchParams); // ✅ unwrap safely
  const columns = useGuestColumns();
  const [data, setData] = useState<Guest[]>([]);
  const [meta, setMeta] = useState({ total: 0, pageCount: 1 });
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("common");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const id = paramId;
        const params = await searchParams;
        const page = Number(params.page) || 1;
        const pageSize = Number(params.per_page) || 10;
        const search = params.search || "";
        const sort = params.sort || "";
        const order = params.order || "";
        const result = await getData(id, page, pageSize, search, sort, order);
        setData(result.data);
        setMeta(result.meta);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [paramId, params]);

  return (
    <div className="space-y-2 md:space-y-6">
      <>
        <h3 className="text-md md:text-lg font-semibold ">
          {t("event_dashboard.guest.title")}
        </h3>
        <DataTable
          data={data}
          columns={columns}
          pageCount={meta.pageCount}
          total={meta.total}
          serverPagination={true}
          loading={loading} // pass loading state
        />
      </>
    </div>
  );
}
