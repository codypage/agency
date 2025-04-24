// Administrative departments and form configuration

// Define types for administrative configuration
interface Department {
  id: string
  name: string
  description: string
  icon: string // Lucide icon name
  color: string // Tailwind color class
  ticketCategory: string // Desk365 category for tickets
}

interface FormField {
  id: string
  label: string
  type: "text" | "textarea" | "select" | "multiselect" | "date" | "file" | "checkbox" | "radio"
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  helpText?: string
  validation?: {
    pattern?: string
    message?: string
    minLength?: number
    maxLength?: number
  }
}

interface FormTemplate {
  id: string
  name: string
  description: string
  departmentId: string
  fields: FormField[]
  ticketTemplate: {
    subject: string // Can include variables like {{field.name}}
    description: string // Template with variables
    priority: "low" | "medium" | "high"
    dueDate?: string // Can be calculated from submission date
    assignTo?: string // Default assignee
  }
}

interface ManualSection {
  id: string
  title: string
  departmentId: string
  icon: string
  items: ManualItem[]
}

interface ManualItem {
  id: string
  title: string
  description: string
  path: string // Path to the markdown content
  lastUpdated: string
  tags: string[]
}

// Departments configuration
const departments: Department[] = [
  {
    id: "administrative",
    name: "Administrative",
    description: "General administrative requests and processes",
    icon: "Building2",
    color: "bg-blue-100 text-blue-700",
    ticketCategory: "Administrative",
  },
  {
    id: "clinical",
    name: "Clinical",
    description: "Clinical documentation and treatment resources",
    icon: "Stethoscope",
    color: "bg-green-100 text-green-700",
    ticketCategory: "Clinical",
  },
  {
    id: "billing",
    name: "Billing",
    description: "Billing inquiries and claim submissions",
    icon: "Receipt",
    color: "bg-yellow-100 text-yellow-700",
    ticketCategory: "Billing",
  },
  {
    id: "it",
    name: "IT",
    description: "Technical support and system access",
    icon: "Laptop",
    color: "bg-purple-100 text-purple-700",
    ticketCategory: "IT Support",
  },
  {
    id: "training",
    name: "Training",
    description: "Training resources and certification requests",
    icon: "GraduationCap",
    color: "bg-pink-100 text-pink-700",
    ticketCategory: "Training",
  },
  {
    id: "hr",
    name: "HR",
    description: "HR requests and employee resources",
    icon: "Users",
    color: "bg-indigo-100 text-indigo-700",
    ticketCategory: "HR",
  },
  {
    id: "reporting",
    name: "Reporting",
    description: "Report requests and data analysis",
    icon: "BarChart3",
    color: "bg-rose-100 text-rose-700",
    ticketCategory: "Reporting",
  },
]

// Form templates
const formTemplates: FormTemplate[] = [
  // Administrative forms
  {
    id: "purchase-request",
    name: "Purchase Request",
    description: "Request to purchase supplies or equipment",
    departmentId: "administrative",
    fields: [
      {
        id: "item-description",
        label: "Item Description",
        type: "text",
        required: true,
        placeholder: "Describe the item(s) needed",
      },
      {
        id: "quantity",
        label: "Quantity",
        type: "text",
        required: true,
        placeholder: "Number of items",
        validation: {
          pattern: "^[0-9]+$",
          message: "Please enter a valid number",
        },
      },
      {
        id: "estimated-cost",
        label: "Estimated Cost",
        type: "text",
        required: true,
        placeholder: "$0.00",
        validation: {
          pattern: "^\\$?[0-9]+(\\.[0-9]{2})?$",
          message: "Please enter a valid dollar amount",
        },
      },
      {
        id: "vendor",
        label: "Vendor",
        type: "text",
        required: true,
        placeholder: "Vendor name",
      },
      {
        id: "justification",
        label: "Justification",
        type: "textarea",
        required: true,
        placeholder: "Explain why this purchase is necessary",
      },
      {
        id: "date-needed",
        label: "Date Needed",
        type: "date",
        required: true,
      },
    ],
    ticketTemplate: {
      subject: "Purchase Request: {{field.item-description}}",
      description:
        "**Item:** {{field.item-description}}\n**Quantity:** {{field.quantity}}\n**Estimated Cost:** {{field.estimated-cost}}\n**Vendor:** {{field.vendor}}\n**Justification:** {{field.justification}}\n**Date Needed:** {{field.date-needed}}",
      priority: "medium",
      assignTo: "Accounting Department",
    },
  },

  // IT Support forms
  {
    id: "it-help-request",
    name: "IT Help Request",
    description: "Request IT support for technical issues",
    departmentId: "it",
    fields: [
      {
        id: "issue-type",
        label: "Issue Type",
        type: "select",
        required: true,
        options: [
          { value: "hardware", label: "Hardware Problem" },
          { value: "software", label: "Software Problem" },
          { value: "network", label: "Network/Internet Issue" },
          { value: "account", label: "Account Access" },
          { value: "other", label: "Other" },
        ],
      },
      {
        id: "issue-description",
        label: "Issue Description",
        type: "textarea",
        required: true,
        placeholder: "Please describe the issue in detail",
      },
      {
        id: "urgency",
        label: "Urgency",
        type: "select",
        required: true,
        options: [
          { value: "low", label: "Low - Not impacting work" },
          { value: "medium", label: "Medium - Causing some delays" },
          { value: "high", label: "High - Preventing work" },
          { value: "critical", label: "Critical - Affecting multiple users" },
        ],
      },
      {
        id: "location",
        label: "Location",
        type: "text",
        required: true,
        placeholder: "Your office/location",
      },
      {
        id: "attachment",
        label: "Attachments (screenshots, etc.)",
        type: "file",
        required: false,
      },
    ],
    ticketTemplate: {
      subject: "IT Help: {{field.issue-type}}",
      description:
        "**Issue Type:** {{field.issue-type}}\n**Description:** {{field.issue-description}}\n**Urgency:** {{field.urgency}}\n**Location:** {{field.location}}",
      priority: "medium",
      assignTo: "IT Support Team",
    },
  },

  // HR forms
  {
    id: "time-off-request",
    name: "Time Off Request",
    description: "Request for paid time off or leave",
    departmentId: "hr",
    fields: [
      {
        id: "leave-type",
        label: "Leave Type",
        type: "select",
        required: true,
        options: [
          { value: "vacation", label: "Vacation" },
          { value: "sick", label: "Sick Leave" },
          { value: "personal", label: "Personal Day" },
          { value: "bereavement", label: "Bereavement" },
          { value: "unpaid", label: "Unpaid Leave" },
        ],
      },
      {
        id: "start-date",
        label: "Start Date",
        type: "date",
        required: true,
      },
      {
        id: "end-date",
        label: "End Date",
        type: "date",
        required: true,
      },
      {
        id: "full-day",
        label: "Full Day?",
        type: "radio",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No (Partial Day)" },
        ],
        required: true,
      },
      {
        id: "comments",
        label: "Comments",
        type: "textarea",
        required: false,
        placeholder: "Any additional information",
      },
    ],
    ticketTemplate: {
      subject: "Time Off Request: {{field.start-date}} to {{field.end-date}}",
      description:
        "**Leave Type:** {{field.leave-type}}\n**Start Date:** {{field.start-date}}\n**End Date:** {{field.end-date}}\n**Full Day:** {{field.full-day}}\n**Comments:** {{field.comments}}",
      priority: "medium",
      assignTo: "HR Department",
    },
  },

  // Clinical forms
  {
    id: "treatment-plan-review",
    name: "Treatment Plan Review Request",
    description: "Request clinical review of a patient treatment plan",
    departmentId: "clinical",
    fields: [
      {
        id: "client-id",
        label: "Client ID",
        type: "text",
        required: true,
        placeholder: "Client identifier",
      },
      {
        id: "review-type",
        label: "Review Type",
        type: "select",
        required: true,
        options: [
          { value: "initial", label: "Initial Treatment Plan" },
          { value: "update", label: "Treatment Plan Update" },
          { value: "discharge", label: "Discharge Plan" },
        ],
      },
      {
        id: "plan-details",
        label: "Plan Details",
        type: "textarea",
        required: true,
        placeholder: "Provide details about the treatment plan",
      },
      {
        id: "attachment",
        label: "Attach Treatment Plan Document",
        type: "file",
        required: true,
      },
      {
        id: "urgency",
        label: "Urgency",
        type: "select",
        required: true,
        options: [
          { value: "standard", label: "Standard (5 business days)" },
          { value: "urgent", label: "Urgent (2 business days)" },
        ],
      },
    ],
    ticketTemplate: {
      subject: "Treatment Plan Review: {{field.client-id}} - {{field.review-type}}",
      description:
        "**Client ID:** {{field.client-id}}\n**Review Type:** {{field.review-type}}\n**Plan Details:** {{field.plan-details}}\n**Urgency:** {{field.urgency}}",
      priority: "medium",
      assignTo: "Clinical Supervisor",
    },
  },

  // Add more form templates for other departments...
]

// Agency Manual sections
const manualSections: ManualSection[] = [
  {
    id: "admin-policies",
    title: "Administrative Policies",
    departmentId: "administrative",
    icon: "FileText",
    items: [
      {
        id: "purchasing-policy",
        title: "Purchasing Policy",
        description: "Guidelines for requesting and approving purchases",
        path: "/manual/admin/purchasing-policy.md",
        lastUpdated: "2023-05-15",
        tags: ["purchasing", "finance", "approval"],
      },
      {
        id: "travel-policy",
        title: "Travel Policy",
        description: "Travel authorization and reimbursement procedures",
        path: "/manual/admin/travel-policy.md",
        lastUpdated: "2023-04-10",
        tags: ["travel", "reimbursement", "expenses"],
      },
    ],
  },
  {
    id: "clinical-protocols",
    title: "Clinical Protocols",
    departmentId: "clinical",
    icon: "ClipboardCheck",
    items: [
      {
        id: "assessment-protocol",
        title: "Assessment Protocol",
        description: "Standardized assessment procedures",
        path: "/manual/clinical/assessment-protocol.md",
        lastUpdated: "2023-06-01",
        tags: ["assessment", "evaluation", "clinical"],
      },
      {
        id: "treatment-planning",
        title: "Treatment Planning Guide",
        description: "Guidelines for creating effective treatment plans",
        path: "/manual/clinical/treatment-planning.md",
        lastUpdated: "2023-05-20",
        tags: ["treatment", "planning", "goals"],
      },
    ],
  },
  {
    id: "billing-procedures",
    title: "Billing Procedures",
    departmentId: "billing",
    icon: "Receipt",
    items: [
      {
        id: "claims-submission",
        title: "Claims Submission Process",
        description: "Step-by-step guide for submitting claims",
        path: "/manual/billing/claims-submission.md",
        lastUpdated: "2023-05-25",
        tags: ["claims", "billing", "submission"],
      },
      {
        id: "denial-management",
        title: "Denial Management",
        description: "Procedures for handling claim denials",
        path: "/manual/billing/denial-management.md",
        lastUpdated: "2023-04-15",
        tags: ["denials", "appeals", "resubmission"],
      },
    ],
  },
  // Add more manual sections for other departments...
]

// Export configurations
export { departments, formTemplates, manualSections }

// Export types
export type { Department, FormField, FormTemplate, ManualSection, ManualItem }
