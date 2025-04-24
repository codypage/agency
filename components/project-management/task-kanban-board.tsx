"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, Clock, GripVertical, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  assignedTo: { name: string; avatar: string }
  team: string
  dueDate: string
  category: string
  subcategory: string
  percentComplete?: number
}

interface TaskKanbanBoardProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export function TaskKanbanBoard({ tasks, onTaskClick }: TaskKanbanBoardProps) {
  // Group tasks by status
  const notStartedTasks = tasks.filter((task) => task.status === "not-started")
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress")
  const completedTasks = tasks.filter((task) => task.status === "completed")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "not-started":
        return <AlertCircle className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Low
          </Badge>
        )
      default:
        return null
    }
  }

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return <span className="text-red-500 text-xs font-medium">Overdue</span>
    } else if (diffDays === 0) {
      return <span className="text-orange-500 text-xs">Today</span>
    } else if (diffDays === 1) {
      return <span className="text-orange-500 text-xs">Tomorrow</span>
    } else {
      return <span className="text-muted-foreground text-xs">{diffDays} days</span>
    }
  }

  const TaskCard = ({ task }: { task: Task }) => {
    const [isDragging, setIsDragging] = useState(false)

    const handleDragStart = () => setIsDragging(true)
    const handleDragEnd = () => setIsDragging(false)

    return (
      <Card
        className={cn(
          "mb-3 cursor-pointer hover:shadow-md transition-all group",
          task.priority === "high" && task.status !== "completed" ? "border-l-2 border-l-red-500" : "",
          isDragging && "shadow-lg scale-105 opacity-90 rotate-1",
        )}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={() => onTaskClick(task)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onTaskClick(task)
          }
        }}
        aria-label={`Task ${task.id}: ${task.title}`}
      >
        <CardContent className="p-3 relative">
          <div className="opacity-0 group-hover:opacity-70 absolute right-2 top-2">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-medium text-muted-foreground">{task.id}</span>
            {getPriorityBadge(task.priority)}
          </div>
          <h3 className="font-medium text-sm mb-2 line-clamp-1">{task.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{task.description}</p>

          {task.percentComplete !== undefined && <Progress value={task.percentComplete} className="h-1 mb-2" />}

          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-1">
              <Avatar className="h-5 w-5">
                <AvatarImage src={task.assignedTo.avatar || "/placeholder.svg"} alt={task.assignedTo.name} />
                <AvatarFallback>{task.assignedTo.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-xs">{task.assignedTo.name}</span>
            </div>
            <div className="flex items-center gap-1">{getDaysRemaining(task.dueDate)}</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <Select defaultValue="all" className="w-[150px]">
          <SelectTrigger id="filter-priority">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="name" className="w-[150px]">
          <SelectTrigger id="sort-by">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center">
              <AlertCircle className="h-4 w-4 text-gray-500 mr-2" />
              Not Started
              <Badge className="ml-2">{notStartedTasks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 max-h-[calc(100vh-280px)] overflow-auto">
            {notStartedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {notStartedTasks.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No tasks</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center">
              <Clock className="h-4 w-4 text-blue-500 mr-2" />
              In Progress
              <Badge className="ml-2">{inProgressTasks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 max-h-[calc(100vh-280px)] overflow-auto">
            {inProgressTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {inProgressTasks.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No tasks</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Completed
              <Badge className="ml-2">{completedTasks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 max-h-[calc(100vh-280px)] overflow-auto">
            {completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {completedTasks.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No tasks</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
