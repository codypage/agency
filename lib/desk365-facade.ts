/**
 * Desk365 Service Facade
 *
 * This facade provides a simplified interface to the Desk365 API for project management
 * and task assignment. It abstracts the underlying API calls and provides domain-specific
 * methods for the Autism Program implementation.
 */

// Feature flag interface
/**
 * @interface FeatureFlags
 * Interface for feature flags.
 */
interface FeatureFlags {
  /**
   * @param {string} feature - The name of the feature.
   * @returns {boolean} - Whether the feature is enabled.
   */
  isEnabled(feature: string): boolean
}

// Simple implementation of feature flags
/**
 * @class SimpleFeatureFlags
 * A simple implementation of the FeatureFlags interface.
 */
class SimpleFeatureFlags implements FeatureFlags {
  private flags: Record<string, boolean>

  constructor(initialFlags: Record<string, boolean> = {}) {
    this.flags = initialFlags
  }

  /**
   * Checks if a feature is enabled.
   * @param {string} feature - The name of the feature.
   * @returns {boolean} - Whether the feature is enabled.
   */
  isEnabled(feature: string): boolean {
    return this.flags[feature] === true
  }

  /**
   * Sets a feature flag.
   * @param {string} feature - The name of the feature.
   * @param {boolean} enabled - Whether the feature is enabled.
   */
  setFlag(feature: string, enabled: boolean): void {
    this.flags[feature] = enabled
  }
}

// Domain models
/**
 * @interface Task
 * Interface for a task.
 */
interface Task {
  id: string
  title: string
  description: string
  status: "not-started" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  assignedTo: string
  team: string
  dueDate: string
  category: string
  subcategory: string
  // Healthcare-specific fields
  cptCode?: string
  serviceType?: string
  // Metadata
  createdAt: string
  updatedAt: string
  createdBy: string
}

/**
 * @interface Comment
 * Interface for a comment.
 */
interface Comment {
  id: string
  taskId: string
  text: string
  user: string
  timestamp: string
}

/**
 * @interface Attachment
 * Interface for an attachment.
 */
interface Attachment {
  id: string
  taskId: string
  name: string
  url: string
  size: string
  uploadedBy: string
  uploadedAt: string
}

// Custom exceptions
/**
 * @class Desk365Exception
 * Custom exception class for Desk365 API errors.
 */
class Desk365Exception extends Error {
  constructor(message: string) {
    super(message)
    this.name = "Desk365Exception"
  }
}

/**
 * @class FeatureFlagDisabledException
 * Custom exception class for feature flag disabled errors.
 */
class FeatureFlagDisabledException extends Desk365Exception {
  constructor(message: string) {
    super(message)
    this.name = "FeatureFlagDisabledException"
  }
}

/**
 * @class TaskNotFoundException
 * Custom exception class for task not found errors.
 */
class TaskNotFoundException extends Desk365Exception {
  constructor(message: string) {
    super(message)
    this.name = "TaskNotFoundException"
  }
}

/**
 * @class TaskServiceFacade
 * Task Service Facade
 */
export class TaskServiceFacade {
  private ticketsApi: any // This would be the generated Desk365 API client
  private featureFlags: FeatureFlags

  /**
   * @param {any} ticketsApi - The Desk365 API client.
   * @param {FeatureFlags} featureFlags - The feature flags.
   */
  constructor(ticketsApi: any, featureFlags: FeatureFlags) {
    this.ticketsApi = ticketsApi
    this.featureFlags = featureFlags
  }

  /**
   * Get a task by ID
   * @param {string} taskId - The ID of the task.
   * @returns {Promise<Task>} - The task.
   * @throws {FeatureFlagDisabledException} - If the tasks feature is disabled.
   * @throws {TaskNotFoundException} - If the task is not found.
   * @throws {Desk365Exception} - If there is an API error.
   */
  async getTask(taskId: string): Promise<Task> {
    if (!this.featureFlags.isEnabled("tasks")) {
      throw new FeatureFlagDisabledException("Tasks feature is disabled")
    }

    try {
      // Call the Desk365 API to get a ticket
      const ticket = await this.ticketsApi.getTicket(taskId)

      // Map the ticket to our domain model
      return this.mapTicketToTask(ticket)
    } catch (error: any) {
      this.handleApiError(error)
    }
  }

  /**
   * Create a new task
   * @param {Omit<Task, "id" | "createdAt" | "updatedAt" | "createdBy">} task - The task to create.
   * @returns {Promise<Task>} - The created task.
   * @throws {FeatureFlagDisabledException} - If the tasks feature is disabled.
   * @throws {Desk365Exception} - If there is an API error.
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
      return this.mapTicketToTask(createdTicket)
    } catch (error: any) {
      this.handleApiError(error)
    }
  }

  /**
   * Update an existing task
   * @param {string} taskId - The ID of the task to update.
   * @param {Partial<Task>} updates - The updates to apply to the task.
   * @returns {Promise<Task>} - The updated task.
   * @throws {FeatureFlagDisabledException} - If the tasks feature is disabled.
   * @throws {TaskNotFoundException} - If the task is not found.
   * @throws {Desk365Exception} - If there is an API error.
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
      return this.mapTicketToTask(updatedTicket)
    } catch (error: any) {
      this.handleApiError(error)
    }
  }

  /**
   * Add a comment to a task
   * @param {string} taskId - The ID of the task to add the comment to.
   * @param {string} text - The text of the comment.
   * @param {string} user - The user adding the comment.
   * @returns {Promise<Comment>} - The created comment.
   * @throws {FeatureFlagDisabledException} - If the comments feature is disabled.
   * @throws {Desk365Exception} - If there is an API error.
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
   * Get all comments for a task
   * @param {string} taskId - The ID of the task to get the comments for.
   * @returns {Promise<Comment[]>} - The comments for the task.
   * @throws {FeatureFlagDisabledException} - If the comments feature is disabled.
   * @throws {Desk365Exception} - If there is an API error.
   */
  async getComments(taskId: string): Promise<Comment[]> {
    if (!this.featureFlags.isEnabled("comments")) {
      throw new FeatureFlagDisabledException("Comments feature is disabled")
    }

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
  }

  /**
   * Add an attachment to a task
   * @param {string} taskId - The ID of the task to add the attachment to.
   * @param {File} file - The file to attach.
   * @param {string} uploadedBy - The user uploading the attachment.
   * @returns {Promise<Attachment>} - The created attachment.
   * @throws {FeatureFlagDisabledException} - If the attachments feature is disabled.
   * @throws {Desk365Exception} - If there is an API error.
   */
  async addAttachment(taskId: string, file: File, uploadedBy: string): Promise<Attachment> {
    if (!this.featureFlags.isEnabled("attachments")) {
      throw new FeatureFlagDisabledException("Attachments feature is disabled")
    }

    try {
      // Call the Desk365 API to add an attachment to a ticket
      const attachment = await this.ticketsApi.addAttachment(taskId, file, uploadedBy)

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
   * Get all attachments for a task
   * @param {string} taskId - The ID of the task to get the attachments for.
   * @returns {Promise<Attachment[]>} - The attachments for the task.
   * @throws {FeatureFlagDisabledException} - If the attachments feature is disabled.
   * @throws {Desk365Exception} - If there is an API error.
   */
  async getAttachments(taskId: string): Promise<Attachment[]> {
    if (!this.featureFlags.isEnabled("attachments")) {
      throw new FeatureFlagDisabledException("Attachments feature is disabled")
    }

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
  }

  /**
   * Map a Desk365 ticket to our Task domain model
   * @param {any} ticket - The Desk365 ticket.
   * @returns {Task} - The Task domain model.
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
   * @param {any} task - The Task domain model.
   * @returns {any} - The Desk365 ticket.
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
   * @param {Partial<Task>} updates - The task updates.
   * @returns {any} - The ticket updates.
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
   * @param {string} ticketStatus - The Desk365 ticket status.
   * @returns {"not-started" | "in-progress" | "completed"} - The task status.
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
   * @param {"not-started" | "in-progress" | "completed"} taskStatus - The task status.
   * @returns {string} - The Desk365 ticket status.
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
   * @param {string} ticketPriority - The Desk365 ticket priority.
   * @returns {"low" | "medium" | "high"} - The task priority.
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
   * @param {"low" | "medium" | "high"} taskPriority - The task priority.
   * @returns {string} - The Desk365 ticket priority.
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
   * @param {any} error - The API error.
   * @throws {TaskNotFoundException} - If the task is not found.
   * @throws {Desk365Exception} - If there is an API error.
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

// Export the feature flags implementation
export { SimpleFeatureFlags }

// Export domain models
export type { Task, Comment, Attachment, FeatureFlags }

// Export exceptions
export { Desk365Exception, FeatureFlagDisabledException, TaskNotFoundException }
