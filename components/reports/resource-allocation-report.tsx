"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { getProgramConfig } from "@/lib/program-config"

interface ResourceAllocationReportProps {
  program: string
  dateRange: {
    from: Date
    to: Date
  }
  provider: string
  searchQuery: string
}

export function ResourceAllocationReport({ program, dateRange, provider, searchQuery }: ResourceAllocationReportProps) {
  // Get program configuration
  const programConfig = getProgramConfig(program)

  // Mock resource allocation data
  const resourceData = [
    {
      id: "stacy",
      name: "Stacy",
      role: "BCBA",
      allocatedHours: 40,
      usedHours: 32,
      remainingHours: 8,
      utilization: 80,
      projects: ["Autism Program Implementation", "Treatment-Program Services Setup"],
      clients: 5,
    },
    {
      id: "brittany",
      name: "Brittany",
      role: "RBT",
      allocatedHours: 40,
      usedHours: 36,
      remainingHours: 4,
      utilization: 90,
      projects: ["Treatment-Program Services Setup"],
      clients: 4,
    },
    {
      id: "dakota",
      name: "Dakota",
      role: "BCBA",
      allocatedHours: 40,
      usedHours: 30,
      remainingHours: 10,
      utilization: 75,
      projects: ["Assessment Templates"],
      clients: 6,
    },
    {
      id: "jaden",
      name: "Jaden",
      role: "RBT",
      allocatedHours: 40,
      usedHours: 38,
      remainingHours: 2,
      utilization: 95,
      projects: ["Assessment Templates"],
      clients: 3,
    },
    {
      id: "bill",
      name: "Bill",
      role: "Admin",
      allocatedHours: 40,
      usedHours: 28,
      remainingHours: 12,
      utilization: 70,
      projects: ["Authorization Matrix"],
      clients: 0,
    },
  ]

  // Filter resources based on search query and provider
  const filteredResources = resourceData.filter((resource) => {
    if (
      searchQuery &&
      !resource.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !resource.role.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !resource.projects.some((project) => project.toLowerCase().includes(searchQuery.toLowerCase()))
    )
      return false

    if (provider !== "all" && resource.id !== provider) return false

    return true
  })

  // Prepare chart data
  const chartData = filteredResources.map((resource) => ({
    name: resource.name,
    allocated: resource.allocatedHours,
    used: resource.usedHours,
    remaining: resource.remainingHours,
    utilization: resource.utilization,
  }))

  // Calculate totals
  const totals = filteredResources.reduce(
    (acc, resource) => {
      acc.allocatedHours += resource.allocatedHours
      acc.usedHours += resource.usedHours
      acc.remainingHours += resource.remainingHours
      return acc
    },
    { allocatedHours: 0, usedHours: 0, remainingHours: 0 },
  )

  // Calculate overall utilization
  const overallUtilization =
    totals.allocatedHours > 0 ? Math.round((totals.usedHours / totals.allocatedHours) * 100) : 0

  // Role distribution data
  const roleData = filteredResources.reduce(
    (acc, resource) => {
      if (!acc[resource.role]) {
        acc[resource.role] = {
          role: resource.role,
          count: 0,
          allocatedHours: 0,
          usedHours: 0,
        }
      }
      acc[resource.role].count += 1
      acc[resource.role].allocatedHours += resource.allocatedHours
      acc[resource.role].usedHours += resource.usedHours
      return acc
    },
    {} as Record<string, { role: string; count: number; allocatedHours: number; usedHours: number }>,
  )

  const roleChartData = Object.values(roleData).map((role) => ({
    name: role.role,
    count: role.count,
    allocatedHours: role.allocatedHours,
    usedHours: role.usedHours,
    utilization: role.allocatedHours > 0 ? Math.round((role.usedHours / role.allocatedHours) * 100) : 0,
  }))

  // Colors for chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{filteredResources.length}</CardTitle>
            <CardDescription>Total Resources</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{Object.keys(roleData).length} different roles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{totals.allocatedHours}</CardTitle>
            <CardDescription>Total Allocated Hours</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {totals.usedHours} hours used ({overallUtilization}% utilization)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{totals.remainingHours}</CardTitle>
            <CardDescription>Total Remaining Hours</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {Math.round(totals.remainingHours / filteredResources.length)} hours per resource on average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resource Allocation Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Allocation</CardTitle>
          <CardDescription>Hours allocated vs. used by resource</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
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
                <Bar dataKey="allocated" fill="#8884d8" name="Allocated Hours" />
                <Bar dataKey="used" fill="#82ca9d" name="Used Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Role Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Role Distribution</CardTitle>
          <CardDescription>Resource allocation by role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={roleChartData}
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
                <Bar dataKey="allocatedHours" fill="#8884d8" name="Allocated Hours">
                  {roleChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
                <Bar dataKey="usedHours" fill="#82ca9d" name="Used Hours">
                  {roleChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Resource Details */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Details</CardTitle>
          <CardDescription>Detailed breakdown of resource allocation</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Allocated Hours</TableHead>
                <TableHead>Used Hours</TableHead>
                <TableHead>Remaining Hours</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>Clients</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">{resource.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{resource.role}</Badge>
                  </TableCell>
                  <TableCell>{resource.allocatedHours}</TableCell>
                  <TableCell>{resource.usedHours}</TableCell>
                  <TableCell>{resource.remainingHours}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={resource.utilization}
                        className={`h-2 w-[100px] ${
                          resource.utilization >= 90 ? "bg-red-200" : resource.utilization >= 75 ? "bg-yellow-200" : ""
                        }`}
                      />
                      <span className="text-sm">{resource.utilization}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {resource.projects.map((project, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {project}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{resource.clients}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
