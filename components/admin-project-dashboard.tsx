"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Plus, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { ProjectTable } from "./project-table"
import { ProjectKanban } from "./project-kanban"
import { ProjectTimeline } from "./project-timeline"
import { adminProjects } from "@/data/admin-projects"
import { ProjectSummary } from "./project-summary"
import { ProjectReporting } from "./project-reporting"
import { ProjectTemplates } from "./project-templates"
import type { AdminProject } from "@/types/admin-project"

export function AdminProjectDashboard() {
  const [projects, setProjects] = useState<AdminProject[]>(adminProjects)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [leadFilter, setLeadFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  // Get unique categories, leads, statuses, and priorities for filters
  const categories = [...new Set(projects.map((project) => project.category))].filter(Boolean).sort()
  const leads = [...new Set(projects.map((project) => project.projectLead).filter(Boolean))].sort()
  const statuses = [...new Set(projects.map((project) => project.status))].sort()
  const priorities = [...new Set(projects.map((project) => project.priority).filter(Boolean))].sort()

  // Filter projects based on search query and filters
  const filteredProjects = projects.filter((project) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      project.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.furtherBreakdown && project.furtherBreakdown.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project.projectLead && project.projectLead.toLowerCase().includes(searchQuery.toLowerCase()))

    // Status filter
    const matchesStatus = statusFilter === "all" || project.status === statusFilter

    // Category filter
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter

    // Lead filter
    const matchesLead = leadFilter === "all" || project.projectLead === leadFilter

    // Priority filter
    const matchesPriority = priorityFilter === "all" || project.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesCategory && matchesLead && matchesPriority
  })

  // Count projects by status
  const statusCounts = {
    "Not Started": projects.filter((p) => p.status === "Not Started").length,
    "In Progress": projects.filter((p) => p.status === "In Progress").length,
    Completed: projects.filter((p) => p.status === "Completed").length,
    "On Hold": projects.filter((p) => p.status === "On Hold").length,
    total: projects.length,
  }

  // Handle creating projects from template
  const handleCreateFromTemplate = (newProjects: Partial<AdminProject>[]) => {
    const projectsToAdd = newProjects.map((project) => ({
      ...project,
      id: `proj-${Math.random().toString(36).substring(2, 9)}`,
      status: project.status || "Not Started",
    })) as AdminProject[]

    setProjects([...projects, ...projectsToAdd])
  }

  // Handle updating a project
  const handleUpdateProject = (updatedProject: AdminProject) => {
    setProjects(projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)))
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Administrative Restructure</h1>
          <p className="text-muted-foreground">Project Management Dashboard</p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
          <ProjectTemplates onCreateFromTemplate={handleCreateFromTemplate} />
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProjectSummary
          title="Total Projects"
          count={statusCounts.total}
          icon={<Calendar className="h-5 w-5 text-muted-foreground" />}
        />
        <ProjectSummary
          title="In Progress"
          count={statusCounts["In Progress"]}
          icon={<Clock className="h-5 w-5 text-blue-500" />}
          color="blue"
        />
        <ProjectSummary
          title="Completed"
          count={statusCounts["Completed"]}
          icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
          color="green"
        />
        <ProjectSummary
          title="Not Started"
          count={statusCounts["Not Started"]}
          icon={<AlertCircle className="h-5 w-5 text-yellow-500" />}
          color="yellow"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={leadFilter} onValueChange={setLeadFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by lead" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Project Leads</SelectItem>
                {leads.map((lead) => (
                  <SelectItem key={lead} value={lead}>
                    {lead}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {priorities.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="table">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <ProjectTable projects={filteredProjects} allProjects={projects} onUpdateProject={handleUpdateProject} />
        </TabsContent>

        <TabsContent value="kanban" className="space-y-4">
          <ProjectKanban projects={filteredProjects} allProjects={projects} onUpdateProject={handleUpdateProject} />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <ProjectTimeline projects={filteredProjects} allProjects={projects} onUpdateProject={handleUpdateProject} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <ProjectReporting projects={filteredProjects} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
