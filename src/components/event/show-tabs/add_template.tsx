"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Check, EyeIcon, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/composable/loading/loading";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";

interface Template {
  id: string;
  name: string;
  type: string;
  image?: string;
  unique_name: string;
  status: string;
  createdAt: string;
  added?: boolean;
}

export default function TabAddTemplate() {
  const { id: eventId } = useParams(); // eventId comes from /event/[id]/add-template
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("common");
  const [totalTemplate, setTotalTemplate] = useState<number>(0);
  const { data: session } = useSession();
  const limitTemplate = session?.user?.plans?.[0]?.limit_template ?? 0;

  useEffect(() => {
    if (!eventId) return;

    async function fetchTemplates() {
      try {
        const res = await fetch(`/api/admin/event/${eventId}/add-template`);
        const data = await res.json();
        if (data.success) {
          setTemplates(data.data);
        }
      } catch (error) {
        console.error("Error loading templates:", error);
      } finally {
        setLoading(false);
      }
    }
    async function fetchTemplateCount() {
      try {
        const res = await fetch(`/api/admin/event/${eventId}/template-count`);
        const data = await res.json();
        setTotalTemplate(data.totalTemplates); // <-- store count
      } catch (error) {
        console.error("Error fetching template count:", error);
      }
    }

    fetchTemplateCount();
    fetchTemplates();
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center ">
        <Loading variant="circle" size="lg" />
      </div>
    );
  }

  if (templates.length === 0) {
    return <div>{t("add_template.no_templates")}</div>;
  }
  const handleSelectTemplate = async (templateId: string) => {
    if (session?.user?.role !== "admin" && totalTemplate >= limitTemplate) {
      toast.error(t("add_template.limit_reached"));
      return;
    }

    try {
      const res = await fetch(`/api/admin/event/${eventId}/add-template`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(t("add_template.template_added"));

        // Update template list
        setTemplates((prev) =>
          prev.map((tpl) =>
            tpl.id === templateId ? { ...tpl, added: true } : tpl
          )
        );

        // ✅ Increase totalTemplate count
        setTotalTemplate((prev) => prev + 1);
      } else {
        toast.error(
          t("add_template.template_add_failed", { message: data.message })
        );
      }
    } catch (err) {
      console.error(err);
      toast.error(t("add_template.something_wrong"));
    }
  };

  return (
    <div>
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          {t("add_template.title")}
          <span className="text-sm text-gray-500">
            {totalTemplate}/{limitTemplate}
          </span>
          {totalTemplate >= limitTemplate &&
            session?.user?.role !== "admin" && (
              <Badge variant="destructive" className="text-xs">
                {t("add_template.limit_reached")}
              </Badge>
            )}
        </h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 xl:gap-6 p-6">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="group relative bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
          >
            {/* Template Image */}
            {tpl.image ? (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={tpl.image || "/placeholder.svg"}
                  alt={tpl.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ) : (
              <div className="h-48 bg-muted flex items-center justify-center">
                <div className="text-muted-foreground text-sm font-medium">
                  {t("add_template.no_preview")}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 p-2 flex flex-col">
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-lg text-card-foreground leading-tight text-balance">
                    {tpl.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className="ml-2 text-xs capitalize shrink-0"
                  >
                    {tpl.type}
                  </Badge>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 flex gap-2 w-full  justify-between">
                <Button
                  onClick={() => {
                    // Only block if NOT admin
                    if (
                      session?.user?.role !== "admin" &&
                      totalTemplate >= limitTemplate
                    ) {
                      toast.error(t("add_template.limit_reached"));
                      return; // stop normal users when limit reached
                    }

                    // Admins skip the check and can always add
                    handleSelectTemplate(tpl.id);
                  }}
                  disabled={tpl.added}
                >
                  {tpl.added ? (
                    <>
                      <Check className="w-4 h-4" />
                      {t("add_template.already_added")}
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      {t("add_template.select_template")}
                    </>
                  )}
                </Button>

                <Button asChild className="flex items-center gap-2">
                  <Link href={`/preview/${tpl.id}`} target="_blank">
                    <EyeIcon className="w-4 h-4" />
                    {t("add_template.preview")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
