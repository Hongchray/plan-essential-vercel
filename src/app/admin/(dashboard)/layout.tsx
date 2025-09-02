'use client'
import { AppSidebar } from "@/components/app-sidebar"
import { NavUser } from "@/components/nav-user"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createContext, useContext, useState, ReactNode } from "react"
import NextTopLoader from "nextjs-toploader";
// User Data
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
}
// Create Loading Context
interface LoadingContextType {
  isLoading: boolean
  setOverlayLoading: (loading: boolean) => void
  loadingText: string
  setLoadingText: (text: string) => void
}
const LoadingContext = createContext<LoadingContextType | false>(false)

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}
import { SessionProvider } from "next-auth/react"
import { Loading } from "@/components/composable/loading/loading"
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState("Loading...")

  const setOverlayLoading = (loading: boolean) => {
    setIsLoading(loading)
  }

  return (
   <LoadingContext.Provider value={{ 
      isLoading, 
      setOverlayLoading, 
      loadingText, 
      setLoadingText 
    }}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="border-b z-50 bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 justify-between w-full">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                  {/* <BreadcrumbList>
                    {breadcrumbItems.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                          {item.isCurrentPage ? (
                            <BreadcrumbPage>{item.label}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink href={item.href || "#"}>
                              {item.label}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {index < breadcrumbItems.length - 1 && (
                          <BreadcrumbSeparator className="hidden md:block ml-2 mr-2" />
                        )}
                      </div>
                    ))}
                  </BreadcrumbList> */}
                </Breadcrumb>
              </div>
              {/* User Nav */}
              <div className="flex items-center gap-2 px-4">
                <NavUser user={data.user} />
              </div>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-gray-50 relative">
            <NextTopLoader color="#F5BABB" showSpinner={false} />
            <SessionProvider>
              <div className="pt-4">
                {children}
              </div>
            </SessionProvider>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </LoadingContext.Provider>
  )
}
