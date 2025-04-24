/**
 * Desk365 API Client Factory
 *
 * This module provides a factory for creating instances of the generated Desk365 API client.
 * It handles configuration, authentication, and provides a consistent interface for the
 * rest of the application to use.
 */

import {
  Configuration,
  type ConfigurationParameters,
  TicketsApi,
  ContactsApi,
  KnowledgeBaseApi,
} from "../../src/generated/desk365-client"

// Client configuration options
export interface Desk365ClientOptions {
  apiKey: string
  baseUrl: string
  timeout?: number
  headers?: Record<string, string>
}

// Default configuration
const DEFAULT_OPTIONS: Partial<Desk365ClientOptions> = {
  baseUrl: "https://api.desk365.com/v3",
  timeout: 30000, // 30 seconds
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
}

/**
 * Creates a configuration object for the generated API client
 */
function createConfiguration(options: Desk365ClientOptions): Configuration {
  const configParams: ConfigurationParameters = {
    basePath: options.baseUrl,
    headers: {
      ...DEFAULT_OPTIONS.headers,
      ...options.headers,
      "X-API-Key": options.apiKey,
    },
    middleware: [
      {
        pre: async (context) => {
          // Add request timestamp for logging/debugging
          context.init.headers = {
            ...context.init.headers,
            "X-Request-Time": new Date().toISOString(),
          }
          return context
        },
        post: async (context) => {
          // Log response time for performance monitoring
          const requestTime = context.init.headers["X-Request-Time"]
          if (requestTime) {
            const responseTime = new Date().getTime() - new Date(requestTime).getTime()
            console.debug(`Desk365 API request to ${context.url} completed in ${responseTime}ms`)
          }
          return context
        },
      },
    ],
    fetchApi: typeof window !== "undefined" ? window.fetch.bind(window) : undefined,
  }

  // Add timeout if specified
  if (options.timeout) {
    configParams.timeoutMs = options.timeout
  }

  return new Configuration(configParams)
}

/**
 * Desk365 API Client Factory
 * Creates instances of the generated API clients with the provided configuration
 */
export class Desk365ClientFactory {
  private configuration: Configuration
  private options: Desk365ClientOptions

  /**
   * Create a new client factory
   * @param options Client configuration options
   */
  constructor(options: Desk365ClientOptions) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    } as Desk365ClientOptions

    this.configuration = createConfiguration(this.options)
  }

  /**
   * Get a configured TicketsApi instance
   */
  getTicketsApi(): TicketsApi {
    return new TicketsApi(this.configuration)
  }

  /**
   * Get a configured ContactsApi instance
   */
  getContactsApi(): ContactsApi {
    return new ContactsApi(this.configuration)
  }

  /**
   * Get a configured KnowledgeBaseApi instance
   */
  getKnowledgeBaseApi(): KnowledgeBaseApi {
    return new KnowledgeBaseApi(this.configuration)
  }

  /**
   * Update the client configuration
   * @param options New configuration options
   */
  updateConfiguration(options: Partial<Desk365ClientOptions>): void {
    this.options = {
      ...this.options,
      ...options,
    }

    this.configuration = createConfiguration(this.options)
  }

  /**
   * Get the current configuration options
   */
  getOptions(): Desk365ClientOptions {
    return { ...this.options }
  }
}

/**
 * Create a new Desk365 API client factory
 * @param options Client configuration options
 */
export function createDesk365Client(options: Desk365ClientOptions): Desk365ClientFactory {
  return new Desk365ClientFactory(options)
}
