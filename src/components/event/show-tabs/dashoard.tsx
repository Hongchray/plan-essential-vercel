"use client"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function TabDashboard({ guests = [], expenses = [] }: { guests?: any[]; expenses?: any[] }) {
  // Dashboard Component
  const confirmedGuests = guests.filter((g) => g.status === "confirmed").length
  const pendingGuests = guests.filter((g) => g.status === "pending").length
  const declinedGuests = guests.filter((g) => g.status === "declined").length

  const giftsReceived = guests.filter((g) => g.gift?.received).length
  const totalGiftValue = guests.filter((g) => g.gift?.received).reduce((sum, g) => sum + (g.gift?.value || 0), 0)

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const paidExpenses = expenses.filter((e) => e.paid).reduce((sum, e) => sum + e.amount, 0)
  const unpaidExpenses = totalExpenses - paidExpenses

  const netAmount = totalGiftValue - totalExpenses

  const guestStatusData = [
    { name: "Confirmed", value: confirmedGuests, color: "#10b981" },
    { name: "Pending", value: pendingGuests, color: "#f59e0b" },
    { name: "Declined", value: declinedGuests, color: "#ef4444" },
  ]

  const financialData = [
    { category: "Gift Income", amount: totalGiftValue, color: "#10b981" },
    { category: "Paid Expenses", amount: paidExpenses, color: "#3b82f6" },
    { category: "Outstanding", amount: unpaidExpenses, color: "#f97316" },
  ]

  const expenseBreakdown = expenses.reduce(
    (acc, expense) => {
      const category = expense.category || "Other"
      acc[category] = (acc[category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const expenseChartData = Object.entries(expenseBreakdown).map(([category, amount]) => ({
    category,
    amount: amount as number,
  }))

  if (guests.length === 0 && expenses.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold mb-4">Wedding Dashboard</h3>
        <div className="text-center py-8 text-gray-500">
          No data available. Please add guests and expenses to see your dashboard.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Wedding Dashboard</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{guests.length}</div>
          <div className="text-sm text-blue-800">Total Guests</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{confirmedGuests}</div>
          <div className="text-sm text-green-800">Confirmed</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">${totalGiftValue.toFixed(2)}</div>
          <div className="text-sm text-purple-800">Gift Income</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
          <div className="text-sm text-red-800">Total Expenses</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Guest Status Distribution</CardTitle>
            <CardDescription>RSVP responses breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                confirmed: { label: "Confirmed", color: "#10b981" },
                pending: { label: "Pending", color: "#f59e0b" },
                declined: { label: "Declined", color: "#ef4444" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={guestStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {guestStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
            <CardDescription>Income vs expenses breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                amount: { label: "Amount ($)", color: "#3b82f6" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="amount" fill="#3b82f6">
                    {financialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {expenseChartData.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
            <CardDescription>Spending breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                amount: { label: "Amount ($)", color: "#8b5cf6" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="amount" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 border rounded-lg">
          <h4 className="font-semibold mb-3">Financial Overview</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-green-600">Gift Income:</span>
              <span className="font-medium text-green-600">+${totalGiftValue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600">Total Expenses:</span>
              <span className="font-medium text-red-600">-${totalExpenses.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-600">Paid Expenses:</span>
              <span className="font-medium text-blue-600">-${paidExpenses.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-orange-600">Outstanding:</span>
              <span className="font-medium text-orange-600">-${unpaidExpenses.toFixed(2)}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-lg">
              <span className={netAmount >= 0 ? "text-green-600" : "text-red-600"}>Net Amount:</span>
              <span className={`font-bold ${netAmount >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${netAmount.toFixed(2)}
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
              <span className="font-medium">{confirmedGuests}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span>Pending</span>
              </div>
              <span className="font-medium">{pendingGuests}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span>Declined</span>
              </div>
              <span className="font-medium">{declinedGuests}</span>
            </div>
            <hr className="my-2" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <span>Gifts Received</span>
              </div>
              <span className="font-medium">{giftsReceived}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
