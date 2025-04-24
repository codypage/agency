"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { getProgramConfig } from "@/lib/program-config"
import { CheckCircle, Clock, AlertCircle, PauseCircle } from "lucide-react"

interface TaskCompletionReportProps {
  program: string
  dateRange: {
    from: Date
    to: Date
  }
  provider: string
  searchQuery: string
}

export function TaskCompletionReport({ program, dateRange, provider, searchQuery }: TaskCompletionReportProps) {
  // Get program configuration
  const programConfig = getProgramConfig(program)

  // Mock task completion data
  const taskData = [
    {
      id: "T-001",
      title: "Functional Assessment Service Setup",
      status: "completed",
      completionDate: "2023-04-25",
      assignedTo: "Stacy",
      category: "System-Build",
      priority: "high",
      daysToComplete: 12,
    },
    {
      id: "T-002",
      title: "Treatment-Program Services Setup",
      status: "in-progress",
      completionDate: null,
      assignedTo: "Brittany",
      category: "System-Build",
      priority: "high",
      daysToComplete: null,
    },
    {
      id: "T-003",
      title: "Assessment Templates",
      status: "completed",
      completionDate: "2023-04-20",
      assignedTo: "Dakota",
      category: "Clinical",
      priority: "medium",
      daysToComplete: 8,
    },
    {
      id: "T-004",
      title: "Authorization Matrix",
      status: "completed",
      completionDate: "2023-05-01",
      assignedTo: "Bill",
      category: "Billing",
      priority: "medium",
      daysToComplete: 15,
    },
    {
      id: "T-005",
      title: "Job Descriptions",
      status: "in-progress",
      completionDate: null,
      assignedTo: "Amy",
      category: "HR & Training",
      priority: "medium",
      daysToComplete: null,
    },
    {
      id: "T-006",
      title: "Cost-Center Codes",
      status: "completed",
      completionDate: "2023-04-18",
      assignedTo: "David",
      category: "Leadership",
      priority: "high",
      daysToComplete: 5,
    },
    {
      id: "T-007",
      title: "Referral Intake Form",
      status: "not-started",
      completionDate: null,
      assignedTo: "Stacy",
      category: "System-Build",
      priority: "high",
      daysToComplete: null,
    },
    {
      id: "T-008",
      title: "Treatment Plan Templates",
      status: "in-progress",
      completionDate: null,
      assignedTo: "Jaden",
      category: "Clinical",
      priority: "medium",
      daysToComplete: null,
    },
  ]

  // Filter tasks based on search query and provider
  const filteredTasks = taskData.filter((task) => {
    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !task.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !task.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false

    if (provider !== "all" && task.assignedTo.toLowerCase() !== provider.toLowerCase()) return false

    return true
  })

  // Calculate completion metrics
  const completedTasks = filteredTasks.filter((task) => task.status === "completed")
  const inProgressTasks = filteredTasks.filter((task) => task.status === "in-progress")
  const notStartedTasks = filteredTasks.filter((task) => task.status === "not-started")
  const onHoldTasks = filteredTasks.filter((task) => task.status === "on-hold")

  const completionRate = filteredTasks.length > 0 ? (completedTasks.length / filteredTasks.length) * 100 : 0
  const averageCompletionDays =
    completedTasks.length > 0
      ? completedTasks.reduce((sum, task) => sum + (task.daysToComplete || 0), 0) / completedTasks.length
      : 0

  // Prepare chart data for task status
  const statusChartData = [
    { name: "Completed", value: completedTasks.length, color: "#00C49F" },
    { name: "In Progress", value: inProgressTasks.length, color: "#0088FE" },
    { name: "Not Started", value: notStartedTasks.length, color: "#FFBB28" },
    { name: "On Hold", value: onHoldTasks.length, color: "#FF8042" },
  ].filter((item) => item.value > 0)

  // Prepare chart data for completion by category
  const categoryMap = filteredTasks.reduce(
    (acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = {
          category: task.category,
          total: 0,
          completed: 0,
        }
      }
      acc[task.category].total += 1
      if (task.status === "completed") {
        acc[task.category].completed += 1
      }
      return acc
    },
    {} as Record<string, { category: string; total: number; completed: number }>,
  )

  const categoryChartData = Object.values(categoryMap).map((category) => ({
    name: category.category,
    total: category.total,
    completed: category.completed,
    completionRate: category.total > 0 ? Math.round((category.completed / category.total) * 100) : 0,
  }))

  // Prepare trend data (mock data for demonstration)
  const trendData = [
    { date: "Week 1", completed: 2, inProgress: 4, notStarted: 2 },
    { date: "Week 2", completed: 3, inProgress: 4, notStarted: 1 },
    { date: "Week 3", completed: 4, inProgress: 3, notStarted: 1 },
    { date: "Week 4", completed: 5, inProgress: 2, notStarted: 1 },
    { date: "Week 5", completed: 6, inProgress: 1, notStarted: 1 },
  ]

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "not-started":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "on-hold":
        return <PauseCircle className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  // Get status badge
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
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Not Started
          </Badge>
        )
      case "on-hold":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            On Hold
          </Badge>
        )
      default:
        return null
    }
  }

  // Get priority badge
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

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{filteredTasks.length}</CardTitle>
            <CardDescription>Total Tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{Object.keys(categoryMap).length} different categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{completedTasks.length}</CardTitle>
            <CardDescription>Completed Tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{Math.round(completionRate)}% completion rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{inProgressTasks.length}</CardTitle>
            <CardDescription>In Progress Tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {Math.round((inProgressTasks.length / filteredTasks.length) * 100)}% of total tasks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{averageCompletionDays.toFixed(1)}</CardTitle>
            <CardDescription>Avg. Days to Complete</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Based on {completedTasks.length} completed tasks</p>
          </CardContent>
        </Card>
      </div>

      {/* Task Status Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>Breakdown of tasks by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statusChartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Tasks">
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completion Trend</CardTitle>
            <CardDescription>Task completion trend over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="completed" stroke="#00C49F" name="Completed" />
                  <Line type="monotone" dataKey="inProgress" stroke="#0088FE" name="In Progress" />
                  <Line type="monotone" dataKey="notStarted" stroke="#FFBB28" name="Not Started" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completion by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Completion by Category</CardTitle>
          <CardDescription>Task completion rate by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryChartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" name="Total Tasks" />
                <Bar dataKey="completed" fill="#82ca9d" name="Completed Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Task Details */}
      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
          <CardDescription>Detailed list of tasks and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Completion Date</TableHead>
                <TableHead>Days to Complete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.id}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getStatusIcon(task.status)}
                      <span className="ml-2">{getStatusBadge(task.status)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{task.assignedTo}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{task.category}</Badge>
                  </TableCell>
                  <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                  <TableCell>
                    {task.completionDate ? new Date(task.completionDate).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell>{task.daysToComplete || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
