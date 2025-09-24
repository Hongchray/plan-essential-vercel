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
import { formatDate } from "@/utils/date";
import { getAvatarColor, getInitials } from "@/utils/avatar";

const ActionsCell = ({ row }: { row: any }) => {
  const router = useRouter();
  const { t } = useTranslation("common");

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

export const MobileTemplateCard = ({
  template,
  onSelect,
  isSelected,
}: {
  template: Template;
  onSelect: (selected: boolean) => void;
  isSelected: boolean;
}) => {
  const { t } = useTranslation("common");
  const name: string = template.name ?? "";
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
            {template.status && (
              <p className="text-[10px] text-gray-500 truncate">
                {template.status}
              </p>
            )}
          </div>
        </div>

        <div className="flex-shrink-0">
          <ActionsCell row={{ original: template }} />
        </div>
      </div>
    </div>
  );
};

export const useTemplateColumns = (): ColumnDef<Template>[] => {
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
