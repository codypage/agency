"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Plus, X } from "lucide-react"
import type { AdminProject } from "@/types/admin-project"

interface ProjectDependenciesProps {
  project: AdminProject
  allProjects: AdminProject[]
  onUpdate: (updatedProject: AdminProject) => void
}

export function ProjectDependencies({ project, allProjects, onUpdate }: ProjectDependenciesProps) {
  const [isAddingDependency, setIsAddingDependency] = useState(false)
  const [selectedDependency, setSelectedDependency] = useState<string>("")

  // Filter out the current project and any projects that already depend on this one
  // to avoid circular dependencies
  const availableProjects = allProjects.filter(
    (p) => p.id !== project.id && !project.dependencies?.includes(p.id) && !p.dependencies?.includes(project.id),
  )

  const dependentProjects = project.dependencies ? allProjects.filter((p) => project.dependencies?.includes(p.id)) : []

  const handleAddDependency = () => {
    if (!selectedDependency) return

    const updatedDependencies = [...(project.dependencies || []), selectedDependency]

    onUpdate({
      ...project,
      dependencies: updatedDependencies,
    })

    setSelectedDependency("")
    setIsAddingDependency(false)
  }

  const handleRemoveDependency = (dependencyId: string) => {
    const updatedDependencies = project.dependencies?.filter((id) => id !== dependencyId) || []

    onUpdate({
      ...project,
      dependencies: updatedDependencies,
    })
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md">Dependencies</CardTitle>
      </CardHeader>
      <CardContent>
        {dependentProjects.length === 0 ? (
          <p className="text-sm text-muted-foreground">No dependencies defined for this task.</p>
        ) : (
          <div className="space-y-2">
            {dependentProjects.map((dep) => (
              <div key={dep.id} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{dep.task}</span>
                  <Badge variant="outline" className="ml-2">
                    {dep.status}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveDependency(dep.id)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsAddingDependency(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Dependency
        </Button>

        <Dialog open={isAddingDependency} onOpenChange={setIsAddingDependency}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Dependency</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                Select a task that must be completed before this task can start.
              </p>
              <Select value={selectedDependency} onValueChange={setSelectedDependency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a task" />
                </SelectTrigger>
                <SelectContent>
                  {availableProjects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.task}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingDependency(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDependency} disabled={!selectedDependency}>
                Add
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
