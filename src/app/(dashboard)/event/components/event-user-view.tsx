"use client";

import { useTranslation } from "react-i18next";
import EventCard from "../components/event-card";
import CreateEventButton from "../components/create-button";
import { useState, useEffect } from "react";
import { Calendar } from "lucide-react"; // pretty icon

export default function EventUserView({ data }: { data: any[] }) {
  const { t } = useTranslation("common");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // prevent SSR mismatch

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-rose-700">
            {t("EventPage.welcome")}
          </h1>
          <p className="text-rose-600">{t("EventPage.explore")}</p>
        </div>
        <CreateEventButton />
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-xl p-10 shadow-sm text-center">
          <Calendar className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-lg font-semibold text-gray-600 mb-2">
            {t("EventPage.noEventsTitle")}
          </h2>
          <p className="text-gray-500 mb-4">
            {t("EventPage.noEventsDescription")}
          </p>
          <CreateEventButton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
