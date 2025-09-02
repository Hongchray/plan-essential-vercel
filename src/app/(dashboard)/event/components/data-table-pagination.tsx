import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  total:number;
  serverPagination?: boolean;
}

export function DataTablePagination<TData>({
  table,
  total,
  serverPagination = false,
}: DataTablePaginationProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Create query string helper
  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      }

      return current.toString();
    },
    [searchParams]
  );

  // Handle per page change for server-side pagination
  const handlePerPageChange = (value: string) => {
    const newSize = Number(value);
    if (serverPagination) {
      // Reset to page 1 when changing page size
      router.push(
        `${pathname}?${createQueryString({
          page: 1,
          per_page: newSize,
        })}`,
        { scroll: false }
      );
    } else {
      table.setPageSize(newSize);
    }
  };

  // Get current per_page from URL or default to 10
  const currentPerPage = Number(searchParams.get("per_page")) || 10;

  return (
    <div className="flex items-center justify-between px-2">
      {/* <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div> */}
      <div className="flex-1 text-sm text-muted-foreground">
        <p>
          Total:{" "}
          <span className="font-bold text-primary">
            {total} records
          </span>{" "}
          .
        </p>
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${currentPerPage}`}
            onValueChange={handlePerPageChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={currentPerPage} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              if (serverPagination) {
                router.push(`${pathname}?${createQueryString({ page: 1 })}`, {
                  scroll: false,
                });
              } else {
                table.setPageIndex(0);
              }
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              if (serverPagination) {
                const currentPage = Number(searchParams.get("page")) || 1;
                router.push(
                  `${pathname}?${createQueryString({
                    page: Math.max(1, currentPage - 1),
                  })}`,
                  { scroll: false }
                );
              } else {
                table.previousPage();
              }
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              if (serverPagination) {
                const currentPage = Number(searchParams.get("page")) || 1;
                router.push(
                  `${pathname}?${createQueryString({
                    page: currentPage + 1,
                  })}`,
                  { scroll: false }
                );
              } else {
                table.nextPage();
              }
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              if (serverPagination) {
                router.push(
                  `${pathname}?${createQueryString({
                    page: table.getPageCount(),
                  })}`,
                  { scroll: false }
                );
              } else {
                table.setPageIndex(table.getPageCount() - 1);
              }
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
