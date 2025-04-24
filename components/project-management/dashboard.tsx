"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle2, Clock, FileText, Filter, Plus, Search, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ProjectTaskList } from "./project-task-list"
import { TeamView } from "./team-view"
import { CreateTaskDialog } from "./create-task-dialog"

export function ProjectManagementDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)

  // Project summary data
  const projectData = {
    name: "Autism Program Implementation",
    progress: 35,
    startDate: "2023-04-01",
    endDate: "2023-08-15",
    tasks: {
      total: 42,
      completed: 15,
      inProgress: 18,
      notStarted: 9,
    },
    teams: [
      { name: "System-Build", lead: "Stacy", members: 2, tasksAssigned: 12, tasksCompleted: 4 },
      { name: "Clinical", lead: "Dakota", members: 2, tasksAssigned: 10, tasksCompleted: 3 },
      { name: "Billing", lead: "Bill", members: 2, tasksAssigned: 8, tasksCompleted: 3 },
      { name: "HR & Training", lead: "Amy", members: 2, tasksAssigned: 7, tasksCompleted: 2 },
      { name: "Leadership", lead: "David", members: 2, tasksAssigned: 5, tasksCompleted: 3 },
    ],
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{projectData.name}</h1>
          <p className="text-muted-foreground">
            {new Date(projectData.startDate).toLocaleDateString()} -{" "}
            {new Date(projectData.endDate).toLocaleDateString()}
          </p>
        </div>
        <Button onClick={() => setIsCreateTaskOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Task
        </Button>
      </div>

      {/* Project Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Project Progress</CardTitle>
          <CardDescription>Overall completion: {projectData.progress}%</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={projectData.progress} className="h-2" />

          <div className="grid grid-cols-4 gap-4 mt-6">
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold">{projectData.tasks.total}</div>
                <p className="text-muted-foreground text-sm">Total Tasks</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center bg-green-50">
                <div className="text-3xl font-bold text-green-600">{projectData.tasks.completed}</div>
                <p className="text-green-600 text-sm">Completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center bg-blue-50">
                <div className="text-3xl font-bold text-blue-600">{projectData.tasks.inProgress}</div>
                <p className="text-blue-600 text-sm">In Progress</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center bg-gray-50">
                <div className="text-3xl font-bold text-gray-600">{projectData.tasks.notStarted}</div>
                <p className="text-gray-600 text-sm">Not Started</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks">
            <FileText className="mr-2 h-4 w-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="teams">
            <Users className="mr-2 h-4 w-4" />
            Teams
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <Calendar className="mr-2 h-4 w-4" />
            Timeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <ProjectTaskList searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="teams">
          <TeamView teams={projectData.teams} />
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>Key milestones and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Initial Planning Complete</p>
                    <p className="text-sm text-muted-foreground">April 15, 2023</p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    Completed
                  </Badge>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">System Build Draft Service Definitions</p>
                    <p className="text-sm text-muted-foreground">April 28, 2023</p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    In Progress
                  </Badge>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Mock "Incredible Test" Dry Run</p>
                    <p className="text-sm text-muted-foreground">May 12, 2023</p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    Upcoming
                  </Badge>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <Clock className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Go-Live Preparation</p>
                    <p className="text-sm text-muted-foreground">July 15, 2023</p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    Not Started
                  </Badge>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <CheckCircle2 className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Program Launch</p>
                    <p className="text-sm text-muted-foreground">August 1, 2023</p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    Not Started
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Task Dialog */}
      <CreateTaskDialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen} />
    </div>
  )
}
