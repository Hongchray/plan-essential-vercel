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
import { useEffect, useState } from "react";
export default function TabDashboard({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Loading...</p>;
  if (!event) return <p>No event found.</p>;

  // Dashboard Component
  const confirmedGuests = 3;
  const pendingGuests = 2;
  const declinedGuests = 1;

  const giftsReceived = 0;
  const totalGiftValue = 100;

  const totalExpenses = 10;
  const paidExpenses = 20;
  const unpaidExpenses = totalExpenses - paidExpenses;

  const netAmount = totalGiftValue - totalExpenses;

  const financialData = [
    {
      category: "Gift Income",
      amount: event.total_gift_income,
      color: "#10b981", // emerald green
    },
    {
      category: "Expenses Budget",
      amount: event.total_expend_budget,
      color: "#f59e0b", // amber / orange
    },
    {
      category: "Expenses Actual",
      amount: event.total_expend_actual,
      color: "#ef4444", // red
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Wedding Dashboard </h3>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {event.total_guest}
          </div>
          <div className="text-sm text-blue-800">Total Guests</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {event.total_confirmed}
          </div>
          <div className="text-sm text-green-800">Confirmed</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {event.total_gift_income}$
          </div>
          <div className="text-sm text-purple-800">Gift Income</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {event.total_expend_actual || 0}$
          </div>
          <div className="text-sm text-red-800">Total Expenses Actual</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {event.total_expend_budget || 0}$
          </div>
          <div className="text-sm text-red-800">Total Expenses Budget</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Guest Status Distribution */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Guest Status Distribution</CardTitle>
            <CardDescription className="text-sm">
              RSVP responses breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            <ChartContainer
              config={{
                confirmed: { label: "Confirmed", color: "#10b981" },
                pending: { label: "Pending", color: "#f59e0b" },
                declined: { label: "Declined", color: "#ef4444" },
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
                      `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
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
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Financial Overview */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Financial Overview</CardTitle>
            <CardDescription className="text-sm">
              Income vs expenses breakdown
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
                  margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {financialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Expense Categories */}
        <Card className="flex flex-col lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Expense Categories</CardTitle>
            <CardDescription className="text-sm">
              Spending breakdown by category
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={event.expenses}
                  dataKey="actual_amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
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
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 border rounded-lg">
          <h4 className="font-semibold mb-3">Financial Overview</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-green-600">Gift Income:</span>
              <span className="font-medium text-green-600">
                {event.total_gift_income.toFixed(2)}$
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600">Total Expenses (Actual):</span>
              <span className="font-medium text-red-600">
                {event.total_expend_actual.toFixed(2)}$
              </span>
            </div>

            <hr className="my-2" />
            <div className="flex justify-between text-lg">
              <span
                className={netAmount >= 0 ? "text-green-600" : "text-red-600"}
              >
                Net Amount:
              </span>
              <span
                className={`font-bold ${
                  netAmount >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {event.netAmount.toFixed(2)}$
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 border rounded-lg">
          <h4 className="font-semibold mb-3">Guest Status</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span>Confirmed</span>
              </div>
              <span className="font-medium">
                {event.guest_summary.confirmed}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span>Pending</span>
              </div>
              <span className="font-medium">{event.guest_summary.pending}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span>Declined</span>
              </div>
              <span className="font-medium">
                {event.guest_summary.declined}
              </span>
            </div>
            <hr className="my-2" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <span>Gifts Received</span>
              </div>
              <span className="font-medium">{event.total_gift}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
