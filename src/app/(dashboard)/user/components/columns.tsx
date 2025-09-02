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

const ActionsCell = ({ row }: { row: any }) => {
  const router = useRouter();

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

export const columns: ColumnDef<User>[] = [
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

  //logo
  {
    accessorKey: "photoUrl",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Logo" />
    ),
    cell: ({ row }) => {
      return (
        <Avatar>
          <AvatarImage src={row.getValue("photoUrl")} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      );
    },
  },

  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
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
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue("phone")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue("email")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue("role")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "telegramId", // column key
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Login As" />
    ),
    cell: ({ row }) => {
      const telegramId = row.getValue<string>("telegramId");

      // If telegramId exists, user logged in via Telegram, else via Phone
      const displayValue = telegramId
        ? "Logged in via Telegram"
        : "Logged in via Phone";

      return <span>{displayValue}</span>;
    },
    filterFn: (row, id, value) => {
      const telegramId = row.getValue<string>("telegramId");
      const displayValue = telegramId
        ? "Logged in via Telegram"
        : "Logged in via Phone";

      return displayValue
        .toLowerCase()
        .includes((value as string).toLowerCase());
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
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
