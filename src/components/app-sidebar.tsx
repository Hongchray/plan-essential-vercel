"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMainBasic } from "./nav-main-basic";
import { LogoApp } from "./logo-app";

import {
  IconHome,
  IconBuildingStore,
  IconListDetails,
  IconPackage,
  IconSettings,
} from "@tabler/icons-react";
import { NavUser } from "./nav-user";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation("common");

  interface NavItem {
    title: string;
    url: string;
    icon?: React.ComponentType;
  }

  const [navMain, setNavMain] = React.useState<NavItem[]>([]);

  React.useEffect(() => {
    setNavMain([
      { title: t("navbar.dashboard"), url: "/dashboard", icon: IconHome },
      { title: t("navbar.users"), url: "/user", icon: IconBuildingStore },
      { title: t("navbar.event"), url: "/event", icon: IconListDetails },
      { title: t("navbar.template"), url: "/template", icon: IconPackage },
      { title: t("navbar.setting"), url: "#", icon: IconSettings },
    ]);
  }, [t]);

  if (!navMain.length) return null; // wait until mounted

  return (
    <Sidebar collapsible="icon" className="z-50" {...props}>
      <SidebarHeader>
        <LogoApp />
      </SidebarHeader>

      <SidebarContent>
        <NavMainBasic items={navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
