"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/composable/loading/loading";
import { Button } from "@/components/ui/button";
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
  if (!profile) return <p className="p-6 text-gray-600">No profile found.</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 p-6 bg-white shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-transform duration-200">
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
            {profile.email || "No email"}
          </p>
          <p className="text-gray-700">Phone: {profile.phone || "-"}</p>
          <p className="text-gray-700">Username: {profile.username || "-"}</p>
          <p className="text-gray-700">Role: {profile.role}</p>
          <p className="text-sm text-gray-500 mt-1">
            Joined:{" "}
            {profile.createdAt
              ? new Date(profile.createdAt).toLocaleDateString()
              : "-"}
          </p>

          {/* Optional Stats */}
          <div className="flex flex-wrap gap-3 mt-3">
            <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full shadow-sm">
              Events: {profile.events.length}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full shadow-sm">
              Plans: {profile.userPlan.length}
            </span>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList className="bg-white rounded-xl p-1 flex space-x-1 shadow-inner border border-gray-200">
          <TabsTrigger
            value="profile"
            className="text-gray-700 font-medium data-[state=active]:bg-gray-100 data-[state=active]:shadow-md data-[state=active]:text-gray-900 rounded-lg px-4 py-2 transition-all"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="text-gray-700 font-medium data-[state=active]:bg-gray-100 data-[state=active]:shadow-md data-[state=active]:text-gray-900 rounded-lg px-4 py-2 transition-all"
          >
            Events
          </TabsTrigger>
          <TabsTrigger
            value="plans"
            className="text-gray-700 font-medium data-[state=active]:bg-gray-100 data-[state=active]:shadow-md data-[state=active]:text-gray-900 rounded-lg px-4 py-2 transition-all"
          >
            Plans
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="p-6 bg-white shadow-lg rounded-xl border border-gray-200">
            <div className="space-y-3">
              <p className="text-gray-800 font-semibold">
                Email:{" "}
                <span className="font-normal">{profile.email || "-"}</span>
              </p>
              <p className="text-gray-800 font-semibold">
                Phone:{" "}
                <span className="font-normal">{profile.phone || "-"}</span>
              </p>
              <p className="text-gray-800 font-semibold">
                Username:{" "}
                <span className="font-normal">{profile.username || "-"}</span>
              </p>
              <p className="text-gray-800 font-semibold">
                Role: <span className="font-normal">{profile.role}</span>
              </p>
              <p className="text-gray-600 font-medium">
                Joined:{" "}
                <span className="font-normal">
                  {profile.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : "-"}
                </span>
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full shadow-sm">
                  Events: {profile.events.length}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full shadow-sm">
                  Plans: {profile.userPlan.length}
                </span>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          {/* Add New Event Button */}
          <div className="flex justify-end mb-4">
            <Button
              className="px-4 py-2 text-white font-medium rounded-lg shadow transition-colors"
              onClick={() => console.log("Add new event clicked")}
            >
              Add New Event
            </Button>
          </div>

          {/* Events Grid */}
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
                  <h3 className="font-semibold text-gray-800">{event.name}</h3>
                  {event.description && (
                    <p className="text-gray-600 text-sm">{event.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge
                      variant="outline"
                      className="text-green-700 bg-green-100"
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
                    {event.location || "No location"} •{" "}
                    {new Date(event.startTime).toLocaleDateString()} -{" "}
                    {new Date(event.endTime).toLocaleDateString()}
                  </p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {profile.userPlan.map((up) => (
              <Card
                key={up.id}
                className="bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 transition-all shadow-lg hover:shadow-xl rounded-2xl border border-indigo-200"
              >
                <CardHeader className="flex justify-between items-center pb-2 border-b border-indigo-200">
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {up.plan.name}
                  </h3>
                  <span className="text-indigo-600 font-semibold text-lg">
                    ${up.plan.price}
                  </span>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3 mt-3">
                  <Badge className="bg-indigo-100 text-indigo-800 font-medium px-3 py-1 rounded-full">
                    Guest Limit: {up.limit_guests}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 font-medium px-3 py-1 rounded-full">
                    Template Limit: {up.limit_template}
                  </Badge>
                  <Badge
                    className={`${
                      up.limit_export_excel
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    } font-medium px-3 py-1 rounded-full`}
                  >
                    Excel Export: {up.limit_export_excel ? "Yes" : "No"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
