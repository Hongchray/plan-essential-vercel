"use client";

import { DataTable } from "./data-table";
import { useUserColumns } from "./columns";
import { User } from "../data/schema";

interface Props {
  data: User[];
  meta: { total: number; pageCount: number; per_page: number };
}

export default function UserTableClient({ data, meta }: Props) {
  const columns = useUserColumns();

  return (
    <DataTable<User, any>
      data={data}
      columns={columns}
      pageCount={meta.pageCount}
      total={meta.total}
      serverPagination={true}
    />
  );
}
