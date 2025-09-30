"use client";

import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  total: number;
  serverPagination?: boolean;
}

export function DataTablePagination<TData>({
  table,
  total,
  serverPagination = false,
}: DataTablePaginationProps<TData>) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      for (const [key, value] of Object.entries(params)) {
        if (value === null) current.delete(key);
        else current.set(key, String(value));
      }
      return current.toString();
    },
    [searchParams]
  );

  const handlePerPageChange = (value: string) => {
    const newSize = Number(value);
    if (serverPagination) {
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

  const currentPerPage = Number(searchParams.get("per_page")) || 10;
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="space-y-3 bg-gray-50 p-2 rounded">
        {/* Navigation Controls - Mobile */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (serverPagination) {
                const currentPageNum = Number(searchParams.get("page")) || 1;
                router.push(
                  `${pathname}?${createQueryString({
                    page: Math.max(1, currentPageNum - 1),
                  })}`,
                  { scroll: false }
                );
              } else table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            {/* {t("component.table.prev_page")} */}
          </Button>

          {/* Per Page Selector - Mobile */}
          <div className="flex items-center justify-center gap-2">
            <Select
              value={`${currentPerPage}`}
              onValueChange={handlePerPageChange}
            >
              <SelectTrigger className="h-8 w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {currentPage} / {totalPages}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{total}</span>{" "}
            {t("component.table.records")}
          </p>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (serverPagination) {
                const currentPageNum = Number(searchParams.get("page")) || 1;
                router.push(
                  `${pathname}?${createQueryString({
                    page: currentPageNum + 1,
                  })}`,
                  { scroll: false }
                );
              } else table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
            className="flex items-center gap-1"
          >
            {/* {t("component.table.next_page")} */}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        <p>
          {t("component.table.total")}:{" "}
          <span className="font-bold text-primary">
            {total} {t("component.table.records")}
          </span>
        </p>
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">
            {t("component.table.rows_per_page")}
          </p>
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
          {t("component.table.page")} {currentPage} {t("component.table.of")}{" "}
          {totalPages}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              if (serverPagination)
                router.push(`${pathname}?${createQueryString({ page: 1 })}`, {
                  scroll: false,
                });
              else table.setPageIndex(0);
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t("component.table.first_page")}</span>
            <ChevronsLeft />
          </Button>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              if (serverPagination) {
                const currentPageNum = Number(searchParams.get("page")) || 1;
                router.push(
                  `${pathname}?${createQueryString({
                    page: Math.max(1, currentPageNum - 1),
                  })}`,
                  { scroll: false }
                );
              } else table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t("component.table.prev_page")}</span>
            <ChevronLeft />
          </Button>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              if (serverPagination) {
                const currentPageNum = Number(searchParams.get("page")) || 1;
                router.push(
                  `${pathname}?${createQueryString({
                    page: currentPageNum + 1,
                  })}`,
                  { scroll: false }
                );
              } else table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t("component.table.next_page")}</span>
            <ChevronRight />
          </Button>

          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              if (serverPagination)
                router.push(
                  `${pathname}?${createQueryString({
                    page: totalPages,
                  })}`,
                  { scroll: false }
                );
              else table.setPageIndex(totalPages - 1);
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t("component.table.last_page")}</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
