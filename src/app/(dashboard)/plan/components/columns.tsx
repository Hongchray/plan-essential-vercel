"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { Plan } from "@/interfaces/plan";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash2Icon, EyeIcon } from "lucide-react";
import { ConfirmDialog } from "@/components/composable/dialog/confirm-dialog";
import { useTranslation } from "react-i18next";
import { currencyFormatters } from "@/utils/currency";

const ActionsCell = ({ row }: { row: any }) => {
  const router = useRouter();
  const { t } = useTranslation("common"); // ✅ hook at top level

  const deleteTemplate = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/plan/${id}`, {
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
      <Link href={`/plan/edit/${row.original.id}`}>
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
export const columns: ColumnDef<Plan>[] = [
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
    accessorKey: "price",
    header: 'តម្លៃ',
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[200px] truncate font-medium">
            {currencyFormatters.usd(row.getValue("price")??0)}
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
