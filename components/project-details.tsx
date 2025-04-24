import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Clock, AlertCircle, PauseCircle, Calendar, User, Users, CheckCheck } from "lucide-react"
import type { AdminProject } from "@/types/admin-project"
import { ProjectDependencies } from "./project-dependencies"

interface ProjectDetailsProps {
  project: AdminProject
  allProjects?: AdminProject[]
  onUpdate?: (updatedProject: AdminProject) => void
}

export function ProjectDetails({ project, allProjects = [], onUpdate = () => {} }: ProjectDetailsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "In Progress":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "Not Started":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "On Hold":
        return <PauseCircle className="h-5 w-5 text-gray-500" />
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

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case "High":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            High Priority
          </Badge>
        )
      case "Medium":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Medium Priority
          </Badge>
        )
      case "Low":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Low Priority
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon(project.status)}
          <span>{getStatusBadge(project.status)}</span>
          {project.priority && <span className="ml-2">{getPriorityBadge(project.priority)}</span>}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <User className="mr-2 h-4 w-4" />
            Assign
          </Button>
          <Button size="sm">
            <CheckCheck className="mr-2 h-4 w-4" />
            Update Status
          </Button>
        </div>
      </div>

      {project.percentComplete !== undefined && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{project.percentComplete}%</span>
          </div>
          <Progress value={project.percentComplete} />
        </div>
      )}

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Task Description</h3>
            <p className="text-sm">{project.furtherBreakdown || "No detailed description provided."}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Category</h3>
            <p className="text-sm">{project.category || "Uncategorized"}</p>
          </div>

          {project.deliverables && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Deliverables</h3>
              <p className="text-sm">{project.deliverables}</p>
            </div>
          )}

          {project.reportsDataUsed && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Reports/Data Used</h3>
              <p className="text-sm">{project.reportsDataUsed}</p>
            </div>
          )}

          {project.results && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Results</h3>
              <p className="text-sm">{project.results}</p>
            </div>
          )}

          {project.reportingMetrics && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Reporting Metrics</h3>
              <p className="text-sm">{project.reportingMetrics}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Project Lead:</h3>
            <p className="text-sm">{project.projectLead || "Unassigned"}</p>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Point of Contact:</h3>
            <p className="text-sm">{project.poc || "None specified"}</p>
          </div>

          {project.startDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Start Date:</h3>
              <p className="text-sm">{project.startDate}</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Due Date:</h3>
            <p className="text-sm">{project.dueDate || "No due date"}</p>
          </div>

          {(project.estimatedHours !== undefined || project.actualHours !== undefined) && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Hours:</h3>
              <p className="text-sm">
                {project.actualHours !== undefined ? `${project.actualHours} actual` : ""}
                {project.actualHours !== undefined && project.estimatedHours !== undefined ? " / " : ""}
                {project.estimatedHours !== undefined ? `${project.estimatedHours} estimated` : ""}
              </p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <CheckCheck className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Implementation Status:</h3>
            <p className="text-sm">{project.implemented || "Not implemented"}</p>
          </div>

          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Checked By:</h3>
            <p className="text-sm">{project.checkedBy || "Not assigned"}</p>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Communication:</h3>
            <p className="text-sm">{project.communicatedBy || "Not assigned"}</p>
          </div>
        </div>
      </div>

      {allProjects.length > 0 && (
        <>
          <Separator />
          <ProjectDependencies project={project} allProjects={allProjects} onUpdate={onUpdate} />
        </>
      )}

      <Separator />

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}
