"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Expense } from "@/interfaces/expense";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { ConfirmDialog } from "@/components/composable/dialog/confirm-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CreateEditForm } from "../expense-form/create-edit";
import { currencyFormatters } from "@/utils/currency";
import { useTranslation } from "next-i18next";

const ActionsCell = ({ row }: { row: any }) => {
  const router = useRouter();
  const { t } = useTranslation("common");

  const deleteEvent = async (eventId: string, id: string) => {
    try {
      const res = await fetch(`/api/admin/event/${eventId}/expense/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success(t("expense.table.delete_success"));
        router.refresh();
      } else {
        toast.error(t("expense.table.delete_error"));
      }
    } catch (error) {
      toast.error(t("expense.table.delete_error"));
    }
  };

  return (
    <div className="flex gap-2 items-end justify-end">
      <CreateEditForm id={row.original.id} />
      <ConfirmDialog
        trigger={
          <Button size="icon" variant="destructive">
            <Trash2Icon />
          </Button>
        }
        title={t("expense.table.delete_title")}
        description={t("expense.table.delete_description")}
        onConfirm={() => deleteEvent(row.original.eventId, row.original.id)}
      />
    </div>
  );
};

export const useExpenseColumns = (): ColumnDef<Expense>[] => {
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
          aria-label={t("expense.table.select_all")}
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t("expense.table.select_row")}
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("expense.table.name")}
        />
      ),
      cell: ({ row }) => (
        <div className="flex gap-2">
          <span className="max-w-[350px] truncate text-primary font-medium">
            {row.getValue("name")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: t("expense.table.description"),
      cell: ({ row }) => (
        <div className="flex gap-2">
          <span className="max-w-[300px] truncate">
            {row.getValue("description")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "budget_amount",
      header: t("expense.table.budget_amount"),
      cell: ({ row }) => (
        <div className="flex gap-2">
          <span className="max-w-[350px] truncate">
            {currencyFormatters.usd(row.getValue("budget_amount") ?? 0)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "actual_amount",
      header: t("expense.table.actual_amount"),
      cell: ({ row }) => (
        <div className="flex gap-2">
          <span className="max-w-[350px] truncate">
            {currencyFormatters.usd(row.getValue("actual_amount") ?? 0)}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionsCell row={row} />,
    },
  ];
};
