"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { DataTable } from "./gift-table/data-table";
import { Gift } from "@/interfaces/gift";
import { IAPIResponse } from "@/interfaces/comon/api-response";
import { columns } from "./gift-table/columns";
import { Loading } from "@/components/composable/loading/loading";
import { currencyFormatters, formatCurrency } from "@/utils/currency";

interface GiftAggregates {
  received: number;
  by_currency: any[]
}

interface GiftResponse extends IAPIResponse<Gift> {
  aggregates: GiftAggregates;
}

// Shape of searchParams
interface SearchParams {
  page?: string;
  per_page?: string;
  search?: string;
  sort?: string;
  order?: string;
}

async function getData(
  id: string,
  page: number = 1,
  pageSize: number = 10,
  search: string = "",
  sort: string = "createdAt",
  order: string = "desc"
): Promise<GiftResponse> {
  const response = await fetch(
    `/api/admin/event/${id}/gift?page=${page}&per_page=${pageSize}&search=${search}&sort=${sort}&order=${order}`
  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch gifts: ${response.status} ${text}`);
  }
  return (await response.json()) as GiftResponse;
}

export default function TabGift({
  paramId,
  searchParams,
}: {
  paramId: string;
  searchParams: any; 
}) {
  const params = use(searchParams) as SearchParams; // 👈 cast unknown to proper type

  const [data, setData] = useState<Gift[]>([]);
  const [meta, setMeta] = useState({ total: 0, pageCount: 1 });
  const [aggregates, setAggregates] = useState<GiftAggregates>({
    received: 0,
    by_currency: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const page = Number(params.page) || 1;
        const pageSize = Number(params.per_page) || 10;
        const search = params.search || "";
        const sort = params.sort || "createdAt";
        const order = params.order || "desc";

        const result = await getData(
          paramId,
          page,
          pageSize,
          search,
          sort,
          order
        );
        setData(result.data);
        setMeta(result.meta);
        setAggregates(result.aggregates);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params, paramId]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Wedding Gifts</h3>
      {loading ? (
        <div className="flex items-center justify-center ">
          <Loading variant="circle" size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Gifts Received */}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600 flex items-center ">
                {loading ? (
                  <Loading variant="minimal" message="" size="sm" />
                ) : (
                  aggregates.received ?? 0
                )}
              </div>
              <div className="text-sm text-green-800 ">
                Gifts Received
              </div>
            </div>

            {/* Total Value */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 flex items-center ">
                {loading ? (
                  <Loading variant="minimal" message="" size="sm" />
                ) : (
                  `${currencyFormatters.usd(aggregates?.by_currency[1]?._sum?.amount ?? 0)}`
                )}
              </div>
              <div className="text-sm text-purple-800">Total Dolar ($)</div>
            </div>
            {/* Total Value */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 flex items-center ">
                {loading ? (
                  <Loading variant="minimal" message="" size="sm" />
                ) : (
                  `${currencyFormatters.khr(aggregates?.by_currency[0]?._sum?.amount ?? 0)}`
                )}
              </div>
              <div className="text-sm text-blue-800">Total Riel(៛)</div>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-4">Expense Management</h3>
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
