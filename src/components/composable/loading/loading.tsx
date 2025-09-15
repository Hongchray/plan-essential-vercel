import { LoaderIcon, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal" | "pulse" | "dots" | "circle";
  message?: string;
  className?: string;
}

export const Loading = ({
  size = "md",
  variant = "default",
  message = "Loading...",
  className,
}: LoadingProps) => {
  const sizeClasses = {
    sm: "h-6 w-6", // for small loaders (inline/data loading)
    md: "h-10 w-10", // medium (between inline and full page)
    lg: "h-16 w-16", // large (page loading)
  };

  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  if (variant === "minimal") {
    return (
      <div
        className={cn(
          "flex items-center justify-center",
          sizeClasses[size],
          className
        )}
      >
        <LoaderIcon
          className={cn(iconSizes[size], "animate-spin text-muted-foreground")}
        />
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div
        className={cn(
          "flex items-center justify-center",
          sizeClasses[size],
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={cn(
                "rounded-full bg-primary/20 animate-ping",
                size === "sm"
                  ? "h-8 w-8"
                  : size === "md"
                  ? "h-10 w-10"
                  : "h-12 w-12"
              )}
            />
            <LoaderIcon
              className={cn(
                iconSizes[size],
                "absolute inset-0 m-auto animate-spin text-primary"
              )}
            />
          </div>
          <span className="text-sm font-medium text-muted-foreground animate-pulse">
            {message}
          </span>
        </div>
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div
        className={cn(
          "flex items-center justify-center",
          sizeClasses[size],
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "rounded-full bg-primary animate-bounce",
                  size === "sm"
                    ? "h-2 w-2"
                    : size === "md"
                    ? "h-3 w-3"
                    : "h-4 w-4"
                )}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "0.6s",
                }}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {message}
          </span>
        </div>
      </div>
    );
  }

  if (variant === "circle") {
    return (
      <div
        className={cn(
          "flex items-center justify-center",
          sizeClasses[size],
          className
        )}
      >
        <div className="relative flex items-center justify-center">
          {/* Ping animation background */}
          <div
            className={cn(
              "rounded-full bg-primary/20 animate-ping",
              iconSizes[size]
            )}
          />

          {/* Use GIF instead of video */}
          <img
            src="/loading.gif"
            alt="Loading..."
            className={cn(iconSizes[size], "absolute inset-0 m-auto")}
          />
        </div>
      </div>
    );
  }

  // Default variant - enhanced version of original
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
          <div className="relative flex items-center justify-center p-3 rounded-full bg-background border border-border/50 shadow-sm">
            <LoaderIcon
              className={cn(iconSizes[size], "animate-spin text-primary")}
            />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">{message}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Please wait a moment
          </p>
        </div>
      </div>
    </div>
  );
};

// Keep original component for backward compatibility
export const Spining = () => {
  return <LoaderIcon className="animate-spin self-center"/>;
};
