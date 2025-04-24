"use client"

import * as React from "react"
import { Bell, Check, CheckCheck, Clock, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Notification, NotificationType } from "@/lib/notification-service"
import { useNotifications } from "@/hooks/use-notifications"
import Link from "next/link"

interface NotificationCenterProps {
  className?: string
}

export function NotificationCenter({ className }: NotificationCenterProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useNotifications()
  const [open, setOpen] = React.useState(false)

  // Group notifications by date
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const thisWeek = new Date(today)
  thisWeek.setDate(thisWeek.getDate() - 7)

  const groupedNotifications = {
    today: notifications.filter((n) => new Date(n.timestamp) >= today),
    yesterday: notifications.filter((n) => {
      const date = new Date(n.timestamp)
      return date >= yesterday && date < today
    }),
    thisWeek: notifications.filter((n) => {
      const date = new Date(n.timestamp)
      return date >= thisWeek && date < yesterday
    }),
    older: notifications.filter((n) => new Date(n.timestamp) < thisWeek),
  }

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
  }

  // Get icon for notification type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <Check className="h-4 w-4 text-green-500" />
      case "warning":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "error":
        return <X className="h-4 w-4 text-red-500" />
      case "info":
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  // Format time
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Render notification group
  const renderNotificationGroup = (title: string, notifications: Notification[]) => {
    if (notifications.length === 0) return null

    return (
      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "p-3 rounded-md border transition-colors",
                notification.read ? "bg-background" : "bg-muted/50",
                "hover:bg-muted/80 cursor-pointer",
              )}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className={cn("text-sm font-medium", !notification.read && "font-semibold")}>
                      {notification.title}
                    </p>
                    <span className="text-xs text-muted-foreground">{formatTime(notification.timestamp)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>

                  {notification.actionUrl && notification.actionLabel && (
                    <div className="pt-1">
                      <Link
                        href={notification.actionUrl}
                        className="text-xs text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {notification.actionLabel}
                      </Link>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    clearNotification(notification.id)
                  }}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Dismiss</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("relative", className)}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <Tabs defaultValue="all">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <h2 className="text-sm font-semibold">Notifications</h2>
            <div className="flex items-center gap-1">
              <TabsList className="h-8">
                <TabsTrigger value="all" className="text-xs px-2">
                  All
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-xs px-2">
                  Unread
                </TabsTrigger>
              </TabsList>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => markAllAsRead()}>
                <CheckCheck className="mr-1 h-3.5 w-3.5" />
                Mark all read
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="p-0 m-0">
            <ScrollArea className="h-[400px] p-4">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <Bell className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                <>
                  {renderNotificationGroup("Today", groupedNotifications.today)}
                  {renderNotificationGroup("Yesterday", groupedNotifications.yesterday)}
                  {renderNotificationGroup("This Week", groupedNotifications.thisWeek)}
                  {renderNotificationGroup("Older", groupedNotifications.older)}
                </>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="unread" className="p-0 m-0">
            <ScrollArea className="h-[400px] p-4">
              {notifications.filter((n) => !n.read).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <CheckCheck className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">No unread notifications</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications
                    .filter((n) => !n.read)
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className="p-3 rounded-md border bg-muted/50 hover:bg-muted/80 cursor-pointer"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-semibold">{notification.title}</p>
                              <span className="text-xs text-muted-foreground">
                                {formatTime(notification.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>

                            {notification.actionUrl && notification.actionLabel && (
                              <div className="pt-1">
                                <Link
                                  href={notification.actionUrl}
                                  className="text-xs text-primary hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {notification.actionLabel}
                                </Link>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              clearNotification(notification.id)
                            }}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Dismiss</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
