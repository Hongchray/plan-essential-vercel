"use client";

import { cn } from "@/lib/utils";

interface RequiredMarkProps {
  className?: string;
}

export function RequiredMark({ className }: RequiredMarkProps) {
  return (
    <span className={cn("text-red-500 ml-1", className)} aria-hidden="true">
      *
    </span>
  );
}
