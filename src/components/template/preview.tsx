"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { Event } from "@/interfaces/event"
// Dynamic templates
const DynamicComponents = {
  WeddingSimpleTemplate: dynamic(() => import("./wedding/simple-template"), {
    loading: () => <LoadingScreen />,
    ssr: false,
  }),
};

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-khmer">កំពុងផ្ទុក... (Loading...)</p>
      </div>
    </div>
  );
}

async function getPreviewTemplate(id: string) {
  try {
    const res = await fetch(`/api/admin/template/${id}`);
    if (!res.ok) throw new Error("Failed to fetch template");
    return await res.json();
  } catch {
    toast.error("Error getting template");
    return null;
  }
}
async function getEvent() {
  try {
    const res = await fetch(`/api/admin/event/preview`);
    if (!res.ok) throw new Error("Failed to fetch invitation");
    return await res.json();
  } catch {
    toast.error("Error getting invitation");
    return null;
  }
}

export default function Preview({ id }: { id: string }) {
  const [template, setTemplate] = useState<any>(null);
  const [event, setEvent] = useState<Event>({} as Event);

  // Fetch template once
  useEffect(() => {
    if (!id) return;
    getPreviewTemplate(id).then((data) => data && setTemplate(data));
    getEvent().then((data) => data && setEvent(data));
  }, [id]);

  // Sample data
  if (!template) {
    return <LoadingScreen />;
  }

  enum TemplateName {
    WeddingSimpleTemplate = "WeddingSimpleTemplate",
  }

  const ComponentToRender =
    DynamicComponents[template.unique_name as TemplateName];

  return (
    <div className="bg-gradient-to-br from-red-50 to-yellow-50">
      {ComponentToRender && (
        <ComponentToRender
          config={template.defaultConfig}
          data={event}
        />
      )}
    </div>
  );
}
