"use client"

import { useState } from "react"
import { ProjectKanban } from "@/components/project-kanban"
import { adminProjects } from "@/data/admin-projects"
import type { AdminProject } from "@/types/admin-project"

export default function KanbanDemoPage() {
  const [projects, setProjects] = useState<AdminProject[]>(adminProjects)

  const handleUpdateProjects = async (updatedProjects: AdminProject[]) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Update local state
    setProjects((currentProjects) => {
      return currentProjects.map((project) => {
        const updatedProject = updatedProjects.find((p) => p.id === project.id)
        return updatedProject || project
      })
    })

    return Promise.resolve()
  }

  const handleDeleteProjects = async (projectsToDelete: AdminProject[]) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Update local state
    setProjects((currentProjects) => {
      return currentProjects.filter((project) => !projectsToDelete.some((p) => p.id === project.id))
    })

    return Promise.resolve()
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Kanban Board with Drag and Drop</h1>
      <ProjectKanban
        projects={projects}
        onUpdateProjects={handleUpdateProjects}
        onDeleteProjects={handleDeleteProjects}
      />
    </div>
  )
}
