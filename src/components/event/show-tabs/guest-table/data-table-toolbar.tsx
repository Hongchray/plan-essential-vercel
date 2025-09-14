"use client";

import { Table } from "@tanstack/react-table";
import { CopyIcon, CropIcon, Download, EllipsisVerticalIcon, MousePointerIcon, PlusCircle, SquareIcon, Trash2Icon, Upload, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { CreateEditForm } from "../guest-form/create-edit";
import { useTranslation } from "react-i18next";
import { ConfirmDialog } from "@/components/composable/dialog/confirm-dialog";
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  serverPagination?: boolean;
}

export function DataTableToolbar<TData>({
  table,
  serverPagination = false,
}: DataTableToolbarProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslation("common");

  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [hasCreatePermission, setHasCreatePermission] = useState(false);

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
      const selectedData = selectedRows.map(row => row.original);

      //

      
      // Clear selection after successful deletion
      table.resetRowSelection();
    } catch (error) {
    }
  };

  const [isDeleting ,setIsDeleting] = useState(false);
  // Get selected rows
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;
  const hasSelectedRows = selectedCount > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={t("component.table.search_placeholder")}
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
            {t("component.table.reset")}
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex gap-4">
        <CreateEditForm id="" />
        <div className='inline-flex w-fit -space-x-px rounded-md shadow-xs rtl:space-x-reverse'>
          <Button className='rounded-none rounded-s-md shadow-none focus-visible:z-10' variant='outline'>
            <Upload />
            <span className=''>បញ្ចូល Excel</span>
          </Button>
          <Button className='rounded-none shadow-none focus-visible:z-10' variant='outline'>
            <Download />
            <span className=''>ទាញយក</span>
          </Button>
          <ConfirmDialog
            trigger={
              <Button className='rounded-none rounded-e-md shadow-none focus-visible:z-10' variant='outline' disabled={!hasSelectedRows || isDeleting}>
                <Trash2Icon />
                <span className=''>លុប</span>
              </Button>
            }
            title={t("event_dashboard.guest.table.delete_title")}
            description={t("event_dashboard.guest.table.delete_description")}
            onConfirm={()=>handleDeleteSelected}
          />
        </div>
        {/* <DataTableViewOptions table={table} /> */}
      </div>
    </div>
  );
}
