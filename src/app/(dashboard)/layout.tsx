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

function DashboardHeader() {
  const { data: session, status } = useSession();
  const { t } = useTranslation("common");

  const user = session?.user;

  if (status === "loading") return null;

  return (
    <header className="border-b z-50 bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 justify-between w-full px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <LanguageSwitcher />
              <NavUser />
            </>
          ) : (
            <span>{t("not_signed_in")}</span>
          )}
        </div>
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
            <AppSidebar />
            <SidebarInset>
              <DashboardHeader />
              <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-gray-50 relative">
                <NextTopLoader color="#F5BABB" showSpinner={false} />
                <div className="pt-4">{children}</div>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </SessionProvider>
      </LoadingProvider>
    </LocaleFontProvider>
  );
}
