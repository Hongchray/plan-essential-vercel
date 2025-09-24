"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loading } from "@/components/composable/loading/loading";
import { useTranslation } from "next-i18next";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MobileTemplateCard } from "./columns";
import { Template } from "../data/schema";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  total: number;
  serverPagination: boolean;
  loading?: boolean; // optional
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  total,
  serverPagination,
  loading = false, // default to false
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslation("common");

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [isMobile, setIsMobile] = React.useState(false);

  // Get current values from URL
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);
  const currentPerPage = Number(searchParams.get("per_page")) || 10;

  // Check if screen is mobile
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      }

      // Add sorting parameters
      if (sorting.length > 0) {
        current.set("sort", sorting[0].id);
        current.set("order", sorting[0].desc ? "desc" : "asc");
      }

      return current.toString();
    },
    [searchParams, sorting]
  );

  // Handle sorting changes
  React.useEffect(() => {
    if (sorting.length > 0) {
      router.push(
        `${pathname}?${createQueryString({
          page: currentPage, // Reset to first page on sort change
          sort: sorting[0].id,
          order: sorting[0].desc ? "desc" : "asc",
        })}`,
        { scroll: false }
      );
    }
  }, [sorting, router, currentPage, pathname, createQueryString]);

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: currentPerPage,
      },
    },
    enableRowSelection: true,
    manualPagination: true,
    manualSorting: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({
          pageIndex: currentPage - 1,
          pageSize: currentPerPage,
        });

        const newPage = newState.pageIndex + 1;
        if (newPage > 0 && newPage <= pageCount) {
          router.push(
            `${pathname}?${createQueryString({
              page: newPage,
              per_page: newState.pageSize,
            })}`,
            { scroll: false }
          );
        }
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4 bg-white p-2 md:p-5 rounded-lg border">
      <DataTableToolbar table={table} serverPagination={serverPagination} />

      {/* Mobile List View */}
      {isMobile ? (
        <div className="">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loading
                variant="table"
                size="lg"
                message={t("component.table.loadingMessage")}
              />
            </div>
          ) : table.getRowModel().rows.length ? (
            table
              .getRowModel()
              .rows.map((row) => (
                <MobileTemplateCard
                  key={row.id}
                  template={row.original as Template}
                  isSelected={row.getIsSelected()}
                  onSelect={(selected) => row.toggleSelected(selected)}
                />
              ))
          ) : (
            <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">{t("component.table.noResults")}</p>
            </div>
          )}
        </div>
      ) : (
        /* Desktop Table View */
        <div className="rounded-md border relative">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <Loading
                      variant="table"
                      size="lg"
                      message={t("component.table.loadingMessage")}
                    />
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {t("component.table.noResults")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <DataTablePagination
        table={table}
        serverPagination={serverPagination}
        total={total}
      />
    </div>
  );
}
