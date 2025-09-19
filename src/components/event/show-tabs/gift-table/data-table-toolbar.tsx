"use client";
import { ConfirmDialog } from "@/components/composable/dialog/confirm-dialog";

import { Table } from "@tanstack/react-table";
import { PlusCircle, X, Download, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { CreateEditGiftForm } from "../gift-form/create-edit";
import { useTranslation } from "react-i18next";
import {
  usePathname,
  useRouter,
  useSearchParams,
  useParams,
} from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useExcelOperations } from "@/hooks/use-gift-export-import";
import { GridLineTypeFunctionProps } from "recharts/types/cartesian/CartesianGrid";
import { Gift } from "@/interfaces/gift";
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  serverPagination?: boolean;
  eventId?: string; // Add eventId for export
}

export function DataTableToolbar<TData>({
  table,
  serverPagination = false,
}: DataTableToolbarProps<TData>) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();

  const eventId = params.id as string;

  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (value: string) => {
    setSearchValue(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (serverPagination) {
        const current = new URLSearchParams(Array.from(searchParams.entries()));

        if (value) {
          current.set("search", value);
          current.set("page", "1");
        } else {
          current.delete("search");
        }

        const search = current.toString();
        const query = search ? `?${search}` : "";

        router.push(`${pathname}${query}`, { scroll: false });
      }
    }, 500);
  };

  const handleDeleteSelected = async () => {
    if (selectedCount === 0) return;

    try {
      const selectedData = selectedRows.map((row) => row.original as Gift);
      const ids = selectedData.map((item: Gift) => item.id);
      const eventId = selectedData[0]?.eventId;

      // Call the DELETE API endpoint
      const response = await fetch(`/api/admin/event/${eventId}/gift`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      });

      // Check if the request was successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || errorData.message || "Failed to delete records"
        );
      }
      table.resetRowSelection();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const handleReset = () => {
    setSearchValue("");
    if (serverPagination) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.delete("search");
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`${pathname}${query}`, { scroll: false });
    }
  };
  const [isDeleting, setIsDeleting] = useState(false);
  // Get selected rows
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;
  const hasSelectedRows = selectedCount > 0;

  const { exportGiftList, isExporting } = useExcelOperations(eventId);

  return (
    <div className="flex items-center justify-between gap-2">
      {/* Left side: search + reset */}
      <div className="flex items-center gap-2">
        <Input
          placeholder={t("expense.search_placeholder")}
          value={searchValue}
          onChange={(event) => handleSearch(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {searchValue && (
          <Button
            variant="ghost"
            onClick={handleReset}
            className="h-8 px-2 lg:px-3"
          >
            {t("expense.reset")}
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Right side: actions */}
      <div className="flex items-center gap-2">
        <CreateEditGiftForm
          id=""
          onSelect={(guest) => {
            console.log("Selected guest:", guest);
          }}
        />

        {/* Export + Delete */}
        <div className="hidden md:inline-flex -space-x-px rounded-md shadow-xs rtl:space-x-reverse">
          <Button
            size="sm"
            onClick={exportGiftList}
            disabled={isExporting}
            className="rounded-none rounded-s-md border-primary shadow-none focus-visible:z-10 text-primary hover:text-primary/80 hover:bg-primary/10"
            variant="outline"
          >
            <Download />
            <span>ទាញយក</span>
          </Button>

          <ConfirmDialog
            trigger={
              <Button
                size="sm"
                className="rounded-none rounded-e-md border-primary shadow-none focus-visible:z-10 text-primary hover:text-primary/80 hover:bg-primary/10"
                variant="outline"
                disabled={!hasSelectedRows || isDeleting}
              >
                <Trash2Icon />
                <span>លុប</span>
              </Button>
            }
            title={t("event_dashboard.guest.table.delete_title")}
            description={t("event_dashboard.guest.table.delete_description")}
            onConfirm={() => handleDeleteSelected()}
          />
        </div>

        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
