"use client"

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  loading: boolean
  entityId?: string
  className?: string
}

export function SubmitButton(
    {
        loading,
        entityId,
        className,
    }: SubmitButtonProps
)
{
    return(
        <Button
            type="submit"
            disabled={loading}
        >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Saving..." : entityId ? "Save Changes" : "Create"}
        </Button>
    );
}