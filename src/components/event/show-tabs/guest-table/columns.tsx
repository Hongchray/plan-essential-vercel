"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Guest } from "@/interfaces/guest";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Button } from "@/components/ui/button";
import { Check, CheckCheck, Copy, Send, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CreateEditForm } from "../guest-form/create-edit";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/composable/dialog/confirm-dialog";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { getAvatarColor, getInitials } from "@/utils/avatar";
import { GuestStatusKH } from "@/enums/guests";

const statusMap: Record<string, GuestStatusKH> = {
  pending: GuestStatusKH.PENDING,
  confirmed: GuestStatusKH.CONFIRMED,
  rejected: GuestStatusKH.REJECTED,
};

const ActionsCell = ({ row }: { row: any }) => {
  const router = useRouter();
  const { t } = useTranslation("common");

  const deleteEvent = async (eventId: string, id: string) => {
    try {
      const res = await fetch(`/api/admin/event/${eventId}/guest/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success(t("event_dashboard.guest.table.toast.delete_success"));
        router.refresh();
      } else {
        toast.error(t("event_dashboard.guest.table.toast.delete_error"));
      }
    } catch (error) {
      toast.error(t("event_dashboard.guest.table.toast.delete_error"));
    }
  };

  const inviteLink = async (id: string) => {
    try {
      const res = await fetch(
        `/api/admin/event/${row.original.eventId}/guest/${id}/invite`,
        {
          method: "PUT",
        }
      );
      if (res.ok) {
        toast.success(t("event_dashboard.guest.table.toast.invite_success"));
        router.refresh();
      } else {
        toast.error(t("event_dashboard.guest.table.toast.invite_error"));
      }
    } catch (error) {
      toast.error(t("event_dashboard.guest.table.toast.invite_error"));
    }
  };

  const [copied, setCopied] = useState(false);
  const invLink = "http://localhost:3000/preview/cmerywzjq0001ulfmu7ahau2o";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(invLink);
      setCopied(true);
      await inviteLink(row.original.id);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = invLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
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
                <Button
                  size="icon"
                  variant="outline"
                  className="cursor-pointer"
                >
                  <Send size={5} />
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
              <p>{t("event_dashboard.guest.table.invite")}</p>
            ) : (
              <p>{t("event_dashboard.guest.table.invited")}</p>
            )}
          </TooltipContent>
        </Tooltip>
        <PopoverContent>
          <div className="p-4 max-w-md mx-auto">
            <p className="pb-2 text-gray-700 font-medium">
              {t("event_dashboard.guest.table.invite_link")}
            </p>
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
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title={
                  copied
                    ? t("event_dashboard.guest.table.copied")
                    : t("event_dashboard.guest.table.copy_to_clipboard")
                }
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            {copied && (
              <p className="text-sm text-green-600 mt-1">
                {t("event_dashboard.guest.table.link_copied")}
              </p>
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
          <p>{t("event_dashboard.guest.table.edit_guest")}</p>
        </TooltipContent>
      </Tooltip>

      <ConfirmDialog
        trigger={
          <Button
            size="icon"
            variant="outline"
            className="border-red-500 cursor-pointer"
          >
            <Trash2Icon className="text-red-700 " />
          </Button>
        }
        title={t("event_dashboard.guest.table.delete_title")}
        description={t("event_dashboard.guest.table.delete_description")}
        onConfirm={() => deleteEvent(row.original.eventId, row.original.id)}
      />
    </div>
  );
};

// Mobile List Card Component
const MobileGuestCard = ({
  guest,
  onSelect,
  isSelected,
}: {
  guest: Guest;
  onSelect: (selected: boolean) => void;
  isSelected: boolean;
}) => {
  const { t } = useTranslation("common");
  const name: string = guest.name ?? "";
  const { bg, text } = getAvatarColor(name);

  return (
    <div className="bg-white border-t border-gray-200 p-2">
      <div className="flex items-center gap-3">
        <Avatar className="h-6 w-6 flex-shrink-0">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback className={`${bg} ${text} font-bold text-[12px]`}>
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <h3 className="text-[12px] font-medium text-gray-900 truncate">
              {name}
            </h3>
            {guest.phone && (
              <p className="text-[10px] text-gray-500 truncate">
                {guest.phone}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {guest.guestGroup && guest.guestGroup.length > 0 && (
              <div className="flex flex-wrap gap-1 items-start">
                {guest.guestGroup.map((group: any) => (
                  <Badge
                    key={group.id}
                    variant="default"
                    className="text-[10px]"
                  >
                    {group.group?.name_kh}
                  </Badge>
                ))}
              </div>
            )}

            {guest.guestTag && guest.guestTag.length > 0 && (
              <div className="flex flex-wrap gap-1 items-start">
                {guest.guestTag.map((tag: any) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="text-[10px]"
                  >
                    {tag.tag?.name_kh}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-shrink-0">
          <ActionsCell row={{ original: guest }} />
        </div>
      </div>
    </div>
  );
};

export function useGuestColumns(): ColumnDef<Guest>[] {
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
          aria-label={t("event_dashboard.guest.table.select_all")}
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t("event_dashboard.guest.table.select_row")}
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
          title={t("event_dashboard.guest.table.name")}
        />
      ),
      cell: ({ row }) => {
        const name: string = row.getValue("name") ?? "";
        const { bg, text } = getAvatarColor(name);
        return (
          <span className="max-w-[350px] truncate font-medium">
            <div className="flex gap-2 items-center">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className={`${bg} ${text} font-bold`}>
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              {name}
            </div>
          </span>
        );
      },
    },
    {
      accessorKey: "phone",
      header: t("event_dashboard.guest.table.phone"),
      cell: ({ row }) => (
        <span className="max-w-[200px] truncate">{row.getValue("phone")}</span>
      ),
    },
    {
      accessorKey: "guestGroup",
      header: t("event_dashboard.guest.table.groups"),
      cell: ({ row }) => (
        <div className="flex gap-2">
          {row.original?.guestGroup?.map((group: any) => (
            <Badge key={group.id} variant="default">
              {group.group?.name_kh}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "guestTag",
      header: t("event_dashboard.guest.table.tags"),
      cell: ({ row }) => (
        <div className="flex gap-2">
          {row.original?.guestTag?.map((tag: any) => (
            <Badge key={tag.id} variant="secondary">
              {tag.tag?.name_kh}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: t("event_dashboard.guest.table.status"),
      cell: ({ row }) => (
        <Badge
          className={`
            capitalize
            ${
              row.original.status === "pending"
                ? "bg-gray-200 text-gray-700"
                : row.original.status === "confirmed"
                ? "bg-blue-100 text-blue-600"
                : row.original.status === "rejected"
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-500"
            }
          `}
        >
          {(row.original.status && statusMap[row.original.status]) || ""}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionsCell row={row} />,
    },
  ];
}

// Export the mobile component for use in your main table component
export { MobileGuestCard };
