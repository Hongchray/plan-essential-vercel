"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";

interface User {
  id: string;
  email: string;
  password: string;
  name?: string | null;
  username?: string | null;
  phone?: string | null;
  photoUrl?: string | null;
  role: string;
  otp_code?: string | null;
  otp_expires_at?: string | null;
  phone_verified: boolean;
  phone_verified_at?: string | null;
  telegramId?: string | null;
  createdAt: string;
  updatedAt: string;
  events?: any[];
}

export default function UserPage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchUser() {
      try {
        const res = await fetch(`/api/admin/user/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user");

        const result = await res.json();
        setUser(result.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <div className="p-4">User not found.</div>;
  }

  return (
    <div className="p-6 space-y-6 bg-white rounded-lg border shadow-sm w-full sm:w-11/12 md:w-2/3 lg:w-1/2">
      {/* Header */}
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          {user.photoUrl && (
            <img
              src={user.photoUrl}
              alt={user.name || user.username || "User"}
              className="w-20 h-20 rounded-full object-cover border"
            />
          )}
          <div>
            <h2 className="text-xl font-semibold">{user.name || "No Name"}</h2>
            <p className="text-gray-600">{user.email}</p>
            <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700">
              {user.role}
            </span>
          </div>
        </div>
        <div>
          {/* <Link href={`/user/edit/${user.id}`}>
            <Button size="icon" variant="outline">
              <Pencil className="w-4 h-4" />
            </Button>
          </Link> */}
        </div>
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <InfoItem label="Username" value={user.username} />
        <InfoItem label="Phone" value={user.phone} />
        <InfoItem label="Email" value={user.email} />
        <InfoItem
          label="Role"
          value={
            <Badge variant="secondary" className="pb-1">
              {user.role}
            </Badge>
          }
        />
        <InfoItem
          label="Created At"
          value={new Date(user.createdAt).toLocaleString()}
        />
        <InfoItem
          label="Updated At"
          value={new Date(user.updatedAt).toLocaleString()}
        />
      </div>

      {/* Events Section */}
      <div className="border-t pt-4 mt-4">
        <h3 className="text-sm font-semibold mb-2">Events</h3>

        {user.events && user.events.length > 0 ? (
          <ul className="space-y-3">
            {user.events.map((event) => (
              <li
                key={event.id}
                className="flex items-start gap-4 p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
              >
                {/* Event Image */}
                <img
                  src={event.image || "https://via.placeholder.com/80"}
                  alt={event.name}
                  className="w-20 h-20 rounded-md object-cover border"
                />

                {/* Event Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-semibold">{event.name}</h4>
                    <p className="text-xs text-gray-500">
                      {event.type?.charAt(0).toUpperCase() +
                        event.type?.slice(1)}{" "}
                      • {new Date(event.startTime).toLocaleString()} -{" "}
                      {new Date(event.endTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-xs text-gray-500">{event.location}</p>
                    <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  {/* Bottom Row: Status + Button */}
                  <div className="flex items-center justify-between mt-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        event.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {event.status}
                    </span>

                    <Link href={`/event/edit/${event.id}`}>
                      <Button size="sm" variant="outline">
                        View Event
                      </Button>
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-gray-500">No events available.</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t justify-end">
        {/* <Link href={`/user/edit/${user.id}`}>
          <Button>Edit User</Button>
        </Link> */}
        <Link href={`/user`}>
          <Button variant="outline">Back</Button>
        </Link>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium capitalize">{value || "—"}</p>
    </div>
  );
}
