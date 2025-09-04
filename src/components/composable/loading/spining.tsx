import { LoaderIcon } from "lucide-react"

export const Spining = () => {
    return (
        <div className="flex items-center justify-center h-32 text-muted-foreground">
            <div className="flex items-center gap-2">
                <LoaderIcon className="h-5 w-5 animate-spin" />
                <span>Loading ...</span>
            </div>
        </div>
    )
}