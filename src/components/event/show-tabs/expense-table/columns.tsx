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
import { Progress } from "@/components/ui/progress";

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

  const budget = expense.budget_amount ?? 0;
  const actual = expense.actual_amount ?? 0;

  const progress = budget > 0 ? Math.min((actual / budget) * 100, 100) : 0;

  return (
    <div className="bg-white border-t border-gray-200 p-3 flex items-center gap-4">
      {/* Left side: Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 break-words">
          {expense.name}
        </h3>
        {/* Progress bar */}
        <div className="mt-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-[11px] text-gray-600 mt-1">
            <span>
              {t("expense.table.actual_amount")}
              <br />
              {currencyFormatters.usd(actual)}
            </span>
            <span>
              {t("expense.table.budget_amount")}
              <br />
              {currencyFormatters.usd(budget)}
            </span>
          </div>
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex-shrink-0 flex items-start">
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
          <span className="max-w-[250px] truncate">
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
      cell: ({ row }) => {
        const actual = Number(row.getValue("actual_amount") ?? 0);
        const budget = Number(row.original.budget_amount ?? 0);

        // Calculate progress percentage
        const progress =
          budget > 0 ? Math.min((actual / budget) * 100, 100) : 0;

        return (
          <div className="flex flex-col gap-1 w-[90%] ">
            {/* Amount text */}
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>{currencyFormatters.usd(actual)}</span>
              <span>{currencyFormatters.usd(budget)}</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full ${
                  progress < 50
                    ? "bg-red-500"
                    : progress < 100
                    ? "bg-yellow-400"
                    : "bg-green-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Optional: show % */}
            <div className="text-xs text-gray-500 text-right">
              {progress.toFixed(0)}%
            </div>
          </div>
        );
      },
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
