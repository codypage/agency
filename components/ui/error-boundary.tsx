"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"
import { useAnalytics } from "@/hooks/use-analytics"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  componentName?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            <p className="mb-4">{this.state.error?.message || "An unexpected error occurred. Please try again."}</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  this.setState({ hasError: false, error: null })
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  window.location.reload()
                }}
              >
                Reload Page
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )
    }

    return this.props.children
  }
}

// Wrapper component to use hooks with class component
export function ErrorBoundary({ children, fallback, componentName }: Omit<ErrorBoundaryProps, "onError">): JSX.Element {
  const { trackError } = useAnalytics()

  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    trackError(error, componentName, {
      componentStack: errorInfo.componentStack,
    })
  }

  return (
    <ErrorBoundaryClass onError={handleError} fallback={fallback} componentName={componentName}>
      {children}
    </ErrorBoundaryClass>
  )
}
