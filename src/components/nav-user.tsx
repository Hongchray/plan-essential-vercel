"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export function NavUser() {
  const { data: session } = useSession();
  const user = session?.user;

  const { isMobile } = useSidebar();

  if (!user) return null; // user not logged in

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" }); // redirect after logout
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              {/* Avatar */}
              <Avatar className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg">
                <AvatarImage
                  src={user.photoUrl ?? undefined}
                  alt={user.name ?? "User"}
                />
                <AvatarFallback className="rounded-lg">
                  {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                </AvatarFallback>
              </Avatar>

              {/* Name & Phone */}
              <div className="grid flex-1 text-left text-xs sm:text-sm leading-tight sm:leading-tight">
                <span className="font-medium">{user.name}</span>
                <span>{user.phone}</span>
              </div>

              {/* Chevron */}
              <ChevronsUpDown className="ml-auto h-3 w-3 sm:h-4 sm:w-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-[14rem] sm:min-w-[16rem] rounded-lg text-xs sm:text-sm"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 px-1 py-1.5 sm:px-2 sm:py-2 text-left text-xs sm:text-sm">
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg">
                  <AvatarImage
                    src={user.photoUrl ?? undefined}
                    alt={user.name ?? undefined}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-xs sm:text-sm leading-tight sm:leading-tight">
                  <span className="font-medium">{user.name}</span>
                  <span>{user.phone}</span>
                  {user.username && <span>{user.username}</span>}
                  {user.role && <span className="capitalize">{user.role}</span>}
                  {user.telegramId && <span>{user.telegramId}</span>}
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                <BadgeCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
                Notification
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
