"use client";

import React from "react";
import { Table } from "@tanstack/react-table";
import {
  CopyIcon,
  CropIcon,
  Download,
  EllipsisVerticalIcon,
  MousePointerIcon,
  PlusCircle,
  SearchIcon,
  SquareIcon,
  Trash2Icon,
  Upload,
  UploadCloud,
  User2Icon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { CreateEditForm } from "../guest-form/create-edit";
import { useTranslation } from "react-i18next";
import { ConfirmDialog } from "@/components/composable/dialog/confirm-dialog";
import { Guest } from "@/interfaces/guest";
import { ExcelImportModal } from "../guest-form/export-excel";
import { toast } from "sonner";
import { useExcelOperations } from "@/hooks/use-guest-export-import";
import { useSession } from "next-auth/react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  serverPagination?: boolean;
  totalGuests?: number; // optional, default to 0
  session?: any; // optional, default to null
}

export function DataTableToolbar<TData>({
  table,
  serverPagination = false,
  totalGuests = 0,
  session = null, // default to null
}: DataTableToolbarProps<TData>) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  //get id
  const eventId = params.id as string;
  const searchParams = useSearchParams();
  const { t } = useTranslation("common");
  const limitGuests = session?.user?.plans?.[0]?.limit_guests ?? 0;
  const limitExportExcel =
    session?.user?.plans?.[0]?.limit_export_excel ?? false;

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

  const handleDeleteSelected = async () => {
    if (selectedCount === 0) return;

    try {
      const selectedData = selectedRows.map((row) => row.original as Guest);
      const ids = selectedData.map((item: Guest) => item.id);
      const eventId = selectedData[0]?.eventId;

      // Call the DELETE API endpoint
      const response = await fetch(`/api/admin/event/${eventId}/guest`, {
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

  const [isDeleting, setIsDeleting] = useState(false);
  // Get selected rows
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;
  const hasSelectedRows = selectedCount > 0;

  const handleImportComplete = () => {
    router.refresh();
  };
  const { exportGuestList, isExporting } = useExcelOperations(eventId);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("component.table.search_placeholder")}
            value={searchValue}
            onChange={(event) => handleSearch(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px] pl-10 text-[12px] md:text-base"
          />
        </div>
        {searchValue && (
          <Button
            variant="ghost"
            onClick={handleReset}
            className="h-8 px-2 lg:px-3 cursor-pointer"
          >
            {t("component.table.reset")}
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex gap-4">
        {session?.user?.role !== "admin" && (
          <div className="ml-2 text-md text-gray-500 flex items-center">
            <User2Icon /> {totalGuests}/{limitGuests}
          </div>
        )}

        {(session?.user?.role === "admin" || totalGuests < limitGuests) && (
          <CreateEditForm id="" />
        )}

        <div className="hidden  md:inline-flex w-fit -space-x-px rounded-md shadow-xs rtl:space-x-reverse">
          <ExcelImportModal
            eventId={eventId}
            onImportComplete={handleImportComplete}
            trigger={
              <Button
                size="sm"
                className="rounded-none rounded-s-md border-primary shadow-none focus-visible:z-10 text-primary hover:text-primary/80 hover:bg-primary/10 cursor-pointer"
                variant="outline"
              >
                <Upload />
                <span>{t("component.table.import_excel")}</span>
              </Button>
            }
          />

          {(limitExportExcel || session?.user?.role === "admin") && (
            <Button
              size="sm"
              onClick={exportGuestList}
              className="rounded-none shadow-none border-primary focus-visible:z-10 text-primary hover:text-primary/80 hover:bg-primary/10 cursor-pointer"
              variant="outline"
            >
              <Download />
              <span>{t("component.table.export_excel")}</span>
            </Button>
          )}

          <ConfirmDialog
            trigger={
              <Button
                size="sm"
                className="rounded-none rounded-e-md border-primary shadow-none focus-visible:z-10 text-primary hover:text-primary/80 hover:bg-primary/10 cursor-pointer"
                variant="outline"
                disabled={!hasSelectedRows || isDeleting}
              >
                <Trash2Icon />
                <span>{t("component.table.delete")}</span>
              </Button>
            }
            title={t("component.table.delete_title")}
            description={t("component.table.delete_description")}
            onConfirm={() => handleDeleteSelected()}
          />
        </div>
      </div>
    </div>
  );
}
