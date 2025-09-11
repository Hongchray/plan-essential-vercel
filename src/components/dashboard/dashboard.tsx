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
import { Loading } from "../composable/loading/loading";
import { useTranslation } from "react-i18next";

interface MonthlyData {
  month: string;
  users: number;
}

interface WeeklyActivity {
  day: string;
  events: number;
}

export default function DashboardPage() {
  // Hooks
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [userChange, setUserChange] = useState<number | null>(null);
  const [templates, setTemplates] = useState<number | null>(null);
  const [events, setEvents] = useState<number | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivity[]>([]);
  const [eventList, setEventList] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const { t } = useTranslation("common");
  const [mounted, setMounted] = useState(false);

  // Mount check
  useEffect(() => setMounted(true), []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setLoadingEvents(true);

        const res = await fetch("/api/admin/dashboard?action=all");
        const data = await res.json();

        if (data.success) {
          const d = data.data;
          setTotalUsers(d.users.totalUsers);
          setUserChange(d.users.percentageChange);
          setTemplates(d.templates);
          setEvents(d.events);
          setMonthlyData(d.monthlyData);
          setWeeklyActivity(d.weeklyActivity);
          setEventList(d.upcomingEvents || []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
      } finally {
        setLoading(false);
        setLoadingEvents(false);
      }
    };

    fetchDashboard();
  }, []);

  // Conditional rendering based on mounted
  if (!mounted) return null;

  return (
    <div className="w-full space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.totalUsers")}
            </CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 flex items-center gap-2">
              {loading ? (
                <Loading variant="circle" size="sm" />
              ) : (
                <span>{totalUsers ?? 0}</span>
              )}
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
                {userChange ?? 0}% {t("dashboard.fromLastMonth")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Total Templates */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.totalTemplates")}
            </CardTitle>
            <FileText className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">
              {templates === null ? (
                <Loading variant="circle" size="sm" />
              ) : (
                templates
              )}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {templates === 0 ? (
                <>{t("dashboard.noTemplates")}</>
              ) : (
                <>
                  <FileText className="h-4 w-4 text-rose-600 mr-1" />{" "}
                  {t("dashboard.templates")}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Total Events */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("dashboard.totalEvents")}
            </CardTitle>
            <PartyPopper className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {events === null ? (
                <Loading variant="circle" size="sm" />
              ) : (
                events
              )}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {events === 0 ? (
                <>{t("dashboard.readyToStart")}</>
              ) : (
                <>
                  <PartyPopper className="h-4 w-4 text-green-600 mr-1" />{" "}
                  {t("dashboard.events")}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t("dashboard.userGrowth")}
            </CardTitle>
            <CardDescription>
              {t("dashboard.monthlyUserTrends")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-[250px]">
                <Loading variant="circle" size="md" />
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>

        {/* Weekly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t("dashboard.weeklyActivity")}
            </CardTitle>
            <CardDescription>{t("dashboard.weeklyEvents")}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-[250px]">
                <Loading variant="circle" size="md" />
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t("dashboard.upcomingEvents")}
          </CardTitle>
          <CardDescription>{t("dashboard.manageEvents")}</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingEvents ? (
            <div className="flex justify-center py-10">
              <Loading variant="circle" size="md" />
            </div>
          ) : (
            <div className="rounded-md border">
              {/* Debug: show eventList */}
              <pre className="p-2 text-xs text-muted-foreground"></pre>

              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">
                      {t("dashboard.eventName")}
                    </TableHead>
                    <TableHead className="font-semibold">
                      {t("dashboard.userName")}
                    </TableHead>
                    <TableHead className="font-semibold">
                      {t("dashboard.eventDate")}
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      {t("dashboard.eventLocation")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventList.map((event) => (
                    <TableRow
                      key={event.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          {event.name}
                        </div>
                      </TableCell>
                      <TableCell>{event.user}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {event.date}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {event.location}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
