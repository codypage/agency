"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EnhancedTaskCard } from "./enhanced-task-card"
import { TaskDetailsDialog } from "./task-details-dialog"
import { TaskKanbanBoard } from "./task-kanban-board"
import { TaskTimeline } from "./task-timeline"
import { TaskCalendar } from "./task-calendar"
import { CreateTaskDialog } from "./create-task-dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Search,
  CalendarDays,
  LayoutGrid,
  List,
  TimerIcon as Timeline,
  Download,
  SlidersHorizontal,
  AlertCircle,
  Users,
  User,
  Clock,
  ArrowUpDown,
  CircleAlert,
  BarChart4,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loading } from "@/components/ui/loading"

// Import the useTranslation hook at the top of the file
import { useTranslation } from "@/hooks/use-translation"

// Mock data for tasks (same as in project-task-list.tsx)
const mockTasks = [
  {
    id: "T-001",
    title: "Functional Assessment Service Setup",
    description: "Build CPT 97151 service with dropdown fields for assessments",
    status: "in-progress",
    priority: "high",
    assignedTo: { name: "Stacy", avatar: "/abstract-s-design.png" },
    team: "System-Build",
    dueDate: "2023-04-28",
    category: "System-Build",
    subcategory: "Functional Assessment",
    percentComplete: 60,
    estimatedHours: 8,
    actualHours: 5,
    attachments: 2,
    comments: 3,
  },
  {
    id: "T-002",
    title: "Treatment-Program Services Setup",
    description: "Build separate billable services for 97153, 97154, 97155, 97156, 97158",
    status: "not-started",
    priority: "high",
    assignedTo: { name: "Brittany", avatar: "/abstract-blue-burst.png" },
    team: "System-Build",
    dueDate: "2023-05-05",
    category: "System-Build",
    subcategory: "Treatment Program",
    percentComplete: 0,
    estimatedHours: 12,
    actualHours: 0,
    attachments: 1,
    comments: 0,
  },
  {
    id: "T-003",
    title: "Assessment Templates",
    description: "Provide assessment templates to attach (FAI, FAST, Vineland-3, GARS-3, etc.)",
    status: "completed",
    priority: "medium",
    assignedTo: { name: "Dakota", avatar: "/letter-d-floral.png" },
    team: "Clinical",
    dueDate: "2023-04-28",
    category: "Clinical",
    subcategory: "Assessments",
    percentComplete: 100,
    estimatedHours: 6,
    actualHours: 8,
    attachments: 5,
    comments: 7,
  },
  {
    id: "T-004",
    title: "Authorization Matrix",
    description: "Create spreadsheet for tracking auth dates, CPT codes, units requested/remaining",
    status: "in-progress",
    priority: "medium",
    assignedTo: { name: "Bill", avatar: "/abstract-blue-burst.png" },
    team: "Billing",
    dueDate: "2023-05-05",
    category: "Billing",
    subcategory: "Authorizations",
    percentComplete: 45,
    estimatedHours: 10,
    actualHours: 6,
    attachments: 3,
    comments: 5,
  },
  {
    id: "T-005",
    title: "Job Descriptions",
    description: "Create job descriptions for IIS Provider and BCBA/Autism Specialist roles",
    status: "in-progress",
    priority: "medium",
    assignedTo: { name: "Amy", avatar: "/letter-a-abstract.png" },
    team: "HR & Training",
    dueDate: "2023-05-05",
    category: "HR",
    subcategory: "Job Descriptions",
    percentComplete: 30,
    estimatedHours: 4,
    actualHours: 2,
    attachments: 0,
    comments: 2,
  },
  {
    id: "T-006",
    title: "Cost-Center Codes",
    description: "Confirm cost-center codes and billing flows in Netsmart",
    status: "completed",
    priority: "high",
    assignedTo: { name: "David", avatar: "/letter-d-floral.png" },
    team: "Leadership",
    dueDate: "2023-04-21",
    category: "Leadership",
    subcategory: "Operations",
    percentComplete: 100,
    estimatedHours: 3,
    actualHours: 2,
    attachments: 1,
    comments: 0,
  },
  {
    id: "T-007",
    title: "Referral Intake Form",
    description: "Create service/form for referral intake with PDF upload capability",
    status: "not-started",
    priority: "high",
    assignedTo: { name: "Stacy", avatar: "/abstract-s-design.png" },
    team: "System-Build",
    dueDate: "2023-05-12",
    category: "System-Build",
    subcategory: "Attachments & Workflows",
    percentComplete: 0,
    estimatedHours: 8,
    actualHours: 0,
    attachments: 0,
    comments: 1,
  },
  {
    id: "T-008",
    title: "Treatment Plan Templates",
    description: "Identify required fields per payor (Sunflower, Optum, BCBS)",
    status: "in-progress",
    priority: "medium",
    assignedTo: { name: "Jaden", avatar: "/abstract-letter-j.png" },
    team: "Clinical",
    dueDate: "2023-04-28",
    category: "Clinical",
    subcategory: "Treatment Plans",
    percentComplete: 75,
    estimatedHours: 5,
    actualHours: 4,
    attachments: 2,
    comments: 4,
  },
]

// Add more mock tasks with different assignees, teams, and categories
const additionalMockTasks = [
  {
    id: "T-009",
    title: "Staff Training Module",
    description: "Develop online training module for new clinical staff",
    status: "in-progress",
    priority: "medium",
    assignedTo: { name: "Emily", avatar: "/abstract-geometric.png" },
    team: "Training",
    dueDate: "2023-05-15",
    category: "Training",
    subcategory: "Online Learning",
    percentComplete: 35,
    estimatedHours: 20,
    actualHours: 8,
    attachments: 4,
    comments: 6,
  },
  {
    id: "T-010",
    title: "Client Portal Setup",
    description: "Configure client portal access and permissions",
    status: "not-started",
    priority: "high",
    assignedTo: { name: "Jason", avatar: "/abstract-aj.png" },
    team: "IT",
    dueDate: "2023-05-20",
    category: "IT",
    subcategory: "Client Access",
    percentComplete: 0,
    estimatedHours: 15,
    actualHours: 0,
    attachments: 1,
    comments: 2,
  },
  {
    id: "T-011",
    title: "Billing Integration Testing",
    description: "Test integration between EHR and billing system",
    status: "in-progress",
    priority: "high",
    assignedTo: { name: "Sarah", avatar: "/abstract-geometric-sm.png" },
    team: "Billing",
    dueDate: "2023-05-10",
    category: "Billing",
    subcategory: "System Integration",
    percentComplete: 50,
    estimatedHours: 12,
    actualHours: 7,
    attachments: 2,
    comments: 8,
  },
  {
    id: "T-012",
    title: "Quality Assurance Checklist",
    description: "Develop QA checklist for clinical documentation review",
    status: "completed",
    priority: "medium",
    assignedTo: { name: "Michael", avatar: "/abstract-geometric-lt.png" },
    team: "Clinical",
    dueDate: "2023-04-25",
    category: "Clinical",
    subcategory: "Quality Assurance",
    percentComplete: 100,
    estimatedHours: 6,
    actualHours: 5,
    attachments: 3,
    comments: 4,
  },
]

// Combine all mock tasks
const allMockTasks = [...mockTasks, ...additionalMockTasks]

// Add the hook inside the component function
export function TaskHub() {
  const { t } = useTranslation("tasks")

  const [viewMode, setViewMode] = useState<"list" | "kanban" | "timeline" | "calendar">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTask, setSelectedTask] = useState<(typeof allMockTasks)[0] | null>(null)
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false)
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [teamFilter, setTeamFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [expandedFilters, setExpandedFilters] = useState(false)
  const [assigneeFilter, setAssigneeFilter] = useState<string[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])
  const [sortField, setSortField] = useState<string>("dueDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [activeTab, setActiveTab] = useState<string>("all")

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Extract unique teams, assignees, and categories for filtering
  const teams = Array.from(new Set(allMockTasks.map((task) => task.team)))
  const assignees = Array.from(new Set(allMockTasks.map((task) => task.assignedTo.name)))
  const categories = Array.from(new Set(allMockTasks.map((task) => task.category)))

  // Count tasks by status for metrics
  const taskStatusCounts = {
    total: allMockTasks.length,
    notStarted: allMockTasks.filter((task) => task.status === "not-started").length,
    inProgress: allMockTasks.filter((task) => task.status === "in-progress").length,
    completed: allMockTasks.filter((task) => task.status === "completed").length,
  }

  // Filter tasks based on search query and filters
  const filteredTasks = useMemo(() => {
    return allMockTasks
      .filter((task) => {
        const matchesSearch =
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.assignedTo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.id.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === "all" || task.status === statusFilter
        const matchesTeam = teamFilter === "all" || task.team === teamFilter
        const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
        const matchesAssignee = assigneeFilter.length === 0 || assigneeFilter.includes(task.assignedTo.name)
        const matchesCategory = categoryFilter.length === 0 || categoryFilter.includes(task.category)
        const matchesTab =
          activeTab === "all" ||
          (activeTab === "my-tasks" && task.assignedTo.name === "Stacy") || // Assuming current user is Stacy
          (activeTab === "team-tasks" && task.team === "System-Build") || // Assuming current team is System-Build
          (activeTab === "overdue" && new Date(task.dueDate) < new Date() && task.status !== "completed") ||
          (activeTab === "upcoming" &&
            new Date(task.dueDate) >= new Date() &&
            new Date(task.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))

        return (
          matchesSearch &&
          matchesStatus &&
          matchesTeam &&
          matchesPriority &&
          matchesAssignee &&
          matchesCategory &&
          matchesTab
        )
      })
      .sort((a, b) => {
        // Handle sorting
        if (sortField === "dueDate") {
          return sortDirection === "asc"
            ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
        } else if (sortField === "priority") {
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return sortDirection === "asc"
            ? priorityOrder[a.priority as keyof typeof priorityOrder] -
                priorityOrder[b.priority as keyof typeof priorityOrder]
            : priorityOrder[b.priority as keyof typeof priorityOrder] -
                priorityOrder[a.priority as keyof typeof priorityOrder]
        } else if (sortField === "percentComplete") {
          return sortDirection === "asc"
            ? (a.percentComplete || 0) - (b.percentComplete || 0)
            : (b.percentComplete || 0) - (a.percentComplete || 0)
        }
        // Default sort by title
        return sortDirection === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      })
  }, [
    searchQuery,
    statusFilter,
    teamFilter,
    priorityFilter,
    assigneeFilter,
    categoryFilter,
    sortField,
    sortDirection,
    activeTab,
  ])

  const openTaskDetails = (task: (typeof allMockTasks)[0]) => {
    setSelectedTask(task)
    setIsTaskDetailsOpen(true)
  }

  const handleCreateTask = () => {
    setIsCreateTaskOpen(true)
  }

  // Task stats for overview cards
  const getCompletionPercentage = () => {
    if (taskStatusCounts.total === 0) return 0
    return Math.round((taskStatusCounts.completed / taskStatusCounts.total) * 100)
  }

  // Function to render appropriate skeleton based on view mode
  const renderLoadingSkeleton = () => {
    switch (viewMode) {
      case "list":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="shadow-sm">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-1/4 mb-2" />
                  <Skeleton className="h-5 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-4 w-5/6 mb-6" />
                  <Skeleton className="h-2 w-full mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      case "kanban":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-24 mb-3 w-full" />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )
      default:
        return <Skeleton className="h-96 w-full" />
    }
  }

  // Function to toggle sort direction or change sort field
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field and default to ascending
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Get sort indicator
  const getSortIndicator = (field: string) => {
    if (sortField !== field) return null

    return <ArrowUpDown className={cn("h-3 w-3 ml-1", sortDirection === "asc" ? "rotate-0" : "rotate-180")} />
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button className="flex-1 md:flex-none" onClick={handleCreateTask}>
            <Plus className="mr-2 h-4 w-4" /> {t("create")}
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Task overview metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col">
            <div className="text-sm font-medium text-muted-foreground">Total Tasks</div>
            {isLoading ? (
              <Skeleton className="h-9 w-16 mt-1" />
            ) : (
              <div className="text-3xl font-bold">{taskStatusCounts.total}</div>
            )}
            <div className="mt-2 text-xs text-muted-foreground">
              {filteredTasks.length} showing with current filters
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col">
            <div className="text-sm font-medium text-muted-foreground">Not Started</div>
            {isLoading ? (
              <Skeleton className="h-9 w-16 mt-1" />
            ) : (
              <div className="text-3xl font-bold text-slate-700">{taskStatusCounts.notStarted}</div>
            )}
            <div className="mt-2 text-xs">
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                {Math.round((taskStatusCounts.notStarted / taskStatusCounts.total) * 100)}% of total
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col">
            <div className="text-sm font-medium text-muted-foreground">In Progress</div>
            {isLoading ? (
              <Skeleton className="h-9 w-16 mt-1" />
            ) : (
              <div className="text-3xl font-bold text-blue-700">{taskStatusCounts.inProgress}</div>
            )}
            <div className="mt-2 text-xs">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {Math.round((taskStatusCounts.inProgress / taskStatusCounts.total) * 100)}% of total
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col">
            <div className="text-sm font-medium text-muted-foreground">Completed</div>
            {isLoading ? (
              <Skeleton className="h-9 w-16 mt-1" />
            ) : (
              <div className="text-3xl font-bold text-green-700">{taskStatusCounts.completed}</div>
            )}
            <div className="mt-2 text-xs">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {getCompletionPercentage()}% completion rate
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <BarChart4 className="h-4 w-4" />
            <span>{t("filter.all")}</span>
          </TabsTrigger>
          <TabsTrigger value="my-tasks" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{t("filter.myTasks")}</span>
          </TabsTrigger>
          <TabsTrigger value="team-tasks" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{t("filter.teamTasks")}</span>
          </TabsTrigger>
          <TabsTrigger value="overdue" className="flex items-center gap-2">
            <CircleAlert className="h-4 w-4" />
            <span>{t("filter.overdue")}</span>
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{t("filter.upcoming")}</span>
          </TabsTrigger>
        </TabsList>

        {/* Filters */}
        <Card>
          <CardHeader className={expandedFilters ? "pb-2" : "pb-3"}>
            <div className="flex justify-between items-center">
              <CardTitle>Task Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setExpandedFilters(!expandedFilters)}>
                {expandedFilters ? "Simple View" : "Advanced Filters"}
              </Button>
            </div>
            {!expandedFilters && <CardDescription>Filter tasks by status, team, or priority</CardDescription>}
          </CardHeader>
          <CardContent className={expandedFilters ? "space-y-4" : ""}>
            <div className="flex flex-col md:flex-row gap-4">
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

              <div className="flex flex-wrap gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={teamFilter} onValueChange={setTeamFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teams</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team} value={team}>
                        {team}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Additional Filters</h4>
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Assignee</h5>
                        <ScrollArea className="h-[120px]">
                          <div className="grid grid-cols-2 gap-2">
                            {assignees.map((assignee) => (
                              <div key={assignee} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`assignee-${assignee}`}
                                  checked={assigneeFilter.includes(assignee)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setAssigneeFilter([...assigneeFilter, assignee])
                                    } else {
                                      setAssigneeFilter(assigneeFilter.filter((a) => a !== assignee))
                                    }
                                  }}
                                />
                                <Label htmlFor={`assignee-${assignee}`}>{assignee}</Label>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Categories</h5>
                        <ScrollArea className="h-[120px]">
                          <div className="grid grid-cols-2 gap-2">
                            {categories.map((category) => (
                              <div key={category} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`category-${category}`}
                                  checked={categoryFilter.includes(category)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setCategoryFilter([...categoryFilter, category])
                                    } else {
                                      setCategoryFilter(categoryFilter.filter((c) => c !== category))
                                    }
                                  }}
                                />
                                <Label htmlFor={`category-${category}`}>{category}</Label>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {expandedFilters && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Sort By</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={sortField === "dueDate" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSort("dueDate")}
                      className="flex items-center"
                    >
                      Due Date {getSortIndicator("dueDate")}
                    </Button>
                    <Button
                      variant={sortField === "priority" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSort("priority")}
                      className="flex items-center"
                    >
                      Priority {getSortIndicator("priority")}
                    </Button>
                    <Button
                      variant={sortField === "percentComplete" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSort("percentComplete")}
                      className="flex items-center"
                    >
                      Progress {getSortIndicator("percentComplete")}
                    </Button>
                    <Button
                      variant={sortField === "title" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSort("title")}
                      className="flex items-center"
                    >
                      Title {getSortIndicator("title")}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">{filteredTasks.length} tasks found</div>

              <div className="bg-muted p-1 rounded-md flex">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className="h-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4 mr-1" /> List
                </Button>
                <Button
                  variant={viewMode === "kanban" ? "default" : "ghost"}
                  size="sm"
                  className="h-8"
                  onClick={() => setViewMode("kanban")}
                >
                  <LayoutGrid className="h-4 w-4 mr-1" /> Kanban
                </Button>
                <Button
                  variant={viewMode === "timeline" ? "default" : "ghost"}
                  size="sm"
                  className="h-8"
                  onClick={() => setViewMode("timeline")}
                >
                  <Timeline className="h-4 w-4 mr-1" /> Timeline
                </Button>
                <Button
                  variant={viewMode === "calendar" ? "default" : "ghost"}
                  size="sm"
                  className="h-8"
                  onClick={() => setViewMode("calendar")}
                >
                  <CalendarDays className="h-4 w-4 mr-1" /> Calendar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task Views */}
        {isLoading ? (
          <Loading variant="skeleton" count={3} />
        ) : filteredTasks.length === 0 ? (
          <Card className="p-8 flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">{t("empty")}</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              {searchQuery
                ? "No tasks match your search criteria"
                : statusFilter !== "all" ||
                    teamFilter !== "all" ||
                    priorityFilter !== "all" ||
                    assigneeFilter.length > 0 ||
                    categoryFilter.length > 0
                  ? "No tasks match the selected filters"
                  : "No tasks found"}
            </p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setStatusFilter("all")
                setTeamFilter("all")
                setPriorityFilter("all")
                setAssigneeFilter([])
                setCategoryFilter([])
                setActiveTab("all")
              }}
            >
              Reset Filters
            </Button>
          </Card>
        ) : (
          <>
            {viewMode === "list" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTasks.map((task) => (
                  <EnhancedTaskCard
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    status={task.status as any}
                    priority={task.priority as any}
                    assignedTo={task.assignedTo}
                    dueDate={task.dueDate}
                    percentComplete={task.percentComplete}
                    estimatedHours={task.estimatedHours}
                    actualHours={task.actualHours}
                    attachments={task.attachments}
                    comments={task.comments}
                    onClick={() => openTaskDetails(task)}
                  />
                ))}
              </div>
            )}

            {viewMode === "kanban" && <TaskKanbanBoard tasks={filteredTasks} onTaskClick={openTaskDetails} />}

            {viewMode === "timeline" && <TaskTimeline tasks={filteredTasks} onTaskClick={openTaskDetails} />}

            {viewMode === "calendar" && <TaskCalendar tasks={filteredTasks} onTaskClick={openTaskDetails} />}
          </>
        )}
      </Tabs>

      {/* Task Details Dialog */}
      {selectedTask && (
        <TaskDetailsDialog task={selectedTask} open={isTaskDetailsOpen} onOpenChange={setIsTaskDetailsOpen} />
      )}

      {/* Create Task Dialog */}
      <CreateTaskDialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen} />
    </div>
  )
}
