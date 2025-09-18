"use client";

import { Table } from "@tanstack/react-table";
import { PlusCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
// import { useClientPermissions } from "@/use-cases/use-client-permission";
import { useEffect } from "react";

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
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // const { hasPermission } = useClientPermissions();

  const [hasCreatePermission, setHasCreatePermission] = useState(false);
  // useEffect(() => {
  //   const canCreate = hasPermission("gameCreate");
  //   setHasCreatePermission(canCreate);
  // }, [hasPermission]);

  const handleSearch = (value: string) => {
    setSearchValue(value);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      if (serverPagination) {
        const current = new URLSearchParams(Array.from(searchParams.entries()));

        if (value) {
          current.set("search", value);
          current.set("page", "1"); // Reset to first page on new search
        } else {
          current.delete("search");
        }

        const search = current.toString();
        const query = search ? `?${search}` : "";

        router.push(`${pathname}${query}`, { scroll: false });
      }
    }, 500); // 500ms delay
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
          placeholder="Search Games..."
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
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex gap-4">
        {/* <Link href="/user/create">
          <Button size="sm">Add New</Button>
        </Link> */}

        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
