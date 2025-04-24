/**
 * Enhanced Desk365 Service Facade with Caching
 *
 * This facade extends the original Desk365 facade to include caching capabilities
 * for improved performance and reduced API calls.
 */

import {
  type Task,
  type Comment,
  type Attachment,
  type FeatureFlags,
  Desk365Exception,
  FeatureFlagDisabledException,
  TaskNotFoundException,
} from "./desk365-facade"
import type { CacheService } from "./cache/cache-service"
import { CacheKeyGenerator } from "./cache/cache-key-generator"

// Cache configuration
export interface TaskServiceCacheConfig {
  enabled: boolean
  taskTtl: number // Time to live for task cache in milliseconds
  commentsTtl: number // Time to live for comments cache in milliseconds
  attachmentsTtl: number // Time to live for attachments cache in milliseconds
}

// Default cache configuration
const DEFAULT_CACHE_CONFIG: TaskServiceCacheConfig = {
  enabled: true,
  taskTtl: 5 * 60 * 1000, // 5 minutes
  commentsTtl: 2 * 60 * 1000, // 2 minutes
  attachmentsTtl: 10 * 60 * 1000, // 10 minutes
}

// Enhanced Task Service Facade with caching
export class CachedTaskServiceFacade {
  private ticketsApi: any // This would be the generated Desk365 API client
  private featureFlags: FeatureFlags
  private cacheService: CacheService
  private cacheConfig: TaskServiceCacheConfig

  constructor(
    ticketsApi: any,
    featureFlags: FeatureFlags,
    cacheService: CacheService,
    cacheConfig: Partial<TaskServiceCacheConfig> = {},
  ) {
    this.ticketsApi = ticketsApi
    this.featureFlags = featureFlags
    this.cacheService = cacheService
    this.cacheConfig = { ...DEFAULT_CACHE_CONFIG, ...cacheConfig }
  }

  /**
   * Get a task by ID with caching
   */
  async getTask(taskId: string): Promise<Task> {
    if (!this.featureFlags.isEnabled("tasks")) {
      throw new FeatureFlagDisabledException("Tasks feature is disabled")
    }

    const cacheKey = CacheKeyGenerator.forTask(taskId)

    if (this.cacheConfig.enabled) {
      return this.cacheService.getOrSet(
        cacheKey,
        async () => {
          try {
            // Call the Desk365 API to get a ticket
            const ticket = await this.ticketsApi.getTicket(taskId)

            // Map the ticket to our domain model
            return this.mapTicketToTask(ticket)
          } catch (error: any) {
            this.handleApiError(error)
          }
        },
        {
          ttl: this.cacheConfig.taskTtl,
          tags: [`task:${taskId}`, "tasks"],
        },
      )
    } else {
      try {
        // Call the Desk365 API to get a ticket without caching
        const ticket = await this.ticketsApi.getTicket(taskId)

        // Map the ticket to our domain model
        return this.mapTicketToTask(ticket)
      } catch (error: any) {
        this.handleApiError(error)
      }
    }
  }

  /**
   * Create a new task (invalidates cache)
   */
  async createTask(task: Omit<Task, "id" | "createdAt" | "updatedAt" | "createdBy">): Promise<Task> {
    if (!this.featureFlags.isEnabled("tasks")) {
      throw new FeatureFlagDisabledException("Tasks feature is disabled")
    }

    try {
      // Map our domain model to the Desk365 ticket format
      const ticketData = this.mapTaskToTicket(task)

      // Call the Desk365 API to create a ticket
      const createdTicket = await this.ticketsApi.createTicket(ticketData)

      // Map the created ticket back to our domain model
      const createdTask = this.mapTicketToTask(createdTicket)

      // Invalidate relevant caches
      if (this.cacheConfig.enabled) {
        await this.cacheService.invalidateByTag("tasks")
        if (task.team) {
          await this.cacheService.invalidateByTag(`department:${task.team}`)
        }
      }

      return createdTask
    } catch (error: any) {
      this.handleApiError(error)
    }
  }

  /**
   * Update an existing task (invalidates cache)
   */
  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    if (!this.featureFlags.isEnabled("tasks")) {
      throw new FeatureFlagDisabledException("Tasks feature is disabled")
    }

    try {
      // Map our domain model updates to the Desk365 ticket format
      const ticketUpdates = this.mapTaskUpdatesToTicket(updates)

      // Call the Desk365 API to update the ticket
      const updatedTicket = await this.ticketsApi.updateTicket(taskId, ticketUpdates)

      // Map the updated ticket back to our domain model
      const updatedTask = this.mapTicketToTask(updatedTicket)

      // Invalidate relevant caches
      if (this.cacheConfig.enabled) {
        await this.cacheService.delete(CacheKeyGenerator.forTask(taskId))
        await this.cacheService.invalidateByTag(`task:${taskId}`)
        await this.cacheService.invalidateByTag("tasks")
        if (updates.team) {
          await this.cacheService.invalidateByTag(`department:${updates.team}`)
        }
      }

      return updatedTask
    } catch (error: any) {
      this.handleApiError(error)
    }
  }

  /**
   * Add a comment to a task (invalidates comments cache)
   */
  async addComment(taskId: string, text: string, user: string): Promise<Comment> {
    if (!this.featureFlags.isEnabled("comments")) {
      throw new FeatureFlagDisabledException("Comments feature is disabled")
    }

    try {
      // Call the Desk365 API to add a comment to a ticket
      const comment = await this.ticketsApi.addComment(taskId, {
        text,
        user,
      })

      // Invalidate comments cache
      if (this.cacheConfig.enabled) {
        await this.cacheService.delete(CacheKeyGenerator.forTaskComments(taskId))
      }

      // Map the comment to our domain model
      return {
        id: comment.id,
        taskId,
        text: comment.text,
        user: comment.user,
        timestamp: comment.timestamp,
      }
    } catch (error: any) {
      this.handleApiError(error)
    }
  }

  /**
   * Get all comments for a task with caching
   */
  async getComments(taskId: string): Promise<Comment[]> {
    if (!this.featureFlags.isEnabled("comments")) {
      throw new FeatureFlagDisabledException("Comments feature is disabled")
    }

    const cacheKey = CacheKeyGenerator.forTaskComments(taskId)

    if (this.cacheConfig.enabled) {
      return this.cacheService.getOrSet(
        cacheKey,
        async () => {
          try {
            // Call the Desk365 API to get comments for a ticket
            const comments = await this.ticketsApi.getComments(taskId)

            // Map the comments to our domain model
            return comments.map((comment: any) => ({
              id: comment.id,
              taskId,
              text: comment.text,
              user: comment.user,
              timestamp: comment.timestamp,
            }))
          } catch (error: any) {
            this.handleApiError(error)
          }
        },
        {
          ttl: this.cacheConfig.commentsTtl,
          tags: [`task:${taskId}`, `task:${taskId}:comments`],
        },
      )
    } else {
      try {
        // Call the Desk365 API to get comments without caching
        const comments = await this.ticketsApi.getComments(taskId)

        // Map the comments to our domain model
        return comments.map((comment: any) => ({
          id: comment.id,
          taskId,
          text: comment.text,
          user: comment.user,
          timestamp: comment.timestamp,
        }))
      } catch (error: any) {
        this.handleApiError(error)
      }
    }
  }

  /**
   * Add an attachment to a task (invalidates attachments cache)
   */
  async addAttachment(taskId: string, file: File, uploadedBy: string): Promise<Attachment> {
    if (!this.featureFlags.isEnabled("attachments")) {
      throw new FeatureFlagDisabledException("Attachments feature is disabled")
    }

    try {
      // Call the Desk365 API to add an attachment to a ticket
      const attachment = await this.ticketsApi.addAttachment(taskId, file, uploadedBy)

      // Invalidate attachments cache
      if (this.cacheConfig.enabled) {
        await this.cacheService.delete(CacheKeyGenerator.forTaskAttachments(taskId))
      }

      // Map the attachment to our domain model
      return {
        id: attachment.id,
        taskId,
        name: attachment.name,
        url: attachment.url,
        size: attachment.size,
        uploadedBy,
        uploadedAt: attachment.uploadedAt,
      }
    } catch (error: any) {
      this.handleApiError(error)
    }
  }

  /**
   * Get all attachments for a task with caching
   */
  async getAttachments(taskId: string): Promise<Attachment[]> {
    if (!this.featureFlags.isEnabled("attachments")) {
      throw new FeatureFlagDisabledException("Attachments feature is disabled")
    }

    const cacheKey = CacheKeyGenerator.forTaskAttachments(taskId)

    if (this.cacheConfig.enabled) {
      return this.cacheService.getOrSet(
        cacheKey,
        async () => {
          try {
            // Call the Desk365 API to get attachments for a ticket
            const attachments = await this.ticketsApi.getAttachments(taskId)

            // Map the attachments to our domain model
            return attachments.map((attachment: any) => ({
              id: attachment.id,
              taskId,
              name: attachment.name,
              url: attachment.url,
              size: attachment.size,
              uploadedBy: attachment.uploadedBy,
              uploadedAt: attachment.uploadedAt,
            }))
          } catch (error: any) {
            this.handleApiError(error)
          }
        },
        {
          ttl: this.cacheConfig.attachmentsTtl,
          tags: [`task:${taskId}`, `task:${taskId}:attachments`],
        },
      )
    } else {
      try {
        // Call the Desk365 API to get attachments without caching
        const attachments = await this.ticketsApi.getAttachments(taskId)

        // Map the attachments to our domain model
        return attachments.map((attachment: any) => ({
          id: attachment.id,
          taskId,
          name: attachment.name,
          url: attachment.url,
          size: attachment.size,
          uploadedBy: attachment.uploadedBy,
          uploadedAt: attachment.uploadedAt,
        }))
      } catch (error: any) {
        this.handleApiError(error)
      }
    }
  }

  /**
   * Clear all caches related to tasks
   */
  async clearCache(): Promise<void> {
    if (this.cacheConfig.enabled) {
      await this.cacheService.invalidateByTag("tasks")
    }
  }

  /**
   * Map a Desk365 ticket to our Task domain model
   */
  private mapTicketToTask(ticket: any): Task {
    // Extract custom fields for healthcare-specific data
    const customFields = ticket.customFields || {}

    return {
      id: ticket.id,
      title: ticket.subject,
      description: ticket.description,
      status: this.mapTicketStatusToTaskStatus(ticket.status),
      priority: this.mapTicketPriorityToTaskPriority(ticket.priority),
      assignedTo: ticket.assignedTo,
      team: customFields.team || "",
      dueDate: ticket.dueDate,
      category: customFields.category || "",
      subcategory: customFields.subcategory || "",
      // Healthcare-specific fields
      cptCode: customFields.cptCode,
      serviceType: customFields.serviceType,
      // Metadata
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      createdBy: ticket.createdBy,
    }
  }

  /**
   * Map our Task domain model to a Desk365 ticket
   */
  private mapTaskToTicket(task: any): any {
    return {
      subject: task.title,
      description: task.description,
      status: this.mapTaskStatusToTicketStatus(task.status),
      priority: this.mapTaskPriorityToTicketPriority(task.priority),
      assignedTo: task.assignedTo,
      dueDate: task.dueDate,
      // Custom fields for our domain-specific data
      customFields: {
        team: task.team,
        category: task.category,
        subcategory: task.subcategory,
        // Healthcare-specific fields
        cptCode: task.cptCode,
        serviceType: task.serviceType,
      },
    }
  }

  /**
   * Map task updates to ticket updates
   */
  private mapTaskUpdatesToTicket(updates: Partial<Task>): any {
    const ticketUpdates: any = {}
    const customFields: any = {}

    if (updates.title) ticketUpdates.subject = updates.title
    if (updates.description) ticketUpdates.description = updates.description
    if (updates.status) ticketUpdates.status = this.mapTaskStatusToTicketStatus(updates.status)
    if (updates.priority) ticketUpdates.priority = this.mapTaskPriorityToTicketPriority(updates.priority)
    if (updates.assignedTo) ticketUpdates.assignedTo = updates.assignedTo
    if (updates.dueDate) ticketUpdates.dueDate = updates.dueDate

    if (updates.team) customFields.team = updates.team
    if (updates.category) customFields.category = updates.category
    if (updates.subcategory) customFields.subcategory = updates.subcategory
    if (updates.cptCode) customFields.cptCode = updates.cptCode
    if (updates.serviceType) customFields.serviceType = updates.serviceType

    if (Object.keys(customFields).length > 0) {
      ticketUpdates.customFields = customFields
    }

    return ticketUpdates
  }

  /**
   * Map Desk365 ticket status to our task status
   */
  private mapTicketStatusToTaskStatus(ticketStatus: string): "not-started" | "in-progress" | "completed" {
    // This mapping would depend on how statuses are defined in Desk365
    switch (ticketStatus) {
      case "new":
      case "open":
        return "not-started"
      case "in_progress":
      case "pending":
        return "in-progress"
      case "resolved":
      case "closed":
        return "completed"
      default:
        return "not-started"
    }
  }

  /**
   * Map our task status to Desk365 ticket status
   */
  private mapTaskStatusToTicketStatus(taskStatus: "not-started" | "in-progress" | "completed"): string {
    switch (taskStatus) {
      case "not-started":
        return "open"
      case "in-progress":
        return "in_progress"
      case "completed":
        return "resolved"
      default:
        return "open"
    }
  }

  /**
   * Map Desk365 ticket priority to our task priority
   */
  private mapTicketPriorityToTaskPriority(ticketPriority: string): "low" | "medium" | "high" {
    switch (ticketPriority) {
      case "low":
        return "low"
      case "medium":
      case "normal":
        return "medium"
      case "high":
      case "urgent":
        return "high"
      default:
        return "medium"
    }
  }

  /**
   * Map our task priority to Desk365 ticket priority
   */
  private mapTaskPriorityToTicketPriority(taskPriority: "low" | "medium" | "high"): string {
    switch (taskPriority) {
      case "low":
        return "low"
      case "medium":
        return "normal"
      case "high":
        return "urgent"
      default:
        return "normal"
    }
  }

  /**
   * Handle API errors and translate them to domain exceptions
   */
  private handleApiError(error: any): never {
    if (error.status === 404) {
      throw new TaskNotFoundException(`Task not found: ${error.message}`)
    } else if (error.status === 401 || error.status === 403) {
      throw new Desk365Exception(`Authentication error: ${error.message}`)
    } else {
      throw new Desk365Exception(`API error: ${error.message}`)
    }
  }
}
