"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Event } from "../data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Button } from "@/components/ui/button";
import { EditIcon, EyeIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { ConfirmDialog } from "@/components/composable/dialog/confirm-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/date";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarColor, getInitials } from "@/utils/avatar";
import { Badge } from "@/components/ui/badge";

const ActionsCell = ({ row }: { row: any }) => {
  const router = useRouter();
  const { t } = useTranslation("common");

  const deleteEvent = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/event/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success(t("EventPage.message.delete_success"));
        router.refresh();
      } else {
        toast.error(t("EventPage.message.delete_error"));
      }
    } catch (error) {
      toast.error(t("EventPage.message.delete_error"));
    }
  };

  return (
    <div className="flex gap-2 items-end justify-end">
      <Link href={`/event/${row.original.id}`}>
        <Button size="icon" variant="outline" className="cursor-pointer">
          <EyeIcon />
        </Button>
      </Link>

      <Link href={`/event/edit/${row.original.id}`}>
        <Button size="icon" variant="outline" className="cursor-pointer">
          <EditIcon />
        </Button>
      </Link>

      <ConfirmDialog
        trigger={
          <Button size="icon" variant="destructive" className="cursor-pointer">
            <Trash2Icon />
          </Button>
        }
        title={t("EventPage.message.delete_title")}
        description={t("EventPage.message.delete_description")}
        onConfirm={() => deleteEvent(row.original.id)}
      />
    </div>
  );
};

export default ActionsCell;

export const MobileEventCard = ({
  event,
  onSelect,
  isSelected,
}: {
  event: Event;
  onSelect: (selected: boolean) => void;
  isSelected: boolean;
}) => {
  const { t } = useTranslation("common");
  const name: string = event.name ?? "";
  const { bg, text } = getAvatarColor(name);

  return (
    <div className="bg-white border-t border-gray-200 p-2">
      <div className="flex items-center gap-3">
        <Avatar className="h-6 w-6 flex-shrink-0">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback className={`${bg} ${text} font-bold text-[12px]`}>
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <h3 className="text-[12px] font-medium text-gray-900 truncate">
              {name}
            </h3>
            {event.location && (
              <p className="text-[10px] text-gray-500 truncate">
                {event.location}
              </p>
            )}
          </div>

          <div className="flex gap-2 items-center">
            {event.startTime && (
              <>
                <Badge variant="default" className="text-[10px]">
                  {formatDate(event.startTime)}
                </Badge>
              </>
            )}
          </div>
        </div>

        <div className="flex-shrink-0">
          <ActionsCell row={{ original: event }} />
        </div>
      </div>
    </div>
  );
};

export const useEventColumns = (): ColumnDef<Event>[] => {
  // We no longer call t() here for the headers
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    // Logo
    {
      accessorKey: "image",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="EventPage.table.logo" />
      ),
      cell: ({ row }) => {
        const name: string = row.getValue("name") ?? "";
        const { bg, text } = getAvatarColor(name);
        return (
          <Avatar>
            <AvatarImage
              src={row.getValue("image") || "/no-image.png"}
              alt="@shadcn"
            />
            <AvatarFallback className={`${bg} ${text} font-bold text-[12px]`}>
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
        );
      },
    },

    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="EventPage.table.name" />
      ),
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Link
            href={`/event/${row.original.id}`} // link to view page
            className="max-w-[200px] truncate font-medium text-blue-600 hover:underline"
          >
            {row.getValue("name")}
          </Link>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="EventPage.table.type" />
      ),
      cell: ({ row }) => {
        const type = row.getValue("type") as string;

        return (
          <Badge
            variant="secondary" // you can try: "default" | "secondary" | "outline" etc.
            className="capitalize"
          >
            {type || "-"}
          </Badge>
        );
      },
    },

    {
      accessorKey: "location",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="EventPage.table.location"
        />
      ),
      cell: ({ row }) => (
        <span className="max-w-[200px] truncate font-medium">
          {row.getValue("location")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="EventPage.table.status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;

        const variant =
          status === "active"
            ? "default"
            : status === "inactive"
            ? "secondary"
            : "outline"; // fallback

        return (
          <Badge variant={variant} className="capitalize">
            {status || "-"}
          </Badge>
        );
      },
    },

    {
      accessorKey: "startTime",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="EventPage.table.startDate"
        />
      ),
      cell: ({ row }) => (
        <span className="max-w-[200px] truncate font-medium">
          {formatDate(row.getValue("startTime"))}
        </span>
      ),
    },
    {
      accessorKey: "eating_time",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="EventPage.table.eating_time"
        />
      ),
      cell: ({ row }) => (
        <span className="max-w-[200px] truncate font-medium">
          {row.getValue("eating_time")}
        </span>
      ),
    },

    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="EventPage.table.created_at"
        />
      ),
      cell: ({ row }) => (
        <span className="max-w-[200px] truncate font-medium">
          {formatDate(row.getValue("createdAt"))}
        </span>
      ),
    },

    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="EventPage.table.updated_at"
        />
      ),
      cell: ({ row }) => (
        <span className="max-w-[200px] truncate font-medium">
          {formatDate(row.getValue("updatedAt"))}
        </span>
      ),
    },

    {
      id: "actions",
      cell: ({ row }) => <ActionsCell row={row} />,
    },
  ];
};
