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

const ActionsCell = ({ row }: { row: any }) => {
  const router = useRouter();

  const deleteEvent = async (eventId: string, id: string) => {
    try {
      const res = await fetch(`/api/admin/event/${eventId}/expense/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Delete expense successfully");
        router.refresh();
      } else {
        toast.error("Error deleting expense");
      }
    } catch (error) {
      toast.error("Error deleting expense");
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
        title="Delete this expense?"
        description="This will permanently remove the expense."
        onConfirm={() => deleteEvent(row.original.eventId, row.original.id)}
      />
    </div>
  );
};

export const columns: ColumnDef<Expense>[] = [
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[350px] truncate text-primary font-medium">
              {row.getValue("name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[300px] truncate ">
            {row.getValue("description")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "budget_amount",
    header: "Budget Amount",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[350px] truncate text-primary font-medium">
              {currencyFormatters.usd(row.getValue("budget_amount")??0)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "actual_amount",
    header: "Actual Amount",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[350px] truncate text-primary font-medium">
              {currencyFormatters.usd(row.getValue("actual_amount")??0)}
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
