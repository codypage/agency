/**
 * Notification Service
 *
 * This service manages notifications for the application, including:
 * - Ticket status changes
 * - Form submissions
 * - Authorization alerts
 * - System notifications
 */

import type { TaskServiceFacade, FeatureFlags } from "@/lib/desk365-facade"
import type { EmailService } from "@/lib/email-service"

// Notification types
export type NotificationType = "info" | "success" | "warning" | "error"

// Notification sources
export type NotificationSource = "ticket" | "form" | "authorization" | "system" | "admin"

// Notification model
export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  source: NotificationSource
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionLabel?: string
  metadata?: Record<string, any>
  // Email delivery settings
  emailDelivery?: {
    sendToOfflineUsers: boolean
    priority: "low" | "medium" | "high"
    recipientIds?: string[]
  }
}

// Notification listener
export type NotificationListener = (notification: Notification) => void

export class NotificationService {
  private taskService: TaskServiceFacade
  private featureFlags: FeatureFlags
  private emailService?: EmailService
  private listeners: NotificationListener[] = []
  private notifications: Notification[] = []
  private maxNotifications = 100
  private pendingOfflineNotifications: Map<string, Notification[]> = new Map()
  private currentUserId = "admin-user" // Default user ID

  constructor(taskService: TaskServiceFacade, featureFlags: FeatureFlags, emailService?: EmailService) {
    this.taskService = taskService
    this.featureFlags = featureFlags
    this.emailService = emailService

    // Initialize with some mock notifications
    this.initializeMockNotifications()

    // Set up periodic check for offline notifications
    if (emailService) {
      this.setupOfflineNotificationCheck()
    }
  }

  /**
   * Set the current user ID
   */
  setCurrentUserId(userId: string): void {
    this.currentUserId = userId

    // Mark user as online in email service
    if (this.emailService) {
      this.emailService.markUserOnline(userId)
    }
  }

  /**
   * Get the current user ID
   */
  getCurrentUserId(): string {
    return this.currentUserId
  }

  /**
   * Add a notification listener
   */
  addListener(listener: NotificationListener): () => void {
    this.listeners.push(listener)

    // Return a function to remove the listener
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  /**
   * Get all notifications
   */
  getNotifications(): Notification[] {
    return [...this.notifications]
  }

  /**
   * Get unread notification count
   */
  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length
  }

  /**
   * Mark a notification as read
   */
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find((n) => n.id === notificationId)
    if (notification) {
      notification.read = true
    }
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    this.notifications.forEach((n) => (n.read = true))
  }

  /**
   * Clear a notification
   */
  clearNotification(notificationId: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== notificationId)
  }

  /**
   * Clear all notifications
   */
  clearAllNotifications(): void {
    this.notifications = []
  }

  /**
   * Create a notification for a ticket status change
   */
  notifyTicketStatusChange(
    ticketId: string,
    ticketTitle: string,
    oldStatus: string,
    newStatus: string,
    assignedTo?: string,
  ): Notification {
    if (!this.featureFlags.isEnabled("notifications")) {
      console.log("Notifications feature is disabled")
      return null
    }

    const notification: Notification = {
      id: this.generateId(),
      title: "Ticket Status Changed",
      message: `Ticket "${ticketTitle}" (${ticketId}) changed from ${oldStatus} to ${newStatus}`,
      type: "info",
      source: "ticket",
      timestamp: new Date(),
      read: false,
      actionUrl: `/project-management?ticket=${ticketId}`,
      actionLabel: "View Ticket",
      metadata: {
        ticketId,
        oldStatus,
        newStatus,
        assignedTo,
      },
      emailDelivery: {
        sendToOfflineUsers: true,
        priority: "medium",
        recipientIds: assignedTo ? [assignedTo] : undefined,
      },
    }

    this.addNotification(notification)
    return notification
  }

  /**
   * Create a notification for a form submission
   */
  notifyFormSubmission(formId: string, formName: string, submittedBy: string, ticketId?: string): Notification {
    if (!this.featureFlags.isEnabled("notifications")) {
      console.log("Notifications feature is disabled")
      return null
    }

    const notification: Notification = {
      id: this.generateId(),
      title: "Form Submitted",
      message: `${formName} form was submitted by ${submittedBy}`,
      type: "success",
      source: "form",
      timestamp: new Date(),
      read: false,
      actionUrl: ticketId ? `/project-management?ticket=${ticketId}` : `/admin/forms/${formId}`,
      actionLabel: ticketId ? "View Ticket" : "View Form",
      metadata: {
        formId,
        formName,
        submittedBy,
        ticketId,
      },
      emailDelivery: {
        sendToOfflineUsers: true,
        priority: "medium",
      },
    }

    this.addNotification(notification)
    return notification
  }

  /**
   * Create a notification for an authorization alert
   */
  notifyAuthorizationAlert(
    clientName: string,
    authId: string,
    message: string,
    severity: "warning" | "error" = "warning",
    assignedTo?: string,
  ): Notification {
    if (!this.featureFlags.isEnabled("notifications")) {
      console.log("Notifications feature is disabled")
      return null
    }

    const notification: Notification = {
      id: this.generateId(),
      title: "Authorization Alert",
      message: `${clientName}: ${message}`,
      type: severity,
      source: "authorization",
      timestamp: new Date(),
      read: false,
      actionUrl: `/reports?auth=${authId}`,
      actionLabel: "View Authorization",
      metadata: {
        clientName,
        authId,
      },
      emailDelivery: {
        sendToOfflineUsers: true,
        priority: severity === "error" ? "high" : "medium",
        recipientIds: assignedTo ? [assignedTo] : undefined,
      },
    }

    this.addNotification(notification)
    return notification
  }

  /**
   * Create a system notification
   */
  notifySystem(
    title: string,
    message: string,
    type: NotificationType = "info",
    actionUrl?: string,
    actionLabel?: string,
    emailPriority: "low" | "medium" | "high" = "low",
  ): Notification {
    if (!this.featureFlags.isEnabled("notifications")) {
      console.log("Notifications feature is disabled")
      return null
    }

    const notification: Notification = {
      id: this.generateId(),
      title,
      message,
      type,
      source: "system",
      timestamp: new Date(),
      read: false,
      actionUrl,
      actionLabel,
      emailDelivery: {
        sendToOfflineUsers: type === "error" || type === "warning",
        priority: emailPriority,
      },
    }

    this.addNotification(notification)
    return notification
  }

  /**
   * Create an admin notification
   */
  notifyAdmin(
    title: string,
    message: string,
    type: NotificationType = "info",
    actionUrl?: string,
    actionLabel?: string,
    metadata?: Record<string, any>,
    emailPriority: "low" | "medium" | "high" = "low",
  ): Notification {
    if (!this.featureFlags.isEnabled("notifications")) {
      console.log("Notifications feature is disabled")
      return null
    }

    const notification: Notification = {
      id: this.generateId(),
      title,
      message,
      type,
      source: "admin",
      timestamp: new Date(),
      read: false,
      actionUrl,
      actionLabel,
      metadata,
      emailDelivery: {
        sendToOfflineUsers: type === "error" || type === "warning",
        priority: emailPriority,
      },
    }

    this.addNotification(notification)
    return notification
  }

  /**
   * Create a notification for an approaching deadline
   */
  notifyDeadlineApproaching(
    projectId: string,
    projectTitle: string,
    dueDate: string,
    daysRemaining: number,
    assignedTo?: string,
  ): Notification {
    if (!this.featureFlags.isEnabled("notifications")) {
      console.log("Notifications feature is disabled")
      return null
    }

    // Determine severity based on days remaining
    let type: NotificationType = "info"
    let priority: "low" | "medium" | "high" = "low"

    if (daysRemaining <= 1) {
      type = "error"
      priority = "high"
    } else if (daysRemaining <= 3) {
      type = "warning"
      priority = "medium"
    } else if (daysRemaining <= 7) {
      type = "info"
      priority = "low"
    }

    const notification: Notification = {
      id: this.generateId(),
      title: "Deadline Approaching",
      message: `Project "${projectTitle}" is due in ${daysRemaining} day${daysRemaining !== 1 ? "s" : ""}. Due date: ${dueDate}`,
      type,
      source: "admin",
      timestamp: new Date(),
      read: false,
      actionUrl: `/project-management?project=${projectId}`,
      actionLabel: "View Project",
      metadata: {
        projectId,
        dueDate,
        daysRemaining,
        assignedTo,
      },
      emailDelivery: {
        sendToOfflineUsers: true,
        priority,
        recipientIds: assignedTo ? [assignedTo] : undefined,
      },
    }

    this.addNotification(notification)
    return notification
  }

  /**
   * Add a notification to the list and notify listeners
   */
  private addNotification(notification: Notification): void {
    // Add to the beginning of the array (newest first)
    this.notifications.unshift(notification)

    // Limit the number of notifications
    if (this.notifications.length > this.maxNotifications) {
      this.notifications = this.notifications.slice(0, this.maxNotifications)
    }

    // Notify listeners
    this.notifyListeners(notification)

    // Handle email delivery if enabled
    this.handleEmailDelivery(notification)
  }

  /**
   * Notify all listeners of a new notification
   */
  private notifyListeners(notification: Notification): void {
    this.listeners.forEach((listener) => {
      try {
        listener(notification)
      } catch (error) {
        console.error("Error in notification listener:", error)
      }
    })
  }

  /**
   * Handle email delivery for a notification
   */
  private handleEmailDelivery(notification: Notification): void {
    if (!this.emailService || !notification.emailDelivery) return

    // Check if notification should be sent to offline users
    if (notification.emailDelivery.sendToOfflineUsers) {
      // If specific recipients are defined, send to them
      if (notification.emailDelivery.recipientIds && notification.emailDelivery.recipientIds.length > 0) {
        notification.emailDelivery.recipientIds.forEach((userId) => {
          if (this.emailService.isUserOffline(userId)) {
            // Send email immediately
            this.emailService.sendEmailNotification(userId, notification)
          } else {
            // Queue notification for later if user goes offline
            this.queueOfflineNotification(userId, notification)
          }
        })
      } else {
        // Send to all offline users with appropriate preferences
        // In a real app, you'd get a list of users who should receive this notification
        const allUserIds = ["admin-user", "clinical-user", "billing-user"]

        allUserIds.forEach((userId) => {
          if (this.emailService.isUserOffline(userId)) {
            // Send email immediately
            this.emailService.sendEmailNotification(userId, notification)
          } else {
            // Queue notification for later if user goes offline
            this.queueOfflineNotification(userId, notification)
          }
        })
      }
    }
  }

  /**
   * Queue a notification for delivery if a user goes offline
   */
  private queueOfflineNotification(userId: string, notification: Notification): void {
    if (!this.pendingOfflineNotifications.has(userId)) {
      this.pendingOfflineNotifications.set(userId, [])
    }

    this.pendingOfflineNotifications.get(userId).push(notification)
  }

  /**
   * Set up periodic check for offline notifications
   */
  private setupOfflineNotificationCheck(): void {
    // Check every minute for users who have gone offline
    setInterval(() => {
      this.checkOfflineUsers()
    }, 60000)
  }

  /**
   * Check for users who have gone offline and send pending notifications
   */
  private checkOfflineUsers(): void {
    if (!this.emailService) return

    // In a real app, you'd have a way to detect when users go offline
    // For this example, we'll just check if any users with pending notifications are now offline
    for (const [userId, notifications] of this.pendingOfflineNotifications.entries()) {
      if (this.emailService.isUserOffline(userId) && notifications.length > 0) {
        // Send batch email with all pending notifications
        this.emailService.sendBatchEmailNotifications(userId, notifications)

        // Clear pending notifications for this user
        this.pendingOfflineNotifications.set(userId, [])
      }
    }
  }

  /**
   * Generate a unique ID for a notification
   */
  private generateId(): string {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Initialize with some mock notifications for demonstration
   */
  private initializeMockNotifications(): void {
    const now = new Date()

    // Add some mock notifications
    this.notifications = [
      {
        id: "mock-1",
        title: "Ticket Status Changed",
        message: 'Ticket "Authorization Matrix" (T-004) changed from in-progress to completed',
        type: "success",
        source: "ticket",
        timestamp: new Date(now.getTime() - 15 * 60000), // 15 minutes ago
        read: false,
        actionUrl: "/project-management?ticket=T-004",
        actionLabel: "View Ticket",
      },
      {
        id: "mock-2",
        title: "Form Submitted",
        message: "Purchase Request form was submitted by David",
        type: "info",
        source: "form",
        timestamp: new Date(now.getTime() - 45 * 60000), // 45 minutes ago
        read: true,
        actionUrl: "/admin/forms/purchase-request",
        actionLabel: "View Form",
      },
      {
        id: "mock-3",
        title: "Authorization Alert",
        message: "John D.: Authorization for 97153 is at 80% utilization",
        type: "warning",
        source: "authorization",
        timestamp: new Date(now.getTime() - 2 * 3600000), // 2 hours ago
        read: false,
        actionUrl: "/reports?auth=AUTH-002",
        actionLabel: "View Authorization",
      },
      {
        id: "mock-4",
        title: "System Maintenance",
        message: "System maintenance scheduled for Sunday, May 15 at 2:00 AM",
        type: "info",
        source: "system",
        timestamp: new Date(now.getTime() - 1 * 86400000), // 1 day ago
        read: true,
      },
      {
        id: "mock-5",
        title: "New Manual Entry",
        message: 'New policy "Travel Reimbursement" has been added to the Agency Manual',
        type: "info",
        source: "admin",
        timestamp: new Date(now.getTime() - 2 * 86400000), // 2 days ago
        read: true,
        actionUrl: "/admin/manual/admin-policies/travel-policy",
        actionLabel: "View Policy",
      },
    ]
  }
}
