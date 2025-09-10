"use client";

import { useTranslation } from "next-i18next";
import EventCard from "../components/event-card";
import CreateEventButton from "../components/create-button";
import { useState, useEffect } from "react";

export default function EventUserView({ data }: { data: any[] }) {
  const { t } = useTranslation("common");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // prevent SSR mismatch

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-2 text-rose-700">
            {t("EventPage.welcome")}
          </h1>
          <p className="text-rose-600">{t("EventPage.explore")}</p>
        </div>
        <CreateEventButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
