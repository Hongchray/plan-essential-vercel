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
import { formatDateCustom } from "@/utils/date";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

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

export const columns: ColumnDef<Event>[] = [
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
  {
    accessorKey: "name",
    header: () => {
      const { t } = useTranslation("common");
      return t("EventPage.table.name");
    },
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[200px] truncate font-medium text-primary underline">
            <Link href={`/event/${row.original.id}`}>
              {row.getValue("name")}
            </Link>
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: () => {
      const { t } = useTranslation("common");
      return t("EventPage.table.type");
    },
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[200px] truncate font-medium capitalize">
            {row.getValue("type")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "startTime",
    header: () => {
      const { t } = useTranslation("common");
      return t("EventPage.table.startDate");
    },
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[200px] truncate font-medium">
            {formatDateCustom(row.getValue("startTime"), "DD/MM/YYYY")}
          </span>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "endTime",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="End Date" />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex gap-2">
  //         <span className="max-w-[200px] truncate font-medium">
  //           {row.getValue("endTime")}
  //         </span>
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "location",
    header: () => {
      const { t } = useTranslation("common");
      return t("EventPage.table.location");
    },
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue("location")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => {
      const { t } = useTranslation("common");
      return t("EventPage.table.status");
    },
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[200px] truncate font-medium">
            <Badge
              variant={
                row.getValue("status") === "active" ? "default" : "outline"
              }
            >
              <span className="capitalize">{row.getValue("status")}</span>
            </Badge>
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
