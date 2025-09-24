"use client";

import { DataTable } from "./data-table";
import { useEventColumns } from "./columns";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Loading } from "@/components/composable/loading/loading";

interface Props {
  data: any[];
  meta: { total: number; pageCount: number; per_page: number };
}

export default function EventTableClient({ data, meta }: Props) {
  const columns = useEventColumns();
  const [loading, setLoading] = useState(true); // client-side loading
  const [isClient, setIsClient] = useState(false);
  const { t, i18n } = useTranslation("common");

  // Mark client after hydration
  useEffect(() => {
    setIsClient(true);

    // Simulate loading delay for demonstration; remove if fetching data dynamically
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-4">
      {/* Table Header */}
      {isClient && i18n.isInitialized ? (
        <h2 className="text-xl font-bold">{t("EventPage.title")}</h2>
      ) : (
        <h2 className="text-xl font-bold">Event Management</h2>
      )}

      {/* Show loading inside table if loading */}
      <DataTable<any, any>
        data={loading ? [] : data} // empty while loading
        columns={columns}
        pageCount={meta.pageCount}
        total={meta.total}
        serverPagination={true}
        loading={loading} // pass state to table loader
        // optional: you can render a custom loader inside table
        // e.g., <Loading variant="table" size="lg" message="Loading events..." />
      />
    </div>
  );
}
