"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  AlertCircle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  ArrowUpRight,
  MessageSquare,
  Paperclip,
  Clock8,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { OptimizedImage } from "@/components/ui/optimized-image"

interface TaskProps {
  id: string
  title: string
  description: string
  status: "not-started" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  assignedTo: { name: string; avatar: string }
  dueDate: string
  percentComplete?: number
  estimatedHours?: number
  actualHours?: number
  attachments?: number
  comments?: number
  onClick?: () => void
}

export function EnhancedTaskCard({
  id,
  title,
  description,
  status,
  priority,
  assignedTo,
  dueDate,
  percentComplete = 0,
  estimatedHours,
  actualHours,
  attachments = 0,
  comments = 0,
  onClick,
}: TaskProps) {
  const [isHovered, setIsHovered] = useState(false)

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            In Progress
          </Badge>
        )
      case "not-started":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Not Started
          </Badge>
        )
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

  const getDaysRemaining = () => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return <span className="text-red-500 font-medium">Overdue by {Math.abs(diffDays)} days</span>
    } else if (diffDays === 0) {
      return <span className="text-orange-500 font-medium">Due today</span>
    } else if (diffDays === 1) {
      return <span className="text-orange-500">Due tomorrow</span>
    } else if (diffDays <= 3) {
      return <span className="text-yellow-500">Due in {diffDays} days</span>
    } else {
      return <span className="text-muted-foreground">Due in {diffDays} days</span>
    }
  }

  // Time tracking indicator
  const getTimeTrackingIndicator = () => {
    if (!estimatedHours) return null

    const timePercentage = actualHours ? Math.round((actualHours / estimatedHours) * 100) : 0
    const isOverBudget = timePercentage > 100

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1">
              <Clock8 className={cn("h-4 w-4", isOverBudget ? "text-red-500" : "text-muted-foreground")} />
              <span className={cn("text-xs", isOverBudget ? "text-red-500" : "text-muted-foreground")}>
                {actualHours || 0}/{estimatedHours}h
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isOverBudget ? "Over budget" : "Time tracking"}: {actualHours || 0} of {estimatedHours} hours used
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Accessibility enhancements
  const cardAriaLabel = `Task ${id}: ${title}. Priority: ${priority}. Status: ${status}. ${percentComplete}% complete.`

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200",
        isHovered ? "shadow-md" : "",
        status === "completed" ? "opacity-75" : "",
        priority === "high" && status !== "completed" ? "border-l-4 border-l-red-500" : "",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick?.()
        }
      }}
      role="button"
      aria-label={cardAriaLabel}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">{id}</span>
            {getPriorityBadge(priority)}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Task actions">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Assign to me</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {status === "not-started" ? "Start task" : status === "in-progress" ? "Complete task" : "Reopen task"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardTitle className="text-base mt-1 line-clamp-1">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              {getStatusIcon(status)}
              <span className="ml-1">{getStatusBadge(status)}</span>
            </div>
            <div>{getDaysRemaining()}</div>
          </div>

          <Progress value={percentComplete} className="h-1" aria-label={`${percentComplete}% complete`} />

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                {assignedTo.avatar ? (
                  <OptimizedImage
                    src={assignedTo.avatar}
                    alt={`Avatar for ${assignedTo.name}`}
                    width={24}
                    height={24}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <AvatarFallback>{assignedTo.name.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <span className="text-xs">{assignedTo.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">{percentComplete}% complete</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between border-t mt-2 pt-2">
        <div className="flex items-center gap-3">
          {getTimeTrackingIndicator()}

          {attachments > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{attachments}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {attachments} attachment{attachments !== 1 ? "s" : ""}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {comments > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{comments}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {comments} comment{comments !== 1 ? "s" : ""}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation()
            // Open task in new tab/window
          }}
        >
          <ArrowUpRight className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  )
}
