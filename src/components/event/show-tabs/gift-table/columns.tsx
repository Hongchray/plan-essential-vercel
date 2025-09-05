"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { ConfirmDialog } from "@/components/composable/dialog/confirm-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CreateEditForm } from "../gift-form/create-edit";
import { currencyFormatters } from "@/utils/currency";
import { Gift } from "@/interfaces/gift";

const ActionsCell = ({ row }: { row: any }) => {
  const router = useRouter();

  const deleteEvent = async (eventId: string, id: string) => {
    try {
      const res = await fetch(`/api/admin/event/${eventId}/gift/${id}`, {
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

export const columns: ColumnDef<Gift>[] = [
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
    accessorKey: "guestId",
    header: "Guest Name",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[350px] truncate text-primary font-medium">
              {row.original.guest?.name}
          </span>
          <span>  ({row.original.guest?.phone})</span>
        </div>
      );
    },
  },
  {
    accessorKey: "note",
    header: "Note",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[300px] truncate ">
            {row.getValue("note")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "payment_type",
    header: "Payment Type",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[350px] truncate capitalize">
              {row.original.payment_type}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "currency_type",
    header: "Currency Type",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[350px] truncate capitalize">
              {row.original.currency_type}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[350px] truncate ">
            {row.original.currency_type === "USD" ? (
              currencyFormatters.usd(row.getValue("amount")??0)
            ) : (
              currencyFormatters.khr(row.getValue("amount")??0)
            )}
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
