"use client";

import TabDashboard from "@/components/event/show-tabs/dashoard";
import TabExpense from "@/components/event/show-tabs/expense";
import TabGift from "@/components/event/show-tabs/gift";
import TabGuest from "@/components/event/show-tabs/guest";
import TabTemplate from "@/components/event/show-tabs/template";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState, use, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  Gift,
  LayoutDashboard,
  Mail,
  PlusIcon,
  Receipt,
  Users,
} from "lucide-react";
import TabAddTemplate from "@/components/event/show-tabs/add_template";
import { ClientOnly } from "@/components/composable/ClientOnly";
interface EventTabsProps {
  eventId: string;
}
export default function ShowEvent({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    page?: string;
    per_page?: number;
    search?: string;
    sort?: string;
    order?: string;
  }>;
}) {
  const router = useRouter();
  const [tab, setTab] = useState("dashboard"); // default tab
  const { t } = useTranslation("common");

  const resolvedParams = use(params);

  const eventId = resolvedParams.id;

  // Set default tab from hash or "dashboard"
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) setTab(hash);

    const handleHashChange = () => {
      const newHash = window.location.hash.replace("#", "");
      if (newHash) setTab(newHash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Update hash when tab changes
  const handleChange = (value: string) => {
    setTab(value);
    router.replace(`/event/${eventId}#${value}`);
  };

  return (
    <div className="p-6 border rounded-md  bg-white  mx-auto">
      <Tabs className="" value={tab} onValueChange={handleChange}>
        <TabsList className="h-full p-2 gap-2">
          <TabsTrigger
            value="dashboard"
            className="flex flex-col gap-1 py-3 px-2 transition-all duration-300 ease-in-out hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:scale-105"
          >
            <LayoutDashboard
              className={`h-4 w-4 transition-all duration-300 ${
                tab === "dashboard"
                  ? "text-primary scale-110"
                  : "text-muted-foreground"
              }`}
            />

            <ClientOnly>
              <span
                className={`text-xs transition-all duration-300 ${
                  tab === "dashboard"
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {t("event_dashboard.tab.dashboard")}
              </span>
            </ClientOnly>
          </TabsTrigger>

          <TabsTrigger
            value="guests"
            className="flex flex-col gap-1 py-3 px-2 transition-all duration-300 ease-in-out hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:scale-105"
          >
            <Users
              className={`h-4 w-4 transition-all duration-300 ${
                tab === "guests"
                  ? "text-primary scale-110"
                  : "text-muted-foreground"
              }`}
            />
            <ClientOnly>
              <span
                className={`text-xs transition-all duration-300 ${
                  tab === "guests"
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {t("event_dashboard.tab.guest")}
              </span>
            </ClientOnly>
          </TabsTrigger>
          <TabsTrigger
            value="expense"
            className="flex flex-col gap-1 py-3 px-2 transition-all duration-300 ease-in-out hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:scale-105"
          >
            <Receipt
              className={`h-4 w-4 transition-all duration-300 ${
                tab === "expense"
                  ? "text-primary scale-110"
                  : "text-muted-foreground"
              }`}
            />

            <ClientOnly>
              <span
                className={`text-xs transition-all duration-300 ${
                  tab === "expense"
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {t("event_dashboard.tab.expense")}
              </span>
            </ClientOnly>
          </TabsTrigger>
          <TabsTrigger
            value="gifts"
            className="flex flex-col gap-1 py-3 px-2 transition-all duration-300 ease-in-out hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:scale-105"
          >
            <Gift
              className={`h-4 w-4 transition-all duration-300 ${
                tab === "gifts"
                  ? "text-primary scale-110"
                  : "text-muted-foreground"
              }`}
            />
            <ClientOnly>
              <span
                className={`text-xs transition-all duration-300 ${
                  tab === "gifts"
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {t("event_dashboard.tab.wedding_gift")}
              </span>
            </ClientOnly>
          </TabsTrigger>
          <TabsTrigger
            value="template"
            className="flex flex-col gap-1 py-3 px-2 transition-all duration-300 ease-in-out hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:scale-105"
          >
            <Mail
              className={`h-4 w-4 transition-all duration-300 ${
                tab === "template"
                  ? "text-primary scale-110"
                  : "text-muted-foreground"
              }`}
            />
            <ClientOnly>
              <span
                className={`text-xs transition-all duration-300 ${
                  tab === "template"
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {t("event_dashboard.tab.invite_template")}
              </span>
            </ClientOnly>
          </TabsTrigger>
          <TabsTrigger
            value="addTemplate"
            className="flex flex-col gap-1 py-3 px-2 transition-all duration-300 ease-in-out hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:scale-105"
          >
            <PlusIcon
              className={`h-4 w-4 transition-all duration-300 ${
                tab === "addTemplate"
                  ? "text-primary scale-110"
                  : "text-muted-foreground"
              }`}
            />
            <ClientOnly>
              <span
                className={`text-xs transition-all duration-300 ${
                  tab === "addTemplate"
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {t("event_dashboard.tab.add_template")}
              </span>
            </ClientOnly>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <div>
            <TabDashboard eventId={eventId} />
          </div>
        </TabsContent>
        <TabsContent value="guests">
          <div>
            <TabGuest paramId={eventId} searchParams={searchParams} />
          </div>
        </TabsContent>
        <TabsContent value="expense">
          <div>
            <TabExpense paramId={eventId} searchParams={searchParams} />
          </div>
        </TabsContent>
        <TabsContent value="gifts">
          <div>
            <TabGift paramId={eventId} searchParams={searchParams} />
          </div>
        </TabsContent>
        <TabsContent value="template">
          <div>
            <TabTemplate paramId={eventId} />
          </div>
        </TabsContent>
        <TabsContent value="addTemplate">
          <div>
            <TabAddTemplate />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
