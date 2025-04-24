"use client"

import { useContext } from "react"
import { NotificationContext } from "@/components/ui/notification-provider"
import type { NotificationType } from "@/lib/notification-service"

export function useNotifications() {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }

  return context
}

// Helper functions for common notification types
export function useTicketNotifications() {
  const { notifyTicketStatusChange } = useNotifications()

  return {
    notifyStatusChange: (
      ticketId: string,
      ticketTitle: string,
      oldStatus: string,
      newStatus: string,
      assignedTo?: string,
    ) => {
      notifyTicketStatusChange(ticketId, ticketTitle, oldStatus, newStatus, assignedTo)
    },
  }
}

export function useFormNotifications() {
  const { notifyFormSubmission } = useNotifications()

  return {
    notifySubmission: (formId: string, formName: string, submittedBy: string, ticketId?: string) => {
      notifyFormSubmission(formId, formName, submittedBy, ticketId)
    },
  }
}

export function useSystemNotifications() {
  const { notifySystem } = useNotifications()

  return {
    notify: (
      title: string,
      message: string,
      type: NotificationType = "info",
      actionUrl?: string,
      actionLabel?: string,
    ) => {
      notifySystem(title, message, type, actionUrl, actionLabel)
    },
    notifySuccess: (title: string, message: string, actionUrl?: string, actionLabel?: string) => {
      notifySystem(title, message, "success", actionUrl, actionLabel)
    },
    notifyError: (title: string, message: string, actionUrl?: string, actionLabel?: string) => {
      notifySystem(title, message, "error", actionUrl, actionLabel)
    },
    notifyWarning: (title: string, message: string, actionUrl?: string, actionLabel?: string) => {
      notifySystem(title, message, "warning", actionUrl, actionLabel)
    },
    notifyInfo: (title: string, message: string, actionUrl?: string, actionLabel?: string) => {
      notifySystem(title, message, "info", actionUrl, actionLabel)
    },
  }
}

// Add a new hook for deadline notifications after the useSystemNotifications function

export function useDeadlineNotifications() {
  const { addNotification } = useNotifications()
  const notificationContext = useContext(NotificationContext)

  if (!notificationContext) {
    throw new Error("useDeadlineNotifications must be used within a NotificationProvider")
  }

  return {
    notifyDeadline: (
      projectId: string,
      projectTitle: string,
      dueDate: string,
      daysRemaining: number,
      assignedTo?: string,
    ) => {
      if (notificationContext.notifyDeadlineApproaching) {
        notificationContext.notifyDeadlineApproaching(projectId, projectTitle, dueDate, daysRemaining, assignedTo)
      } else {
        // Fallback if the specific method isn't available
        addNotification({
          id: `deadline-${Date.now()}`,
          title: "Deadline Approaching",
          message: `Project "${projectTitle}" is due in ${daysRemaining} day${daysRemaining !== 1 ? "s" : ""}. Due date: ${dueDate}`,
          type: daysRemaining <= 1 ? "error" : daysRemaining <= 3 ? "warning" : "info",
          source: "admin",
          timestamp: new Date(),
          read: false,
          actionUrl: `/project-management?project=${projectId}`,
          actionLabel: "View Project",
        })
      }
    },
  }
}

// Helper hook for email notification preferences
export function useEmailPreferences() {
  const { emailPreferences, updateEmailPreferences, isUserOffline, setUserOffline } = useNotifications()

  return {
    preferences: emailPreferences?.preferences,
    updatePreferences: updateEmailPreferences,
    isOffline: isUserOffline,
    setOffline: setUserOffline,
    hasEmailService: !!emailPreferences,
  }
}
