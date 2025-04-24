"use client"

import { useCallback } from "react"

type EventCategory =
  | "dashboard"
  | "tasks"
  | "reports"
  | "authorizations"
  | "admin"
  | "settings"
  | "navigation"
  | "form"
  | "error"

type EventAction =
  | "view"
  | "click"
  | "submit"
  | "create"
  | "update"
  | "delete"
  | "filter"
  | "sort"
  | "search"
  | "export"
  | "error"

interface AnalyticsEvent {
  category: EventCategory
  action: EventAction
  label?: string
  value?: number
  metadata?: Record<string, any>
}

/**
 * Hook for tracking analytics events throughout the application
 */
export function useAnalytics() {
  /**
   * Track an analytics event
   */
  const trackEvent = useCallback(({ category, action, label, value, metadata }: AnalyticsEvent) => {
    // In a real implementation, this would send data to your analytics platform
    // such as Google Analytics, Mixpanel, or a custom backend
    console.log("Analytics Event:", {
      category,
      action,
      label,
      value,
      metadata,
      timestamp: new Date().toISOString(),
    })

    // Example implementation for Google Analytics
    if (typeof window !== "undefined" && "gtag" in window) {
      // @ts-ignore - gtag might not be typed
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
        ...metadata,
      })
    }
  }, [])

  /**
   * Track a page view
   */
  const trackPageView = useCallback((path: string, title?: string) => {
    // In a real implementation, this would send page view data to your analytics platform
    console.log("Page View:", { path, title, timestamp: new Date().toISOString() })

    // Example implementation for Google Analytics
    if (typeof window !== "undefined" && "gtag" in window) {
      // @ts-ignore - gtag might not be typed
      window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_path: path,
        page_title: title,
      })
    }
  }, [])

  /**
   * Track an error event
   */
  const trackError = useCallback(
    (error: Error, componentName?: string, metadata?: Record<string, any>) => {
      console.error("Error tracked:", error)

      trackEvent({
        category: "error",
        action: "error",
        label: componentName || "unknown_component",
        metadata: {
          errorMessage: error.message,
          errorStack: error.stack,
          ...metadata,
        },
      })
    },
    [trackEvent],
  )

  return { trackEvent, trackPageView, trackError }
}
