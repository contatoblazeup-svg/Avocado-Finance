"use client"

import React from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <Alert variant="destructive" className="bg-red-900/20 border-red-500/50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-red-400">Something went wrong</AlertTitle>
          <AlertDescription className="text-red-200 mb-4">
            {error?.message || "An unexpected error occurred. Please try again."}
          </AlertDescription>
          <Button
            onClick={resetError}
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </Alert>
      </div>
    </div>
  )
}

export function ErrorMessage({
  error,
  onRetry,
  className,
}: {
  error: string | Error
  onRetry?: () => void
  className?: string
}) {
  const message = typeof error === "string" ? error : error.message

  return (
    <Alert variant="destructive" className={`bg-red-900/20 border-red-500/50 ${className}`}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="text-red-400">Error</AlertTitle>
      <AlertDescription className="text-red-200">
        {message}
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="mt-2 border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
