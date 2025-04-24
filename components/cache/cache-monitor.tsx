"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CacheFactory } from "@/lib/cache/cache-factory"
import { RefreshCw, Trash2, Clock, Database } from "lucide-react"

// Create a cache instance for monitoring
const monitorCache = CacheFactory.createCache({
  storageType: typeof window !== "undefined" ? "localStorage" : "memory",
  namespace: "desk365",
})

// Cache hit/miss metrics
interface CacheMetrics {
  hits: number
  misses: number
  operations: {
    timestamp: number
    operation: "get" | "set" | "delete" | "clear"
    key: string
    hit?: boolean
    executionTime?: number
  }[]
}

export function CacheMonitor() {
  const [metrics, setMetrics] = useState<CacheMetrics>({
    hits: 0,
    misses: 0,
    operations: [],
  })
  const [cacheKeys, setCacheKeys] = useState<string[]>([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Simulate cache operations for demonstration
  useEffect(() => {
    const simulateCacheOperations = async () => {
      // Simulate some cache operations
      const keys = []

      // Get operation (miss)
      const startMiss = performance.now()
      const missResult = await monitorCache.get("test-key-1")
      const endMiss = performance.now()

      if (!missResult) {
        setMetrics((prev) => ({
          ...prev,
          misses: prev.misses + 1,
          operations: [
            {
              timestamp: Date.now(),
              operation: "get",
              key: "test-key-1",
              hit: false,
              executionTime: endMiss - startMiss,
            },
            ...prev.operations.slice(0, 19), // Keep last 20 operations
          ],
        }))
      }

      // Set operation
      await monitorCache.set("test-key-1", { value: "test-value-1" }, { ttl: 60000 })
      keys.push("test-key-1")

      setMetrics((prev) => ({
        ...prev,
        operations: [
          {
            timestamp: Date.now(),
            operation: "set",
            key: "test-key-1",
          },
          ...prev.operations.slice(0, 19),
        ],
      }))

      // Get operation (hit)
      const startHit = performance.now()
      const hitResult = await monitorCache.get("test-key-1")
      const endHit = performance.now()

      if (hitResult) {
        setMetrics((prev) => ({
          ...prev,
          hits: prev.hits + 1,
          operations: [
            {
              timestamp: Date.now(),
              operation: "get",
              key: "test-key-1",
              hit: true,
              executionTime: endHit - startHit,
            },
            ...prev.operations.slice(0, 19),
          ],
        }))
      }

      // Set another key
      await monitorCache.set("test-key-2", { value: "test-value-2" }, { ttl: 30000 })
      keys.push("test-key-2")

      setMetrics((prev) => ({
        ...prev,
        operations: [
          {
            timestamp: Date.now(),
            operation: "set",
            key: "test-key-2",
          },
          ...prev.operations.slice(0, 19),
        ],
      }))

      setCacheKeys(keys)
    }

    simulateCacheOperations()
  }, [refreshTrigger])

  const clearCache = async () => {
    await monitorCache.clear()
    setCacheKeys([])
    setMetrics((prev) => ({
      ...prev,
      operations: [
        {
          timestamp: Date.now(),
          operation: "clear",
          key: "all",
        },
        ...prev.operations.slice(0, 19),
      ],
    }))
  }

  const refreshMetrics = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  // Calculate hit rate
  const hitRate =
    metrics.hits + metrics.misses > 0 ? Math.round((metrics.hits / (metrics.hits + metrics.misses)) * 100) : 0

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Cache Monitor</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={refreshMetrics}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={clearCache}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cache
            </Button>
          </div>
        </CardTitle>
        <CardDescription>Monitor cache performance and operations</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="metrics">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="operations">Recent Operations</TabsTrigger>
            <TabsTrigger value="keys">Cached Keys</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-3 gap-4 mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{hitRate}%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics.hits} hits / {metrics.misses} misses
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Operations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.operations.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last operation: {metrics.operations[0]?.operation || "none"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Cached Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{cacheKeys.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Storage: {typeof window !== "undefined" ? "localStorage" : "memory"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="operations">
            <div className="space-y-2 mt-4">
              {metrics.operations.map((op, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-2">
                    {op.operation === "get" && (
                      <Badge variant={op.hit ? "default" : "destructive"}>{op.hit ? "HIT" : "MISS"}</Badge>
                    )}
                    {op.operation === "set" && <Badge variant="outline">SET</Badge>}
                    {op.operation === "delete" && <Badge variant="outline">DELETE</Badge>}
                    {op.operation === "clear" && <Badge variant="outline">CLEAR</Badge>}
                    <span className="text-sm font-medium">{op.key}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {op.executionTime !== undefined && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {op.executionTime.toFixed(2)}ms
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">{new Date(op.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
              {metrics.operations.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">No operations recorded yet</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="keys">
            <div className="space-y-2 mt-4">
              {cacheKeys.map((key, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{key}</span>
                  </div>
                </div>
              ))}
              {cacheKeys.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">No cached keys found</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
