"use client"

/**
 * React hook for using Desk365 services in components
 */

import { useState } from "react"
import { getServiceProvider, type ServiceProviderConfig } from "../lib/api-client/service-provider"
import type { CachedTaskServiceFacade } from "../lib/desk365-facade-with-cache"

/**
 * Hook for using Desk365 services in React components
 * @returns Object containing Desk365 services and utilities
 */
export function useDesk365() {
  const [isReady, setIsReady] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  // Get service instances
  let taskService: CachedTaskServiceFacade | null = null
  let config: ServiceProviderConfig | null = null

  try {
    const serviceProvider = getServiceProvider()
    taskService = serviceProvider.getTaskService()
    config = serviceProvider.getConfig()

    // If we got here, services are ready
    if (!isReady) {
      setIsReady(true)
    }
  } catch (err) {
    if (!error) {
      setError(err instanceof Error ? err : new Error(String(err)))
    }
  }

  // Update configuration
  const updateConfig = (newConfig: Partial<ServiceProviderConfig>) => {
    try {
      const serviceProvider = getServiceProvider()
      serviceProvider.updateConfig(newConfig)

      // Force a re-render to pick up new config
      setIsReady(false)
      setTimeout(() => setIsReady(true), 0)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    }
  }

  // Clear caches
  const clearCaches = async () => {
    try {
      const serviceProvider = getServiceProvider()
      await serviceProvider.clearCaches()
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    }
  }

  return {
    isReady,
    error,
    taskService,
    config,
    updateConfig,
    clearCaches,
  }
}
