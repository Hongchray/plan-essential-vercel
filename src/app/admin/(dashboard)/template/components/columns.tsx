"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Template } from "../data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DeleteIcon, EditIcon, EyeIcon, Trash2Icon } from "lucide-react"
import Link from "next/link"
import { ConfirmDialog } from "@/components/composable/dialog/confirm-dialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const ActionsCell = ({ row }: { row: any }) => {
  const router = useRouter(); 
  
  const deleteTemplate = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/template/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Delete Template successfully");
        router.refresh();
      } else {
        toast.error("Error deleting template");
      }
    } catch (error) {
      toast.error("Error deleting template");
    }
  };

  return (
    <div className="flex gap-2 items-end justify-end">
      <Link href={`/preview/${row.original.id}`}>
        <Button size="icon" variant="outline">
          <EyeIcon />
        </Button>
      </Link>
      <Link href={`/admin/template/edit/${row.original.id}`}>
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
        onConfirm={() => deleteTemplate(row.original.id)}
      />
    </div>
  );
};

export const columns: ColumnDef<Template>[] = [
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
    accessorKey: "image",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }) => {
      if (row.getValue("image")) {
        return (
          <Image
            src={row.getValue("image")}
            width={50}
            height={50}
            alt="Picture of the author"
            className="rounded"
          />
        )
      }
    }
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
      )
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue("type")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[200px] truncate font-medium">
            {row.getValue("status")}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />, 
  },
]