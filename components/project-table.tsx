"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, Clock, AlertCircle, PauseCircle, MoreHorizontal, Calendar, User, FileText } from "lucide-react"
import type { AdminProject } from "@/types/admin-project"
import { ProjectDetails } from "./project-details"
import { BulkOperationsToolbar } from "./project-management/bulk-operations-toolbar"

interface ProjectTableProps {
  projects: AdminProject[]
  allProjects?: AdminProject[]
  onUpdateProject?: (project: AdminProject) => void
  onUpdateProjects?: (projects: AdminProject[]) => Promise<void>
  onDeleteProjects?: (projects: AdminProject[]) => Promise<void>
}

export function ProjectTable({
  projects,
  allProjects = [],
  onUpdateProject = () => {},
  onUpdateProjects = async () => {},
  onDeleteProjects = async () => {},
}: ProjectTableProps) {
  const [selectedProject, setSelectedProject] = useState<AdminProject | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedProjects, setSelectedProjects] = useState<AdminProject[]>([])
  const [selectionMode, setSelectionMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case "High":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            High
          </Badge>
        )
      case "Medium":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Medium
          </Badge>
        )
      case "Low":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Low
          </Badge>
        )
      default:
        return null
    }
  }

  const openProjectDetails = (project: AdminProject) => {
    if (selectionMode) {
      toggleProjectSelection(project)
    } else {
      setSelectedProject(project)
      setDetailsOpen(true)
    }
  }

  const handleProjectUpdate = (updatedProject: AdminProject) => {
    onUpdateProject(updatedProject)
    setSelectedProject(updatedProject)
  }

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode)
    if (selectionMode) {
      setSelectedProjects([])
    }
  }

  const toggleProjectSelection = (project: AdminProject) => {
    if (selectedProjects.some((p) => p.id === project.id)) {
      setSelectedProjects(selectedProjects.filter((p) => p.id !== project.id))
    } else {
      setSelectedProjects([...selectedProjects, project])
    }
  }

  const toggleAllProjects = (checked: boolean) => {
    if (checked) {
      setSelectedProjects([...projects])
    } else {
      setSelectedProjects([])
    }
  }

  const isProjectSelected = (project: AdminProject) => {
    return selectedProjects.some((p) => p.id === project.id)
  }

  const areAllProjectsSelected = () => {
    return projects.length > 0 && selectedProjects.length === projects.length
  }

  const handleUpdateStatus = async (tasks: AdminProject[], status: AdminProject["status"]) => {
    try {
      setIsLoading(true)
      const updatedProjects = tasks.map((task) => ({
        ...task,
        status,
      }))
      await onUpdateProjects(updatedProjects)
      // Update local state to reflect changes
      setSelectedProjects((prev) => prev.map((p) => (tasks.some((t) => t.id === p.id) ? { ...p, status } : p)))
    } catch (error) {
      console.error("Failed to update status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePriority = async (tasks: AdminProject[], priority: AdminProject["priority"]) => {
    try {
      setIsLoading(true)
      const updatedProjects = tasks.map((task) => ({
        ...task,
        priority,
      }))
      await onUpdateProjects(updatedProjects)
      // Update local state to reflect changes
      setSelectedProjects((prev) => prev.map((p) => (tasks.some((t) => t.id === p.id) ? { ...p, priority } : p)))
    } catch (error) {
      console.error("Failed to update priority:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssignTasks = async (tasks: AdminProject[], assignee: string) => {
    try {
      setIsLoading(true)
      const updatedProjects = tasks.map((task) => ({
        ...task,
        projectLead: assignee,
      }))
      await onUpdateProjects(updatedProjects)
      // Update local state to reflect changes
      setSelectedProjects((prev) =>
        prev.map((p) => (tasks.some((t) => t.id === p.id) ? { ...p, projectLead: assignee } : p)),
      )
    } catch (error) {
      console.error("Failed to assign tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTasks = async (tasks: AdminProject[]) => {
    try {
      setIsLoading(true)
      await onDeleteProjects(tasks)
      // Clear selection after deletion
      setSelectedProjects([])
    } catch (error) {
      console.error("Failed to delete tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Projects</h2>
        <Button
          variant={selectionMode ? "default" : "outline"}
          onClick={toggleSelectionMode}
          className="flex items-center gap-2"
        >
          <Checkbox checked={selectionMode} onCheckedChange={() => {}} className="h-4 w-4" />
          {selectionMode ? "Exit Selection" : "Select Multiple"}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectionMode && (
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={areAllProjectsSelected()}
                    onCheckedChange={(checked) => toggleAllProjects(!!checked)}
                    aria-label="Select all projects"
                  />
                </TableHead>
              )}
              <TableHead>Task</TableHead>
              <TableHead>Project Lead</TableHead>
              <TableHead>POC</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={selectionMode ? 9 : 8} className="text-center py-8 text-muted-foreground">
                  No projects match your search criteria
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow
                  key={project.id}
                  className={`cursor-pointer hover:bg-muted/50 ${isProjectSelected(project) ? "bg-muted" : ""}`}
                  onClick={() => openProjectDetails(project)}
                >
                  {selectionMode && (
                    <TableCell className="w-[40px]" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isProjectSelected(project)}
                        onCheckedChange={() => toggleProjectSelection(project)}
                        aria-label={`Select project ${project.task}`}
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium">
                    <div className="max-w-md truncate">{project.task}</div>
                  </TableCell>
                  <TableCell>{project.projectLead || "—"}</TableCell>
                  <TableCell>{project.poc || "—"}</TableCell>
                  <TableCell>
                    {project.dueDate ? (
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {project.dueDate}
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getStatusIcon(project.status)}
                      <span className="ml-2">{getStatusBadge(project.status)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{project.priority ? getPriorityBadge(project.priority) : "—"}</TableCell>
                  <TableCell>
                    {project.category ? <Badge variant="secondary">{project.category}</Badge> : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            openProjectDetails(project)
                          }}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          Assign
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark as completed
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedProject && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProject.task}</DialogTitle>
              <DialogDescription>Task details and progress tracking</DialogDescription>
            </DialogHeader>
            <ProjectDetails project={selectedProject} allProjects={allProjects} onUpdate={handleProjectUpdate} />
          </DialogContent>
        </Dialog>
      )}

      {/* Bulk Operations Toolbar */}
      {selectedProjects.length > 0 && (
        <BulkOperationsToolbar
          selectedTasks={selectedProjects}
          onClearSelection={() => setSelectedProjects([])}
          onAssignTasks={handleAssignTasks}
          onUpdateStatus={handleUpdateStatus}
          onUpdatePriority={handleUpdatePriority}
          onDeleteTasks={handleDeleteTasks}
          isLoading={isLoading}
          allTasks={allProjects}
        />
      )}
    </>
  )
}
