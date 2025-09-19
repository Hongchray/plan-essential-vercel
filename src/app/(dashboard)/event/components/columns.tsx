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
        <Button size="icon" variant="outline">
          <EyeIcon />
        </Button>
      </Link>

      <Link href={`/event/edit/${row.original.id}`}>
        <Button size="icon" variant="outline">
          <EditIcon />
        </Button>
      </Link>

      <ConfirmDialog
        trigger={
          <Button size="icon" variant="destructive">
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
      cell: ({ row }) => (
        <Avatar>
          <AvatarImage src={row.getValue("image")} alt={row.getValue("name")} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
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
      cell: ({ row }) => (
        <span className="max-w-[200px] truncate font-medium">
          {row.getValue("type")}
        </span>
      ),
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
      cell: ({ row }) => (
        <span className="max-w-[200px] truncate font-medium">
          {row.getValue("status")}
        </span>
      ),
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
