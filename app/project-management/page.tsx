import { Suspense } from "react"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { ProjectTaskList } from "@/components/project-management/project-task-list"
import { CreateTaskDialog } from "@/components/project-management/create-task-dialog"
import { TaskCalendar } from "@/components/project-management/task-calendar"
import { TaskKanbanBoard } from "@/components/project-management/task-kanban-board"
import { TaskTimeline } from "@/components/project-management/task-timeline"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function ProjectManagementPage() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <Breadcrumbs />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
          <p className="text-muted-foreground">
            Manage tasks and track progress for the Autism Program implementation.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <CreateTaskDialog />
        </div>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Task Views</CardTitle>
            <CardDescription>Choose how you want to view and manage your tasks.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="list">List</TabsTrigger>
                  <TabsTrigger value="kanban">Kanban</TabsTrigger>
                  <TabsTrigger value="calendar">Calendar</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search tasks..." className="pl-8 w-[200px] lg:w-[300px]" />
                </div>
              </div>

              <TabsContent value="list" className="mt-0">
                <Suspense fallback={<div>Loading tasks...</div>}>
                  <ProjectTaskList searchQuery="" />
                </Suspense>
              </TabsContent>

              <TabsContent value="kanban" className="mt-0">
                <Suspense fallback={<div>Loading kanban board...</div>}>
                  <TaskKanbanBoard />
                </Suspense>
              </TabsContent>

              <TabsContent value="calendar" className="mt-0">
                <Suspense fallback={<div>Loading calendar...</div>}>
                  <TaskCalendar />
                </Suspense>
              </TabsContent>

              <TabsContent value="timeline" className="mt-0">
                <Suspense fallback={<div>Loading timeline...</div>}>
                  <TaskTimeline />
                </Suspense>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
