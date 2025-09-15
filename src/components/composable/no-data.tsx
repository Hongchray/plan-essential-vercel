import { FileX, Database, Search, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface NoDataProps {
  icon?: "file" | "database" | "search" | "inbox";
  title?: string;
  description?: string;
  className?: string;
}

export function NoData({
  icon = "file",
  title = "No data found",
  description = "There is no data to display at the moment.",
  className,
}: NoDataProps) {
  const icons = {
    file: FileX,
    database: Database,
    search: Search,
    inbox: Inbox,
  };

  const IconComponent = icons[icon];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
    >
      <div className="mb-4 rounded-full bg-muted p-4">
        <IconComponent className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
    </div>
  );
}
