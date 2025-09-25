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
import { getAvatarColor, getInitials } from "@/utils/avatar";

const ActionsCell = ({ row }: { row: any }) => {
  const router = useRouter();

  const { t } = useTranslation("common");

  return (
    <div className="flex gap-2 items-end justify-end">
      <Link href={`/user/${row.original.id}`}>
        <Button size="icon" variant="outline" className="cursor-pointer">
          <EyeIcon />
        </Button>
      </Link>
    </div>
  );
};

export const MobileUserCard = ({
  user,
  onSelect,
  isSelected,
}: {
  user: User;
  onSelect: (selected: boolean) => void;
  isSelected: boolean;
}) => {
  const { t } = useTranslation("common");
  const name: string = user.name ?? "";
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
            {user.phone && (
              <p className="text-[10px] text-gray-500 truncate">{user.phone}</p>
            )}
          </div>
        </div>

        <div className="flex-shrink-0">
          <ActionsCell row={{ original: user }} />
        </div>
      </div>
    </div>
  );
};

export const useUserColumns = (): ColumnDef<User>[] => {
  const { t } = useTranslation("common");

  return [
    // Logo
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
      accessorKey: "photoUrl",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="user.table.logo" />
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
        <DataTableColumnHeader column={column} title="user.table.name" />
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
        <DataTableColumnHeader column={column} title="user.table.phone" />
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
        <DataTableColumnHeader column={column} title="user.table.email" />
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
        <DataTableColumnHeader column={column} title="user.table.role" />
      ),
      cell: ({ row }) => {
        const role = (row.getValue("role") as string) || "";

        const variant =
          role === "admin"
            ? "destructive" // red for admin
            : role === "user"
            ? "secondary" // gray for user
            : "outline"; // fallback

        return (
          <Badge variant={variant} className="capitalize">
            {role || "-"}
          </Badge>
        );
      },
    },

    {
      accessorKey: "telegramId",
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="user.table.login_as" />
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
