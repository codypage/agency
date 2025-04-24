"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle2, Clock, AlertCircle, PauseCircle } from "lucide-react"
import type { AdminProject } from "@/types/admin-project"
import { ProjectDetails } from "./project-details"

interface ProjectTimelineProps {
  projects: AdminProject[]
}

export function ProjectTimeline({ projects }: ProjectTimelineProps) {
  const [selectedProject, setSelectedProject] = useState<AdminProject | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  // Sort projects by due date
  const sortedProjects = [...projects].sort((a, b) => {
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })

  // Group projects by due date
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const thisWeek = new Date(today)
  thisWeek.setDate(thisWeek.getDate() + 7)

  const thisMonth = new Date(today)
  thisMonth.setMonth(thisMonth.getMonth() + 1)

  const dueSoon = sortedProjects.filter((p) => p.dueDate && new Date(p.dueDate) <= thisWeek)
  const dueThisMonth = sortedProjects.filter(
    (p) => p.dueDate && new Date(p.dueDate) > thisWeek && new Date(p.dueDate) <= thisMonth,
  )
  const dueLater = sortedProjects.filter((p) => p.dueDate && new Date(p.dueDate) > thisMonth)
  const noDueDate = sortedProjects.filter((p) => !p.dueDate)

  const openProjectDetails = (project: AdminProject) => {
    setSelectedProject(project)
    setDetailsOpen(true)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "Not Started":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "On Hold":
        return <PauseCircle className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        )
      case "In Progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            In Progress
          </Badge>
        )
      case "Not Started":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Not Started
          </Badge>
        )
      case "On Hold":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            On Hold
          </Badge>
        )
      default:
        return null
    }
  }

  const renderTimelineSection = (title: string, projects: AdminProject[], urgency?: "high" | "medium" | "low") => {
    if (projects.length === 0) return null

    return (
      <div className="mb-8">
        <h3
          className={`text-lg font-medium mb-4 ${
            urgency === "high" ? "text-red-600" : urgency === "medium" ? "text-orange-600" : ""
          }`}
        >
          {title}
        </h3>
        <div className="space-y-4">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => openProjectDetails(project)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">{project.task}</h4>
                    {project.dueDate && <p className="text-sm text-muted-foreground">Due: {project.dueDate}</p>}
                    {project.projectLead && (
                      <p className="text-sm text-muted-foreground">Lead: {project.projectLead}</p>
                    )}
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(project.status)}
                    <span className="ml-2">{getStatusBadge(project.status)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {renderTimelineSection("Due This Week", dueSoon, "high")}
            {renderTimelineSection("Due This Month", dueThisMonth, "medium")}
            {renderTimelineSection("Due Later", dueLater, "low")}
            {renderTimelineSection("No Due Date", noDueDate)}
          </div>
        </CardContent>
      </Card>

      {selectedProject && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProject.task}</DialogTitle>
            </DialogHeader>
            <ProjectDetails project={selectedProject} />
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
