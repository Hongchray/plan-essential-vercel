"use client";

import { Loading } from "@/components/composable/loading/loading";
import { useEffect, useState } from "react";

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
      <p className="p-4">
        <Loading variant="circle" />
      </p>
    );
  if (!profile) return <p className="p-4">No profile found.</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <div className="flex items-center space-x-4">
        {profile.photoUrl ? (
          <img
            src={profile.photoUrl}
            alt={profile.name || "User"}
            className="w-20 h-20 rounded-full border"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-xl">
            {profile.name?.charAt(0) || "U"}
          </div>
        )}

        <div>
          {JSON.stringify(profile, null, 2)}
          <p className="text-lg font-semibold">{profile.name || "No name"}</p>
          <p className="text-gray-600">{profile.email || "No email"}</p>
          <p className="text-gray-600">Username: {profile.username || "-"}</p>
          <p className="text-gray-600">Phone: {profile.phone || "-"}</p>
          <p className="text-gray-600">Role: {profile.role}</p>
          <p className="text-sm text-gray-400">
            Joined:{" "}
            {profile.createdAt
              ? new Date(profile.createdAt).toLocaleDateString()
              : "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
