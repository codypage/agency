"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart, LineChart } from "@/components/ui/chart"
import { CalendarDays, CheckCircle2, Clock, FileText, PlusCircle } from "lucide-react"

export function ProjectManagerDashboard() {
  // Sample data - in a real app, this would come from an API
  const projects = [
    {
      id: "1",
      name: "Clinical Documentation System",
      status: "In Progress",
      progress: 65,
      dueDate: "Oct 15, 2023",
      priority: "High",
      assignees: [
        { name: "Alex Johnson", avatar: "/abstract-aj.png" },
        { name: "Sarah Miller", avatar: "/abstract-geometric-sm.png" },
      ],
    },
    {
      id: "2",
      name: "Authorization Tracking Portal",
      status: "Planning",
      progress: 25,
      dueDate: "Nov 30, 2023",
      priority: "Medium",
      assignees: [
        { name: "David Chen", avatar: "/placeholder.svg?height=32&width=32&query=DC" },
        { name: "Emily Wilson", avatar: "/graffiti-ew.png" },
      ],
    },
    {
      id: "3",
      name: "Staff Training Program",
      status: "Completed",
      progress: 100,
      dueDate: "Sep 1, 2023",
      priority: "Low",
      assignees: [{ name: "Michael Brown", avatar: "/placeholder.svg?height=32&width=32&query=MB" }],
    },
    {
      id: "4",
      name: "Billing Integration",
      status: "At Risk",
      progress: 45,
      dueDate: "Oct 5, 2023",
      priority: "Critical",
      assignees: [
        { name: "Jessica Lee", avatar: "/placeholder.svg?height=32&width=32&query=JL" },
        { name: "Robert Taylor", avatar: "/placeholder.svg?height=32&width=32&query=RT" },
      ],
    },
  ]

  const upcomingDeadlines = [
    {
      id: "d1",
      task: "Submit Clinical Documentation System Design",
      project: "Clinical Documentation System",
      dueDate: "Sep 28, 2023",
      assignee: "Alex Johnson",
    },
    {
      id: "d2",
      task: "Billing Integration API Testing",
      project: "Billing Integration",
      dueDate: "Sep 30, 2023",
      assignee: "Jessica Lee",
    },
    {
      id: "d3",
      task: "Authorization Portal Wireframes",
      project: "Authorization Tracking Portal",
      dueDate: "Oct 5, 2023",
      assignee: "David Chen",
    },
  ]

  const projectStatusData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Completed",
        data: [3, 2, 4, 3, 5, 4],
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        borderColor: "rgb(16, 185, 129)",
      },
      {
        label: "In Progress",
        data: [5, 6, 4, 5, 3, 6],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
      },
      {
        label: "At Risk",
        data: [1, 2, 1, 0, 1, 2],
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        borderColor: "rgb(239, 68, 68)",
      },
    ],
  }

  const resourceAllocationData = {
    labels: ["Development", "Design", "Testing", "Documentation", "Training", "Management"],
    datasets: [
      {
        label: "Allocated Hours",
        data: [120, 80, 60, 40, 30, 50],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 2,
      },
      {
        label: "Used Hours",
        data: [100, 65, 40, 35, 25, 45],
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        borderColor: "rgb(16, 185, 129)",
        borderWidth: 2,
      },
    ],
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500"
      case "In Progress":
        return "bg-blue-500"
      case "Planning":
        return "bg-yellow-500"
      case "At Risk":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "Critical":
        return "destructive"
      case "High":
        return "default"
      case "Medium":
        return "secondary"
      case "Low":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Project Manager Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <CalendarDays className="mr-2 h-4 w-4" />
            Project Calendar
          </Button>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">4 active, 2 planning, 6 completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Track</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">83%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 this week, 5 next week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resource Utilization</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76%</div>
            <p className="text-xs text-muted-foreground">-2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="projects">Active Projects</TabsTrigger>
          <TabsTrigger value="deadlines">Upcoming Deadlines</TabsTrigger>
          <TabsTrigger value="analytics">Project Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>Status and progress of current projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projects.map((project) => (
                  <div key={project.id} className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${getStatusColor(project.status)}`} />
                        <h3 className="font-medium">{project.name}</h3>
                      </div>
                      <Badge variant={getPriorityVariant(project.priority)}>{project.priority}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div>Due: {project.dueDate}</div>
                      <div>{project.progress}% complete</div>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {project.assignees.map((assignee, index) => (
                          <Avatar key={index} className="border-2 border-background h-8 w-8">
                            <AvatarImage src={assignee.avatar || "/placeholder.svg"} alt={assignee.name} />
                            <AvatarFallback>
                              {assignee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Projects
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="deadlines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>Tasks and milestones due soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div
                    key={deadline.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <div className="font-medium">{deadline.task}</div>
                      <div className="text-sm text-muted-foreground">Project: {deadline.project}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-sm font-medium">Due: {deadline.dueDate}</div>
                      <div className="text-xs text-muted-foreground">Assigned to: {deadline.assignee}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Deadlines
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Status Trends</CardTitle>
                <CardDescription>Project status over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <BarChart data={projectStatusData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Resource Allocation</CardTitle>
                <CardDescription>Allocated vs. used hours by category</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <LineChart data={resourceAllocationData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
