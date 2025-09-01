"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { CreateEditForm } from "@/components/store/create-edit"
import Link from "next/link"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}
const groups = [
  {
    label: "All Groups",
    value: "all",
  },
  {
    label: "Group 1",
    value: "group1",
  },
  {
    label: "Group 2",
    value: "group2",
  },
]
export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Filter stores..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/* Filter Group */}
        <DataTableFacetedFilter
            title="Group"
            options={groups}
        />
        <DataTableFacetedFilter
            title="Tags"
            options={groups}
        />
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {/* <CreateEditForm /> */}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}