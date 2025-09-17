"use client";

import { useTranslation } from "react-i18next";
import { AppSidebar } from "@/components/app-sidebar";
import { NavUser } from "@/components/nav-user";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import NextTopLoader from "nextjs-toploader";
import { SessionProvider, useSession } from "next-auth/react";
import { LoadingProvider } from "@/hooks/LoadingContext";
import LanguageSwitcher from "@/components/language-switcher";
import { LocaleFontProvider } from "@/components/locale-font-provider";
import { useEffect, useState } from "react";
import {
  IconHome,
  IconBuildingStore,
  IconListDetails,
  IconPackage,
  IconSettings,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoApp } from "../../components/logo-app";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function DashboardHeader() {
  const { data: session, status } = useSession();
  const { t } = useTranslation("common");
  const pathname = usePathname();

  const [navMain, setNavMain] = useState<
    {
      title: string;
      url: string;
      icon: React.ComponentType<{ size: number }>;
    }[]
  >([]);

  useEffect(() => {
    // Define all possible menu items
    const allMenus = [
      { title: t("navbar.dashboard"), url: "/dashboard", icon: IconHome },
      { title: t("navbar.users"), url: "/user", icon: IconBuildingStore },
      { title: t("navbar.event"), url: "/event", icon: IconListDetails },
      { title: t("navbar.template"), url: "/template", icon: IconPackage },
    ];

    // Filter based on role
    const userRole = session?.user?.role;
    if (userRole === "user") {
      setNavMain(allMenus.filter((item) => item.url === "/event"));
    } else {
      setNavMain(allMenus);
    }
  }, [t, session]);

  const user = session?.user;
  if (status === "loading") return null;

  return (
    <header className="border-b z-50 bg-background sticky top-0 flex h-16 shrink-0 items-center px-2 md:px-4">
      <div className="flex items-center gap-2 sm:gap-2 w-full">
        {/* Mobile Burger Menu (left of Logo) */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
              >
                <MenuIcon className="h-8 w-8" />{" "}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-4">
              <VisuallyHidden>
                <SheetTitle>Navigation Menu</SheetTitle>
              </VisuallyHidden>

              <div className="flex flex-col gap-4 mt-6">
                {user && <NavUser />}
                {navMain.map((item) => {
                  const isActive = pathname.startsWith(item.url);
                  return (
                    <Link
                      key={item.url}
                      href={item.url}
                      className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "text-primary"
                          : "text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      <item.icon size={18} />
                      {item.title}
                    </Link>
                  );
                })}
                <Separator className="my-4" />
                <LanguageSwitcher />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo (right next to menu) */}
        <LogoApp />

        <Separator orientation="vertical" className="h-6 hidden md:block" />

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-4">
          {navMain.map((item) => {
            const isActive = pathname.startsWith(item.url);
            return (
              <Link
                key={item.url}
                href={item.url}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                <item.icon size={18} />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right-side user/lang */}
      <div className="flex items-center gap-2">
        {user ? (
          <>
            <div className="hidden md:flex">
              <LanguageSwitcher />
            </div>
            <NavUser />
          </>
        ) : (
          <span className="text-sm text-gray-600">{t("not_signed_in")}</span>
        )}
      </div>
    </header>
  );
}
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocaleFontProvider>
      <LoadingProvider>
        <SessionProvider>
          <SidebarProvider>
            {/* <AppSidebar /> */}
            <SidebarInset>
              <DashboardHeader />
              {/* Fixed main content area with proper overflow handling */}
              <div className="flex flex-1 flex-col gap-4  p-0 md:p-4 pt-0 bg-rose-50 relative overflow-hidden">
                <NextTopLoader color="#dd1d49" showSpinner={false} />
                <div className="pt-0 md:pt-4 flex-1 overflow-y-auto">
                  {children}
                </div>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </SessionProvider>
      </LoadingProvider>
    </LocaleFontProvider>
  );
}
