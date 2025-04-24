"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"

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

interface TaskCalendarProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export function TaskCalendar({ tasks, onTaskClick }: TaskCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const getTasksForDay = (day: number) => {
    const date = new Date(year, month, day)
    const dateString = date.toISOString().split("T")[0]

    return tasks.filter((task) => {
      const taskDate = new Date(task.dueDate)
      return taskDate.toISOString().split("T")[0] === dateString
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const renderCalendarDays = () => {
    const days = []
    const totalCells = firstDayOfMonth + daysInMonth
    const totalRows = Math.ceil(totalCells / 7)

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-muted bg-muted/20"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const tasksForDay = getTasksForDay(day)
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString()

      days.push(
        <div
          key={`day-${day}`}
          className={`h-24 border border-muted p-1 overflow-hidden ${isToday ? "bg-muted/30 border-primary" : ""}`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className={`text-sm font-medium ${isToday ? "text-primary" : ""}`}>{day}</span>
            {tasksForDay.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {tasksForDay.length}
              </Badge>
            )}
          </div>
          <div className="space-y-1 overflow-y-auto max-h-[calc(100%-20px)]">
            {tasksForDay.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="text-xs p-1 rounded cursor-pointer hover:bg-muted/50 flex items-center gap-1"
                onClick={() => onTaskClick(task)}
              >
                <div className={`w-1 h-1 rounded-full ${getPriorityColor(task.priority)}`}></div>
                <span className="truncate">{task.title}</span>
              </div>
            ))}
            {tasksForDay.length > 3 && (
              <div className="text-xs text-muted-foreground text-center">+{tasksForDay.length - 3} more</div>
            )}
          </div>
        </div>,
      )
    }

    // Add empty cells to complete the last row
    const remainingCells = totalRows * 7 - (firstDayOfMonth + daysInMonth)
    for (let i = 0; i < remainingCells; i++) {
      days.push(<div key={`empty-end-${i}`} className="h-24 border border-muted bg-muted/20"></div>)
    }

    return days
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Task Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">
              {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
            </span>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-0">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center py-2 font-medium text-sm">
              {day}
            </div>
          ))}
          {renderCalendarDays()}
        </div>
      </CardContent>
    </Card>
  )
}
