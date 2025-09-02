"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Guest } from "./data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { ConfirmDialog } from "@/components/composable/dialog/confirm-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { IconAccessPoint } from "@tabler/icons-react";

const ActionsCell = ({ row }: { row: any }) => {
  const router = useRouter();

  const deleteEvent = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/event/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Delete Event successfully");
        router.refresh();
      } else {
        toast.error("Error deleting Event");
      }
    } catch (error) {
      toast.error("Error deleting Event");
    }
  };

  return (
    <div className="flex gap-2 items-end justify-end">
      <Link href={`/event/edit/${row.original.id}`}>
        <Button size="icon" variant="outline">
          <IconAccessPoint />
        </Button>
      </Link>
      <Link href={`/event/edit/${row.original.id}`}>
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
        title="Delete this file?"
        description="This will permanently remove the file."
        onConfirm={() => deleteEvent(row.original.id)}
      />
    </div>
  );
};

export const columns: ColumnDef<Guest>[] = [
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
          <span className="max-w-[200px] truncate font-medium text-primary underline">
            <Link href={`/event/${row.original.id}`}>
              {row.getValue("name")}
            </Link>
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
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue("address")}
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
