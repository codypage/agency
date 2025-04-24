/**
 * Cache Factory
 *
 * A factory for creating cache service instances with different storage strategies.
 */

import { CacheService } from "./cache-service"
import { MemoryCacheStorage } from "./memory-cache-storage"
import { LocalStorageCacheStorage } from "./local-storage-cache"

export type CacheStorageType = "memory" | "localStorage"

export interface CacheFactoryOptions {
  storageType?: CacheStorageType
  defaultTtl?: number
  namespace?: string
}

export class CacheFactory {
  /**
   * Create a cache service with the specified storage type
   */
  static createCache(options: CacheFactoryOptions = {}): CacheService {
    const { storageType = "memory", defaultTtl, namespace = "desk365" } = options

    let storage

    switch (storageType) {
      case "localStorage":
        // Only use localStorage in browser environments
        if (typeof window !== "undefined" && window.localStorage) {
          storage = new LocalStorageCacheStorage(namespace)
        } else {
          console.warn("localStorage not available, falling back to memory cache")
          storage = new MemoryCacheStorage()
        }
        break
      case "memory":
      default:
        storage = new MemoryCacheStorage()
        break
    }

    return new CacheService(storage, { defaultTtl, namespace })
  }
}
