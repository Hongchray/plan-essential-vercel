"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Guest } from "@/interfaces/guest";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { ConfirmDialog } from "@/components/composable/dialog/confirm-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { IconAccessPoint } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { CreateEditForm } from "../guest-form/create-edit";
import Image from "next/image";

const ActionsCell = ({ row }: { row: any }) => {
  const router = useRouter();

  const deleteEvent = async (eventId: string, id: string) => {
    try {
      const res = await fetch(`/api/admin/event/${eventId}/guest/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Delete guest successfully");
        router.refresh();
      } else {
        toast.error("Error deleting guest");
      }
    } catch (error) {
      toast.error("Error deleting guest");
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
        title="Delete this guest?"
        description="This will permanently remove the guest."
        onConfirm={() => deleteEvent(row.original.eventId, row.original.id)}
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
        );
      }
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
          <span className="max-w-[350px] truncate text-primary font-medium">
            {/* <Link href={`/event/${row.original.id}`}> */}
              {row.getValue("name")}
            {/* </Link> */}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: 'Phone',
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[200px] truncate">
            {row.getValue("phone")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: 'Address',
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className="max-w-[300px] truncate ">
            {row.getValue("address")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "guestGroup",
    header: "Groups",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className=" truncate flex gap-2">
            {row.original?.guestGroup?.map((group: any) => (
              <span key={group.id} className="">
                 <Badge variant="destructive" className="">   {group.group?.name_en} ({group.group?.name_kh})</Badge>
              </span>
            ))}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "guestTag",
    header: "Tags",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className=" truncate  flex gap-2">
            {row.original?.guestTag?.map((tag: any) => (
              <span key={tag.id} className="">
                 <Badge variant="secondary" className="">   {tag.tag?.name_en} ({tag.tag?.name_kh})</Badge>
              </span>
            ))}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className=" truncate  flex gap-2">
              <span className="">
                 <Badge variant={row.original.status === "pending"
                      ? "outline"
                      : row.original.status === "confirmed"
                      ? "default"
                      : row.original.status === "rejected"
                      ? "secondary"
                      : "default"
                      } className="capitalize"> {row.original.status}</Badge>
              </span>
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
