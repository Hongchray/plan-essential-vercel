"use client";

import { Table } from "@tanstack/react-table";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation("common");

  const [mounted, setMounted] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mark as mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only set searchValue after mounted
  useEffect(() => {
    if (mounted) {
      setSearchValue(searchParams.get("search") || "");
    }
  }, [mounted, searchParams]);

  const handleSearch = (value: string) => {
    setSearchValue(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (serverPagination) {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        if (value) {
          current.set("search", value);
          current.set("page", "1");
        } else {
          current.delete("search");
        }
        const query = current.toString() ? `?${current.toString()}` : "";
        router.push(`${pathname}${query}`, { scroll: false });
      }
    }, 500);
  };

  const handleReset = () => {
    setSearchValue("");
    if (serverPagination) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.delete("search");
      const query = current.toString() ? `?${current.toString()}` : "";
      router.push(`${pathname}${query}`, { scroll: false });
    }
  };

  // Only render client-dependent UI after mounted
  if (!mounted) return null;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={t("component.table.search")}
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
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
        {/*
        <Link href="/event/create" passHref>
          <Button size="sm" asChild>
            <div className="inline-flex items-center gap-1">
              <Plus /> {t("component.table.add_new")}
            </div>
          </Button>
        </Link>
        */}

        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
