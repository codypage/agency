"use client"

/**
 * React hook for using the cache service in components
 */

import { useState, useEffect, useCallback } from "react"
import type { CacheService } from "@/lib/cache/cache-service"
import { CacheFactory } from "@/lib/cache/cache-factory"

// Default cache instance
const defaultCache = CacheFactory.createCache({
  storageType: typeof window !== "undefined" ? "localStorage" : "memory",
  defaultTtl: 5 * 60 * 1000, // 5 minutes
  namespace: "desk365",
})

export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    ttl?: number
    tags?: string[]
    enabled?: boolean
    cacheService?: CacheService
  } = {},
) {
  const { ttl, tags = [], enabled = true, cacheService = defaultCache } = options

  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(
    async (skipCache = false) => {
      setIsLoading(true)
      setError(null)

      try {
        let result: T

        if (enabled && !skipCache) {
          result = await cacheService.getOrSet(key, fetcher, { ttl, tags })
        } else {
          result = await fetcher()
        }

        setData(result)
        return result
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [key, fetcher, ttl, tags, enabled, cacheService],
  )

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Function to manually invalidate the cache and refetch
  const invalidateAndRefetch = useCallback(async () => {
    await cacheService.delete(key)
    return fetchData(true)
  }, [key, cacheService, fetchData])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    invalidateAndRefetch,
  }
}
