"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/composable/loading/loading";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Pencil, Plus, PlusIcon } from "lucide-react";
import { formatDate } from "@/utils/date";
interface Event {
  id: string;
  name: string;
  description?: string;
  image?: string | null;
  status: string;
  type: string;
  location?: string;
  startTime: string;
  endTime: string;
}

interface Plan {
  id: string;
  name: string;
  price?: number;
}

interface UserPlan {
  id: string;
  limit_guests: number;
  limit_template: number;
  limit_export_excel: boolean;
  plan: Plan;
}

interface UserProfile {
  id: string;
  email?: string | null;
  name?: string | null;
  username?: string | null;
  photoUrl?: string | null;
  phone?: string | null;
  role: string;
  telegramId?: string | null;
  phone_verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  events: Event[];
  userPlan: UserPlan[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("common");
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/admin/profile");
        const data = await res.json();
        if (data.success) setProfile(data.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-gray-600">
        <Loading variant="circle" />
      </div>
    );
  if (!profile)
    return <p className="p-6 text-gray-600">{t("profile.noProfile")}</p>;

  return (
    <div className="p-2 max-w-6xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="relative flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 p-6 bg-white shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-transform duration-200">
        {/* Edit Button */}
        <Button
          onClick={() => router.push(`/profile/${profile.id}`)}
          className="absolute top-4 right-4 px-4 py-2 text-sm font-medium text-white transition-colors cursor-pointer  rounded-lg shadow"
        >
          <Pencil className="w-4 h-4 mr-2 inline-block" />
          {t("profile.edit")}
        </Button>

        {/* Profile Image */}
        {profile.photoUrl ? (
          <img
            src={profile.photoUrl}
            alt={profile.name || "User"}
            className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 shadow-md"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center text-4xl font-bold text-gray-700 shadow-inner">
            {profile.name?.charAt(0) || "U"}
          </div>
        )}

        {/* Profile Info */}
        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
          <p className="text-gray-700 font-medium">
            {profile.email || t("profile.noEmail")}
          </p>
          <p className="text-gray-700">
            {t("profile.phone")}: {profile.phone || "-"}
          </p>
          <p className="text-gray-700">
            {t("profile.username")}: {profile.username || "-"}
          </p>
          <p className="text-gray-700">
            {t("profile.role")}: {profile.role}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {t("profile.joined")}:{" "}
            {profile.createdAt ? formatDate(profile.createdAt) : "-"}
          </p>

          {/* Optional Stats */}
          <div className="flex flex-wrap gap-3 mt-3">
            <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full shadow-sm">
              {t("profile.events")}: {profile.events.length}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full shadow-sm">
              {t("profile.plans")}:{" "}
              {profile.userPlan?.[0]?.plan?.name ?? "No plan"}
            </span>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList className="bg-white rounded-xl p-1 flex space-x-1 shadow-inner border border-gray-200">
          <TabsTrigger
            value="profile"
            className="text-gray-700 font-medium data-[state=active]:bg-gray-100 data-[state=active]:shadow-md data-[state=active]:text-gray-900 rounded-lg px-4 py-2 transition-all cursor-pointer "
          >
            {t("profile.tabProfile")}
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="text-gray-700 font-medium data-[state=active]:bg-gray-100 data-[state=active]:shadow-md data-[state=active]:text-gray-900 rounded-lg px-4 py-2 transition-all cursor-pointer"
          >
            {t("profile.tabEvents")}
          </TabsTrigger>

          {profile.role !== "admin" && (
            <TabsTrigger
              value="plans"
              className="text-gray-700 font-medium data-[state=active]:bg-gray-100 data-[state=active]:shadow-md data-[state=active]:text-gray-900 rounded-lg px-4 py-2 transition-all cursor-pointer"
            >
              {t("profile.tabPlans")}
            </TabsTrigger>
          )}
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="p-6 bg-white shadow-lg rounded-xl border border-gray-200">
            <div className="space-y-3">
              <p className="text-gray-800 font-semibold">
                {t("profile.email")}:{" "}
                <span className="font-normal">{profile.email || "-"}</span>
              </p>
              <p className="text-gray-800 font-semibold">
                {t("profile.phone")}:{" "}
                <span className="font-normal">{profile.phone || "-"}</span>
              </p>
              <p className="text-gray-800 font-semibold">
                {t("profile.username")}:{" "}
                <span className="font-normal">{profile.username || "-"}</span>
              </p>
              <p className="text-gray-800 font-semibold flex items-center gap-2">
                {t("profile.role")}:
                <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium uppercase">
                  {profile.role}
                </span>
              </p>

              <p className="text-gray-600 font-medium">
                {t("profile.joined")}:{" "}
                <span className="font-normal">
                  {profile.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : "-"}
                </span>
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full shadow-sm">
                  {t("profile.events")}: {profile.events.length}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full shadow-sm">
                  {t("profile.plans")}:{" "}
                  {profile.userPlan?.[0]?.plan?.name ?? "No plan"}
                </span>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <Card className="p-6 bg-white shadow-lg rounded-xl border border-gray-200">
            <div className="flex justify-end mb-4">
              <Button
                className="px-4 py-2 text-white font-medium rounded-lg shadow transition-colors cursor-pointer"
                onClick={() => router.push("/event/create")}
              >
                <PlusIcon />
                {t("profile.addNewEvent")}
              </Button>
            </div>

            {/* Events Grid */}
            {profile.events && profile.events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.events.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    {event.image && (
                      <img
                        src={event.image}
                        alt={event.name}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <CardHeader className="space-y-1">
                      <h3 className="font-semibold text-gray-800">
                        {event.name}
                      </h3>
                      {event.description && (
                        <p className="text-gray-600 text-sm">
                          {event.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge
                          variant="outline"
                          className="text-green-700 bg-green-100 capitalize"
                        >
                          {event.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-blue-700 bg-blue-100"
                        >
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-gray-500 text-xs mt-1">
                        {event.location || t("profile.noLocation")} •{" "}
                        {new Date(event.startTime).toLocaleDateString()} -{" "}
                        {new Date(event.endTime).toLocaleDateString()}
                      </p>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-10 text-gray-500 border rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mb-3 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <p className="text-sm font-medium">
                  {t("profile.noEvents", {
                    defaultValue: t("profile.noEvents"),
                  })}
                </p>
                <Button
                  className="mt-3 px-4 py-2 font-medium cursor-pointer"
                  onClick={() => router.push("/event/create")}
                >
                  {t("profile.addNewEvent")}
                </Button>
              </div>
            )}
          </Card>
          {/* Add New Event Button */}
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans">
          {profile.userPlan.length > 0 ? (
            <div className="flex justify-center">
              {profile.userPlan.map((up) => (
                <Card
                  key={up.id}
                  className="w-full max-w-md bg-white shadow-lg rounded-xl border border-gray-200 transition-all  hover:shadow-xl"
                >
                  <CardHeader className="flex flex-col items-center text-center pb-4 border-b border-indigo-200">
                    <h3 className="font-bold text-gray-800 text-2xl">
                      {up.plan.name}
                    </h3>
                    <span className="text-indigo-600 font-extrabold text-3xl mt-2">
                      ${up.plan.price}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      {t("profile.plans")}
                    </p>
                  </CardHeader>

                  <CardContent className="flex flex-col gap-3 mt-4">
                    <Badge className="bg-indigo-100 text-indigo-800 font-medium px-3 py-1 rounded-full text-center">
                      {t("profile.guestLimit")}: {up.limit_guests}
                    </Badge>
                    <Badge className="bg-green-100 text-green-800 font-medium px-3 py-1 rounded-full text-center">
                      {t("profile.templateLimit")}: {up.limit_template}
                    </Badge>
                    <Badge
                      className={`${
                        up.limit_export_excel
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      } font-medium px-3 py-1 rounded-full text-center`}
                    >
                      {t("profile.excelExport")}:{" "}
                      {up.limit_export_excel
                        ? t("profile.yes")
                        : t("profile.no")}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-6">
              {t("profile.noProfile")}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
