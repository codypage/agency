"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Calendar, CheckCircle2, Clock, AlertCircle, PauseCircle } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { AdminProject } from "@/types/admin-project"

interface ProjectReportingProps {
  projects: AdminProject[]
}

export function ProjectReporting({ projects }: ProjectReportingProps) {
  const [reportType, setReportType] = useState<"status" | "category" | "lead" | "deadline">("status")

  // Status distribution data
  const statusData = [
    { name: "Not Started", value: projects.filter((p) => p.status === "Not Started").length },
    { name: "In Progress", value: projects.filter((p) => p.status === "In Progress").length },
    { name: "Completed", value: projects.filter((p) => p.status === "Completed").length },
    { name: "On Hold", value: projects.filter((p) => p.status === "On Hold").length },
  ]

  // Category distribution data
  const categoryMap: Record<string, number> = {}
  projects.forEach((project) => {
    if (project.category) {
      categoryMap[project.category] = (categoryMap[project.category] || 0) + 1
    }
  })

  const categoryData = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  // Project lead distribution data
  const leadMap: Record<string, number> = {}
  projects.forEach((project) => {
    if (project.projectLead) {
      leadMap[project.projectLead] = (leadMap[project.projectLead] || 0) + 1
    }
  })

  const leadData = Object.entries(leadMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10) // Top 10 leads

  // Deadline distribution data
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const deadlineData = [
    {
      name: "Overdue",
      value: projects.filter((p) => {
        if (!p.dueDate || p.status === "Completed") return false
        const dueDate = new Date(p.dueDate)
        return dueDate < today
      }).length,
    },
    {
      name: "Due Today",
      value: projects.filter((p) => {
        if (!p.dueDate || p.status === "Completed") return false
        const dueDate = new Date(p.dueDate)
        return dueDate.toDateString() === today.toDateString()
      }).length,
    },
    {
      name: "Due This Week",
      value: projects.filter((p) => {
        if (!p.dueDate || p.status === "Completed") return false
        const dueDate = new Date(p.dueDate)
        const diffTime = dueDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays > 0 && diffDays <= 7
      }).length,
    },
    {
      name: "Due This Month",
      value: projects.filter((p) => {
        if (!p.dueDate || p.status === "Completed") return false
        const dueDate = new Date(p.dueDate)
        const diffTime = dueDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays > 7 && diffDays <= 30
      }).length,
    },
    {
      name: "Due Later",
      value: projects.filter((p) => {
        if (!p.dueDate || p.status === "Completed") return false
        const dueDate = new Date(p.dueDate)
        const diffTime = dueDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays > 30
      }).length,
    },
    {
      name: "No Due Date",
      value: projects.filter((p) => !p.dueDate && p.status !== "Completed").length,
    },
  ]

  // Colors for charts
  const COLORS = {
    status: ["#FFBB28", "#0088FE", "#00C49F", "#FF8042"],
    category: ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c", "#d0ed57", "#ffc658"],
    lead: ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c", "#d0ed57", "#ffc658"],
    deadline: ["#ff0000", "#ff8800", "#ffcc00", "#00cc00", "#0088FE", "#AAAAAA"],
  }

  // Get status icon
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

  // Handle export
  const handleExport = () => {
    // In a real implementation, this would generate and download a CSV or PDF report
    alert("Exporting report... (This would download a file in a real implementation)")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs value={reportType} onValueChange={(value) => setReportType(value as any)}>
          <TabsList>
            <TabsTrigger value="status">Status Distribution</TabsTrigger>
            <TabsTrigger value="category">Category Distribution</TabsTrigger>
            <TabsTrigger value="lead">Project Lead Workload</TabsTrigger>
            <TabsTrigger value="deadline">Deadline Analysis</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* Status Distribution Report */}
      {reportType === "status" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
              <CardDescription>Project breakdown by current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.status[index % COLORS.status.length]} />
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
              <CardTitle>Status Details</CardTitle>
              <CardDescription>Detailed breakdown of project statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusData.map((status) => (
                  <div key={status.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getStatusIcon(status.name)}
                      <span className="ml-2">{getStatusBadge(status.name)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{status.value}</span>
                      <span className="text-sm text-muted-foreground">projects</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Category Distribution Report */}
      {reportType === "category" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>Project breakdown by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={80} />
                    <Tooltip formatter={(value) => [`${value} projects`, "Count"]} />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8">
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.category[index % COLORS.category.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Details</CardTitle>
              <CardDescription>Detailed breakdown of project categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {categoryData.map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div>
                      <Badge variant="secondary">{category.name}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{category.value}</span>
                      <span className="text-sm text-muted-foreground">projects</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Project Lead Workload Report */}
      {reportType === "lead" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Lead Workload</CardTitle>
              <CardDescription>Project distribution by assigned lead</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leadData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={80} />
                    <Tooltip formatter={(value) => [`${value} projects`, "Count"]} />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8">
                      {leadData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.lead[index % COLORS.lead.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lead Details</CardTitle>
              <CardDescription>Detailed breakdown of project leads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {leadData.map((lead) => (
                  <div key={lead.name} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{lead.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{lead.value}</span>
                      <span className="text-sm text-muted-foreground">projects</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Deadline Analysis Report */}
      {reportType === "deadline" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Deadline Analysis</CardTitle>
              <CardDescription>Project breakdown by deadline status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deadlineData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {deadlineData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.deadline[index % COLORS.deadline.length]} />
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
              <CardTitle>Deadline Details</CardTitle>
              <CardDescription>Detailed breakdown of project deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deadlineData.map((deadline, index) => (
                  <div key={deadline.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: COLORS.deadline[index % COLORS.deadline.length] }}
                      />
                      <span className="font-medium">{deadline.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{deadline.value}</span>
                      <span className="text-sm text-muted-foreground">projects</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {reportType === "status" && "Projects by Status"}
            {reportType === "category" && "Projects by Category"}
            {reportType === "lead" && "Projects by Lead"}
            {reportType === "deadline" && "Projects by Deadline"}
          </CardTitle>
          <CardDescription>Detailed list of projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {reportType === "category" ? "Category" : reportType === "lead" ? "Lead" : "Due Date"}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.slice(0, 10).map((project) => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{project.task}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(project.status)}
                        <span className="ml-2">{getStatusBadge(project.status)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {reportType === "category" ? (
                        <Badge variant="secondary">{project.category || "Uncategorized"}</Badge>
                      ) : reportType === "lead" ? (
                        <span className="text-sm text-gray-900">{project.projectLead || "Unassigned"}</span>
                      ) : (
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-gray-900">{project.dueDate || "No due date"}</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {projects.length > 10 && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Showing 10 of {projects.length} projects. Export the report to see all projects.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
