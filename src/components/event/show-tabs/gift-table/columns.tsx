"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { ConfirmDialog } from "@/components/composable/dialog/confirm-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CreateEditGiftForm } from "../gift-form/create-edit";
import { currencyFormatters } from "@/utils/currency";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getAvatarColor, getInitials } from "@/utils/avatar";
import { Gift } from "@/interfaces/gift";
const ActionsCell = ({ row }: { row: any }) => {
  const router = useRouter();
  const { t } = useTranslation("common");

  const deleteEvent = async (eventId: string, id: string) => {
    try {
      const res = await fetch(`/api/admin/event/${eventId}/gift/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success(t("gift.table.delete_success"));
        router.refresh();
      } else {
        toast.error(t("gift.table.delete_error"));
      }
    } catch (error) {
      toast.error(t("gift.table.delete_error"));
    }
  };

  return (
    <div className="flex gap-2 items-end justify-end">
      <CreateEditGiftForm id={row.original.id} />
      <ConfirmDialog
        trigger={
          <Button size="icon" variant="destructive">
            <Trash2Icon />
          </Button>
        }
        title={t("gift.table.delete_title")}
        description={t("gift.table.delete_description")}
        onConfirm={() => deleteEvent(row.original.eventId, row.original.id)}
      />
    </div>
  );
};

export const MobileGiftCard = ({
  gift,
  onSelect,
  isSelected,
}: {
  gift: Gift;
  onSelect: (selected: boolean) => void;
  isSelected: boolean;
}) => {
  const { t } = useTranslation("common");
  const name: string = gift.guest?.name ?? "";
  const { bg, text } = getAvatarColor(name);

  return (
    <div className="bg-white border-t border-gray-200 p-2 ">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Avatar className="h-8 w-8 flex-shrink-0">
          {gift.guest?.image ? (
            <AvatarImage src={gift.guest.image} alt={name} />
          ) : (
            <AvatarImage src="/placeholder.svg" />
          )}
          <AvatarFallback className={`${bg} ${text} font-bold text-[12px]`}>
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        {/* Guest & Gift info */}
        <div className="flex-1 min-w-0">
          <div className="mb-1">
            <h3 className="text-[13px] font-semibold text-gray-900 break-words">
              {name}
            </h3>
            <p className="text-[11px] text-gray-500">{gift.guest?.phone}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-600">
            <Badge variant="default" className="text-[10px]">
              {gift.payment_type}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {gift.currency_type} {gift.amount_usd}
            </Badge>
            {gift.note && (
              <span className="italic text-gray-500">“{gift.note}”</span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end mt-2">
        <ActionsCell row={{ original: gift }} />
      </div>
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
    header: () => {
      const { t } = useTranslation("common");
      return t("gift.table.guest_name");
    },
    cell: ({ row }) => (
      <div className="flex gap-2">
        <span className="max-w-[350px] truncate text-primary font-medium">
          {row.original.guest?.name}
        </span>
        <span>({row.original.guest?.phone})</span>
      </div>
    ),
  },
  {
    accessorKey: "note",
    header: () => {
      const { t } = useTranslation("common");
      return t("gift.table.note");
    },
    cell: ({ row }) => (
      <div className="flex gap-2">
        <span className="max-w-[300px] truncate ">{row.getValue("note")}</span>
      </div>
    ),
  },
  {
    accessorKey: "payment_type",
    header: () => {
      const { t } = useTranslation("common");
      return t("gift.table.payment_type");
    },
    cell: ({ row }) => (
      <div className="flex gap-2">
        <span className="max-w-[350px] truncate capitalize">
          {row.original.payment_type}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "currency_type",
    header: () => {
      const { t } = useTranslation("common");
      return t("gift.table.currency_type");
    },
    cell: ({ row }) => (
      <div className="flex gap-2">
        <span className="max-w-[350px] truncate capitalize">
          {row.original.currency_type}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "amount_usd",
    header: () => {
      const { t } = useTranslation("common");
      return t("gift.table.amount");
    },
    cell: ({ row }) => (
      <div className="flex gap-2">
        <span className="max-w-[350px] truncate ">
          {row.original.currency_type === "USD"
            ? currencyFormatters.usd(row.getValue("amount_usd") ?? 0)
            : currencyFormatters.khr(row.getValue("amount_usd") ?? 0)}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => {
      const { t } = useTranslation("common");
      return t("gift.table.actions");
    },
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
