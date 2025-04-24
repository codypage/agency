"use client"

import { useEffect, useState } from "react"
import { useDeadlineNotifications } from "@/hooks/use-notifications"
import type { AdminProject } from "@/types/admin-project"

interface DeadlineNotificationServiceProps {
  projects: AdminProject[]
}

export function DeadlineNotificationService({ projects }: DeadlineNotificationServiceProps) {
  const { notifyDeadline } = useDeadlineNotifications()
  const [processedDeadlines, setProcessedDeadlines] = useState<Set<string>>(new Set())

  // Check for approaching deadlines
  useEffect(() => {
    // Get today's date
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Process projects with due dates
    const projectsWithDueDates = projects.filter(
      (project) => project.dueDate && project.status !== "Completed" && project.status !== "On Hold",
    )

    // Check each project
    projectsWithDueDates.forEach((project) => {
      if (!project.dueDate) return

      // Parse the due date (handle different formats)
      let dueDate: Date

      // Handle format like "6-May"
      if (project.dueDate.includes("-")) {
        const [day, month] = project.dueDate.split("-")
        const year = today.getFullYear()
        const monthMap: Record<string, number> = {
          Jan: 0,
          Feb: 1,
          Mar: 2,
          Apr: 3,
          May: 4,
          Jun: 5,
          Jul: 6,
          Aug: 7,
          Sep: 8,
          Oct: 9,
          Nov: 10,
          Dec: 11,
        }
        dueDate = new Date(year, monthMap[month], Number.parseInt(day))
      } else {
        // Try to parse as ISO date
        dueDate = new Date(project.dueDate)
      }

      // Calculate days remaining
      const timeDiff = dueDate.getTime() - today.getTime()
      const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24))

      // Create a unique key for this deadline notification
      const notificationKey = `${project.id}-${daysRemaining}`

      // Only notify for approaching deadlines (7, 3, and 1 days before)
      // and only if we haven't already processed this specific notification
      if (
        (daysRemaining === 7 || daysRemaining === 3 || daysRemaining === 1) &&
        !processedDeadlines.has(notificationKey)
      ) {
        // Send notification
        notifyDeadline(project.id, project.task, project.dueDate, daysRemaining, project.projectLead)

        // Mark this notification as processed
        setProcessedDeadlines((prev) => new Set(prev).add(notificationKey))
      }
    })

    // In a real app, you would want to run this check periodically or on app startup
    // For this demo, we'll just run it once when the component mounts
  }, [projects, notifyDeadline, processedDeadlines])

  // This is a service component that doesn't render anything
  return null
}
