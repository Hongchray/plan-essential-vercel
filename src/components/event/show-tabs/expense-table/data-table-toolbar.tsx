"use client";

import { Table } from "@tanstack/react-table";
import { PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { CreateEditForm } from "../expense-form/create-edit";
import { useTranslation } from "react-i18next";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  serverPagination?: boolean;
}

export function DataTableToolbar<TData>({
  table,
  serverPagination = false,
}: DataTableToolbarProps<TData>) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
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

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
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
      <div className="flex gap-4">
        <CreateEditForm id="" />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
