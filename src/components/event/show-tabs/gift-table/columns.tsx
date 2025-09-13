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
import { Gift } from "@/interfaces/gift";
import { useTranslation } from "react-i18next";

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
    accessorKey: "amount",
    header: () => {
      const { t } = useTranslation("common");
      return t("gift.table.amount");
    },
    cell: ({ row }) => (
      <div className="flex gap-2">
        <span className="max-w-[350px] truncate ">
          {row.original.currency_type === "USD"
            ? currencyFormatters.usd(row.getValue("amount") ?? 0)
            : currencyFormatters.khr(row.getValue("amount") ?? 0)}
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
