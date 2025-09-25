"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { Event } from "@/interfaces/event";
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
async function getPreviewEventTemplate(eventId: string, id: string) {
  try {
    const res = await fetch(`/api/admin/event/${eventId}/template/${id}`);
    if (!res.ok) throw new Error("Failed to fetch template");
    return await res.json();
  } catch {
    toast.error("Error getting template");
    return null;
  }
}
async function getEvent(id: string) {
  try {
    const res = await fetch(`/api/admin/event/preview?eventId=${id}`);
    if (!res.ok) throw new Error("Failed to fetch invitation");
    return await res.json();
  } catch {
    toast.error("Error getting invitation");
    return null;
  }
}

export default function Preview({
  templateId,
  eventId,
}: {
  templateId: string;
  eventId: string;
}) {
  const [template, setTemplate] = useState<any>(null);
  const [event, setEvent] = useState<Event>({} as Event);

  useEffect(() => {
    if (!templateId) return;
    if (eventId) {
      getPreviewEventTemplate(eventId, templateId).then(
        (data) => data && setTemplate(data)
      );
    }
    if (!eventId) {
      getPreviewTemplate(templateId).then((data) => data && setTemplate(data));
    }
    getEvent(eventId).then((data) => data && setEvent(data));
  }, [templateId, eventId]);

  if (!template) {
    return <LoadingScreen />;
  }

  enum TemplateName {
    WeddingSimpleTemplate = "WeddingSimpleTemplate",
  }
  let ComponentToRender =
    DynamicComponents[template.unique_name as TemplateName];
  if (eventId) {
    ComponentToRender =
      DynamicComponents[template.template.unique_name as TemplateName];
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50">
      {ComponentToRender &&
        (eventId ? (
          <ComponentToRender config={template.config} data={event} />
        ) : (
          <ComponentToRender config={template.defaultConfig} data={event} />
        ))}
    </div>
  );
}
