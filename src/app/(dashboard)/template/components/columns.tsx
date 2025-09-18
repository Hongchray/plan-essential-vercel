"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { labels, priorities, statuses } from "../data/data";
import { Template } from "../data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash2Icon, EyeIcon } from "lucide-react";
import { ConfirmDialog } from "@/components/composable/dialog/confirm-dialog";
import { useTranslation } from "react-i18next";

const ActionsCell = ({ row }: { row: any }) => {
  const router = useRouter();
  const { t } = useTranslation("common"); // ✅ hook at top level

  const deleteTemplate = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/template/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success(t("templates.message.delete_success"));
        router.refresh();
      } else {
        toast.error(t("templates.message.delete_error"));
      }
    } catch (error) {
      toast.error(t("templates.message.delete_error"));
    }
  };

  return (
    <div className="flex gap-2 items-end justify-end">
      <Link href={`/preview/${row.original.id}`}>
        <Button size="icon" variant="outline">
          <EyeIcon />
        </Button>
      </Link>
      <Link href={`/template/edit/${row.original.id}`}>
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
        title={t("templates.message.delete_title")}
        description={t("templates.message.delete_description")}
        onConfirm={() => deleteTemplate(row.original.id)}
      />
    </div>
  );
};
export const columns: ColumnDef<Template>[] = [
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
    accessorKey: "image",
    enableSorting: false,
    header: () => {
      const { t } = useTranslation("common");
      return t("templates.table.image");
    },
    cell: ({ row }) => {
      return (
        <Avatar className="rounded h-[50px] ">
          <AvatarImage src={row.getValue("image")} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "name",
    header: () => {
      const { t } = useTranslation("common");
      return t("templates.table.name");
    },
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: () => {
      const { t } = useTranslation("common");
      return t("templates.table.type");
    },
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue("type")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => {
      const { t } = useTranslation("common");
      return t("templates.table.status");
    },
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue("status")}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "updatedAt",
    header: () => {
      const { t } = useTranslation("common");
      return t("templates.table.updatedAt");
    },
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue("updatedAt")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => {
      const { t } = useTranslation("common");
      return t("templates.table.createdAt");
    },
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue("createdAt")}
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
