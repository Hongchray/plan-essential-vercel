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

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Store Name",
      logo: GalleryVerticalEnd,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconHome,
    },
    {
      title: "Users",
      url: "/user",
      icon: IconBuildingStore,
    },
    {
      title: "Event",
      url: "/event",
      icon: IconListDetails,
    },
    {
      title: "Template",
      url: "/template",
      icon: IconPackage,
    },
    {
      title: "Setting",
      url: "#",
      icon: IconSettings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <LogoApp />
      </SidebarHeader>
      <SidebarContent>
        <NavMainBasic items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
