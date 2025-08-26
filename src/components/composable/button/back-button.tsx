"use client"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"

export function BackButton()
{
    const router = useRouter()
    return(
         <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
        >
            Cancel
        </Button>
    )
}