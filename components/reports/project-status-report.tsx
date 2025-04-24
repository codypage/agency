"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { getProgramConfig } from "@/lib/program-config"
import { CheckCircle, Clock, AlertCircle, PauseCircle } from "lucide-react"

interface ProjectStatusReportProps {
  program: string
  dateRange: {
    from: Date
    to: Date
  }
  provider: string
  searchQuery: string
}

export function ProjectStatusReport({ program, dateRange, provider, searchQuery }: ProjectStatusReportProps) {
  // Get program configuration
  const programConfig = getProgramConfig(program)

  // Mock project status data
  const projectStatusData = [
    { name: "Not Started", value: 9, color: "#FFBB28" },
    { name: "In Progress", value: 18, color: "#0088FE" },
    { name: "Completed", value: 15, color: "#00C49F" },
    { name: "On Hold", value: 5, color: "#FF8042" },
  ]

  // Mock project data
  const projectData = [
    {
      id: "P001",
      name: "Autism Program Implementation",
      status: "In Progress",
      progress: 35,
      lead: "Stacy",
      dueDate: "2023-08-15",
      priority: "High",
    },
    {
      id: "P002",
      name: "Treatment-Program Services Setup",
      status: "In Progress",
      progress: 60,
      lead: "Brittany",
      dueDate: "2023-05-05",
      priority: "High",
    },
    {
      id: "P003",
      name: "Assessment Templates",
      status: "Completed",
      progress: 100,
      lead: "Dakota",
      dueDate: "2023-04-28",
      priority: "Medium",
    },
    {
      id: "P004",
      name: "Authorization Matrix",
      status: "In Progress",
      progress: 75,
      lead: "Bill",
      dueDate: "2023-05-05",
      priority: "Medium",
    },
    {
      id: "P005",
      name: "Job Descriptions",
      status: "Not Started",
      progress: 0,
      lead: "Amy",
      dueDate: "2023-05-05",
      priority: "Medium",
    },
  ]

  // Filter projects based on search query and provider
  const filteredProjects = projectData.filter((project) => {
    if (
      searchQuery &&
      !project.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !project.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !project.lead.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false

    if (provider !== "all" && project.lead.toLowerCase() !== provider.toLowerCase()) return false

    return true
  })

  // Calculate status counts for filtered projects
  const statusCounts = {
    "Not Started": filteredProjects.filter((p) => p.status === "Not Started").length,
    "In Progress": filteredProjects.filter((p) => p.status === "In Progress").length,
    Completed: filteredProjects.filter((p) => p.status === "Completed").length,
    "On Hold": filteredProjects.filter((p) => p.status === "On Hold").length,
  }

  // Prepare chart data for filtered projects
  const chartData = [
    { name: "Not Started", value: statusCounts["Not Started"], color: "#FFBB28" },
    { name: "In Progress", value: statusCounts["In Progress"], color: "#0088FE" },
    { name: "Completed", value: statusCounts.Completed, color: "#00C49F" },
    { name: "On Hold", value: statusCounts["On Hold"], color: "#FF8042" },
  ].filter((item) => item.value > 0)

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
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

  // Get status badge
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

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
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

  return (
    <div className="space-y-6">
      {/* Status Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
            <CardDescription>Overview of project statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} projects`, "Count"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Summary</CardTitle>
            <CardDescription>Project counts by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                  <span>Not Started</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{statusCounts["Not Started"]}</span>
                  <span className="text-sm text-muted-foreground">projects</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-blue-500 mr-2" />
                  <span>In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{statusCounts["In Progress"]}</span>
                  <span className="text-sm text-muted-foreground">projects</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{statusCounts.Completed}</span>
                  <span className="text-sm text-muted-foreground">projects</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <PauseCircle className="h-4 w-4 text-gray-500 mr-2" />
                  <span>On Hold</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{statusCounts["On Hold"]}</span>
                  <span className="text-sm text-muted-foreground">projects</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project List */}
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Detailed list of projects and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Lead</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.id}</TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getStatusIcon(project.status)}
                      <span className="ml-2">{getStatusBadge(project.status)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={project.progress} className="h-2 w-[100px]" />
                      <span className="text-sm">{project.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{project.lead}</TableCell>
                  <TableCell>{new Date(project.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{getPriorityBadge(project.priority)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
