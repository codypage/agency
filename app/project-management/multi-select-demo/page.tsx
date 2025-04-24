"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectTable } from "@/components/project-table"
import { ProjectKanban } from "@/components/project-kanban"
import { adminProjects } from "@/data/admin-projects"
import { toast } from "@/hooks/use-toast"

export default function MultiSelectDemo() {
  const [projects, setProjects] = useState(adminProjects)

  const handleUpdateProjects = async (updatedProjects: typeof projects) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update the projects in state
    setProjects((prev) =>
      prev.map((project) => {
        const updatedProject = updatedProjects.find((p) => p.id === project.id)
        return updatedProject || project
      }),
    )

    return Promise.resolve()
  }

  const handleDeleteProjects = async (projectsToDelete: typeof projects) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Remove the projects from state
    setProjects((prev) => prev.filter((project) => !projectsToDelete.some((p) => p.id === project.id)))

    return Promise.resolve()
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
        <p className="text-muted-foreground">
          Manage your projects with multi-select capabilities for bulk operations.
        </p>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
        </TabsList>
        <TabsContent value="table" className="mt-6">
          <ProjectTable
            projects={projects}
            allProjects={projects}
            onUpdateProject={(updatedProject) => {
              setProjects((prev) =>
                prev.map((project) => (project.id === updatedProject.id ? updatedProject : project)),
              )
              toast({
                title: "Project updated",
                description: "The project has been updated successfully.",
              })
            }}
            onUpdateProjects={handleUpdateProjects}
            onDeleteProjects={handleDeleteProjects}
          />
        </TabsContent>
        <TabsContent value="kanban" className="mt-6">
          <ProjectKanban
            projects={projects}
            onUpdateProjects={handleUpdateProjects}
            onDeleteProjects={handleDeleteProjects}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
