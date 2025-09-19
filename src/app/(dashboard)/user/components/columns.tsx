"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { labels, priorities, statuses } from "../data/data";
import { User } from "../data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EditIcon, EyeIcon, Trash2Icon } from "lucide-react";
import { ConfirmDialog } from "@/components/composable/dialog/confirm-dialog";
import { useTranslation } from "react-i18next";

const ActionsCell = ({ row }: { row: any }) => {
  const router = useRouter();

  const { t } = useTranslation("common");

  return (
    <div className="flex gap-2 items-end justify-end">
      <Link href={`/user/${row.original.id}`}>
        <Button size="icon" variant="outline">
          <EyeIcon />
        </Button>
      </Link>
    </div>
  );
};

export const useUserColumns = (): ColumnDef<User>[] => {
  const { t } = useTranslation("common");

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
          aria-label={t("user.table.select_all")}
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t("user.table.select_all")}
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    // Logo
    {
      accessorKey: "photoUrl",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("user.table.logo")} />
      ),
      cell: ({ row }) => (
        <Avatar>
          <AvatarImage src={row.getValue("photoUrl")} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
    },

    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("user.table.name")} />
      ),
      cell: ({ row }) => (
        <div className="flex gap-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      ),
    },

    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("user.table.phone")} />
      ),
      cell: ({ row }) => (
        <span className="max-w-[200px] truncate font-medium">
          {row.getValue("phone")}
        </span>
      ),
    },

    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("user.table.email")} />
      ),
      cell: ({ row }) => (
        <span className="max-w-[200px] truncate font-medium">
          {row.getValue("email")}
        </span>
      ),
    },

    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("user.table.role")} />
      ),
      cell: ({ row }) => (
        <span className="max-w-[200px] truncate font-medium">
          {row.getValue("role")}
        </span>
      ),
    },

    {
      accessorKey: "telegramId",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("user.table.login_as")}
        />
      ),
      cell: ({ row }) => {
        const telegramId = row.getValue<string>("telegramId");
        const displayValue = telegramId
          ? t("user.table.logged_in_telegram")
          : t("user.table.logged_in_phone");

        return <span>{displayValue}</span>;
      },
      filterFn: (row, id, value) => {
        const telegramId = row.getValue<string>("telegramId");
        const displayValue = telegramId
          ? t("user.table.logged_in_telegram")
          : t("user.table.logged_in_phone");

        return displayValue
          .toLowerCase()
          .includes((value as string).toLowerCase());
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionsCell row={row} />,
    },
  ];
};
