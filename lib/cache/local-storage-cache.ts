/**
 * LocalStorage Cache Storage
 *
 * A browser localStorage implementation of the CacheStorage interface.
 * This is useful for persisting cache between page refreshes.
 */

import type { CacheEntry, CacheStorage } from "./cache-service"

export class LocalStorageCacheStorage implements CacheStorage {
  private prefix: string

  constructor(prefix = "desk365_cache") {
    this.prefix = prefix
  }

  private getPrefixedKey(key: string): string {
    return `${this.prefix}:${key}`
  }

  private getAllKeys(): string[] {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(this.prefix)) {
        keys.push(key.substring(this.prefix.length + 1)) // +1 for the colon
      }
    }
    return keys
  }

  async get<T>(key: string): Promise<CacheEntry<T> | null> {
    try {
      const prefixedKey = this.getPrefixedKey(key)
      const item = localStorage.getItem(prefixedKey)

      if (!item) {
        return null
      }

      return JSON.parse(item) as CacheEntry<T>
    } catch (error) {
      console.error("Error retrieving from localStorage cache:", error)
      return null
    }
  }

  async set<T>(key: string, entry: CacheEntry<T>): Promise<void> {
    try {
      const prefixedKey = this.getPrefixedKey(key)
      localStorage.setItem(prefixedKey, JSON.stringify(entry))
    } catch (error) {
      console.error("Error setting localStorage cache:", error)
    }
  }

  async delete(key: string): Promise<void> {
    const prefixedKey = this.getPrefixedKey(key)
    localStorage.removeItem(prefixedKey)
  }

  async clear(): Promise<void> {
    const keys = this.getAllKeys()
    for (const key of keys) {
      await this.delete(key)
    }
  }

  async invalidateByTag(tag: string): Promise<void> {
    const keys = this.getAllKeys()
    for (const key of keys) {
      const entry = await this.get(key)
      if (entry && entry.tags.includes(tag)) {
        await this.delete(key)
      }
    }
  }
}
