"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ClockIcon, AlertCircleIcon, CalendarIcon, MoreHorizontal, CheckCircle } from "lucide-react"
import {
  // US-001: View Task List
  // US-001: Each task should show title, status, priority, and assignee
  // US-001: Tasks should be sortable by different criteria
  // US-001: Tasks should be filterable by status, priority, and assignee
  // US-003: View Task Details
  // US-003: Task details should be accessible by clicking on a task in the list
  // US-003: Task details should be displayed in a modal dialog
  // US-004: Edit Task
  // US-004: Task list should reflect changes immediately
  // US-005: Delete Task
  // US-005: Task should be removed from the list immediately
  // US-006: View Tasks in Kanban Board
  // US-006: User should be able to drag and drop tasks between statuses
  // US-006: Board should update in real-time when tasks are moved
  // US-007: View Tasks in Timeline
  // US-007: Tasks should be displayed on a timeline based on due date
  // US-007: Timeline should be zoomable and pannable
  // US-007: Tasks should be color-coded by status or priority
  // US-008: View Tasks in Calendar
  // US-008: Tasks should be displayed on a calendar based on due date
  // US-008: Calendar should show day, week, and month views
  // US-008: Tasks should be clickable to view details
} from "@/components/ui/table"
import { departments } from "@/lib/admin-config"
import { OptimizedImage } from "@/components/ui/optimized-image"

interface RecentTicketsProps {
  departmentId: string
  searchQuery: string
}

// Mock ticket data - in a real implementation, this would come from your Desk365 API
const mockTickets = [
  {
    id: "TICK-001",
    subject: "Purchase Request: Office Supplies",
    department: "administrative",
    status: "open",
    priority: "medium",
    createdDate: "2023-06-10",
    assignedTo: "John Smith",
    avatarUrl: "/javascript-code-abstract.png",
  },
  {
    id: "TICK-002",
    subject: "IT Help: Network Issue",
    department: "it",
    status: "in-progress",
    priority: "high",
    createdDate: "2023-06-09",
    assignedTo: "Lisa Tech",
    avatarUrl: "/abstract-geometric-lt.png",
  },
  {
    id: "TICK-003",
    subject: "Time Off Request: June 15-20",
    department: "hr",
    status: "in-progress",
    priority: "medium",
    createdDate: "2023-06-08",
    assignedTo: "HR Team",
    avatarUrl: "/diverse-hr-team.png",
  },
  {
    id: "TICK-004",
    subject: "Treatment Plan Review: Client #1234",
    department: "clinical",
    status: "in-progress",
    priority: "high",
    createdDate: "2023-06-07",
    assignedTo: "Dr. Sarah",
    avatarUrl: "/abstract-data-stream.png",
  },
  {
    id: "TICK-005",
    subject: "Claims Rejection Report Request",
    department: "billing",
    status: "completed",
    priority: "medium",
    createdDate: "2023-06-05",
    assignedTo: "Billing Team",
    avatarUrl: "/abstract-blue-texture.png",
  },
  {
    id: "TICK-006",
    subject: "New Software Training Request",
    department: "training",
    status: "open",
    priority: "low",
    createdDate: "2023-06-04",
    assignedTo: "Training Dept",
    avatarUrl: "/abstract-geometric-TD.png",
  },
]

export function RecentTickets({ departmentId, searchQuery }: RecentTicketsProps) {
  // Filter tickets based on department and search query
  const filteredTickets = mockTickets.filter((ticket) => {
    if (departmentId !== "all" && ticket.department !== departmentId) return false

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        ticket.subject.toLowerCase().includes(query) ||
        ticket.id.toLowerCase().includes(query) ||
        ticket.assignedTo.toLowerCase().includes(query)
      )
    }

    return true
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <ClockIcon className="h-4 w-4 text-blue-500" />
      case "open":
        return <AlertCircleIcon className="h-4 w-4 text-gray-500" />
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
      case "open":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Open
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

  const getDepartmentBadge = (deptId: string) => {
    const dept = departments.find((d) => d.id === deptId)
    if (!dept) return null

    return (
      <Badge variant="outline" className={dept.color}>
        {dept.name}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tickets</CardTitle>
        <CardDescription>
          Active tickets from{" "}
          {departmentId === "all" ? "all departments" : departments.find((d) => d.id === departmentId)?.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-medium">{ticket.id}</TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell>{getDepartmentBadge(ticket.department)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {/* US-001: Each task should show status */}
                    {getStatusIcon(ticket.status)}
                    <span className="ml-2">{getStatusBadge(ticket.status)}</span>
                  </div>
                </TableCell>
                <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {new Date(ticket.createdDate).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {/* US-001: Each task should show assignee */}
                    <Avatar className="h-8 w-8">
                      <OptimizedImage
                        src={ticket.avatarUrl || "/placeholder.svg"}
                        alt={ticket.assignedTo}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <AvatarFallback>{ticket.assignedTo.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{ticket.assignedTo}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Update status</DropdownMenuItem>
                      <DropdownMenuItem>Reassign</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Add comment</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
