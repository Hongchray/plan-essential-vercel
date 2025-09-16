"use client";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTranslation } from "next-i18next";

import { useEffect, useState } from "react";
import { Loading } from "@/components/composable/loading/loading";
import { currencyFormatters } from "@/utils/currency";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
export default function TabDashboard({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("common"); 

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/admin/event/${eventId}/dashboard`);
        const data = await res.json();
        setEvent(data);
      } catch (error) {
        console.error("Error loading event dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [eventId]);

  if (loading)
    return (
      <div className="flex items-center justify-center ">
        <Loading variant="circle" size="lg" />
      </div>
    );
  if (!event) return <p>No event found.</p>;

  const financialData = [
    {
      category: "ចំណងដៃ",
      amount: event.total_gift_income,
      color: "#10b981", // emerald green
    },
    {
      category: "ចំណាយប៉ាន់ស្មាន",
      amount: event.total_expend_budget,
      color: "#f59e0b", // amber / orange
    },
    {
      category: "ចំណាយពិត",
      amount: event.total_expend_actual,
      color: "#ef4444", // red
    },
    {
      category: "ចំនេញ/ខាត",
      amount: event.netAmount,
      color: "#0092b8",
    },
  ];

  return (
    <div className="space-y-2 md:space-y-6">
      <h3 className="text-md md:text-lg font-semibold">
        {t("event_dashboard.title")}
      </h3>
      <ScrollArea>
        <div className="flex gap-4 mb-6 w-full overflow-x-auto md:grid grid-cols-5">
          <div className="bg-blue-50 p-4 rounded-lg flex-shrink-0 w-40 md:w-auto">
            <div className="text-2xl font-bold text-blue-600">
              {event.total_guest}
            </div>
            <div className="text-sm text-blue-800">
              {t("event_dashboard.cards.total_guests")}
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg flex-shrink-0 w-40 md:w-auto">
            <div className="text-2xl font-bold text-green-600">
              {event.total_confirmed}
            </div>
            <div className="text-sm text-green-800">
              {t("event_dashboard.cards.confirmed")}
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg flex-shrink-0 w-40 md:w-auto">
            <div className="text-2xl font-bold text-purple-600">
              {currencyFormatters.usd(event.total_gift_income)}  ( {currencyFormatters.khr(event.total_income_khr)})
            </div>
            <div className="text-sm text-purple-800">
              {t("event_dashboard.cards.gift_income")}
            </div>
          </div>

          <div className="bg-pink-50 p-4 rounded-lg flex-shrink-0 w-40 md:w-auto">
            <div className="text-2xl font-bold text-red-600">
              {currencyFormatters.usd(event.total_expend_actual || 0)}
            </div>
            <div className="text-sm text-red-800">
              {t("event_dashboard.cards.total_expenses_actual")}
            </div>
          </div>

          <div className="bg-cyan-50 p-4 rounded-lg flex-shrink-0 w-40 md:w-auto">
            <div className="text-2xl font-bold text-cyan-600">
              {currencyFormatters.usd(event.netAmount || 0)}
            </div>
            <div className="text-sm text-cyan-800">
              {t("event_dashboard.cards.profit_loss")}
            </div>
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Guest Status Distribution */}
        <Card className="flex flex-col shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">
              {t("event_dashboard.charts.guest_status.title")}
            </CardTitle>
            <CardDescription className="text-sm">
              {/* {t("event_dashboard.charts.guest_status.description")} */}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            <ChartContainer
              config={{
                confirmed: { label: "បានបញ្ជាក់", color: "#10b981" },
                pending: { label: "មិនទាន់ឆ្លើយតប", color: "#f59e0b" },
                declined: { label: "បដិសេធ", color: "#ef4444" },
              }}
              className="h-[250px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={event.guestStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    dataKey="value"
                  >
                    {event.guestStatusData.map(
                      (entry: { color: string | undefined }, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      )
                    )}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Financial Overview */}
        <Card className="flex flex-col shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">
              {t("event_dashboard.charts.financial_overview.title")}
            </CardTitle>
            <CardDescription className="text-sm">
              {/* {t("event_dashboard.charts.financial_overview.description")} */}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer
              config={{
                amount: { label: "Amount ($)", color: "#3b82f6" },
              }}
              className="h-[250px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={financialData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                 <Legend
                    verticalAlign="top"
                    align="center"
                    payload={financialData.map((item) => ({
                      value: item.category,
                      type: "square",
                      id: item.category,
                      color: item.color,
                    }))}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={80}>
                    {financialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} name={entry.category} />
                    ))}
                     {/* <LabelList
                        dataKey="amount"
                        position="top"
                        formatter={(value: number) =>
                          value.toLocaleString() 
                        }
                      /> */}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Expense Categories */}
        <Card className="flex flex-col lg:col-span-1 shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">
              {t("event_dashboard.charts.expense_categories.title")}
            </CardTitle>
            <CardDescription className="text-sm">
              {/* {t("event_dashboard.charts.expense_categories.description")} */}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 h-[250px] ">
            <ChartContainer
                config={{
                  amount: { label: "Amount ($)", color: "#3b82f6" },
                }}
                className="h-[250px] w-full"
              >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={event.expenses}
                    dataKey="actual_amount"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={false}
                    label={({ name, value, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {event.expenses.map(
                      (entry: { name: string | undefined }, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            [
                              "#10b981",
                              "#f59e0b",
                              "#ef4444",
                              "#3b82f6",
                              "#8b5cf6",
                            ][index % 5]
                          }
                        />
                      )
                    )}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Financial & Guest Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 border rounded-lg">
          <h4 className="font-semibold mb-3">
            {t("event_dashboard.financial_summary.title")}
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-green-600 font-medium">
                {t("event_dashboard.financial_summary.gift_income")}
              </span>
              <span className="font-medium text-green-600">
                {currencyFormatters.usd(event.total_gift_income)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600 font-medium">
                {t("event_dashboard.financial_summary.total_expenses_actual")}
              </span>
              <span className="font-medium text-red-600">
                {currencyFormatters.usd(event.total_expend_actual)}
              </span>
            </div>
            <div className="my-2 border-t-2 border-dashed"></div>
            <div className="flex justify-between">
              <span
                className="text-blue-600 font-medium" 
              >
                {t("event_dashboard.cards.profit_loss")}
              </span>
              <span
                className={`font-medium ${
                  event.netAmount >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {currencyFormatters.usd(event.netAmount)}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 border rounded-lg">
          <h4 className="font-semibold mb-3">
            {t("event_dashboard.guest_summary.title")}
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* <div className="w-3 h-3 bg-green-500 rounded-full"></div> */}
                <span className="text-green-500 font-medium">{t("event_dashboard.guest_summary.confirmed")}</span>
              </div>
              <span className="font-medium text-green-500">
                {event.guest_summary.confirmed}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* <div className="w-3 h-3 bg-yellow-500 rounded-full"></div> */}
                <span className="text-yellow-500 font-medium">{t("event_dashboard.guest_summary.pending")}</span>
              </div>
              <span className="font-medium text-yellow-500">{event.guest_summary.pending}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* <div className="w-3 h-3 bg-red-500 rounded-full"></div> */}
                <span className="text-red-500 font-medium">{t("event_dashboard.guest_summary.declined")}</span>
              </div>
              <span className="font-medium text-red-500">
                {event.guest_summary.declined}
              </span>
            </div>
            <div className="my-2 border-t-2 border-dashed"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* <div className="w-3 h-3 bg-blue-400 rounded-full"></div> */}
                <span className="text-blue-500 font-medium">{t("event_dashboard.guest_summary.gifts_received")}</span>
              </div>
              <span className="font-medium text-blue-500">{event.total_gift}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
