"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { DataTable } from "./gift-table/data-table";
import { Gift } from "@/interfaces/gift";
import { IAPIResponse } from "@/interfaces/comon/api-response";
import { columns } from "./gift-table/columns";
import { Loading } from "@/components/composable/loading/loading";
import { currencyFormatters } from "@/utils/currency";
import { useTranslation } from "react-i18next";
import { EXCHANGE_RATES } from "@/utils/exchangeRates";
import { Users, DollarSign, TrendingUp } from "lucide-react";
import { IconMoneybagPlus } from "@tabler/icons-react";

interface GiftAggregates {
  received: number;
  by_currency: any[];
  total_amount_usd_equivalent: number;
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
    total_amount_usd_equivalent: 0,
  });
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("common");

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
      <h3 className="text-lg font-semibold mb-4">{t("gift.wedding_gifts")}</h3>
      {loading ? (
        <div className="flex items-center justify-center ">
          <Loading variant="circle" size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            {/* Gifts Received */}
            <div className="bg-gradient-to-br from-teal-100 to-teal-200 p-5 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
              <div className="flex items-center justify-between">
                <Users className="w-8 h-8 text-teal-700" />
                <div className="text-3xl font-extrabold text-teal-700">
                  {loading ? (
                    <Loading variant="minimal" message="" size="sm" />
                  ) : (
                    aggregates.received ?? 0
                  )}
                </div>
              </div>
              <div className="text-sm font-medium text-teal-900 mt-2">
                {t("gift.received")}
              </div>
            </div>

            {/* Total Value (USD) */}
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-5 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
              <div className="flex items-center justify-between">
                <DollarSign className="w-8 h-8 text-orange-700" />
                <div className="text-3xl font-extrabold text-orange-700">
                  {loading ? (
                    <Loading variant="minimal" message="" size="sm" />
                  ) : (
                    currencyFormatters.usd(
                      aggregates?.by_currency[1]?._sum?.amount_usd ?? 0
                    )
                  )}
                </div>
              </div>
              <div className="text-sm font-medium text-orange-900 mt-2">
                {t("gift.total_usd")}
              </div>
            </div>

            {/* Total Value (KHR) */}
            <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-5 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
              <div className="flex items-center justify-between">
                <p className="text-[35px] font-bold text-pink-700">៛</p>
                <div className="text-3xl font-extrabold text-pink-700">
                  {loading ? (
                    <Loading variant="minimal" message="" size="sm" />
                  ) : (
                    currencyFormatters.khr(
                      aggregates?.by_currency[0]?._sum?.amount_khr ?? 0
                    )
                  )}
                </div>
              </div>
              <div className="text-sm font-medium text-pink-900 mt-2">
                {t("gift.total_khr")}
              </div>
            </div>

            {/* Total USD Equivalent */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
              <div className="flex items-center justify-between">
                <TrendingUp className="w-8 h-8 text-purple-700" />
                <div className="text-3xl font-extrabold text-purple-700">
                  {loading ? (
                    <Loading variant="minimal" message="" size="sm" />
                  ) : (
                    currencyFormatters.usd(
                      aggregates?.total_amount_usd_equivalent ?? 0
                    )
                  )}
                </div>
              </div>
              <div className="text-sm font-medium text-purple-900 mt-2">
                {t("gift.total_usd_equivalent")}
              </div>
              <div className="text-xs text-purple-500 mt-1">
                {t("gift.exchange_rate", { rate: EXCHANGE_RATES.USD_TO_KHR })}
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4">{t("gift.title")}</h3>
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
