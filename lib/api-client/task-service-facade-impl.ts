/**
 * Task Service Facade Implementation
 *
 * This module provides an implementation of the TaskServiceFacade using the
 * generated Desk365 API client.
 */

import type { TicketsApi } from "../../src/generated/desk365-client"
import {
  type TaskServiceFacade,
  type Task,
  type Comment,
  type Attachment,
  type FeatureFlags,
  Desk365Exception,
  FeatureFlagDisabledException,
  TaskNotFoundException,
} from "../desk365-facade"

/**
 * Implementation of the TaskServiceFacade using the generated Desk365 API client
 */
export class TaskServiceFacadeImpl implements TaskServiceFacade {
  private ticketsApi: TicketsApi
  private featureFlags: FeatureFlags

  /**
   * Create a new TaskServiceFacadeImpl
   * @param ticketsApi The generated TicketsApi client
   * @param featureFlags Feature flags for controlling functionality
   */
  constructor(ticketsApi: TicketsApi, featureFlags: FeatureFlags) {
    this.ticketsApi = ticketsApi
    this.featureFlags = featureFlags
  }

  /**
   * Get a task by ID
   * @param taskId The ID of the task to retrieve
   * @returns The task
   */
  async getTask(taskId: string): Promise<Task> {
    if (!this.featureFlags.isEnabled("tasks")) {
      throw new FeatureFlagDisabledException("Tasks feature is disabled")
    }

    try {
      // Call the generated API client
      const ticket = await this.ticketsApi.getTicket({ ticketId: taskId })

      // Map the response to our domain model
      return this.mapTicketToTask(ticket)
    } catch (error) {
      this.handleApiError(error)
    }
  }

  /**
   * Create a new task
   * @param task The task to create
   * @returns The created task
   */
  async createTask(task: Omit<Task, "id" | "createdAt" | "updatedAt" | "createdBy">): Promise<Task> {
    if (!this.featureFlags.isEnabled("tasks")) {
      throw new FeatureFlagDisabledException("Tasks feature is disabled")
    }

    try {
      // Map our domain model to the API request model
      const ticketData = this.mapTaskToTicket(task)

      // Call the generated API client
      const createdTicket = await this.ticketsApi.createTicket({
        ticketCreateRequest: ticketData,
      })

      // Map the response back to our domain model
      return this.mapTicketToTask(createdTicket)
    } catch (error) {
      this.handleApiError(error)
    }
  }

  /**
   * Update an existing task
   * @param taskId The ID of the task to update
   * @param updates The updates to apply to the task
   * @returns The updated task
   */
  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    if (!this.featureFlags.isEnabled("tasks")) {
      throw new FeatureFlagDisabledException("Tasks feature is disabled")
    }

    try {
      // Map our domain model updates to the API request model
      const ticketUpdates = this.mapTaskUpdatesToTicket(updates)

      // Call the generated API client
      const updatedTicket = await this.ticketsApi.updateTicket({
        ticketId: taskId,
        ticketUpdateRequest: ticketUpdates,
      })

      // Map the response back to our domain model
      return this.mapTicketToTask(updatedTicket)
    } catch (error) {
      this.handleApiError(error)
    }
  }

  /**
   * Add a comment to a task
   * @param taskId The ID of the task to add the comment to
   * @param text The text of the comment
   * @param user The user adding the comment
   * @returns The created comment
   */
  async addComment(taskId: string, text: string, user: string): Promise<Comment> {
    if (!this.featureFlags.isEnabled("comments")) {
      throw new FeatureFlagDisabledException("Comments feature is disabled")
    }

    try {
      // Call the generated API client
      const comment = await this.ticketsApi.addComment({
        ticketId: taskId,
        commentCreateRequest: {
          text,
          user,
        },
      })

      // Map the response to our domain model
      return {
        id: comment.id,
        taskId,
        text: comment.text,
        user: comment.user,
        timestamp: comment.timestamp,
      }
    } catch (error) {
      this.handleApiError(error)
    }
  }

  /**
   * Get all comments for a task
   * @param taskId The ID of the task to get comments for
   * @returns The comments for the task
   */
  async getComments(taskId: string): Promise<Comment[]> {
    if (!this.featureFlags.isEnabled("comments")) {
      throw new FeatureFlagDisabledException("Comments feature is disabled")
    }

    try {
      // Call the generated API client
      const comments = await this.ticketsApi.getComments({ ticketId: taskId })

      // Map the response to our domain model
      return comments.map((comment) => ({
        id: comment.id,
        taskId,
        text: comment.text,
        user: comment.user,
        timestamp: comment.timestamp,
      }))
    } catch (error) {
      this.handleApiError(error)
    }
  }

  /**
   * Add an attachment to a task
   * @param taskId The ID of the task to add the attachment to
   * @param file The file to attach
   * @param uploadedBy The user uploading the attachment
   * @returns The created attachment
   */
  async addAttachment(taskId: string, file: File, uploadedBy: string): Promise<Attachment> {
    if (!this.featureFlags.isEnabled("attachments")) {
      throw new FeatureFlagDisabledException("Attachments feature is disabled")
    }

    try {
      // Create a FormData object for the multipart request
      const formData = new FormData()
      formData.append("file", file)
      formData.append("uploadedBy", uploadedBy)

      // Call the generated API client
      const attachment = await this.ticketsApi.addAttachment({
        ticketId: taskId,
        file: file,
        uploadedBy: uploadedBy,
      })

      // Map the response to our domain model
      return {
        id: attachment.id,
        taskId,
        name: attachment.name,
        url: attachment.url,
        size: attachment.size,
        uploadedBy,
        uploadedAt: attachment.uploadedAt,
      }
    } catch (error) {
      this.handleApiError(error)
    }
  }

  /**
   * Get all attachments for a task
   * @param taskId The ID of the task to get attachments for
   * @returns The attachments for the task
   */
  async getAttachments(taskId: string): Promise<Attachment[]> {
    if (!this.featureFlags.isEnabled("attachments")) {
      throw new FeatureFlagDisabledException("Attachments feature is disabled")
    }

    try {
      // Call the generated API client
      const attachments = await this.ticketsApi.getAttachments({ ticketId: taskId })

      // Map the response to our domain model
      return attachments.map((attachment) => ({
        id: attachment.id,
        taskId,
        name: attachment.name,
        url: attachment.url,
        size: attachment.size,
        uploadedBy: attachment.uploadedBy,
        uploadedAt: attachment.uploadedAt,
      }))
    } catch (error) {
      this.handleApiError(error)
    }
  }

  /**
   * Map a Desk365 ticket to our Task domain model
   * @param ticket The Desk365 ticket
   * @returns The Task domain model
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
   * @param task The Task domain model
   * @returns The Desk365 ticket
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
   * @param updates The task updates
   * @returns The ticket updates
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
   * @param ticketStatus The Desk365 ticket status
   * @returns The task status
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
   * @param taskStatus The task status
   * @returns The Desk365 ticket status
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
   * @param ticketPriority The Desk365 ticket priority
   * @returns The task priority
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
   * @param taskPriority The task priority
   * @returns The Desk365 ticket priority
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
   * @param error The API error
   * @throws {TaskNotFoundException} If the task is not found
   * @throws {Desk365Exception} If there is an API error
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
