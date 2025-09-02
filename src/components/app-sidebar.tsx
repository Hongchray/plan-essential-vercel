"use client";
import * as React from "react";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMainBasic } from "./nav-main-basic";
import {
  IconListDetails,
  IconPackage,
  IconHome,
  IconBuildingStore,
  IconSettings,
} from "@tabler/icons-react";
import { GalleryVerticalEnd } from "lucide-react";
import { LogoApp } from "./logo-app";
import { useSession } from "next-auth/react";

// Sample navigation data
const navMain = [
  { title: "Dashboard", url: "/dashboard", icon: IconHome },
  { title: "Users", url: "/user", icon: IconBuildingStore },
  { title: "Event", url: "/event", icon: IconListDetails },
  { title: "Template", url: "/template", icon: IconPackage },
  { title: "Setting", url: "#", icon: IconSettings },
];

// Sample teams (optional)
const teams = [{ name: "Store Name", logo: GalleryVerticalEnd, plan: "Free" }];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession();

  // If user is not logged in, you can show a default user or empty
  const user = session?.user || {
    name: "Guest",
    email: "guest@example.com",
    photoUrl: "/avatars/default.png", // default avatar
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <LogoApp />
      </SidebarHeader>
      <SidebarContent>
        <NavMainBasic items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
