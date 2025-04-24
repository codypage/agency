"use client"

import { FormField } from "@/components/ui/form"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon, FileUp, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { FormField, FormTemplate } from "@/lib/admin-config"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useFormNotifications } from "@/hooks/use-notifications"
import { ResponsiveFormLayout, FormSection } from "@/components/ui/responsive-form-layout"
import { Loading } from "@/components/ui/loading"
import { BackButton } from "@/components/ui/back-button"

interface RequestFormProps {
  formTemplate: FormTemplate
}

export function RequestForm({ formTemplate }: RequestFormProps) {
  const router = useRouter()
  const { notifySubmission } = useFormNotifications()
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

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

      // Validate required fields
      const missingFields: string[] = []
      formTemplate.fields.forEach((field) => {
        if (field.required && (formData[field.id] === undefined || formData[field.id] === "")) {
          missingFields.push(field.label)
        }
      })

      if (missingFields.length > 0) {
        setError(`Please fill out the following required fields: ${missingFields.join(", ")}`)
        setSubmitting(false)
        return
      }

      // Prepare ticket data using the template
      const ticketData = {
        subject: processTemplate(formTemplate.ticketTemplate.subject, formData),
        description: processTemplate(formTemplate.ticketTemplate.description, formData),
        priority: formTemplate.ticketTemplate.priority,
        dueDate: formTemplate.ticketTemplate.dueDate,
        assignTo: formTemplate.ticketTemplate.assignTo,
        departmentId: formTemplate.departmentId,
      }

      // In a real implementation, this would call the Desk365 API
      console.log("Creating ticket with data:", ticketData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Send notification about form submission
      notifySubmission(
        formTemplate.id,
        formTemplate.name,
        "Admin User", // In a real app, this would be the current user
        `TICKET-${Date.now().toString().slice(-6)}`, // Mock ticket ID
      )

      setSuccess(true)

      // Navigate back to admin dashboard after successful submission
      setTimeout(() => {
        router.push("/admin/dashboard?success=true")
      }, 2000)
    } catch (err) {
      console.error("Error submitting form:", err)
      setError("An error occurred while submitting your request. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // Helper function to process template strings with field values
  const processTemplate = (template: string, data: Record<string, any>) => {
    return template.replace(/\{\{field\.([^}]+)\}\}/g, (match, fieldId) => {
      return data[fieldId] || ""
    })
  }

  // Render form fields based on their type
  const renderField = (field: FormField) => {
    switch (field.type) {
      case "text":
        return (
          <FormField key={field.id}>
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
              aria-required={field.required}
              aria-describedby={field.helpText ? `${field.id}-help` : undefined}
            />
            {field.helpText && (
              <p id={`${field.id}-help`} className="text-sm text-muted-foreground">
                {field.helpText}
              </p>
            )}
          </FormField>
        )

      case "textarea":
        return (
          <FormField key={field.id}>
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
              aria-required={field.required}
              aria-describedby={field.helpText ? `${field.id}-help` : undefined}
            />
            {field.helpText && (
              <p id={`${field.id}-help`} className="text-sm text-muted-foreground">
                {field.helpText}
              </p>
            )}
          </FormField>
        )

      case "select":
        return (
          <FormField key={field.id}>
            <Label
              htmlFor={field.id}
              className={field.required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}
            >
              {field.label}
            </Label>
            <Select value={formData[field.id] || ""} onValueChange={(value) => handleInputChange(field.id, value)}>
              <SelectTrigger id={field.id}>
                <SelectValue placeholder={field.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.helpText && (
              <p id={`${field.id}-help`} className="text-sm text-muted-foreground">
                {field.helpText}
              </p>
            )}
          </FormField>
        )

      case "date":
        return (
          <FormField key={field.id}>
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
                  aria-haspopup="dialog"
                  aria-expanded="false"
                  aria-required={field.required}
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
            {field.helpText && (
              <p id={`${field.id}-help`} className="text-sm text-muted-foreground">
                {field.helpText}
              </p>
            )}
          </FormField>
        )

      case "checkbox":
        return (
          <FormField key={field.id} className="flex items-center space-x-2 space-y-0">
            <Checkbox
              id={field.id}
              checked={formData[field.id] || false}
              onCheckedChange={(checked) => handleInputChange(field.id, checked)}
              aria-required={field.required}
              aria-describedby={field.helpText ? `${field.id}-help` : undefined}
            />
            <div className="space-y-1 leading-none">
              <Label
                htmlFor={field.id}
                className={field.required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}
              >
                {field.label}
              </Label>
              {field.helpText && (
                <p id={`${field.id}-help`} className="text-xs text-muted-foreground">
                  {field.helpText}
                </p>
              )}
            </div>
          </FormField>
        )

      case "radio":
        return (
          <FormField key={field.id}>
            <div className="mb-2">
              <Label className={field.required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}>
                {field.label}
              </Label>
            </div>
            <RadioGroup
              value={formData[field.id] || ""}
              onValueChange={(value) => handleInputChange(field.id, value)}
              aria-required={field.required}
              aria-describedby={field.helpText ? `${field.id}-help` : undefined}
            >
              {field.options?.map((option) => (
                <div className="flex items-center space-x-2" key={option.value}>
                  <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                  <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
            {field.helpText && (
              <p id={`${field.id}-help`} className="text-sm text-muted-foreground mt-1">
                {field.helpText}
              </p>
            )}
          </FormField>
        )

      case "file":
        return (
          <FormField key={field.id}>
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
            {field.helpText && (
              <p id={`${field.id}-help`} className="text-sm text-muted-foreground">
                {field.helpText}
              </p>
            )}
          </FormField>
        )

      default:
        return null
    }
  }

  if (success) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <Info className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Request Submitted Successfully</AlertTitle>
        <AlertDescription className="text-green-700">
          Your request has been submitted and a ticket has been created. You will be redirected to the dashboard.
        </AlertDescription>
      </Alert>
    )
  }

  // Group fields by category if they have one
  const fieldsByCategory = formTemplate.fields.reduce(
    (acc, field) => {
      const category = field.category || "General"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(field)
      return acc
    },
    {} as Record<string, FormField[]>,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formTemplate.name}</CardTitle>
        <CardDescription>{formTemplate.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {Object.entries(fieldsByCategory).map(([category, fields]) => (
            <FormSection key={category} title={category !== "General" ? category : undefined}>
              <ResponsiveFormLayout columns={category === "General" ? 1 : 2} gap="md">
                {fields.map(renderField)}
              </ResponsiveFormLayout>
            </FormSection>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <BackButton onClick={() => router.back()} />
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? (
            <>
              <Loading variant="spinner" size="sm" text="" className="mr-2" />
              Submitting...
            </>
          ) : (
            "Submit Request"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
