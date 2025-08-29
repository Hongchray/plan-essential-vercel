
import tasks from './data/tasks.json'
import { Metadata } from "next"
import { z } from "zod"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { storeSchema } from "./data/schema"

export const metadata: Metadata = {
  title: "Users",
  description: "A task and issue tracker build using Tanstack Table.",
}

// Simulate a database read for tasks.
async function getTasks() {
  return z.array(storeSchema).parse(tasks)
}

export default async function StorePage() {
  const tasks = await getTasks()
  return (
    <>
      <div className="hidden h-full flex-1 flex-col gap-2 p-4 md:flex">
        <DataTable data={tasks} columns={columns} />
      </div> 
    </>
  )
}