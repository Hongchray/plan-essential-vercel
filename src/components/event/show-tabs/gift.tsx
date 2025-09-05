"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./gift-table/data-table";
import { Gift } from "@/interfaces/gift";
import { IAPIResponse } from "@/interfaces/comon/api-response";
import { columns } from "./gift-table/columns";

async function getData(
  id: string,
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  sort: string,
  order: string
) {
  const response = await fetch(
    `/api/admin/event/${id}/gift?page=${page}&per_page=${pageSize}&search=${search}&sort=${sort}&order=${order}`,
    {
      method: "GET",
    }
  );
  const result: IAPIResponse<Gift> = await response.json();
  return result;
}
export default function TabGift({ paramId, searchParams }: { paramId: string; searchParams: any }) {
  // Gift Component
  const [data, setData] = useState<Gift[]>([])
  const [meta, setMeta] = useState({ total: 0, pageCount: 1 })
  useEffect(() => {
    async function fetchData() {
      const id = await paramId;
      const params = await searchParams
      const page = Number(params.page) || 1
      const pageSize = params.per_page
      const search = params.search || ''
      const sort = params.sort || ''
      const order = params.order || ''
      const result = await getData(id, page, pageSize, search, sort, order)
      setData(result.data)
      setMeta(result.meta)
    }
    fetchData()
  }, [searchParams])

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Wedding Gifts</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {2}
          </div>
          <div className="text-sm text-green-800">Gifts Received</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            ${200}
          </div>
          <div className="text-sm text-purple-800">Total Value</div>
        </div>
      </div>

      <DataTable
        data={data}
        columns={columns}
        pageCount={meta.pageCount}
        total={meta.total}
        serverPagination={true}
      />
    </div>
  );
}
