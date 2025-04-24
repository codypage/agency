"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckSquare, MoveHorizontal } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToWindowEdges } from "@dnd-kit/modifiers"
import type { AdminProject } from "@/types/admin-project"
import { ProjectDetails } from "./project-details"
import { BulkOperationsToolbar } from "./project-management/bulk-operations-toolbar"
import { KanbanColumn } from "./project-management/kanban-column"
import { DraggableTaskCard } from "./project-management/draggable-task-card"
import { arrayMove } from "@dnd-kit/sortable"

interface ProjectKanbanProps {
  projects: AdminProject[]
  onUpdateProjects?: (projects: AdminProject[]) => Promise<void>
  onDeleteProjects?: (projects: AdminProject[]) => Promise<void>
}

export function ProjectKanban({
  projects,
  onUpdateProjects = async () => {},
  onDeleteProjects = async () => {},
}: ProjectKanbanProps) {
  const [selectedProject, setSelectedProject] = useState<AdminProject | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedProjects, setSelectedProjects] = useState<AdminProject[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  // Group projects by status
  const [notStarted, setNotStarted] = useState(projects.filter((p) => p.status === "Not Started"))
  const [inProgress, setInProgress] = useState(projects.filter((p) => p.status === "In Progress"))
  const [completed, setCompleted] = useState(projects.filter((p) => p.status === "Completed"))
  const [onHold, setOnHold] = useState(projects.filter((p) => p.status === "On Hold"))

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const openProjectDetails = (project: AdminProject) => {
    if (selectionMode) {
      toggleProjectSelection(project)
    } else {
      setSelectedProject(project)
      setDetailsOpen(true)
    }
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

  const isProjectSelected = (project: AdminProject) => {
    return selectedProjects.some((p) => p.id === project.id)
  }

  const handleUpdateStatus = async (tasks: AdminProject[], status: AdminProject["status"]) => {
    try {
      setIsUpdating(true)
      const updatedProjects = tasks.map((task) => ({
        ...task,
        status,
      }))
      await onUpdateProjects(updatedProjects)
      // Update local state to reflect changes
      setSelectedProjects((prev) => prev.map((p) => (tasks.some((t) => t.id === p.id) ? { ...p, status } : p)))
      toast({
        title: "Tasks updated",
        description: `${tasks.length} tasks updated to ${status}`,
      })
    } catch (error) {
      toast({
        title: "Failed to update tasks",
        description: "There was an error updating the tasks. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleUpdatePriority = async (tasks: AdminProject[], priority: AdminProject["priority"]) => {
    try {
      setIsUpdating(true)
      const updatedProjects = tasks.map((task) => ({
        ...task,
        priority,
      }))
      await onUpdateProjects(updatedProjects)
      // Update local state to reflect changes
      setSelectedProjects((prev) => prev.map((p) => (tasks.some((t) => t.id === p.id) ? { ...p, priority } : p)))
      toast({
        title: "Tasks updated",
        description: `${tasks.length} tasks updated to ${priority} priority`,
      })
    } catch (error) {
      toast({
        title: "Failed to update tasks",
        description: "There was an error updating the tasks. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAssignTasks = async (tasks: AdminProject[], assignee: string) => {
    try {
      setIsUpdating(true)
      const updatedProjects = tasks.map((task) => ({
        ...task,
        projectLead: assignee,
      }))
      await onUpdateProjects(updatedProjects)
      // Update local state to reflect changes
      setSelectedProjects((prev) =>
        prev.map((p) => (tasks.some((t) => t.id === p.id) ? { ...p, projectLead: assignee } : p)),
      )
      toast({
        title: "Tasks assigned",
        description: `${tasks.length} tasks assigned to ${assignee}`,
      })
    } catch (error) {
      toast({
        title: "Failed to assign tasks",
        description: "There was an error assigning the tasks. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteTasks = async (tasks: AdminProject[]) => {
    try {
      setIsUpdating(true)
      await onDeleteProjects(tasks)
      // Clear selection after deletion
      setSelectedProjects([])
      toast({
        title: "Tasks deleted",
        description: `${tasks.length} tasks have been deleted`,
      })
    } catch (error) {
      toast({
        title: "Failed to delete tasks",
        description: "There was an error deleting the tasks. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Find the active project being dragged
  const activeProject = activeId ? projects.find((p) => p.id === activeId) : null

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)
  }

  // Handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      return
    }

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) {
      setActiveId(null)
      return
    }

    const activeProject = projects.find((p) => p.id === activeId)
    const overProject = projects.find((p) => p.id === overId)

    if (!activeProject || !overProject) {
      setActiveId(null)
      return
    }

    // Reorder within the same column
    if (
      over.id.toString().startsWith("column-") &&
      activeProject.status === over.id.toString().replace("column-", "")
    ) {
      const columnId = over.id.toString()
      let items: AdminProject[] = []

      if (columnId === "column-Not Started") {
        items = [...notStarted]
      } else if (columnId === "column-In Progress") {
        items = [...inProgress]
      } else if (columnId === "column-Completed") {
        items = [...completed]
      } else if (columnId === "column-On Hold") {
        items = [...onHold]
      }

      const activeIndex = items.findIndex((item) => item.id === activeId)
      const overIndex = items.findIndex((item) => item.id === overId)

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        const newItems = arrayMove(items, activeIndex, overIndex)

        // Update the state based on the column
        if (columnId === "column-Not Started") {
          setNotStarted(newItems)
        } else if (columnId === "column-In Progress") {
          setInProgress(newItems)
        } else if (columnId === "column-Completed") {
          setCompleted(newItems)
        } else if (columnId === "column-On Hold") {
          setOnHold(newItems)
        }

        // Update the main projects array with the new order
        const updatedProjects = projects.map((project) => {
          const reorderedProject = newItems.find((item) => item.id === project.id)
          return reorderedProject || project
        })

        // Call the update function to persist the changes
        await onUpdateProjects(updatedProjects)

        toast({
          title: "Tasks reordered",
          description: "Tasks have been reordered within the column.",
        })
      }
    }

    setActiveId(null)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Project Board</h2>
        <div className="flex gap-2">
          <Button
            variant={selectionMode ? "default" : "outline"}
            onClick={toggleSelectionMode}
            className="flex items-center gap-2"
            disabled={isUpdating}
          >
            <CheckSquare className="h-4 w-4 mr-1" />
            {selectionMode ? "Exit Selection" : "Select Multiple"}
          </Button>
          {!selectionMode && (
            <Button variant="outline" className="flex items-center gap-2" disabled>
              <MoveHorizontal className="h-4 w-4 mr-1" />
              Drag Mode Active
            </Button>
          )}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KanbanColumn
            id="column-Not Started"
            title="Not Started"
            count={notStarted.length}
            colorClass="bg-yellow-50 border-yellow-200"
          >
            <SortableContext items={notStarted.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              {notStarted.map((project) => (
                <DraggableTaskCard
                  key={project.id}
                  project={project}
                  isSelected={isProjectSelected(project)}
                  selectionMode={selectionMode}
                  onSelect={() => toggleProjectSelection(project)}
                  onClick={() => openProjectDetails(project)}
                  disabled={isUpdating}
                />
              ))}
            </SortableContext>
          </KanbanColumn>

          <KanbanColumn
            id="column-In Progress"
            title="In Progress"
            count={inProgress.length}
            colorClass="bg-blue-50 border-blue-200"
          >
            <SortableContext items={inProgress.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              {inProgress.map((project) => (
                <DraggableTaskCard
                  key={project.id}
                  project={project}
                  isSelected={isProjectSelected(project)}
                  selectionMode={selectionMode}
                  onSelect={() => toggleProjectSelection(project)}
                  onClick={() => openProjectDetails(project)}
                  disabled={isUpdating}
                />
              ))}
            </SortableContext>
          </KanbanColumn>

          <KanbanColumn
            id="column-Completed"
            title="Completed"
            count={completed.length}
            colorClass="bg-green-50 border-green-200"
          >
            <SortableContext items={completed.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              {completed.map((project) => (
                <DraggableTaskCard
                  key={project.id}
                  project={project}
                  isSelected={isProjectSelected(project)}
                  selectionMode={selectionMode}
                  onSelect={() => toggleProjectSelection(project)}
                  onClick={() => openProjectDetails(project)}
                  disabled={isUpdating}
                />
              ))}
            </SortableContext>
          </KanbanColumn>

          <KanbanColumn
            id="column-On Hold"
            title="On Hold"
            count={onHold.length}
            colorClass="bg-gray-50 border-gray-200"
          >
            <SortableContext items={onHold.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              {onHold.map((project) => (
                <DraggableTaskCard
                  key={project.id}
                  project={project}
                  isSelected={isProjectSelected(project)}
                  selectionMode={selectionMode}
                  onSelect={() => toggleProjectSelection(project)}
                  onClick={() => openProjectDetails(project)}
                  disabled={isUpdating}
                />
              ))}
            </SortableContext>
          </KanbanColumn>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeProject ? (
            <div className="opacity-80 w-full max-w-[300px] transform rotate-3 shadow-xl">
              <DraggableTaskCard
                project={activeProject}
                isSelected={false}
                selectionMode={false}
                onSelect={() => {}}
                onClick={() => {}}
                isDragging
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

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

      {/* Bulk Operations Toolbar */}
      {selectedProjects.length > 0 && (
        <BulkOperationsToolbar
          selectedTasks={selectedProjects}
          onClearSelection={() => setSelectedProjects([])}
          onAssignTasks={handleAssignTasks}
          onUpdateStatus={handleUpdateStatus}
          onUpdatePriority={handleUpdatePriority}
          onDeleteTasks={handleDeleteTasks}
          isLoading={isUpdating}
          allTasks={projects}
        />
      )}
    </>
  )
}
