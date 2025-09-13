import { IconInnerShadowTop } from "@tabler/icons-react";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Link from "next/link";
import Image from "next/image";

export function LogoApp() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className="data-[slot=sidebar-menu-button]:!p-[0]"
          >
            <Link href="/dashboard">
              <Image
                src="/logo.png"
                alt="Logo"
                width={34}
                height={34}
                className="mr-0.5"
              />
              <span className="text-xl font-bold text-primary">plan essential</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
