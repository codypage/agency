/**
 * Desk365 Service Provider
 *
 * This module provides a centralized way to access Desk365 services throughout the application.
 * It handles client initialization, caching, and provides access to the various service facades.
 */

import { createDesk365Client, type Desk365ClientFactory, type Desk365ClientOptions } from "./client-factory"
import { TaskServiceFacadeImpl } from "./task-service-facade-impl"
import { SimpleFeatureFlags, type FeatureFlags } from "../desk365-facade"
import { CacheFactory } from "../cache/cache-factory"
import { CachedTaskServiceFacade } from "../desk365-facade-with-cache"
import type { CacheService } from "../cache/cache-service"
import type { TaskServiceCacheConfig } from "../desk365-facade-with-cache"

// Service provider configuration
export interface ServiceProviderConfig {
  apiKey: string
  baseUrl: string
  featureFlags: Record<string, boolean>
  caching: {
    enabled: boolean
    storageType: "memory" | "localStorage"
    defaultTtl: number
    taskTtl: number
    commentsTtl: number
    attachmentsTtl: number
  }
}

/**
 * Desk365 Service Provider
 * Provides access to Desk365 services throughout the application
 */
export class Desk365ServiceProvider {
  private clientFactory: Desk365ClientFactory
  private featureFlags: FeatureFlags
  private cacheService: CacheService
  private config: ServiceProviderConfig

  // Cached service instances
  private taskServiceInstance: CachedTaskServiceFacade | null = null

  /**
   * Create a new service provider
   * @param config Service provider configuration
   */
  constructor(config: ServiceProviderConfig) {
    this.config = config

    // Create the client factory
    const clientOptions: Desk365ClientOptions = {
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
    }
    this.clientFactory = createDesk365Client(clientOptions)

    // Create the feature flags
    this.featureFlags = new SimpleFeatureFlags(config.featureFlags)

    // Create the cache service
    this.cacheService = CacheFactory.createCache({
      storageType: config.caching.storageType,
      defaultTtl: config.caching.defaultTtl,
    })
  }

  /**
   * Get the task service
   * @returns The task service
   */
  getTaskService(): CachedTaskServiceFacade {
    if (!this.taskServiceInstance) {
      // Create the base task service
      const ticketsApi = this.clientFactory.getTicketsApi()
      const taskService = new TaskServiceFacadeImpl(ticketsApi, this.featureFlags)

      // Create the cached task service
      const cacheConfig: TaskServiceCacheConfig = {
        enabled: this.config.caching.enabled,
        taskTtl: this.config.caching.taskTtl,
        commentsTtl: this.config.caching.commentsTtl,
        attachmentsTtl: this.config.caching.attachmentsTtl,
      }

      this.taskServiceInstance = new CachedTaskServiceFacade(
        ticketsApi,
        this.featureFlags,
        this.cacheService,
        cacheConfig,
      )
    }

    return this.taskServiceInstance
  }

  /**
   * Update the service provider configuration
   * @param config New configuration
   */
  updateConfig(config: Partial<ServiceProviderConfig>): void {
    // Update the configuration
    this.config = {
      ...this.config,
      ...config,
    }

    // Update the client factory if needed
    if (config.apiKey || config.baseUrl) {
      const clientOptions: Partial<Desk365ClientOptions> = {}
      if (config.apiKey) clientOptions.apiKey = config.apiKey
      if (config.baseUrl) clientOptions.baseUrl = config.baseUrl

      this.clientFactory.updateConfiguration(clientOptions)
    }

    // Update feature flags if needed
    if (config.featureFlags) {
      const flags = this.featureFlags as SimpleFeatureFlags
      Object.entries(config.featureFlags).forEach(([key, value]) => {
        flags.setFlag(key, value)
      })
    }

    // Update cache configuration if needed
    if (config.caching) {
      // If storage type changed, create a new cache service
      if (config.caching.storageType && config.caching.storageType !== this.config.caching.storageType) {
        this.cacheService = CacheFactory.createCache({
          storageType: config.caching.storageType,
          defaultTtl: config.caching.defaultTtl || this.config.caching.defaultTtl,
        })
      }

      // Reset service instances to pick up new cache configuration
      this.taskServiceInstance = null
    }
  }

  /**
   * Get the current configuration
   * @returns The current configuration
   */
  getConfig(): ServiceProviderConfig {
    return { ...this.config }
  }

  /**
   * Clear all caches
   */
  async clearCaches(): Promise<void> {
    await this.cacheService.clear()
    console.log("All caches cleared")
  }
}

// Global instance for singleton access
let globalInstance: Desk365ServiceProvider | null = null

/**
 * Initialize the global service provider
 * @param config Service provider configuration
 * @returns The service provider instance
 */
export function initializeServiceProvider(config: ServiceProviderConfig): Desk365ServiceProvider {
  globalInstance = new Desk365ServiceProvider(config)
  return globalInstance
}

/**
 * Get the global service provider instance
 * @returns The service provider instance
 * @throws Error if the service provider has not been initialized
 */
export function getServiceProvider(): Desk365ServiceProvider {
  if (!globalInstance) {
    throw new Error("Service provider not initialized. Call initializeServiceProvider first.")
  }

  return globalInstance
}
