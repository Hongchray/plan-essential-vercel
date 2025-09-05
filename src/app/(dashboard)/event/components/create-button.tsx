"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
export default function CreateEventButton() {
  return (
    <div className="flex justify-end mb-4">
      <Button
        onClick={() => (window.location.href = "/event/create")}
        className=""
      >
        <PlusIcon /> Create Event
      </Button>
    </div>
  );
}
