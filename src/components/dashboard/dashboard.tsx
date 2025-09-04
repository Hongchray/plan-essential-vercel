"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  Calendar,
  PartyPopper,
} from "lucide-react";
import { useEffect, useState } from "react";
import DataLoading from "../composable/loading/dataloading";
const monthlyData = [
  { month: "Jan", users: 12, templates: 12, earnings: 456 },
  { month: "Feb", users: 15, templates: 23, earnings: 456 },
  { month: "Mar", users: 18, templates: 23, earnings: 546 },
  { month: "Apr", users: 20, templates: 34, earnings: 34 },
  { month: "May", users: 22, templates: 23, earnings: 34 },
  { month: "Jun", users: 24, templates: 12, earnings: 34 },
  { month: "Jul", users: 1, templates: 2, earnings: 333 },
  { month: "Aug", users: 3, templates: 1, earnings: 343 },
  { month: "Sep", users: 4, templates: 33, earnings: 34 },
  { month: "Oct", users: 6, templates: 12, earnings: 345 },
  { month: "Nov", users: 3, templates: 12, earnings: 34 },
  { month: "Dec", users: 23, templates: 4, earnings: 1888 },
];

const weeklyActivity = [
  { day: "Mon", events: 3 },
  { day: "Tue", events: 5 },
  { day: "Wed", events: 2 },
  { day: "Thu", events: 8 },
  { day: "Fri", events: 6 },
  { day: "Sat", events: 4 },
  { day: "Sun", events: 1 },
];

// User Data
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
};

export default function DashboardPage() {
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [userChange, setUserChange] = useState<number | null>(null);

  const [templates, setTemplates] = useState<number | null>(null);
  const [events, setEvents] = useState<number | null>(null);

  useEffect(() => {
    // Fetch total users
    fetch("/api/admin/dashboard?action=totalUsers")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTotalUsers(data.data.totalUsers);
          setUserChange(data.data.percentageChange);
        }
      })
      .finally(() => setLoadingUsers(false));

    // Fetch total templates
    fetch("/api/admin/dashboard?action=templates")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTemplates(data.data);
      });

    // Fetch total events
    fetch("/api/admin/dashboard?action=events")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setEvents(data.data);
      });
  }, []);

  return (
    <div className="w-full space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {loadingUsers ? <DataLoading size="24px" /> : totalUsers ?? 0}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <p
                className={
                  userChange && userChange >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {userChange && userChange >= 0 ? "+" : ""}
                {userChange ?? 0}% from last month
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Total Templates */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Templates
            </CardTitle>
            <FileText className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">
              {templates === null ? <DataLoading size="24px" /> : templates}
            </div>
            {templates === 0 && (
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                No templates created yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Total Events */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Events
            </CardTitle>
            <PartyPopper className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {events === null ? <DataLoading size="24px" /> : events}
            </div>
            {events === 0 && (
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                Ready to start earning
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 ">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              User Growth
            </CardTitle>
            <CardDescription>Monthly user registration trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                users: {
                  label: "Users",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="min-h-[100px] max-h-[250px] w-[100%]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="var(--color-chart-1)"
                    fill="var(--color-chart-1)"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Activity
            </CardTitle>
            <CardDescription>Events scheduled this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                events: {
                  label: "Events",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="min-h-[100px] max-h-[250px] w-[100%]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="events"
                    fill="var(--color-chart-2)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Events
          </CardTitle>
          <CardDescription>
            Manage and track your scheduled events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Event Name</TableHead>
                  <TableHead className="font-semibold">User Name</TableHead>
                  <TableHead className="font-semibold">Event Date</TableHead>
                  <TableHead className="text-right font-semibold">
                    Event Location
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      រៀបអារពាហ៍ពិពាហ៍
                    </div>
                  </TableCell>
                  <TableCell>Mr. Makara (0731883330/3456789)</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      2023-12-12
                    </div>
                  </TableCell>
                  <TableCell className="text-right">Phnom Penh</TableCell>
                </TableRow>
                <TableRow className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      រៀបអារពាហ៍ពិពាហ៍
                    </div>
                  </TableCell>
                  <TableCell>Mr. Hong (0731883330/3456789)</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      2023-12-12
                    </div>
                  </TableCell>
                  <TableCell className="text-right">Phnom Penh</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
