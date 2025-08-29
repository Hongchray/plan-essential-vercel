"use client"

import { Metadata } from "next"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { useLoading } from "../layout"
import { useEffect, useState } from "react"
import { Event } from "./data/schema"

// export const metadata: Metadata = {
//   title: "Templates",
//   description: "Manage all templates",
// }

// Simulate a database read for tasks.
async function getTemplates() {
   // get all templates from api
   const res = await fetch('/api/admin/event',{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
   })
   const data = await res.json()
   return data.event
}

export default function TemplatePage() {
  const { setOverlayLoading } = useLoading();
  const [data, setData] = useState<Event[]>([])
  useEffect(() => {
    async function fetchTemplates() {
      setOverlayLoading(true)
      try {
        const templates = await getTemplates()
        setData(templates as Event[])
      } catch (error) {
        console.error("Failed to fetch templates:", error)
        // You might want to show an error message to the user here
      } finally {
        setOverlayLoading(false)
      }
    }

    fetchTemplates()
  }, [])
  return (
    <>
      <div className="h-full flex-1 flex-col gap-2 p-4">
        <DataTable data={data} columns={columns} />
      </div> 
    </>
  )
}