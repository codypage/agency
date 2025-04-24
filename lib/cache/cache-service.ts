/**
 * Cache Service
 *
 * A flexible caching service that supports multiple storage strategies
 * and configuration options for the Desk365 API Integration.
 */

// Cache entry with metadata
export interface CacheEntry<T> {
  value: T
  expiresAt: number | null // Timestamp when the entry expires (null = no expiration)
  createdAt: number // Timestamp when the entry was created
  tags: string[] // Tags for cache invalidation
}

// Cache configuration options
export interface CacheOptions {
  ttl?: number // Time to live in milliseconds (undefined = no expiration)
  tags?: string[] // Tags for cache invalidation
  staleWhileRevalidate?: boolean // Return stale data while fetching fresh data
}

// Cache storage interface
export interface CacheStorage {
  get<T>(key: string): Promise<CacheEntry<T> | null>
  set<T>(key: string, entry: CacheEntry<T>): Promise<void>
  delete(key: string): Promise<void>
  clear(): Promise<void>
  invalidateByTag(tag: string): Promise<void>
}

// Cache service class
export class CacheService {
  private storage: CacheStorage
  private defaultTtl: number | undefined
  private namespace: string

  constructor(storage: CacheStorage, options: { defaultTtl?: number; namespace?: string } = {}) {
    this.storage = storage
    this.defaultTtl = options.defaultTtl
    this.namespace = options.namespace || "desk365"
  }

  /**
   * Generate a namespaced cache key
   */
  private getNamespacedKey(key: string): string {
    return `${this.namespace}:${key}`
  }

  /**
   * Get a value from the cache
   */
  async get<T>(key: string): Promise<T | null> {
    const namespacedKey = this.getNamespacedKey(key)
    const entry = await this.storage.get<T>(namespacedKey)

    if (!entry) {
      return null
    }

    // Check if the entry is expired
    if (entry.expiresAt !== null && entry.expiresAt < Date.now()) {
      await this.storage.delete(namespacedKey)
      return null
    }

    return entry.value
  }

  /**
   * Set a value in the cache
   */
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    const namespacedKey = this.getNamespacedKey(key)
    const ttl = options.ttl !== undefined ? options.ttl : this.defaultTtl
    const expiresAt = ttl !== undefined ? Date.now() + ttl : null

    const entry: CacheEntry<T> = {
      value,
      expiresAt,
      createdAt: Date.now(),
      tags: options.tags || [],
    }

    await this.storage.set(namespacedKey, entry)
  }

  /**
   * Delete a value from the cache
   */
  async delete(key: string): Promise<void> {
    const namespacedKey = this.getNamespacedKey(key)
    await this.storage.delete(namespacedKey)
  }

  /**
   * Clear the entire cache
   */
  async clear(): Promise<void> {
    await this.storage.clear()
  }

  /**
   * Invalidate cache entries by tag
   */
  async invalidateByTag(tag: string): Promise<void> {
    await this.storage.invalidateByTag(tag)
  }

  /**
   * Get or set a value in the cache with a callback function
   */
  async getOrSet<T>(key: string, callback: () => Promise<T>, options: CacheOptions = {}): Promise<T> {
    const cachedValue = await this.get<T>(key)

    if (cachedValue !== null) {
      return cachedValue
    }

    const value = await callback()
    await this.set(key, value, options)
    return value
  }

  /**
   * Wrap a function with caching
   */
  withCache<T, Args extends any[]>(
    fn: (...args: Args) => Promise<T>,
    keyGenerator: (...args: Args) => string,
    options: CacheOptions = {},
  ): (...args: Args) => Promise<T> {
    return async (...args: Args): Promise<T> => {
      const key = keyGenerator(...args)
      return this.getOrSet(key, () => fn(...args), options)
    }
  }
}
