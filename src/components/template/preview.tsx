"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// Dynamic templates
const DynamicComponents = {
  WeddingBasicTemplete: dynamic(() => import("./wedding/basic-template"), {
    loading: () => <LoadingScreen />,
    ssr: false,
  }),
  WeddingTraditionalTemplate: dynamic(
    () => import("./wedding/traditional-template"),
    {
      loading: () => <LoadingScreen />,
      ssr: false,
    }
  ),
  WeddingStyleTemplate: dynamic(() => import("./wedding/style-template"), {
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

export default function Preview({ id }: { id: string }) {
  const [template, setTemplate] = useState<any>(null);

  // Fetch template once
  useEffect(() => {
    if (!id) return;
    getPreviewTemplate(id).then((data) => data && setTemplate(data));
  }, [id]);

  // Sample data
  if (!template) {
    return <LoadingScreen />;
  }

  enum TemplateName {
    WeddingBasicTemplete = "WeddingBasicTemplete",
    WeddingTraditionalTemplate = "WeddingTraditionalTemplate",
    WeddingStyleTemplate = "WeddingStyleTemplate",
  }

  const ComponentToRender =
    DynamicComponents[template.unique_name as TemplateName];

  return (
    <div className="bg-gradient-to-br from-red-50 to-yellow-50">
      {ComponentToRender && (
        <ComponentToRender
          data={{
            groom: template.groom,
            bride: template.bride,
            ceremony: template.ceremony,
          }}
        />
      )}
    </div>
  );
}
