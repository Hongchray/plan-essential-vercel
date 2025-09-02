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

// User Data
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
}
export default function Page() {
  return (
    <div className="p-5">
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        <div className=" rounded-lg border  p-2  bg-white">
          <div className="p-4">
            <h3 className="text-lg">
              <a href="#">Total Users</a>
            </h3>
            <p className="mt-2 font-bold text-2xl text-orange-600 ">
              24
            </p>
          </div>
        </div>
        <div className=" rounded-lg border  p-2  bg-white">
          <div className="p-4">
            <h3 className="text-lg">
              <a href="#">Total Store</a>
            </h3>
            <p className="mt-2 font-bold text-2xl text-blue-600">
              2
            </p>
          </div>
        </div>
        <div className="rounded-lg border  p-2 bg-white">
          <div className="p-4">
            <h3 className="text-lg">
              <a href="#">Total Templetes</a>
            </h3>
            <p className="mt-2 font-bold text-2xl text-rose-600">
              0
            </p>
          </div>
        </div>
        <div className="rounded-lg border  p-2  bg-white">
          <div className="p-4">
            <h3 className="text-lg ">
              <a href="#">Total Earning</a>
            </h3>
            <p className="mt-2 font-bold text-2xl text-green-600">
              0
            </p>
          </div>
        </div>
      </div>
      <div className=" flex-1 rounded-md p-5 bg-white border mt-5">
        <h2 className="p-2 text-2xl font-semibold"> Up Coming Event </h2>
        <div>
          <Table className="rounded-lg">
            <TableHeader className="bg-zinc-100 rounded-lg">
              <TableRow className="rounded-lg">
                <TableHead className="">Event Name</TableHead>
                <TableHead>User Name</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead className="text-right">Event Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium hover:underline">រៀបអារពាហ៍ពិពាហ៍</TableCell>
                <TableCell>Mr. Makara (0731883330/3456789)</TableCell>
                <TableCell>2023-12-12</TableCell>
                <TableCell className="text-right">Phnom Penh</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium hover:underline">រៀបអារពាហ៍ពិពាហ៍</TableCell>
                <TableCell>Mr. Hong (0731883330/3456789)</TableCell>
                <TableCell>2023-12-12</TableCell>
                <TableCell className="text-right">Phnom Penh</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
