"use client";
import { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { Event } from "@/interfaces/event";
import { Check, Cog, Maximize2, Minimize2, Save, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { Loading } from "@/components/composable/loading/loading";
import { LanguageProvider } from "@/hooks/LanguageContext";
// Dynamic templates
const PreviewComponents = {
  WeddingSimpleTemplate: dynamic(
    () => import("@/components/template/wedding/simple-template"),
    {
      loading: () => <LoadingScreen />,
      ssr: false,
    }
  ),
  WeddingSpecialTemplate: dynamic(
    () => import("@/components/template/wedding/special-template"),
    {
      loading: () => <LoadingScreen />,
      ssr: false,
    }
  ),
};

const EditorComponents = {
  WeddingSimpleTemplateEditor: dynamic(
    () => import("@/components/template/wedding/simple-template-editor"),
    {
      loading: () => <LoadingScreen />,
      ssr: false,
    }
  ),
  WeddingSpecialTemplateEditor: dynamic(
    () => import("@/components/template/wedding/special-template-editor"),
    {
      loading: () => <LoadingScreen />,
      ssr: false,
    }
  ),
};

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

export default function TabTemplate({ paramId }: { paramId: string }) {
  // This is the main state that both editor and preview will use
  const [config, setConfig] = useState<any>({});
  const [template, setTemplate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [eventTemplate, setEventTemplate] = useState<any[]>([]);
  const [isFullscreenEditor, setIsFullscreenEditor] = useState(false);
  const [event, setEvent] = useState<Event>({} as Event);
  const { t } = useTranslation("common");

  // Fetch template once and initialize config
  useEffect(() => {
    if (!paramId) return;

    setIsLoading(true);
    getEvent(paramId).then((data) => {
      if (data) {
        setEvent(data);
      }
    });
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
    const selectedTemplate = eventTemplate.find(
      (item) => item.id === templateId
    );
    if (selectedTemplate) {
      setTemplate(selectedTemplate);
      setConfig(selectedTemplate.config || {});
      toast.success(
        `${t("templates.switch_to")} ${selectedTemplate.template.name}`
      );
    }
  };

  // Save configuration
  const handleSave = async () => {
    if (!template?.id) return;

    setIsSaving(true);
    try {
      const response = await fetch(
        `/api/admin/event/${paramId}/template/${template.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            config: config,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      toast.success(t("templates.save_success"));
    } catch (error) {
      toast.error(t("templates.save_failed"));
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const setDefaultTemplate = async () => {
    try {
      const response = await fetch(
        `/api/admin/event/${paramId}/template/${template.id}/default`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      toast.success(t("templates.save_success"));
      getPreviewTemplate(paramId).then((data) => {
        if (data) {
          setEventTemplate(data);
          setTemplate(data[0]);
          setConfig(data[0].config);
        }
        setIsLoading(false);
      });
    } catch (error) {
      toast.error(t("templates.save_failed"));
      console.error("Save error:", error);
    } finally {
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
      toast.success(t("templates.reset_success"));
    } catch (error) {
      toast.error(t("templates.reset_failed"));
      console.error("Reset error:", error);
    }
  };

  // Toggle fullscreen editor
  const toggleFullscreenEditor = () => {
    setIsFullscreenEditor(!isFullscreenEditor);
  };

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullscreenEditor) {
        setIsFullscreenEditor(false);
      }
    };

    if (isFullscreenEditor) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
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
    return (
      <div className="flex items-center justify-center ">
        <Loading variant="circle" size="lg" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{t("templates.template_not_found")}</p>
      </div>
    );
  }

  enum TemplateName {
    WeddingSimpleTemplate = "WeddingSimpleTemplate",
    WeddingSpecialTemplate = "WeddingSpecialTemplate",
  }

  enum EditorName {
    WeddingSimpleTemplateEditor = "WeddingSimpleTemplateEditor",
    WeddingSpecialTemplateEditor = "WeddingSpecialTemplateEditor",
  }

  const ComponentToRender =
    PreviewComponents[template.template.unique_name as TemplateName];
  const EditorToRender =
    EditorComponents[`${template.template.unique_name}Editor` as EditorName];

  if (isFullscreenEditor) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        {/* Fullscreen Header */}
        <div className="h-16 bg-gray-800 text-white flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">
              {t("templates.full_screen.title")}
            </h2>
            <div className="text-sm text-gray-300">
              {template.template?.name || template.template?.unique_name}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              variant="default"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                  {t("templates.full_screen.saving")}
                </div>
              ) : (
                <>
                  <Save />
                  {t("templates.default_screen.save")}
                </>
              )}
            </Button>
            <Button
              size="sm"
              onClick={toggleFullscreenEditor}
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <Minimize2 className="h-4 w-4 mr-2" />
              {t("templates.full_screen.exit_fullscreen")}
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
        <LanguageProvider>
          <div className="bg-gray-50">
            <div className=" mx-auto">
              <ResizablePanelGroup direction="horizontal">
                {/* Editor Panel */}
                <ResizablePanel defaultSize={30} minSize={25}>
                  <div className="p-8 h-[calc(100vh-80px)] overflow-y-auto bg-gray-50 mb-8">
                    {EditorToRender && config !== undefined ? (
                      <EditorToRender config={config} setConfig={setConfig} />
                    ) : (
                      <div className="text-center text-gray-500 mt-8">
                        <p>{t("templates.full_screen.editor_not_available")}</p>
                        <p className="text-sm mt-2">
                          {t("templates.full_screen.template")}:{" "}
                          {template.template?.unique_name}
                        </p>
                      </div>
                    )}
                  </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Preview Panel */}
                <ResizablePanel defaultSize={70} minSize={40}>
                  <div className="h-[calc(100vh-80px)] overflow-y-auto">
                    <div className=" min-h-full pb-[50px]">
                      {ComponentToRender && config !== undefined ? (
                        <ComponentToRender config={config} data={event} />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-gray-500">
                            {t("templates.full_screen.preview_not_available")}
                          </p>
                          <p className="text-sm text-gray-400 mt-2">
                            {t("templates.full_screen.component")}:{" "}
                            {template.template?.unique_name}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </div>
        </LanguageProvider>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">
        {t("templates.default_screen.my_templates")}
      </h3>
      <div className="flex gap-2">
        <Select value={template.id} onValueChange={handleTemplateSwitch}>
          <SelectTrigger className="w-[280px] border-dashed border-2">
            <SelectValue
              placeholder={t("templates.default_screen.select_template")}
            />
          </SelectTrigger>
          <SelectContent>
            {eventTemplate.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={setDefaultTemplate}>
          {template.isDefault ? (
            <>
              <Check /> <div>បានប្រើ</div>
            </>
          ) : (
            <>
              <Cog /> <div>ដាក់ប្រើ</div>
            </>
          )}
        </Button>
      </div>
      <div className="h-[750px] border-dashed border-3 rounded ">
        <LanguageProvider>
          <ResizablePanelGroup direction="horizontal">
            {/* Editor Panel */}
            <ResizablePanel defaultSize={30} minSize={25}>
              <div className="p-2 border-b shadow-md bg-gray-800 text-white h-[50px] flex items-center justify-between rounded-tl">
                <div className="font-bold">
                  {t("templates.default_screen.editor")}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={toggleFullscreenEditor}
                    variant="ghost"
                    className="text-white hover:bg-gray-700 p-1 h-8 w-8"
                    title={t("templates.default_screen.fullscreen_editor")}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="px-4 py-6 h-[calc(100%-50px)] overflow-y-auto bg-gray-50">
                {EditorToRender && config !== undefined ? (
                  <EditorToRender config={config} setConfig={setConfig} />
                ) : (
                  <div className="text-center text-gray-500 mt-8">
                    <p>{t("templates.default_screen.editor_not_available")}</p>
                    <p className="text-sm mt-2">
                      {t("templates.default_screen.template")}:{" "}
                      {template.template?.unique_name}
                    </p>
                  </div>
                )}
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Preview Panel */}
            <ResizablePanel defaultSize={70} minSize={40}>
              <div className="p-2 border-b shadow h-[50px] flex items-center justify-between bg-white">
                <span className="font-bold">
                  {t("templates.default_screen.preview_template")}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {template.template?.name || template.template?.unique_name}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                          {t("templates.default_screen.saving")}
                        </div>
                      ) : (
                        <>
                          <Save />
                          {t("templates.default_screen.save")}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="h-[calc(100%-50px)] overflow-y-auto">
                <div className="bg-gradient-to-br from-red-50 to-yellow-50 min-h-full">
                  {ComponentToRender && config !== undefined ? (
                    <ComponentToRender config={config} data={event} />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">
                        {t("templates.default_screen.preview_not_available")}
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        {t("templates.default_screen.component")}:{" "}
                        {template.template?.unique_name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </LanguageProvider>
      </div>
    </div>
  );
}
