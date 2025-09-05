"use client";
import { Event } from "../data/schema";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EyeIcon, PencilIcon } from "lucide-react";
export default function EventCard({ event }: { event: Event }) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col justify-between">
      <div>
        {event.image && (
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-40 object-cover rounded-md mb-4"
          />
        )}

        <h3 className="text-lg font-bold mb-2">{event.name}</h3>

        {event.type && (
          <span className="text-sm font-medium text-blue-600 mb-2 capitalize">
            {event.type}
          </span>
        )}

        {event.description && (
          <p className="text-gray-700 mb-2">{event.description}</p>
        )}

        {(event.location || event.startTime || event.endTime) && (
          <div className="text-sm text-gray-500">
            {event.location && <p>📍 {event.location}</p>}
            <p>
              🗓 {new Date(event.startTime).toLocaleDateString()} -{" "}
              {new Date(event.endTime).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Edit button */}
      <div className="mt-4 flex justify-end gap-3">
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => (window.location.href = `/event/${event.id}`)} // navigate to edit page
          >
            View
            <EyeIcon />
          </Button>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => (window.location.href = `/event/edit/${event.id}`)} // navigate to edit page
          >
            Edit
            <PencilIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
