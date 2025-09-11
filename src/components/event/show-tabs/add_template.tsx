"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Check, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/composable/loading/loading";
import Link  from "next/link";
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
    return <div>No templates found.</div>;
  }
  const handleSelectTemplate = async (templateId: string) => {
    try {
      const res = await fetch(`/api/admin/event/${eventId}/add-template`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Template added successfully!");

        // ✅ Update local state so button marks as "Already Added"
        setTemplates((prev) =>
          prev.map((tpl) =>
            tpl.id === templateId ? { ...tpl, added: true } : tpl
          )
        );
      } else {
        toast.error(`Failed: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
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
                No Preview
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
            <div className="mt-6 flex gap-2 w-full">
              <Button
                onClick={() => handleSelectTemplate(tpl.id)}
                disabled={tpl.added}
                className={`flex-1 font-medium transition-all duration-200 ${
                  tpl.added
                    ? "bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md"
                }`}
                size="lg"
              >
                {tpl.added ? (
                  <>
                    <Check className="w-4 h-4" />
                    Already Added
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Select Template
                  </>
                )}
              </Button>

              <Button className="flex-none">
                <Link href={`/preview/${tpl.id}`} target="_blank">
                  Preview
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
