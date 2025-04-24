"use client"

import * as React from "react"
import type { Notification, NotificationService } from "@/lib/notification-service"
import type { EmailService } from "@/lib/email-service"

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  clearNotification: (notificationId: string) => void
  clearAllNotifications: () => void
  addNotification: (notification: Notification) => void
  notifyTicketStatusChange: (
    ticketId: string,
    ticketTitle: string,
    oldStatus: string,
    newStatus: string,
    assignedTo?: string,
  ) => Notification | null
  notifyFormSubmission: (
    formId: string,
    formName: string,
    submittedBy: string,
    ticketId?: string,
  ) => Notification | null
  notifyAuthorizationAlert: (
    clientName: string,
    authId: string,
    message: string,
    severity?: "warning" | "error",
    assignedTo?: string,
  ) => Notification | null
  notifySystem: (
    title: string,
    message: string,
    type?: "info" | "success" | "warning" | "error",
    actionUrl?: string,
    actionLabel?: string,
    emailPriority?: "low" | "medium" | "high",
  ) => Notification | null
  notifyDeadlineApproaching: (
    projectId: string,
    projectTitle: string,
    dueDate: string,
    daysRemaining: number,
    assignedTo?: string,
  ) => Notification | null
  emailPreferences: any
  updateEmailPreferences: (updates: any) => void
  isUserOffline: boolean
  setUserOffline: (offline: boolean) => void
  addNotificationListener: (listener: (notification: Notification) => void) => () => void
  notificationService: NotificationService
  emailService: EmailService
}

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined)

interface NotificationProviderProps {
  children: React.ReactNode
  notificationService: NotificationService
  emailService: EmailService
}

export function NotificationProvider({ children, notificationService, emailService }: NotificationProviderProps) {
  const [notifications, setNotifications] = React.useState<Notification[]>(notificationService.getNotifications())
  const [isUserOffline, setIsUserOffline] = React.useState(false)
  const [emailPreferences, setEmailPreferences] = React.useState(
    emailService.getUserPreferences(notificationService.getCurrentUserId()),
  )

  const addNotification = (notification: Notification) => {
    notificationService.addNotification(notification)
    setNotifications(notificationService.getNotifications())
  }

  const markAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId)
    setNotifications([...notificationService.getNotifications()])
  }

  const markAllAsRead = () => {
    notificationService.markAllAsRead()
    setNotifications([...notificationService.getNotifications()])
  }

  const clearNotification = (notificationId: string) => {
    notificationService.clearNotification(notificationId)
    setNotifications([...notificationService.getNotifications()])
  }

  const clearAllNotifications = () => {
    notificationService.clearAllNotifications()
    setNotifications([])
  }

  const notifyTicketStatusChange = (
    ticketId: string,
    ticketTitle: string,
    oldStatus: string,
    newStatus: string,
    assignedTo?: string,
  ) => {
    const notification = notificationService.notifyTicketStatusChange(
      ticketId,
      ticketTitle,
      oldStatus,
      newStatus,
      assignedTo,
    )
    if (notification) {
      setNotifications([...notificationService.getNotifications()])
    }
    return notification
  }

  const notifyFormSubmission = (formId: string, formName: string, submittedBy: string, ticketId?: string) => {
    const notification = notificationService.notifyFormSubmission(formId, formName, submittedBy, ticketId)
    if (notification) {
      setNotifications([...notificationService.getNotifications()])
    }
    return notification
  }

  const notifyAuthorizationAlert = (
    clientName: string,
    authId: string,
    message: string,
    severity?: "warning" | "error",
    assignedTo?: string,
  ) => {
    const notification = notificationService.notifyAuthorizationAlert(clientName, authId, message, severity, assignedTo)
    if (notification) {
      setNotifications([...notificationService.getNotifications()])
    }
    return notification
  }

  const notifySystem = (
    title: string,
    message: string,
    type?: "info" | "success" | "warning" | "error",
    actionUrl?: string,
    actionLabel?: string,
    emailPriority?: "low" | "medium" | "high",
  ) => {
    const notification = notificationService.notifySystem(title, message, type, actionUrl, actionLabel, emailPriority)
    if (notification) {
      setNotifications([...notificationService.getNotifications()])
    }
    return notification
  }

  const notifyDeadlineApproaching = (
    projectId: string,
    projectTitle: string,
    dueDate: string,
    daysRemaining: number,
    assignedTo?: string,
  ) => {
    const notification = notificationService.notifyDeadlineApproaching(
      projectId,
      projectTitle,
      dueDate,
      daysRemaining,
      assignedTo,
    )
    if (notification) {
      setNotifications([...notificationService.getNotifications()])
    }
    return notification
  }

  const updateEmailPreferences = (updates: any) => {
    const updatedPreferences = {
      ...emailPreferences.preferences,
      ...updates,
    }
    const newEmailPreferences = {
      ...emailPreferences,
      preferences: updatedPreferences,
    }
    setEmailPreferences(newEmailPreferences)
    emailService.updateUserPreferences({
      userId: notificationService.getCurrentUserId(),
      email: emailPreferences.email,
      preferences: updatedPreferences,
    })
  }

  const setUserOffline = (offline: boolean) => {
    setIsUserOffline(offline)
    if (offline) {
      emailService.markUserOffline(notificationService.getCurrentUserId())
    } else {
      emailService.markUserOnline(notificationService.getCurrentUserId())
    }
  }

  const addNotificationListener = (listener: (notification: Notification) => void) => {
    return notificationService.addListener(listener)
  }

  const value = React.useMemo(
    () => ({
      notifications: notificationService.getNotifications(),
      unreadCount: notificationService.getUnreadCount(),
      markAsRead,
      markAllAsRead,
      clearNotification,
      clearAllNotifications,
      addNotification,
      notifyTicketStatusChange,
      notifyFormSubmission,
      notifyAuthorizationAlert,
      notifySystem,
      notifyDeadlineApproaching,
      emailPreferences,
      updateEmailPreferences,
      isUserOffline,
      setUserOffline,
      addNotificationListener,
      notificationService,
      emailService,
    }),
    [notifications, isUserOffline, emailPreferences],
  )

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

function useNotifications() {
  const context = React.useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

export { useNotifications, NotificationContext }
