"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingProps {
  logo?: string
  logoSize?: number
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "spinner" | "dots" | "pulse" | "skeleton"
  text?: string
  fullScreen?: boolean
  overlay?: boolean
  className?: string
}

export function Loading({
  logo,
  logoSize = 80,
  size = "md",
  variant = "spinner",
  text = 'Loading...',
  fullScreen = false,
  overlay = false,
  className
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg", 
    xl: "text-xl"
  }

  const containerClasses = cn(
    "flex flex-col items-center justify-center gap-3",
    fullScreen && "fixed inset-0 z-50",
    overlay && "bg-white/50 backdrop-blur-xs",
    !fullScreen && "p-8",
    className
  )

  const renderVariant = () => {
    switch (variant) {
      case "spinner":
        return (
          <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
        )
      
      case "dots":
        return (
          <div className="flex space-x-1">
            <div className={cn("bg-primary rounded-full animate-bounce", 
              size === "sm" ? "w-2 h-2" : 
              size === "md" ? "w-3 h-3" :
              size === "lg" ? "w-4 h-4" : "w-5 h-5"
            )} style={{ animationDelay: "0ms" }} />
            <div className={cn("bg-primary rounded-full animate-bounce", 
              size === "sm" ? "w-2 h-2" : 
              size === "md" ? "w-3 h-3" :
              size === "lg" ? "w-4 h-4" : "w-5 h-5"
            )} style={{ animationDelay: "150ms" }} />
            <div className={cn("bg-primary rounded-full animate-bounce", 
              size === "sm" ? "w-2 h-2" : 
              size === "md" ? "w-3 h-3" :
              size === "lg" ? "w-4 h-4" : "w-5 h-5"
            )} style={{ animationDelay: "300ms" }} />
          </div>
        )
      
      case "pulse":
        return (
          <div className={cn("bg-primary rounded-full animate-pulse", sizeClasses[size])} />
        )
      
      case "skeleton":
        return (
          <div className="space-y-3">
            <div className={cn("bg-gray-200 rounded animate-pulse", 
              size === "sm" ? "h-3 w-24" :
              size === "md" ? "h-4 w-32" :
              size === "lg" ? "h-5 w-40" : "h-6 w-48"
            )} />
            <div className={cn("bg-gray-200 rounded animate-pulse", 
              size === "sm" ? "h-3 w-20" :
              size === "md" ? "h-4 w-28" :
              size === "lg" ? "h-5 w-36" : "h-6 w-44"
            )} />
            <div className={cn("bg-gray-200 rounded animate-pulse", 
              size === "sm" ? "h-3 w-16" :
              size === "md" ? "h-4 w-24" :
              size === "lg" ? "h-5 w-32" : "h-6 w-40"
            )} />
          </div>
        )
      
      default:
        return <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
    }
  }

  return (
    <div className={containerClasses}>
      {renderVariant()}
      {text && (
        <p className={cn("text-muted-foreground animate-pulse", textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  )
}

// Page Loading Component
export function PageLoading({ 
  text = "Loading...", 
  className 
}: { 
  text?: string
  className?: string 
}) {
  return (
    <Loading
      logo="/logo.png"
      logoSize={80}
      size="lg"
      variant="spinner"
      text={text}
      fullScreen={true}
      overlay={true}
      className={className}
    />
  )
}

// Card Loading Component
export function CardLoading({ 
  text,
  className 
}: { 
  text?: string
  className?: string 
}) {
  return (
    <div className={cn("border rounded-lg p-8", className)}>
      <Loading
        size="md"
        variant="skeleton"
        text={text}
      />
    </div>
  )
}

// Button Loading Component
export function ButtonLoading({ 
  text = "Loading...",
  size = "sm",
  className 
}: { 
  text?: string
  size?: "sm" | "md"
  className?: string 
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Loader2 className={cn("animate-spin", 
        size === "sm" ? "w-4 h-4" : "w-5 h-5"
      )} />
      <span className={size === "sm" ? "text-sm" : "text-base"}>{text}</span>
    </div>
  )
}

// Table Loading Component
export function TableLoading({ 
  rows = 5,
  columns = 4,
  className 
}: { 
  rows?: number
  columns?: number
  className?: string 
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, j) => (
            <div
              key={j}
              className="h-4 bg-gray-200 rounded animate-pulse flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  )
}