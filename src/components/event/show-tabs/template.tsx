"use client";
import { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { Event } from "@/interfaces/event";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Maximize2, Minimize2, X } from "lucide-react";

// Dynamic templates
const PreviewComponents = {
  WeddingSimpleTemplate: dynamic(() => import("@/components/template/wedding/simple-template"), {
    loading: () => <LoadingScreen />,
    ssr: false,
  }),
};

const EditorComponents = {
  WeddingSimpleTemplateEditor: dynamic(() => import("@/components/template/wedding/simple-template-editor"), {
    loading: () => <LoadingScreen />,
    ssr: false,
  }),
}

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-khmer">កំពុងផ្ទុក...</p>
      </div>
    </div>
  );
}

async function getPreviewTemplate(id: string) {
  try {
    const res = await fetch(`/api/admin/event/${id}/template`);
    if (!res.ok) throw new Error("Failed to fetch template");
    return await res.json();
  } catch {
    toast.error("Error getting template");
    return null;
  }
}

async function getEvent(id: string) {
  try {
    const res = await fetch(`/api/admin/event/${id}`);
    if (!res.ok) throw new Error("Failed to fetch event");
    return await res.json();
  } catch {
    toast.error("Error getting event");
    return null;
  }
}

export default function TabTemplate({paramId}: {paramId: string}) {
  const [config, setConfig] = useState<any>({});
  const [template, setTemplate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [eventTemplate, setEventTemplate] = useState<any[]>([]);
  const [isFullscreenEditor, setIsFullscreenEditor] = useState(false);
  const [event, setEvent] = useState<Event>({} as Event);

  // Fetch template once and initialize config
  useEffect(() => {
    if (!paramId) return;
    
    setIsLoading(true);
    getEvent(paramId).then((data)=>{
      if(data){
        setEvent(data);
      }
    })
    getPreviewTemplate(paramId).then((data) => {
      if (data) {
        setEventTemplate(data);
        setTemplate(data[0]);
        setConfig(data[0].config);
      }
      setIsLoading(false);
    });
  }, [paramId]);

  // Handle template switching
  const handleTemplateSwitch = (templateId: string) => {
    const selectedTemplate = eventTemplate.find((item) => item.id === templateId);
    if (selectedTemplate) {
      setTemplate(selectedTemplate);
      setConfig(selectedTemplate.config || {});
      toast.success(`Switched to ${selectedTemplate.template.name}`);
    }
  };

  // Save configuration
  const handleSave = async () => {
    if (!template?.id) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/event/${paramId}/template/${template.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: config
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

  // Reset to default configuration
  const handleResetDefault = async () => {
    if (!template?.id) return;
    
    try {
      // You might want to fetch the default config from your API
      // For now, let's reset to an empty config
      const defaultConfig = {};
      setConfig(defaultConfig);
      toast.success("Reset to default configuration");
    } catch (error) {
      toast.error("Failed to reset to default");
      console.error('Reset error:', error);
    }
  };

  // Toggle fullscreen editor
  const toggleFullscreenEditor = () => {
    setIsFullscreenEditor(!isFullscreenEditor);
  };

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreenEditor) {
        setIsFullscreenEditor(false);
      }
    };

    if (isFullscreenEditor) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreenEditor]);

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
    WeddingSimpleTemplate = "WeddingSimpleTemplate",
  }

  enum EditorName {
    WeddingSimpleTemplateEditor = "WeddingSimpleTemplateEditor",
  }

  const ComponentToRender = PreviewComponents[template.template.unique_name as TemplateName];
  const EditorToRender = EditorComponents[`${template.template.unique_name}Editor` as EditorName];

  // Fullscreen Editor Modal
  if (isFullscreenEditor) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        {/* Fullscreen Header */}
        <div className="h-16 border-b bg-gray-800 text-white flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">Editor - Fullscreen Mode</h2>
            <div className="text-sm text-gray-300">
              {template.template?.name || template.template?.unique_name}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              size="sm" 
              onClick={handleResetDefault}
              variant="secondary"
              disabled={isSaving}
            >
              Reset default
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave}
              disabled={isSaving}
              variant='default'
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
            <Button
              size="sm"
              onClick={toggleFullscreenEditor}
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <Minimize2 className="h-4 w-4 mr-2" />
              Exit Fullscreen
            </Button>
            <Button
              size="sm"
              onClick={toggleFullscreenEditor}
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-gray-700 p-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Fullscreen Editor Content */}
        <div className="bg-gray-50">
          <div className=" mx-auto">
              <ResizablePanelGroup direction="horizontal">
              {/* Editor Panel */}
              <ResizablePanel defaultSize={30} minSize={25}>
                  <div className="p-8 h-[calc(100vh-80px)] overflow-y-auto bg-gray-50 mb-8">
                    {EditorToRender && config !== undefined ? (
                      <EditorToRender
                        config={config}
                        setConfig={setConfig}
                      />
                    ) : (
                      <div className="text-center text-gray-500 mt-8">
                        <p>Editor not available for this template</p>
                        <p className="text-sm mt-2">
                          Template: {template.template?.unique_name}
                        </p>
                      </div>
                    )}
                  </div>
              </ResizablePanel>
          
                <ResizableHandle withHandle />
    
                {/* Preview Panel */}
                <ResizablePanel defaultSize={70} minSize={40}>
                  <div className="h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="bg-gradient-to-br from-red-50 to-yellow-50 min-h-full">
                      {ComponentToRender && config !== undefined ? (
                        <ComponentToRender
                          config={config}
                          data={event}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-gray-500">Preview not available</p>
                          <p className="text-sm text-gray-400 mt-2">
                            Component: {template.template?.unique_name}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
          </div>
        </div>

        {/* Fullscreen Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-100 border-t px-6 py-3">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <div>
              Template: {template.template?.unique_name} | ID: {template.id}
            </div>
            <div className="flex items-center gap-4">
              <span>Press ESC to exit fullscreen</span>
              <span>Last modified: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">My Templates</h3>
      <div>
        <Select 
          value={template.id} 
          onValueChange={handleTemplateSwitch}
        >
          <SelectTrigger className="w-[280px] border-dashed border-2">
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            {eventTemplate.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="h-[750px] border-dashed border-3 rounded">
        <ResizablePanelGroup direction="horizontal">
          {/* Editor Panel */}
          <ResizablePanel defaultSize={30} minSize={25}>
            <div className="p-2 border-b shadow-md bg-gray-800 text-white h-[50px] flex items-center justify-between rounded-tl">
              <div className="font-bold">Editor</div>
              <div className="flex items-center gap-2">
                <div className="animate-pulse">
                  {Object.keys(config).length > 0 ? "●" : "○"} Live
                </div>
                <Button
                  size="sm"
                  onClick={toggleFullscreenEditor}
                  variant="ghost"
                  className="text-white hover:bg-gray-700 p-1 h-8 w-8"
                  title="Fullscreen Editor"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="px-4 py-6 h-[calc(100%-50px)] overflow-y-auto bg-gray-50">
              {EditorToRender && config !== undefined ? (
                <EditorToRender
                  config={config}
                  setConfig={setConfig}
                />
              ) : (
                <div className="text-center text-gray-500 mt-8">
                  <p>Editor not available for this template</p>
                  <p className="text-sm mt-2">
                    Template: {template.template?.unique_name}
                  </p>
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
                  {template.template?.name || template.template?.unique_name}
                </span>

                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    onClick={handleResetDefault}
                    variant="outline"
                    disabled={isSaving}
                  >
                    Reset default
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSave}
                    disabled={isSaving}
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
            </div>
            <div className="h-[calc(100%-50px)] overflow-y-auto">
              <div className="bg-gradient-to-br from-red-50 to-yellow-50 min-h-full">
                {ComponentToRender && config !== undefined ? (
                  <ComponentToRender
                    config={config}
                    data={event}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Preview not available</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Component: {template.template?.unique_name}
                    </p>
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
          Template: {template.template?.unique_name} | ID: {template.id}
        </div>
        <div>
          Last modified: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}