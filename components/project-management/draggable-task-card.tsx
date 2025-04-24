"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, User, MoreHorizontal } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { AdminProject } from "@/types/admin-project"

interface DraggableTaskCardProps {
  project: AdminProject
  isSelected: boolean
  selectionMode: boolean
  onSelect: () => void
  onClick: () => void
  isDragging?: boolean
  disabled?: boolean
}

export function DraggableTaskCard({
  project,
  isSelected,
  selectionMode,
  onSelect,
  onClick,
  isDragging = false,
  disabled = false,
}: DraggableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: project.id,
    disabled: selectionMode || disabled,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  }

  const isCurrentlyDragging = isDragging || isSortableDragging

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`mb-3 cursor-pointer hover:shadow-md transition-shadow ${
        isSelected ? "ring-2 ring-primary" : ""
      } ${isCurrentlyDragging ? "shadow-lg" : ""}`}
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            {selectionMode && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onSelect()}
                onClick={(e) => e.stopPropagation()}
                className="mr-2 mt-1"
                aria-label={`Select project ${project.task}`}
              />
            )}
            <h3 className={`font-medium text-sm line-clamp-2 ${selectionMode ? "flex-1" : ""}`}>{project.task}</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {project.category && (
            <Badge variant="secondary" className="text-xs">
              {project.category}
            </Badge>
          )}

          <div className="flex justify-between items-center text-xs text-muted-foreground pt-2">
            {project.dueDate ? (
              <div className="flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                {project.dueDate}
              </div>
            ) : (
              <span>No due date</span>
            )}

            {project.projectLead ? (
              <div className="flex items-center">
                <User className="mr-1 h-3 w-3" />
                {project.projectLead}
              </div>
            ) : (
              <span>Unassigned</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
