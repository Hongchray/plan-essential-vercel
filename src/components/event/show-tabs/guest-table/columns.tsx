"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Guest } from "@/interfaces/guest";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Button } from "@/components/ui/button";
import { Check, CheckCheck, Copy, EditIcon, Send, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { ConfirmDialog } from "@/components/composable/dialog/confirm-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { IconAccessPoint } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { CreateEditForm } from "../guest-form/create-edit";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { getAvatarColor, getInitials } from "@/utils/avatar";

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
  const inviteLink = async(id: string) =>{
    try {
      const res = await fetch(`/api/admin/event/${row.original.eventId}/guest/${id}/invite`, {
        method: "PUT",
      });
      if (res.ok) {
        toast.success("Invite guest successfully");
        router.refresh();
      } else {
        toast.error("Error inviting guest");
      }
    } catch (error) {
      toast.error("Error inviting guest");
    }
  }
  const [copied, setCopied] = useState(false);
  const invLink = "http://localhost:3000/preview/cmerywzjq0001ulfmu7ahau2o";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(invLink);
      setCopied(true);
      await inviteLink(row.original.id)
      setTimeout(() => setCopied(false), 2000); 
    } catch (err) {
      
      const textArea = document.createElement('textarea');
      textArea.value = invLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <div className="flex gap-2 items-end justify-end">
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              {!row.original.is_invited ? (
                <Button size="icon" variant="outline">
                  <Send />
                </Button>
              ) : (
                <Button size="icon" variant="default">
                  <CheckCheck />
                </Button>
              )}
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            {!row.original.is_invited ? (
              <p>Invite</p>
            ) : (
              <p>Invited</p>
            )}
          </TooltipContent>
        </Tooltip>
        <PopoverContent>
          <div className="p-4 max-w-md mx-auto">
            <p className="pb-2 text-gray-700 font-medium">Invite link</p>
            <div className="flex gap-2 items-center">
              <input 
                type="text"
                value={invLink}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleCopy}
                className={`p-2 rounded-md transition-colors ${
                  copied 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={copied ? "Copied!" : "Copy to clipboard"}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            {copied && (
              <p className="text-sm text-green-600 mt-1">Link copied to clipboard!</p>
            )}
          </div>
        </PopoverContent>
      </Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <CreateEditForm id={row.original.id} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit guest</p>
        </TooltipContent>
      </Tooltip>
      <ConfirmDialog
        trigger={
          <Button size="icon" variant="outline" className="border-red-500">
            <Trash2Icon className="text-red-700"/>
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name: string = row.getValue('name') ??"" ;
      const { bg, text } = getAvatarColor(name);
      return (
        <div className="flex gap-2">
          <span className="max-w-[350px] truncate text-primary font-medium">
              <div className="flex gap-2 items-center">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback className={`${bg} ${text} font-bold`}>{getInitials(name)}</AvatarFallback>
                </Avatar>
                { row.getValue("name") }
              </div>
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
    accessorKey: "guestGroup",
    header: "Groups",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <span className=" truncate flex gap-2">
            {row.original?.guestGroup?.map((group: any) => (
              <span key={group.id} className="">
                 <Badge variant="default" className="">   {group.group?.name_kh}</Badge>
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
                 <Badge variant="secondary" className="">   {tag.tag?.name_kh}</Badge>
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
