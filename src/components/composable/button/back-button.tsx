"use client"
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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
            <X/>
            Cancel
        </Button>
    )
}