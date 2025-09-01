"use client";

import TabDashboard from "@/components/event/show-tabs/dashoard";
import TabExpense from "@/components/event/show-tabs/expense";
import TabGift from "@/components/event/show-tabs/gift";
import TabGuest from "@/components/event/show-tabs/guest";
import TabTemplate from "@/components/event/show-tabs/template";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Guest = {
  id: number;
  name: string;
  email: string;
  status: "confirmed" | "pending" | "declined";
  group: string;
  tags: string[];
  gift: { received: boolean; item: string; value: number };
};

type Expense = {
  id: number;
  category: string;
  description: string;
  amount: number;
  date: string;
  paid: boolean;
};

// Define segment params for this route
export interface SegmentParams {
  id: string;
}

// Props passed to the page
export interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: any;
}
export default async function ShowEvent({ params }: PageProps) {
  const router = useRouter();
  const { id } = await params;
  const [tab, setTab] = useState<string>("");

  const [guests, setGuests] = useState<Guest[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      status: "confirmed",
      group: "Groom's side",
      tags: ["high school friend", "college roommate"],
      gift: { received: true, item: "Kitchen Blender", value: 120 },
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      status: "pending",
      group: "Bride's side",
      tags: ["work colleague"],
      gift: { received: false, item: "", value: 0 },
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      status: "declined",
      group: "Groom's side",
      tags: ["team mate", "neighbor"],
      gift: { received: false, item: "", value: 0 },
    },
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 1,
      category: "Venue",
      description: "Wedding venue booking",
      amount: 5000,
      date: "2024-01-15",
      paid: true,
    },
    {
      id: 2,
      category: "Catering",
      description: "Wedding dinner for 100 guests",
      amount: 3500,
      date: "2024-02-01",
      paid: true,
    },
    {
      id: 3,
      category: "Photography",
      description: "Wedding photographer",
      amount: 1200,
      date: "2024-03-01",
      paid: false,
    },
    {
      id: 4,
      category: "Flowers",
      description: "Bridal bouquet and decorations",
      amount: 800,
      date: "2024-03-15",
      paid: false,
    },
    {
      id: 5,
      category: "Music",
      description: "DJ and sound system",
      amount: 600,
      date: "2024-04-01",
      paid: false,
    },
  ]);

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

  // Update hash when tab changes
  const handleChange = (value: string) => {
    setTab(value);
    router.push(`#${value}`);
  };

  return (
    <div className="p-6 border rounded-md bg-white mx-auto">
      <Tabs value={tab} onValueChange={handleChange}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="guests">Guests</TabsTrigger>
          <TabsTrigger value="expense">Expense</TabsTrigger>
          <TabsTrigger value="gifts">Wedding Gifts</TabsTrigger>
          <TabsTrigger value="template">Invite's Template</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <TabDashboard guests={guests} expenses={expenses} />
        </TabsContent>

        <TabsContent value="guests">
          <TabGuest guests={guests} setGuests={setGuests} />
        </TabsContent>

        <TabsContent value="expense">
          <TabExpense expenses={expenses} setExpenses={setExpenses} />
        </TabsContent>

        <TabsContent value="gifts">
          <TabGift
            guests={guests}
            setGuests={setGuests}
            expenses={expenses}
            setExpenses={setExpenses}
          />
        </TabsContent>

        <TabsContent value="template">
          <TabTemplate
            guests={guests}
            setGuests={setGuests}
            expenses={expenses}
            setExpenses={setExpenses}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
