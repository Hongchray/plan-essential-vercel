"use client";

import TabDashboard from "@/components/event/show-tabs/dashoard";
import TabExpense from "@/components/event/show-tabs/expense";
import TabGift from "@/components/event/show-tabs/gift";
import TabGuest from "@/components/event/show-tabs/guest";
import TabTemplate from "@/components/event/show-tabs/template";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import { Gift, LayoutDashboard, Mail, Receipt, Users } from "lucide-react";

export default function showEvent({
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
  const param =  React.use(params);
  const router = useRouter()
  const [tab, setTab] = useState("");
  // Set default tab from hash or dashboard
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) setTab(hash);
    else setTab("dashboard");

    const handleHashChange = () => {
      const newHash = window.location.hash.replace("#", "");
      if (newHash) setTab(newHash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

    // // Update hash when tab changes
    const handleChange = (value: string) => {
        setTab(value)
        router.replace(`/event/${param.id}#${value}`)
    }
    return (
        <div className="p-6 border rounded-md  bg-white  mx-auto">
            <Tabs  className="" value={tab} onValueChange={handleChange}>
                <TabsList className="h-full p-2 gap-2">
                    <TabsTrigger
                      value="dashboard"
                      className="flex flex-col gap-1 py-3 px-2 transition-all duration-300 ease-in-out hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:scale-105"
                    >
                      <LayoutDashboard
                        className={`h-4 w-4 transition-all duration-300 ${tab === "dashboard" ? "text-primary scale-110" : "text-muted-foreground"}`}
                      />
                      <span
                        className={`text-xs transition-all duration-300 ${tab === "dashboard" ? "text-primary font-medium" : "text-muted-foreground"}`}
                      >
                        Dashboard
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="guests"
                      className="flex flex-col gap-1 py-3 px-2 transition-all duration-300 ease-in-out hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:scale-105"
                    >
                      <Users
                        className={`h-4 w-4 transition-all duration-300 ${tab === "guests" ? "text-primary scale-110" : "text-muted-foreground"}`}
                      />
                      <span
                        className={`text-xs transition-all duration-300 ${tab === "guests" ? "text-primary font-medium" : "text-muted-foreground"}`}
                      >
                        Guests
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="expense"
                      className="flex flex-col gap-1 py-3 px-2 transition-all duration-300 ease-in-out hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:scale-105"
                    >
                      <Receipt
                        className={`h-4 w-4 transition-all duration-300 ${tab === "expense" ? "text-primary scale-110" : "text-muted-foreground"}`}
                      />
                      <span
                        className={`text-xs transition-all duration-300 ${tab === "expense" ? "text-primary font-medium" : "text-muted-foreground"}`}
                      >
                        Expense
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="gifts"
                      className="flex flex-col gap-1 py-3 px-2 transition-all duration-300 ease-in-out hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:scale-105"
                    >
                      <Gift
                        className={`h-4 w-4 transition-all duration-300 ${tab === "gifts" ? "text-primary scale-110" : "text-muted-foreground"}`}
                      />
                      <span
                        className={`text-xs transition-all duration-300 ${tab === "gifts" ? "text-primary font-medium" : "text-muted-foreground"}`}
                      >
                        Wedding Gifts
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="template"
                      className="flex flex-col gap-1 py-3 px-2 transition-all duration-300 ease-in-out hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:scale-105"
                    >
                      <Mail
                        className={`h-4 w-4 transition-all duration-300 ${tab === "template" ? "text-primary scale-110" : "text-muted-foreground"}`}
                      />
                      <span
                        className={`text-xs transition-all duration-300 ${tab === "template" ? "text-primary font-medium" : "text-muted-foreground"}`}
                      >
                        Invite's Template
                      </span>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="dashboard">
                    <div>
                       <TabDashboard />
                    </div>
                </TabsContent>
                <TabsContent value="guests">
                    <div>
                        <TabGuest paramId={param.id} searchParams={searchParams} />
                    </div>
                </TabsContent>
                <TabsContent value="expense">
                    <div>
                        <TabExpense paramId={param.id} searchParams={searchParams} />
                    </div>
                </TabsContent>
                <TabsContent value="gifts">
                    <div>
                        {/* <TabGift guests={guests} setGuests={setGuests} expenses={expenses} setExpenses={setExpenses} /> */}
                    </div>
                </TabsContent>
                <TabsContent value="template">
                    <div>
                        {/* <TabTemplate guests={guests} setGuests={setGuests} expenses={expenses} setExpenses={setExpenses} /> */}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
