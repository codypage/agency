export interface AdminProject {
  id: string
  task: string
  furtherBreakdown?: string
  projectLead?: string
  poc?: string
  dueDate?: string
  status: "Not Started" | "In Progress" | "Completed" | "On Hold"
  implemented?: string
  checkedBy?: string
  reportsDataUsed?: string
  results?: string
  communicatedBy?: string
  category?: string
  // New fields for enhanced functionality
  priority?: "High" | "Medium" | "Low"
  dependencies?: string[] // IDs of tasks this task depends on
  percentComplete?: number // 0-100
  startDate?: string
  estimatedHours?: number
  actualHours?: number
  deliverables?: string
  reportingMetrics?: string
  templateId?: string // Reference to a template if created from one
  phase?: string // For waterfall methodology
  epicId?: string // For agile methodology
  storyPoints?: number // For agile methodology
}
