import type { UserStory } from "@/components/development/user-story-mapping"

export const userStories: UserStory[] = [
  {
    id: "US-001",
    title: "View Task List",
    description: "As a user, I want to view a list of all tasks so that I can see what needs to be done.",
    acceptanceCriteria: [
      "Tasks should be displayed in a list format",
      "Each task should show title, status, priority, and assignee",
      "Tasks should be sortable by different criteria",
      "Tasks should be filterable by status, priority, and assignee",
    ],
    priority: "high",
    status: "implemented",
    epic: "Task Management",
    components: ["TaskHub", "EnhancedTaskCard"],
  },
  {
    id: "US-002",
    title: "Create New Task",
    description: "As a user, I want to create a new task so that I can assign work to team members.",
    acceptanceCriteria: [
      "Form should include fields for title, description, assignee, priority, and due date",
      "Form should validate required fields",
      "User should receive confirmation when task is created",
      "New task should appear in the task list immediately",
    ],
    priority: "high",
    status: "implemented",
    epic: "Task Management",
    components: ["CreateTaskDialog", "TaskHub"],
  },
  {
    id: "US-003",
    title: "View Task Details",
    description:
      "As a user, I want to view detailed information about a task so that I can understand what needs to be done.",
    acceptanceCriteria: [
      "Task details should include all task information",
      "Task details should be accessible by clicking on a task in the list",
      "Task details should be displayed in a modal dialog",
    ],
    priority: "medium",
    status: "implemented",
    epic: "Task Management",
    components: ["TaskDetailsDialog", "EnhancedTaskCard"],
  },
  {
    id: "US-004",
    title: "Edit Task",
    description: "As a user, I want to edit a task so that I can update its details as requirements change.",
    acceptanceCriteria: [
      "All task fields should be editable",
      "Form should validate required fields",
      "User should receive confirmation when task is updated",
      "Task list should reflect changes immediately",
    ],
    priority: "medium",
    status: "in-progress",
    epic: "Task Management",
    components: ["TaskDetailsDialog", "TaskHub"],
  },
  {
    id: "US-005",
    title: "Delete Task",
    description: "As a user, I want to delete a task so that I can remove tasks that are no longer needed.",
    acceptanceCriteria: [
      "User should be prompted to confirm deletion",
      "User should receive confirmation when task is deleted",
      "Task should be removed from the list immediately",
    ],
    priority: "low",
    status: "planned",
    epic: "Task Management",
    components: ["TaskDetailsDialog", "TaskHub"],
  },
  {
    id: "US-006",
    title: "View Tasks in Kanban Board",
    description: "As a user, I want to view tasks in a Kanban board so that I can visualize workflow.",
    acceptanceCriteria: [
      "Tasks should be grouped by status",
      "User should be able to drag and drop tasks between statuses",
      "Board should update in real-time when tasks are moved",
    ],
    priority: "high",
    status: "implemented",
    epic: "Task Visualization",
    components: ["TaskKanbanBoard", "TaskHub"],
  },
  {
    id: "US-007",
    title: "View Tasks in Timeline",
    description: "As a user, I want to view tasks in a timeline so that I can see when tasks are due.",
    acceptanceCriteria: [
      "Tasks should be displayed on a timeline based on due date",
      "Timeline should be zoomable and pannable",
      "Tasks should be color-coded by status or priority",
    ],
    priority: "medium",
    status: "implemented",
    epic: "Task Visualization",
    components: ["TaskTimeline", "TaskHub"],
  },
  {
    id: "US-008",
    title: "View Tasks in Calendar",
    description: "As a user, I want to view tasks in a calendar so that I can see what's due on specific days.",
    acceptanceCriteria: [
      "Tasks should be displayed on a calendar based on due date",
      "Calendar should show day, week, and month views",
      "Tasks should be clickable to view details",
    ],
    priority: "medium",
    status: "implemented",
    epic: "Task Visualization",
    components: ["TaskCalendar", "TaskHub"],
  },
  {
    id: "US-009",
    title: "Submit Authorization Request",
    description:
      "As a clinical staff member, I want to submit authorization requests so that I can get approval for services.",
    acceptanceCriteria: [
      "Form should include fields for client, service, units, and dates",
      "Form should validate required fields",
      "User should receive confirmation when request is submitted",
      "Request should be tracked in the system",
    ],
    priority: "high",
    status: "implemented",
    epic: "Authorization Management",
    components: ["AuthorizationRequestWizard", "AuthorizationDashboard"],
  },
  {
    id: "US-010",
    title: "Track Authorization Status",
    description:
      "As a billing specialist, I want to track authorization status so that I can ensure services are billable.",
    acceptanceCriteria: [
      "Authorizations should be displayed in a list with status",
      "List should be filterable by status, client, and service",
      "List should be sortable by different criteria",
      "Detailed view should show all authorization information",
    ],
    priority: "high",
    status: "implemented",
    epic: "Authorization Management",
    components: ["AuthorizationTable", "AuthorizationDashboard"],
  },
  {
    id: "US-011",
    title: "Generate Reports",
    description: "As a manager, I want to generate reports so that I can analyze program performance.",
    acceptanceCriteria: [
      "User should be able to select report type",
      "User should be able to set report parameters",
      "Reports should be downloadable in multiple formats",
      "Reports should include visualizations where appropriate",
    ],
    priority: "medium",
    status: "in-progress",
    epic: "Reporting",
    components: ["ReportsDashboard", "CustomReportBuilder"],
  },
  {
    id: "US-012",
    title: "Manage User Roles",
    description: "As an administrator, I want to manage user roles so that I can control access to the system.",
    acceptanceCriteria: [
      "Admin should be able to view all users",
      "Admin should be able to assign roles to users",
      "Admin should be able to create new roles",
      "Changes should take effect immediately",
    ],
    priority: "medium",
    status: "planned",
    epic: "Administration",
    components: ["AdminDashboard", "RoleSelector"],
  },
]

export const componentDetails = {
  TaskHub: {
    description: "Main component for task management that provides different views and filtering options",
    path: "components/project-management/task-hub.tsx",
  },
  EnhancedTaskCard: {
    description: "Card component that displays task information in a compact format",
    path: "components/project-management/enhanced-task-card.tsx",
  },
  CreateTaskDialog: {
    description: "Dialog for creating new tasks with form validation",
    path: "components/project-management/create-task-dialog.tsx",
  },
  TaskDetailsDialog: {
    description: "Dialog for viewing and editing task details",
    path: "components/project-management/task-details-dialog.tsx",
  },
  TaskKanbanBoard: {
    description: "Kanban board view for tasks grouped by status",
    path: "components/project-management/task-kanban-board.tsx",
  },
  TaskTimeline: {
    description: "Timeline view for tasks based on due dates",
    path: "components/project-management/task-timeline.tsx",
  },
  TaskCalendar: {
    description: "Calendar view for tasks based on due dates",
    path: "components/project-management/task-calendar.tsx",
  },
  AuthorizationRequestWizard: {
    description: "Step-by-step wizard for submitting authorization requests",
    path: "components/authorization/authorization-request-wizard.tsx",
  },
  AuthorizationDashboard: {
    description: "Dashboard for managing and tracking authorizations",
    path: "components/authorization/authorization-dashboard.tsx",
  },
  AuthorizationTable: {
    description: "Table component for displaying authorization data",
    path: "components/authorization/authorization-table.tsx",
  },
  ReportsDashboard: {
    description: "Dashboard for accessing and generating reports",
    path: "components/reports/reports-dashboard.tsx",
  },
  CustomReportBuilder: {
    description: "Interface for building custom reports with various parameters",
    path: "components/reports/custom-report-builder.tsx",
  },
  AdminDashboard: {
    description: "Dashboard for administrative functions",
    path: "components/admin/admin-dashboard.tsx",
  },
  RoleSelector: {
    description: "Component for selecting and managing user roles",
    path: "components/layout/role-selector.tsx",
  },
}

export const epicDetails = {
  "Task Management": {
    title: "Task Management",
    description: "Core functionality for creating, viewing, editing, and deleting tasks",
  },
  "Task Visualization": {
    title: "Task Visualization",
    description: "Different ways to visualize tasks including list, kanban, timeline, and calendar views",
  },
  "Authorization Management": {
    title: "Authorization Management",
    description: "Functionality for submitting, tracking, and managing service authorizations",
  },
  Reporting: {
    title: "Reporting",
    description: "Tools for generating and viewing reports on system data",
  },
  Administration: {
    title: "Administration",
    description: "Administrative functions for managing the system",
  },
}
