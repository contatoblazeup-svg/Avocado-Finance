"use client"

import { cn } from "@/lib/utils"

interface LoadingProps {
  size?: "sm" | "md" | "lg"
  variant?: "spinner" | "dots" | "pulse"
  className?: string
  text?: string
}

export function Loading({ size = "md", variant = "spinner", className, text }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }

  if (variant === "spinner") {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
        <div
          className={cn("animate-spin rounded-full border-2 border-gray-600 border-t-green-500", sizeClasses[size])}
        />
        {text && <p className={cn("text-gray-400", textSizeClasses[size])}>{text}</p>}
      </div>
    )
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
        </div>
        {text && <p className={cn("text-gray-400", textSizeClasses[size])}>{text}</p>}
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
        <div className={cn("bg-green-500 rounded-full animate-pulse", sizeClasses[size])} />
        {text && <p className={cn("text-gray-400", textSizeClasses[size])}>{text}</p>}
      </div>
    )
  }

  return null
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-gray-700 rounded", className)} />
}

export function PoolCardSkeleton() {
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <LoadingSkeleton className="w-10 h-10 rounded-full" />
            <LoadingSkeleton className="w-10 h-10 rounded-full" />
          </div>
          <div className="space-y-2">
            <LoadingSkeleton className="h-5 w-20" />
            <LoadingSkeleton className="h-4 w-12" />
          </div>
        </div>
        <div className="text-right space-y-1">
          <LoadingSkeleton className="h-6 w-16" />
          <LoadingSkeleton className="h-3 w-8" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <LoadingSkeleton className="h-16" />
        <LoadingSkeleton className="h-16" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <LoadingSkeleton className="h-12" />
        <LoadingSkeleton className="h-12" />
      </div>

      <LoadingSkeleton className="h-10 mb-4" />
      <LoadingSkeleton className="h-2 mb-4" />

      <div className="flex gap-2">
        <LoadingSkeleton className="flex-1 h-10" />
        <LoadingSkeleton className="w-10 h-10" />
      </div>
    </div>
  )
}
