"use client"

import { useState } from "react"
import { AdminProjectDashboard } from "@/components/admin-project-dashboard"
import { DeadlineNotificationService } from "@/components/deadline-notification-service"
import { adminProjects } from "@/data/admin-projects"

export default function AdminProjectDashboardPage() {
  const [projects, setProjects] = useState(adminProjects)

  return (
    <div className="min-h-screen bg-background">
      <DeadlineNotificationService projects={projects} />
      <AdminProjectDashboard />
    </div>
  )
}
