import { IconInnerShadowTop } from "@tabler/icons-react";
import {  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import Link from "next/link";

export function LogoApp(){
    return(
            <SidebarHeader>
                <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                    asChild
                    className="data-[slot=sidebar-menu-button]:!p-[0]"
                    >
                    <Link href="/admin/dashboard">
                        <IconInnerShadowTop className="!size-5 mr-1" />
                        <span className="text-base font-semibold ">Plan Essential</span>
                    </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
    );
}