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
                width={20}
                height={20}
                className="mr-1"
              />{" "}
              <span className="text-base font-semibold ">Plan Essential</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
