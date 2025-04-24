/**
 * Email Service
 *
 * This service handles sending email notifications to users when they are offline.
 * It integrates with the notification system to deliver important updates via email.
 */

import type { Notification } from "@/lib/notification-service"

// Email configuration interface
export interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
  from: string
}

// User email preferences
export interface UserEmailPreferences {
  userId: string
  email: string
  preferences: {
    ticketStatusChanges: boolean
    formSubmissions: boolean
    authorizationAlerts: boolean
    systemNotifications: boolean
    adminNotifications: boolean
    // Notification priority thresholds
    minPriority: "low" | "medium" | "high"
  }
}

export class EmailService {
  private config: EmailConfig
  private userPreferences: Map<string, UserEmailPreferences> = new Map()
  private offlineUsers: Set<string> = new Set()

  constructor(config: EmailConfig) {
    this.config = config

    // Initialize with some mock user preferences
    this.initializeMockUserPreferences()
  }

  /**
   * Send an email notification to a user
   */
  async sendEmailNotification(userId: string, notification: Notification): Promise<boolean> {
    const userPrefs = this.userPreferences.get(userId)

    if (!userPrefs) {
      console.warn(`No email preferences found for user ${userId}`)
      return false
    }

    // Check if user is offline and should receive this notification type
    if (!this.shouldSendEmail(userId, notification)) {
      return false
    }

    try {
      // In a real implementation, this would use a library like nodemailer
      // to send the actual email
      console.log(`Sending email to ${userPrefs.email}:`, {
        subject: this.getEmailSubject(notification),
        body: this.getEmailBody(notification),
      })

      // Simulate email sending delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      return true
    } catch (error) {
      console.error("Error sending email notification:", error)
      return false
    }
  }

  /**
   * Send a batch of email notifications to a user
   */
  async sendBatchEmailNotifications(userId: string, notifications: Notification[]): Promise<boolean> {
    if (notifications.length === 0) return true

    const userPrefs = this.userPreferences.get(userId)

    if (!userPrefs) {
      console.warn(`No email preferences found for user ${userId}`)
      return false
    }

    // Filter notifications that should be sent via email
    const emailNotifications = notifications.filter(
      (notification) => this.shouldSendEmail(userId, notification, false), // Don't check offline status for batch emails
    )

    if (emailNotifications.length === 0) return true

    try {
      // In a real implementation, this would use a library like nodemailer
      // to send the actual email with all notifications in one message
      console.log(`Sending batch email to ${userPrefs.email} with ${emailNotifications.length} notifications`)

      // Simulate email sending delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      return true
    } catch (error) {
      console.error("Error sending batch email notifications:", error)
      return false
    }
  }

  /**
   * Mark a user as offline
   */
  markUserOffline(userId: string): void {
    this.offlineUsers.add(userId)
  }

  /**
   * Mark a user as online
   */
  markUserOnline(userId: string): void {
    this.offlineUsers.delete(userId)
  }

  /**
   * Check if a user is offline
   */
  isUserOffline(userId: string): boolean {
    return this.offlineUsers.has(userId)
  }

  /**
   * Update user email preferences
   */
  updateUserPreferences(preferences: UserEmailPreferences): void {
    this.userPreferences.set(preferences.userId, preferences)
  }

  /**
   * Get user email preferences
   */
  getUserPreferences(userId: string): UserEmailPreferences | undefined {
    return this.userPreferences.get(userId)
  }

  /**
   * Determine if an email should be sent for this notification
   */
  private shouldSendEmail(userId: string, notification: Notification, checkOfflineStatus = true): boolean {
    const userPrefs = this.userPreferences.get(userId)

    if (!userPrefs) return false

    // Check if user is offline (if required)
    if (checkOfflineStatus && !this.isUserOffline(userId)) return false

    // Check notification priority
    if (!this.meetsMinimumPriority(notification.type, userPrefs.preferences.minPriority)) {
      return false
    }

    // Check notification source preferences
    switch (notification.source) {
      case "ticket":
        return userPrefs.preferences.ticketStatusChanges
      case "form":
        return userPrefs.preferences.formSubmissions
      case "authorization":
        return userPrefs.preferences.authorizationAlerts
      case "system":
        return userPrefs.preferences.systemNotifications
      case "admin":
        return userPrefs.preferences.adminNotifications
      default:
        return false
    }
  }

  /**
   * Check if notification priority meets the minimum threshold
   */
  private meetsMinimumPriority(notificationType: string, minPriority: "low" | "medium" | "high"): boolean {
    const priorityValues = {
      low: 1,
      medium: 2,
      high: 3,
    }

    // Map notification types to priority levels
    const notificationPriority =
      notificationType === "error" ? "high" : notificationType === "warning" ? "medium" : "low"

    return priorityValues[notificationPriority] >= priorityValues[minPriority]
  }

  /**
   * Generate email subject for a notification
   */
  private getEmailSubject(notification: Notification): string {
    const prefix = this.getSourcePrefix(notification.source)
    return `${prefix}: ${notification.title}`
  }

  /**
   * Generate email body for a notification
   */
  private getEmailBody(notification: Notification): string {
    let body = `
      <h2>${notification.title}</h2>
      <p>${notification.message}</p>
      <p>Time: ${notification.timestamp.toLocaleString()}</p>
    `

    if (notification.actionUrl) {
      body += `
        <p>
          <a href="${notification.actionUrl}">${notification.actionLabel || "View Details"}</a>
        </p>
      `
    }

    return body
  }

  /**
   * Get prefix for notification source
   */
  private getSourcePrefix(source: string): string {
    switch (source) {
      case "ticket":
        return "Ticket Update"
      case "form":
        return "Form Submission"
      case "authorization":
        return "Authorization Alert"
      case "system":
        return "System Notification"
      case "admin":
        return "Admin Notification"
      default:
        return "Notification"
    }
  }

  /**
   * Initialize with mock user preferences for demonstration
   */
  private initializeMockUserPreferences(): void {
    this.userPreferences.set("admin-user", {
      userId: "admin-user",
      email: "admin@example.com",
      preferences: {
        ticketStatusChanges: true,
        formSubmissions: true,
        authorizationAlerts: true,
        systemNotifications: true,
        adminNotifications: true,
        minPriority: "medium",
      },
    })

    this.userPreferences.set("clinical-user", {
      userId: "clinical-user",
      email: "clinical@example.com",
      preferences: {
        ticketStatusChanges: true,
        formSubmissions: false,
        authorizationAlerts: true,
        systemNotifications: false,
        adminNotifications: false,
        minPriority: "high",
      },
    })

    this.userPreferences.set("billing-user", {
      userId: "billing-user",
      email: "billing@example.com",
      preferences: {
        ticketStatusChanges: false,
        formSubmissions: false,
        authorizationAlerts: true,
        systemNotifications: true,
        adminNotifications: false,
        minPriority: "medium",
      },
    })

    // Mark some users as offline for demonstration
    this.markUserOffline("clinical-user")
  }
}
