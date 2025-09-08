"use client";
import { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Preview from "@/components/template/preview";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// Dynamic templates
const DynamicComponents = {
  WeddingBasicTemplete: dynamic(() => import("@/components/template/wedding/basic-template"), {
    loading: () => <LoadingScreen />,
    ssr: false,
  }),
  WeddingTraditionalTemplate: dynamic(
    () => import("@/components/template/wedding/traditional-template"),
    {
      loading: () => <LoadingScreen />,
      ssr: false,
    }
  ),
  WeddingStyleTemplate: dynamic(() => import("@/components/template/wedding/style-template"), {
    loading: () => <LoadingScreen />,
    ssr: false,
  }),
  WeddingSimpleTemplate: dynamic(() => import("@/components/template/wedding/simple-template"), {
    loading: () => <LoadingScreen />,
    ssr: false,
  }),
};

const EditorComponent = {
  WeddingSimpleTemplateEditor: dynamic(() => import("@/components/template/wedding/simple-template-editor"), {
    loading: () => <LoadingScreen />,
    ssr: false,
  }),
}

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

export default function TabTemplate({id}: {id: string}) {
  // This is the main state that both editor and preview will use
  const [config, setConfig] = useState<any>({});
  const [template, setTemplate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch template once and initialize config
  useEffect(() => {
    if (!id) return;
    
    setIsLoading(true);
    getPreviewTemplate(id).then((data) => {
      if (data) {
        setTemplate(data);
        // Initialize config with defaultConfig
        setConfig(data?.defaultConfig || {});
      }
      setIsLoading(false);
    });
  }, [id]);

  // Save configuration
  const handleSave = async () => {
    if (!template?.id) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/template/${template.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          defaultConfig: config
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      toast.success("Template saved successfully!");
    } catch (error) {
      toast.error("Failed to save template");
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save functionality (optional)
  useEffect(() => {
    if (!template?.id || !config) return;

    const autoSaveTimer = setTimeout(() => {
      // Auto-save after 3 seconds of no changes
      // You can enable this if you want auto-save
      // handleSave();
    }, 3000);

    return () => clearTimeout(autoSaveTimer);
  }, [config, template?.id]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!template) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Template not found</p>
      </div>
    );
  }

  enum TemplateName {
    WeddingBasicTemplete = "WeddingBasicTemplete",
    WeddingTraditionalTemplate = "WeddingTraditionalTemplate",
    WeddingStyleTemplate = "WeddingStyleTemplate",
    WeddingSimpleTemplate = "WeddingSimpleTemplate",
  }

  enum EditorName {
    WeddingSimpleTemplateEditor = "WeddingSimpleTemplateEditor",
  }

  const ComponentToRender = DynamicComponents[template.unique_name as TemplateName];
  const EditorToRender = EditorComponent[`${template.unique_name}Editor` as EditorName];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Wedding Invitation Editor</h3>
      <div className="h-[750px] border-dashed border-2 rounded">
        <ResizablePanelGroup direction="horizontal">
          {/* Editor Panel */}
          <ResizablePanel defaultSize={30} minSize={25}>
            <div className="p-2 border-b shadow-md bg-gray-800 text-white h-[50px] flex items-center justify-between rounded-tl">
              <div className="font-bold">Editor</div>
              <div className=" animate-pulse">
                {Object.keys(config).length > 0 ? "●" : "○"} Live
              </div>
            </div>
            <div className="px-4 py-6 h-[calc(100%-50px)] overflow-y-auto bg-gray-50">
              {EditorToRender && config ? (
                <EditorToRender
                  config={config}
                  setConfig={setConfig}
                />
              ) : (
                <div className="text-center text-gray-500 mt-8">
                  <p>Editor not available for this template</p>
                </div>
              )}
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Preview Panel */}
          <ResizablePanel defaultSize={70} minSize={40}>
            <div className="p-2 border-b shadow h-[50px] flex items-center justify-between bg-white">
              <span className="font-bold">Preview Template</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {template.name || template.unique_name}
                </span>
                <Button 
                  size="sm" 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSaving ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </div>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
            <div className="h-[calc(100%-50px)] overflow-y-auto">
              <div className="bg-gradient-to-br from-red-50 to-yellow-50 min-h-full">
                {ComponentToRender && config ? (
                  <ComponentToRender
                    config={config}
                    data={{
                      groom: template.groom || {},
                      bride: template.bride || {},
                      ceremony: template.ceremony || {},
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Preview not available</p>
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      
      {/* Status Bar */}
      <div className="flex justify-between items-center text-xs text-gray-500 px-2">
        <div>
          Template: {template.unique_name} | ID: {template.id}
        </div>
        <div>
          Last modified: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}