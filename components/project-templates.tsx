"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon, FileText, Plus } from "lucide-react"
import type { AdminProject } from "@/types/admin-project"

interface ProjectTemplatesProps {
  onCreateFromTemplate: (projects: Partial<AdminProject>[]) => void
}

export function ProjectTemplates({ onCreateFromTemplate }: ProjectTemplatesProps) {
  const [open, setOpen] = useState(false)
  const [templateType, setTemplateType] = useState<"generic" | "waterfall" | "agile" | "simple">("generic")
  const [projectName, setProjectName] = useState("")
  const [projectCategory, setProjectCategory] = useState("")
  const [projectLead, setProjectLead] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  const handleCreateFromTemplate = () => {
    // Validate required fields
    if (!projectName || !projectCategory || !projectLead || !startDate || !endDate) {
      alert("Please fill in all required fields")
      return
    }

    // Format dates
    const formattedStartDate = format(startDate, "d-MMM")
    const formattedEndDate = format(endDate, "d-MMM")

    // Create projects based on template type
    let projects: Partial<AdminProject>[] = []

    if (templateType === "generic") {
      // Generic project plan template
      projects = [
        {
          task: `${projectName} - Initiation`,
          category: projectCategory,
          projectLead,
          dueDate: format(new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000), "d-MMM"),
          status: "Not Started",
          priority: "High",
          phase: "Initiation",
          percentComplete: 0,
          startDate: formattedStartDate,
          deliverables: "Project charter, stakeholder analysis",
        },
        {
          task: `${projectName} - Planning`,
          category: projectCategory,
          projectLead,
          dueDate: format(new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000), "d-MMM"),
          status: "Not Started",
          priority: "High",
          phase: "Planning",
          percentComplete: 0,
          startDate: format(new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000), "d-MMM"),
          dependencies: ["0"], // Depends on Initiation
          deliverables: "Project plan, schedule, budget",
        },
        {
          task: `${projectName} - Execution`,
          category: projectCategory,
          projectLead,
          dueDate: format(new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000), "d-MMM"),
          status: "Not Started",
          priority: "Medium",
          phase: "Execution",
          percentComplete: 0,
          startDate: format(new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000), "d-MMM"),
          dependencies: ["1"], // Depends on Planning
          deliverables: "Working deliverables",
        },
        {
          task: `${projectName} - Monitoring & Controlling`,
          category: projectCategory,
          projectLead,
          dueDate: formattedEndDate,
          status: "Not Started",
          priority: "Medium",
          phase: "Monitoring",
          percentComplete: 0,
          startDate: format(new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000), "d-MMM"),
          dependencies: ["1"], // Depends on Planning
          deliverables: "Status reports, change requests",
        },
        {
          task: `${projectName} - Closure`,
          category: projectCategory,
          projectLead,
          dueDate: formattedEndDate,
          status: "Not Started",
          priority: "Low",
          phase: "Closure",
          percentComplete: 0,
          startDate: format(new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000), "d-MMM"),
          dependencies: ["2", "3"], // Depends on Execution and Monitoring
          deliverables: "Final deliverables, lessons learned",
        },
      ]
    } else if (templateType === "waterfall") {
      // Waterfall project template
      projects = [
        {
          task: `${projectName} - Requirements`,
          category: projectCategory,
          projectLead,
          dueDate: format(new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000), "d-MMM"),
          status: "Not Started",
          priority: "High",
          phase: "Requirements",
          percentComplete: 0,
          startDate: formattedStartDate,
          deliverables: "Requirements document",
        },
        {
          task: `${projectName} - Design`,
          category: projectCategory,
          projectLead,
          dueDate: format(new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000), "d-MMM"),
          status: "Not Started",
          priority: "High",
          phase: "Design",
          percentComplete: 0,
          startDate: format(new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000), "d-MMM"),
          dependencies: ["0"], // Depends on Requirements
          deliverables: "Design documents",
        },
        {
          task: `${projectName} - Implementation`,
          category: projectCategory,
          projectLead,
          dueDate: format(new Date(startDate.getTime() + 28 * 24 * 60 * 60 * 1000), "d-MMM"),
          status: "Not Started",
          priority: "Medium",
          phase: "Implementation",
          percentComplete: 0,
          startDate: format(new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000), "d-MMM"),
          dependencies: ["1"], // Depends on Design
          deliverables: "Code, components",
        },
        {
          task: `${projectName} - Testing`,
          category: projectCategory,
          projectLead,
          dueDate: format(new Date(startDate.getTime() + 35 * 24 * 60 * 60 * 1000), "d-MMM"),
          status: "Not Started",
          priority: "Medium",
          phase: "Testing",
          percentComplete: 0,
          startDate: format(new Date(startDate.getTime() + 28 * 24 * 60 * 60 * 1000), "d-MMM"),
          dependencies: ["2"], // Depends on Implementation
          deliverables: "Test reports, bug fixes",
        },
        {
          task: `${projectName} - Deployment`,
          category: projectCategory,
          projectLead,
          dueDate: formattedEndDate,
          status: "Not Started",
          priority: "High",
          phase: "Deployment",
          percentComplete: 0,
          startDate: format(new Date(startDate.getTime() + 35 * 24 * 60 * 60 * 1000), "d-MMM"),
          dependencies: ["3"], // Depends on Testing
          deliverables: "Production release",
        },
      ]
    } else if (templateType === "agile") {
      // Agile project template
      projects = [
        {
          task: `${projectName} - Sprint Planning`,
          category: projectCategory,
          projectLead,
          dueDate: format(new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000), "d-MMM"),
          status: "Not Started",
          priority: "High",
          phase: "Sprint 1",
          percentComplete: 0,
          startDate: formattedStartDate,
          deliverables: "Sprint backlog",
        },
        {
          task: `${projectName} - User Story 1`,
          category: projectCategory,
          projectLead,
          dueDate: format(new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000), "d-MMM"),
          status: "Not Started",
          priority: "Medium",
          phase: "Sprint 1",
          percentComplete: 0,
          startDate: format(new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000), "d-MMM"),
          dependencies: ["0"], // Depends on Sprint Planning
          deliverables: "Working feature",
          storyPoints: 5,
        },
        {
          task: `${projectName} - User Story 2`,
          category: projectCategory,
          projectLead,
          dueDate: format(new Date(startDate.getTime() + 12 * 24 * 60 * 60 * 1000), "d-MMM"),
          status: "Not Started",
          priority: "Medium",
          phase: "Sprint 1",
          percentComplete: 0,
          startDate: format(new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000), "d-MMM"),
          dependencies: ["1"], // Depends on User Story 1
          deliverables: "Working feature",
          storyPoints: 3,
        },
        {
          task: `${projectName} - Sprint Review`,
          category: projectCategory,
          projectLead,
          dueDate: format(new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000), "d-MMM"),
          status: "Not Started",
          priority: "High",
          phase: "Sprint 1",
          percentComplete: 0,
          startDate: format(new Date(startDate.getTime() + 12 * 24 * 60 * 60 * 1000), "d-MMM"),
          dependencies: ["1", "2"], // Depends on User Stories
          deliverables: "Demo, feedback",
        },
        {
          task: `${projectName} - Sprint Retrospective`,
          category: projectCategory,
          projectLead,
          dueDate: format(new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000), "d-MMM"),
          status: "Not Started",
          priority: "Medium",
          phase: "Sprint 1",
          percentComplete: 0,
          startDate: format(new Date(startDate.getTime() + 13 * 24 * 60 * 60 * 1000), "d-MMM"),
          dependencies: ["3"], // Depends on Sprint Review
          deliverables: "Action items",
        },
      ]
    } else if (templateType === "simple") {
      // Simple task list template
      projects = [
        {
          task: projectName,
          category: projectCategory,
          projectLead,
          dueDate: formattedEndDate,
          status: "Not Started",
          priority: "Medium",
          percentComplete: 0,
          startDate: formattedStartDate,
          deliverables: "Project deliverables",
        },
      ]
    }

    // Create the projects
    onCreateFromTemplate(projects)

    // Close the dialog
    setOpen(false)

    // Reset form
    setProjectName("")
    setProjectCategory("")
    setProjectLead("")
    setStartDate(new Date())
    setEndDate(undefined)
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <FileText className="mr-2 h-4 w-4" /> Templates
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Project from Template</DialogTitle>
            <DialogDescription>
              Choose a template and customize it to create a new project or set of tasks.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="generic" onValueChange={(value) => setTemplateType(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="generic">Generic</TabsTrigger>
              <TabsTrigger value="waterfall">Waterfall</TabsTrigger>
              <TabsTrigger value="agile">Agile</TabsTrigger>
              <TabsTrigger value="simple">Simple</TabsTrigger>
            </TabsList>

            <TabsContent value="generic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Generic Project Plan</h3>
                <p className="text-sm text-muted-foreground">
                  A standard project plan with initiation, planning, execution, monitoring, and closure phases.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-category">Category</Label>
                  <Input
                    id="project-category"
                    value={projectCategory}
                    onChange={(e) => setProjectCategory(e.target.value)}
                    placeholder="Enter project category"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-lead">Project Lead</Label>
                  <Input
                    id="project-lead"
                    value={projectLead}
                    onChange={(e) => setProjectLead(e.target.value)}
                    placeholder="Enter project lead"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Timeline</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="start-date" className="sr-only">
                        Start Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="start-date"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : "Start date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="end-date" className="sr-only">
                        End Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="end-date"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !endDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : "End date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Tasks Created:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Project Initiation</li>
                  <li>Project Planning</li>
                  <li>Project Execution</li>
                  <li>Monitoring & Controlling</li>
                  <li>Project Closure</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="waterfall" className="space-y-4 mt-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Waterfall Project</h3>
                <p className="text-sm text-muted-foreground">
                  A sequential project approach with requirements, design, implementation, testing, and deployment
                  phases.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name-waterfall">Project Name</Label>
                  <Input
                    id="project-name-waterfall"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-category-waterfall">Category</Label>
                  <Input
                    id="project-category-waterfall"
                    value={projectCategory}
                    onChange={(e) => setProjectCategory(e.target.value)}
                    placeholder="Enter project category"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-lead-waterfall">Project Lead</Label>
                  <Input
                    id="project-lead-waterfall"
                    value={projectLead}
                    onChange={(e) => setProjectLead(e.target.value)}
                    placeholder="Enter project lead"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Timeline</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="start-date-waterfall" className="sr-only">
                        Start Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="start-date-waterfall"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : "Start date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="end-date-waterfall" className="sr-only">
                        End Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="end-date-waterfall"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !endDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : "End date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Tasks Created:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Requirements</li>
                  <li>Design</li>
                  <li>Implementation</li>
                  <li>Testing</li>
                  <li>Deployment</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="agile" className="space-y-4 mt-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Agile Sprint</h3>
                <p className="text-sm text-muted-foreground">
                  An agile sprint with planning, user stories, review, and retrospective.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name-agile">Project Name</Label>
                  <Input
                    id="project-name-agile"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-category-agile">Category</Label>
                  <Input
                    id="project-category-agile"
                    value={projectCategory}
                    onChange={(e) => setProjectCategory(e.target.value)}
                    placeholder="Enter project category"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-lead-agile">Project Lead</Label>
                  <Input
                    id="project-lead-agile"
                    value={projectLead}
                    onChange={(e) => setProjectLead(e.target.value)}
                    placeholder="Enter project lead"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Timeline</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="start-date-agile" className="sr-only">
                        Start Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="start-date-agile"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : "Start date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="end-date-agile" className="sr-only">
                        End Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="end-date-agile"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !endDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : "End date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Tasks Created:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Sprint Planning</li>
                  <li>User Story 1</li>
                  <li>User Story 2</li>
                  <li>Sprint Review</li>
                  <li>Sprint Retrospective</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="simple" className="space-y-4 mt-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Simple Task</h3>
                <p className="text-sm text-muted-foreground">A single task with basic information.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name-simple">Task Name</Label>
                  <Input
                    id="project-name-simple"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter task name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-category-simple">Category</Label>
                  <Input
                    id="project-category-simple"
                    value={projectCategory}
                    onChange={(e) => setProjectCategory(e.target.value)}
                    placeholder="Enter task category"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-lead-simple">Assigned To</Label>
                  <Input
                    id="project-lead-simple"
                    value={projectLead}
                    onChange={(e) => setProjectLead(e.target.value)}
                    placeholder="Enter assignee"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Timeline</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="start-date-simple" className="sr-only">
                        Start Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="start-date-simple"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : "Start date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="end-date-simple" className="sr-only">
                        End Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="end-date-simple"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !endDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : "End date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Tasks Created:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Single task with the specified details</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFromTemplate}>
              <Plus className="mr-2 h-4 w-4" /> Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
