"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

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

interface TaskTimelineProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export function TaskTimeline({ tasks, onTaskClick }: TaskTimelineProps) {
  // Sort tasks by due date
  const sortedTasks = [...tasks].sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })

  // Group tasks by month/year
  const groupedTasks: Record<string, Task[]> = {}

  sortedTasks.forEach((task) => {
    const date = new Date(task.dueDate)
    const monthYear = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`

    if (!groupedTasks[monthYear]) {
      groupedTasks[monthYear] = []
    }

    groupedTasks[monthYear].push(task)
  })

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

  const isOverdue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    return due < today && today.toDateString() !== due.toDateString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Timeline</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[calc(100vh-280px)] overflow-auto">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />

          <div className="space-y-8">
            {Object.entries(groupedTasks).map(([monthYear, tasks]) => (
              <div key={monthYear} className="relative">
                <div className="flex items-center mb-4">
                  <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                    <span className="text-xs font-bold">{monthYear.split(" ")[0].substring(0, 3)}</span>
                  </div>
                  <h3 className="ml-4 text-lg font-semibold">{monthYear}</h3>
                </div>

                <div className="ml-10 space-y-4">
                  {tasks.map((task) => {
                    const taskIsOverdue = isOverdue(task.dueDate)
                    return (
                      <div
                        key={task.id}
                        className={cn(
                          "p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors",
                          taskIsOverdue && task.status !== "completed" ? "border-red-200 bg-red-50" : "",
                          task.priority === "high" && task.status !== "completed" ? "border-l-4 border-l-red-500" : "",
                        )}
                        onClick={() => onTaskClick(task)}
                        tabIndex={0}
                        role="button"
                        aria-label={`Task ${task.id}: ${task.title}. Due ${new Date(task.dueDate).toLocaleDateString()}.`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            onTaskClick(task)
                          }
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(task.status)}
                            <span className="font-medium">{task.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getPriorityBadge(task.priority)}
                            <span
                              className={cn(
                                "text-sm",
                                taskIsOverdue && task.status !== "completed"
                                  ? "text-red-600 font-medium"
                                  : "text-muted-foreground",
                              )}
                            >
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.description}</p>

                        {task.percentComplete !== undefined && (
                          <Progress
                            value={task.percentComplete}
                            className="h-1 mb-3"
                            aria-label={`${task.percentComplete}% complete`}
                          />
                        )}

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={task.assignedTo.avatar || "/placeholder.svg"}
                                alt={task.assignedTo.name}
                              />
                              <AvatarFallback>{task.assignedTo.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{task.assignedTo.name}</span>
                          </div>
                          <Badge variant="outline">{task.team}</Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            {Object.keys(groupedTasks).length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No tasks found in timeline</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
