'use client'
import { useEffect, useState } from "react";
import { columns } from "./expense-table/columns";
import { DataTable } from "./expense-table/data-table";
import { IAPIResponse } from "@/interfaces/comon/api-response";
import { Expense } from "@/interfaces/expense";

async function getData(
  id: string,
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  sort: string,
  order: string
) {
  const response = await fetch(
    `/api/admin/event/${id}/expense?page=${page}&per_page=${pageSize}&search=${search}&sort=${sort}&order=${order}`,
    {
      method: "GET",
    }
  );
  const result: IAPIResponse<Expense> = await response.json();
  return result;
}

export default function TabExpense({ paramId, searchParams }: { paramId: string; searchParams: any }) {
  const [data, setData] = useState<Expense[]>([])
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
      <h3 className="text-lg font-semibold mb-4">Expense Management</h3>
      <DataTable
        data={data}
        columns={columns}
        pageCount={meta.pageCount}
        total={meta.total}
        serverPagination={true}
      />
    </div>
  )
}
