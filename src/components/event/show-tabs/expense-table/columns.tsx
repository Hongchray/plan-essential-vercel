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
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getAvatarColor, getInitials } from "@/utils/avatar";

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
          <Button size="icon" variant="destructive" className="cursor-pointer">
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

export const MobileExpenseCard = ({
  expense,
  onSelect,
  isSelected,
}: {
  expense: Expense;
  onSelect: (selected: boolean) => void;
  isSelected: boolean;
}) => {
  const { t } = useTranslation("common");
  return (
    <div className="bg-white border-t border-gray-200 p-2 ">
      <div className="flex items-start gap-3">
        {/* Avatar */}

        {/* Guest & Gift info */}
        <div className="flex-1 min-w-0">
          <div className="mb-1">
            <h3 className="text-[13px] font-semibold text-gray-900 break-words">
              {expense.name}
            </h3>
            <p className="text-[11px] text-gray-500">{expense.actual_amount}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-600">
            <Badge variant="default" className="text-[10px]">
              {expense.name}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {expense.budget_amount} {expense.budget_amount}
            </Badge>
            {expense.budget_amount && (
              <span className="italic text-gray-500">
                “{expense.budget_amount}”
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end mt-2">
        <ActionsCell row={{ original: expense }} />
      </div>
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
      accessorKey: "budget_amount",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("expense.table.budget_amount")}
        />
      ),
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
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("expense.table.actual_amount")}
        />
      ),
      cell: ({ row }) => (
        <div className="flex gap-2">
          <span className="max-w-[350px] truncate">
            {currencyFormatters.usd(row.getValue("actual_amount") ?? 0)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: t("expense.table.description"),
      cell: ({ row }) => (
        <div className="flex gap-2">
          <span className="max-w-[250px] truncate">
            {row.getValue("description")}
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
