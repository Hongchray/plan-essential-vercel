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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
      <>
        <ScrollArea>
          <div className="flex gap-4 w-full  md:grid grid-cols-4  md:grid-cols-4 ">
            {/* Gifts Received */}
            <div className="flex-shrink-0 min-w-40 md:w-auto relative bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl  transition-all duration-300 border-blue-200/50">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-700">
                    {loading ? (
                      <Loading
                        variant="minimal"
                        message={t("component.table.loadingMessage")}
                        size="sm"
                      />
                    ) : (
                      aggregates.received ?? 0
                    )}
                  </div>
                </div>
              </div>
              <div className="text-sm font-medium text-blue-600">
                {t("gift.received")}
              </div>
            </div>

            {/* Total Value (USD) */}
            <div className="flex-shrink-0 min-w-40 md:w-auto relative bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl  transition-all duration-300 border-green-200/50">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-700">
                    {loading ? (
                      <Loading
                        variant="minimal"
                        message={t("component.table.loadingMessage")}
                        size="sm"
                      />
                    ) : (
                      currencyFormatters.usd(
                        aggregates?.by_currency[1]?._sum?.amount_usd ?? 0
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="text-sm font-medium text-green-600">
                {t("gift.total_usd")}
              </div>
            </div>

            {/* Total Value (KHR) */}
            <div className="flex-shrink-0 min-w-40 md:w-auto relative bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-2xl  transition-all duration-300 border-purple-200/50">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <div
                    className="text-xl font-bold text-purple-600 px-2 "
                    style={{
                      fontFamily: "Moul",
                    }}
                  >
                    ៛
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-700">
                    {loading ? (
                      <Loading
                        variant="minimal"
                        message={t("component.table.loadingMessage")}
                        size="sm"
                      />
                    ) : (
                      currencyFormatters.khr(
                        aggregates?.by_currency[0]?._sum?.amount_khr ?? 0
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="text-sm font-medium text-purple-600">
                {t("gift.total_khr")}
              </div>
            </div>

            {/* Total USD Equivalent */}
            <div className="flex-shrink-0 min-w-40 md:w-auto relative bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-2xl  transition-all duration-300 border-red-200/50">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-700">
                    {loading ? (
                      <Loading
                        variant="minimal"
                        message={t("component.table.loadingMessage")}
                        size="sm"
                      />
                    ) : (
                      currencyFormatters.usd(
                        aggregates?.total_amount_usd_equivalent ?? 0
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="text-sm font-medium text-red-600 mb-1">
                <span>{t("gift.total_usd_equivalent")}</span>
                <span className="text-xs text-red-500">
                  {t("gift.exchange_rate", { rate: EXCHANGE_RATES.USD_TO_KHR })}
                </span>
              </div>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <h3 className="text-lg font-semibold mb-4">{t("gift.title")}</h3>
        <DataTable
          data={data}
          columns={columns}
          pageCount={meta.pageCount}
          total={meta.total}
          serverPagination={true}
          loading={loading}
        />
      </>
    </div>
  );
}
