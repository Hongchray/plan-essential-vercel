"use client";

import { DataTable } from "./data-table";
import { useEventColumns } from "./columns";

interface Props {
  data: any[];
  meta: { total: number; pageCount: number; per_page: number };
}

export default function EventTableClient({ data, meta }: Props) {
  const columns = useEventColumns();

  return (
    <DataTable<any, any>
      data={data}
      columns={columns}
      pageCount={meta.pageCount}
      total={meta.total}
      serverPagination={true}
    />
  );
}
