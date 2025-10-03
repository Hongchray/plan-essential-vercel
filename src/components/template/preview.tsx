"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { Event } from "@/interfaces/event";
import { LanguageProvider } from "@/hooks/LanguageContext";

// Dynamic templates
const DynamicComponents = {
  WeddingSimpleTemplate: dynamic(() => import("./wedding/simple-template"), {
    loading: () => <LoadingScreen />,
    ssr: false,
  }),
  WeddingSpecialTemplate: dynamic(() => import("./wedding/special-template"), {
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

async function getEventBySlug(slug: string) {
  try {
    const res = await fetch(`/api/admin/event/preview?slug=${slug}`);
    if (!res.ok) throw new Error("Failed to fetch invitation");
    return await res.json();
  } catch {
    toast.error("Error getting invitation");
    return null;
  }
}

enum TemplateName {
  WeddingSimpleTemplate = "WeddingSimpleTemplate",
  WeddingSpecialTemplate = "WeddingSpecialTemplate",
}

export default function Preview({
  templateId,
  eventId,
  slug,
}: {
  templateId?: string;
  eventId?: string;
  slug?: string;
}) {
  const [template, setTemplate] = useState<any>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (slug) {
        const data = await getEventBySlug(slug);
        if (data) {
          setEvent(data);
          if (data.eventTemplates?.[0]) {
            setTemplate(data.eventTemplates[0]);
          }
        }
        setLoading(false);
        return;
      }

      if (eventId && templateId) {
        const [eventData, templateData] = await Promise.all([
          getEvent(eventId),
          getPreviewEventTemplate(eventId, templateId),
        ]);
        if (eventData) setEvent(eventData);
        if (templateData) setTemplate(templateData);
        setLoading(false);
        return;
      }

      if (!slug) {
        const eventData = await getEvent(eventId || "");
        if (eventData) {
          setEvent(eventData);
        }
      }

      if (templateId) {
        const templateData = await getPreviewTemplate(templateId);
        if (templateData) setTemplate(templateData);
        setLoading(false);
        return;
      }

      setLoading(false);
    };

    fetchData();
  }, [templateId, eventId, slug]);

  if (loading || !template) {
    return <LoadingScreen />;
  }

  const templateUniqueName =
    eventId || slug
      ? template.template?.unique_name
      : templateId
      ? template?.unique_name
      : undefined;

  const ComponentToRender = templateUniqueName
    ? DynamicComponents[templateUniqueName as TemplateName]
    : null;

  if (!ComponentToRender) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-3xl font-bold ">Not Found</p>
      </div>
    );
  }

  const config =
    eventId || slug
      ? template?.config
      : templateId
      ? template?.defaultConfig
      : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 relative">
      <LanguageProvider>
        <ComponentToRender config={config} data={event || ({} as Event)} />
      </LanguageProvider>
    </div>
  );
}
