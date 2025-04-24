"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon, FileUp, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useNotifications } from "@/hooks/use-notifications"

// Report ticket form templates for different categories
const reportFormTemplates = {
  "data-request": {
    title: "Data Request",
    description: "Request specific data or custom reports",
    fields: [
      {
        id: "report-name",
        label: "Report Name",
        type: "text",
        required: true,
        placeholder: "Enter a descriptive name for this report",
      },
      {
        id: "data-needed",
        label: "Data Needed",
        type: "textarea",
        required: true,
        placeholder: "Describe the specific data points or metrics you need",
      },
      {
        id: "date-range",
        label: "Date Range",
        type: "date-range",
        required: true,
      },
      {
        id: "format",
        label: "Preferred Format",
        type: "select",
        required: true,
        options: [
          { value: "excel", label: "Excel Spreadsheet" },
          { value: "pdf", label: "PDF Report" },
          { value: "dashboard", label: "Interactive Dashboard" },
          { value: "raw-data", label: "Raw Data Export" },
        ],
      },
      {
        id: "urgency",
        label: "Urgency",
        type: "select",
        required: true,
        options: [
          { value: "low", label: "Low - Within 2 weeks" },
          { value: "medium", label: "Medium - Within 1 week" },
          { value: "high", label: "High - Within 2-3 days" },
          { value: "urgent", label: "Urgent - Within 24 hours" },
        ],
      },
      {
        id: "purpose",
        label: "Purpose",
        type: "textarea",
        required: true,
        placeholder: "Explain how this data will be used",
      },
    ],
  },
  "report-issue": {
    title: "Report Issue",
    description: "Report a problem with existing reports",
    fields: [
      {
        id: "report-name",
        label: "Report Name",
        type: "text",
        required: true,
        placeholder: "Name of the report with issues",
      },
      {
        id: "issue-description",
        label: "Issue Description",
        type: "textarea",
        required: true,
        placeholder: "Describe the problem in detail",
      },
      {
        id: "issue-type",
        label: "Issue Type",
        type: "select",
        required: true,
        options: [
          { value: "data-accuracy", label: "Data Accuracy" },
          { value: "missing-data", label: "Missing Data" },
          { value: "calculation-error", label: "Calculation Error" },
          { value: "display-issue", label: "Display/Formatting Issue" },
          { value: "access-issue", label: "Access/Permission Issue" },
          { value: "other", label: "Other" },
        ],
      },
      {
        id: "steps-to-reproduce",
        label: "Steps to Reproduce",
        type: "textarea",
        required: false,
        placeholder: "Steps to reproduce the issue (if applicable)",
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
        id: "screenshot",
        label: "Screenshot (if available)",
        type: "file",
        required: false,
      },
    ],
  },
  "enhancement-request": {
    title: "Enhancement Request",
    description: "Request improvements to existing reports",
    fields: [
      {
        id: "report-name",
        label: "Report Name",
        type: "text",
        required: true,
        placeholder: "Name of the report to enhance",
      },
      {
        id: "enhancement-description",
        label: "Enhancement Description",
        type: "textarea",
        required: true,
        placeholder: "Describe the requested enhancement in detail",
      },
      {
        id: "business-justification",
        label: "Business Justification",
        type: "textarea",
        required: true,
        placeholder: "Explain why this enhancement is needed and its business value",
      },
      {
        id: "priority",
        label: "Priority",
        type: "select",
        required: true,
        options: [
          { value: "low", label: "Low - Nice to have" },
          { value: "medium", label: "Medium - Would improve workflow" },
          { value: "high", label: "High - Significant impact on operations" },
        ],
      },
      {
        id: "desired-timeline",
        label: "Desired Timeline",
        type: "date",
        required: false,
      },
    ],
  },
  "new-report-request": {
    title: "New Report Request",
    description: "Request a completely new report",
    fields: [
      {
        id: "report-name",
        label: "Proposed Report Name",
        type: "text",
        required: true,
        placeholder: "Suggested name for the new report",
      },
      {
        id: "report-description",
        label: "Report Description",
        type: "textarea",
        required: true,
        placeholder: "Describe the purpose and content of the new report",
      },
      {
        id: "data-sources",
        label: "Data Sources",
        type: "textarea",
        required: true,
        placeholder: "List the data sources that should be used for this report",
      },
      {
        id: "key-metrics",
        label: "Key Metrics",
        type: "textarea",
        required: true,
        placeholder: "List the key metrics or calculations that should be included",
      },
      {
        id: "audience",
        label: "Target Audience",
        type: "select",
        required: true,
        options: [
          { value: "executive", label: "Executive Leadership" },
          { value: "management", label: "Department Management" },
          { value: "clinical", label: "Clinical Staff" },
          { value: "billing", label: "Billing/Finance" },
          { value: "operations", label: "Operations" },
          { value: "other", label: "Other" },
        ],
      },
      {
        id: "frequency",
        label: "Desired Frequency",
        type: "select",
        required: true,
        options: [
          { value: "daily", label: "Daily" },
          { value: "weekly", label: "Weekly" },
          { value: "monthly", label: "Monthly" },
          { value: "quarterly", label: "Quarterly" },
          { value: "ad-hoc", label: "Ad-hoc/On-demand" },
        ],
      },
      {
        id: "priority",
        label: "Priority",
        type: "select",
        required: true,
        options: [
          { value: "low", label: "Low" },
          { value: "medium", label: "Medium" },
          { value: "high", label: "High" },
        ],
      },
      {
        id: "business-justification",
        label: "Business Justification",
        type: "textarea",
        required: true,
        placeholder: "Explain why this report is needed and its business value",
      },
    ],
  },
  "access-request": {
    title: "Report Access Request",
    description: "Request access to specific reports",
    fields: [
      {
        id: "report-name",
        label: "Report Name(s)",
        type: "text",
        required: true,
        placeholder: "Name(s) of the report(s) you need access to",
      },
      {
        id: "access-level",
        label: "Access Level Needed",
        type: "select",
        required: true,
        options: [
          { value: "view", label: "View Only" },
          { value: "edit", label: "Edit/Modify" },
          { value: "admin", label: "Administrative Access" },
        ],
      },
      {
        id: "justification",
        label: "Justification",
        type: "textarea",
        required: true,
        placeholder: "Explain why you need access to these reports",
      },
      {
        id: "manager-approval",
        label: "Manager Approval",
        type: "radio",
        required: true,
        options: [
          { value: "yes", label: "Yes, my manager has approved this request" },
          { value: "no", label: "No, I need to obtain manager approval" },
        ],
      },
      {
        id: "manager-name",
        label: "Manager Name",
        type: "text",
        required: true,
        placeholder: "Name of your manager",
      },
      {
        id: "urgency",
        label: "Urgency",
        type: "select",
        required: true,
        options: [
          { value: "low", label: "Low - Within 1 week" },
          { value: "medium", label: "Medium - Within 2-3 days" },
          { value: "high", label: "High - Within 24 hours" },
        ],
      },
    ],
  },
}

interface ReportTicketFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  programName?: string
  reportType?: string
}

export function ReportTicketForm({ open, onOpenChange, programName, reportType }: ReportTicketFormProps) {
  const [formType, setFormType] = useState<keyof typeof reportFormTemplates>("data-request")
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { notifySystem } = useNotifications()

  // Reset form when opened
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form data when closing
      setFormData({})
      setDateRange({})
      setError(null)
      setSuccess(false)
    }
    onOpenChange(newOpen)
  }

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      setError(null)

      // Get the current form template
      const template = reportFormTemplates[formType]

      // Validate required fields
      const missingFields: string[] = []
      template.fields.forEach((field) => {
        if (field.required) {
          if (field.type === "date-range") {
            if (!dateRange.from || !dateRange.to) {
              missingFields.push(field.label)
            }
          } else if (formData[field.id] === undefined || formData[field.id] === "") {
            missingFields.push(field.label)
          }
        }
      })

      if (missingFields.length > 0) {
        setError(`Please fill out the following required fields: ${missingFields.join(", ")}`)
        setSubmitting(false)
        return
      }

      // Prepare ticket data
      const ticketData = {
        subject: `${template.title}: ${formData["report-name"] || "Report Request"}`,
        description: prepareTicketDescription(template, formData, dateRange, programName, reportType),
        priority: getPriorityFromForm(formData),
        category: "Reports",
        subcategory: template.title,
        email: "cmhcccorg-reports@cmhccc.desk365.io",
      }

      // In a real implementation, this would call the Desk365 API
      console.log("Creating report ticket with data:", ticketData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Send notification
      notifySystem(
        `Report Ticket Submitted: ${ticketData.subject}`,
        `Your report ticket has been submitted successfully and sent to the reports team.`,
        "success",
        "/reports",
        "View Reports",
      )

      setSuccess(true)

      // Close the dialog after a delay
      setTimeout(() => {
        handleOpenChange(false)
      }, 2000)
    } catch (err) {
      console.error("Error submitting report ticket:", err)
      setError("An error occurred while submitting your request. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // Prepare the ticket description from form data
  const prepareTicketDescription = (
    template: (typeof reportFormTemplates)[keyof typeof reportFormTemplates],
    data: Record<string, any>,
    dateRange: { from?: Date; to?: Date },
    programName?: string,
    reportType?: string,
  ): string => {
    let description = `## ${template.title}\n\n`

    // Add context information
    if (programName) {
      description += `**Program:** ${programName}\n`
    }
    if (reportType) {
      description += `**Report Type:** ${reportType}\n`
    }
    description += "\n"

    // Add form fields
    template.fields.forEach((field) => {
      if (field.type === "date-range") {
        description += `**${field.label}:** ${
          dateRange.from ? format(dateRange.from, "MMM dd, yyyy") : "Not specified"
        } to ${dateRange.to ? format(dateRange.to, "MMM dd, yyyy") : "Not specified"}\n`
      } else if (field.type === "select" || field.type === "radio") {
        const value = data[field.id]
        if (value) {
          const option = field.options?.find((opt) => opt.value === value)
          description += `**${field.label}:** ${option?.label || value}\n`
        }
      } else if (data[field.id]) {
        description += `**${field.label}:** ${data[field.id]}\n`
      }
    })

    // Add submission metadata
    description += `\n**Submitted:** ${new Date().toLocaleString()}\n`
    description += `**Submitted By:** ${localStorage.getItem("userName") || "Current User"}\n`
    description += `**Email:** ${localStorage.getItem("userEmail") || "user@example.com"}\n`

    return description
  }

  // Get priority from form data
  const getPriorityFromForm = (data: Record<string, any>): "low" | "medium" | "high" => {
    const priorityField = data["priority"] || data["urgency"]
    if (priorityField === "high" || priorityField === "urgent" || priorityField === "critical") {
      return "high"
    } else if (priorityField === "medium") {
      return "medium"
    }
    return "low"
  }

  // Render form fields based on their type
  const renderField = (field: any) => {
    switch (field.type) {
      case "text":
        return (
          <div className="grid gap-2" key={field.id}>
            <Label
              htmlFor={field.id}
              className={field.required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}
            >
              {field.label}
            </Label>
            <Input
              id={field.id}
              placeholder={field.placeholder}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
          </div>
        )

      case "textarea":
        return (
          <div className="grid gap-2" key={field.id}>
            <Label
              htmlFor={field.id}
              className={field.required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}
            >
              {field.label}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        )

      case "select":
        return (
          <div className="grid gap-2" key={field.id}>
            <Label
              htmlFor={field.id}
              className={field.required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}
            >
              {field.label}
            </Label>
            <Select value={formData[field.id] || ""} onValueChange={(value) => handleInputChange(field.id, value)}>
              <SelectTrigger id={field.id}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case "date":
        return (
          <div className="grid gap-2" key={field.id}>
            <Label
              htmlFor={field.id}
              className={field.required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}
            >
              {field.label}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id={field.id}
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData[field.id] && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData[field.id]
                    ? format(new Date(formData[field.id]), "PPP")
                    : field.placeholder || "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData[field.id] ? new Date(formData[field.id]) : undefined}
                  onSelect={(date) => handleInputChange(field.id, date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )

      case "date-range":
        return (
          <div className="grid gap-2" key={field.id}>
            <Label
              htmlFor={field.id}
              className={field.required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}
            >
              {field.label}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button id={field.id} variant={"outline"} className={cn("w-full justify-start text-left font-normal")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{
                    from: dateRange.from,
                    to: dateRange.to,
                  }}
                  onSelect={(range) => {
                    setDateRange({
                      from: range?.from,
                      to: range?.to,
                    })
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        )

      case "radio":
        return (
          <div className="grid gap-2" key={field.id}>
            <Label className={field.required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}>
              {field.label}
            </Label>
            <RadioGroup value={formData[field.id] || ""} onValueChange={(value) => handleInputChange(field.id, value)}>
              {field.options?.map((option: any) => (
                <div className="flex items-center space-x-2" key={option.value}>
                  <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                  <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case "file":
        return (
          <div className="grid gap-2" key={field.id}>
            <Label
              htmlFor={field.id}
              className={field.required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}
            >
              {field.label}
            </Label>
            <div className="flex items-center gap-4">
              <Button type="button" variant="outline">
                <FileUp className="mr-2 h-4 w-4" />
                {formData[field.id] ? "Change File" : "Upload File"}
              </Button>
              {formData[field.id] && <span className="text-sm">{formData[field.id]}</span>}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const currentTemplate = reportFormTemplates[formType]

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Report Ticket</DialogTitle>
          <DialogDescription>
            Submit a ticket to the reporting team for data requests, issues, or enhancements
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {success ? (
            <Alert className="bg-green-50 border-green-200">
              <Info className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Ticket Submitted Successfully</AlertTitle>
              <AlertDescription className="text-green-700">
                Your report ticket has been submitted and sent to the reports team at
                cmhcccorg-reports@cmhccc.desk365.io
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {error && (
                <Alert variant="destructive">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="form-type">Request Type</Label>
                  <Select
                    value={formType}
                    onValueChange={(value: keyof typeof reportFormTemplates) => setFormType(value)}
                  >
                    <SelectTrigger id="form-type">
                      <SelectValue placeholder="Select request type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(reportFormTemplates).map(([key, template]) => (
                        <SelectItem key={key} value={key}>
                          {template.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">{currentTemplate.description}</p>
                </div>

                {/* Context information */}
                {(programName || reportType) && (
                  <div className="bg-muted/50 p-3 rounded-md">
                    <h3 className="text-sm font-medium mb-2">Request Context</h3>
                    {programName && <p className="text-sm">Program: {programName}</p>}
                    {reportType && <p className="text-sm">Report Type: {reportType}</p>}
                  </div>
                )}

                {/* Form fields */}
                <div className="space-y-4">{currentTemplate.fields.map((field) => renderField(field))}</div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || success}>
            {submitting ? "Submitting..." : "Submit Ticket"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
