"use client";

import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useState, useEffect } from "react";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {mounted && (
          <p>
            {t("component.table.total")}:{" "}
            <span className="font-bold text-primary">
              {total} {t("component.table.records")}
            </span>
          </p>
        )}
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          {mounted && <p>{t("component.table.rows_per_page")}</p>}

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
          {mounted && (
            <p>
              {t("component.table.total")}:{" "}
              <span className="font-bold text-primary">
                {total} {t("component.table.records")}
              </span>
            </p>
          )}
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
            {mounted && <p>{t("component.table.first_page")}</p>}

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
              } else table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            {mounted && <p>{t("component.table.prev_page")}</p>}
            <ChevronLeft />
          </Button>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              if (serverPagination) {
                const currentPage = Number(searchParams.get("page")) || 1;
                router.push(
                  `${pathname}?${createQueryString({ page: currentPage + 1 })}`,
                  { scroll: false }
                );
              } else table.nextPage();
            }}
            disabled={!table.getCanNextPage()}
          >
            {mounted && <p>{t("component.table.next_page")}</p>}
            <ChevronRight />
          </Button>

          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              if (serverPagination)
                router.push(
                  `${pathname}?${createQueryString({
                    page: table.getPageCount(),
                  })}`,
                  { scroll: false }
                );
              else table.setPageIndex(table.getPageCount() - 1);
            }}
            disabled={!table.getCanNextPage()}
          >
            {" "}
            {mounted && <p>{t("component.table.last_page")}</p>}
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
