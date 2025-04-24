/**
 * In-Memory Cache Storage
 *
 * A simple in-memory implementation of the CacheStorage interface.
 */

import type { CacheEntry, CacheStorage } from "./cache-service"

export class MemoryCacheStorage implements CacheStorage {
  private cache: Map<string, CacheEntry<any>> = new Map()

  async get<T>(key: string): Promise<CacheEntry<T> | null> {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined
    return entry || null
  }

  async set<T>(key: string, entry: CacheEntry<T>): Promise<void> {
    this.cache.set(key, entry)
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key)
  }

  async clear(): Promise<void> {
    this.cache.clear()
  }

  async invalidateByTag(tag: string): Promise<void> {
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.includes(tag)) {
        this.cache.delete(key)
      }
    }
  }
}
