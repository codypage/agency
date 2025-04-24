"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { CachedTaskServiceFacade } from "@/lib/desk365-facade-with-cache"
import { SimpleFeatureFlags } from "@/lib/desk365-facade"

// Mock API client - in a real implementation, this would be properly initialized
const mockTicketsApi = {
  createTicket: async (ticketData: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      id: `TASK-${Math.floor(Math.random() * 10000)}`,
      ...ticketData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "Current User",
    }
  },
}

// Initialize feature flags
const featureFlags = new SimpleFeatureFlags({
  tasks: true,
  comments: true,
  attachments: true,
})

// Initialize the task service
const taskService = new CachedTaskServiceFacade(
  mockTicketsApi,
  featureFlags,
  // Using a mock cache service - in a real implementation, this would be properly initialized
  {
    getOrSet: async (key, fn) => await fn(),
    delete: async () => {},
    invalidateByTag: async () => {},
  },
  { enabled: false }, // Disable caching for now
)

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskCreated?: (task: any) => void
}

interface TaskFormData {
  title: string
  description: string
  team: string
  assignee: string
  priority: string
  category: string
  subcategory: string
  dueDate?: Date
  cptCode: string
  serviceType: string
}

export function CreateTaskDialog({ open, onOpenChange, onTaskCreated }: CreateTaskDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: {
      title: "",
      description: "",
      team: "",
      assignee: "",
      priority: "",
      category: "",
      subcategory: "",
      dueDate: undefined,
      cptCode: "",
      serviceType: "",
    },
  })

  const resetForm = () => {
    reset()
  }

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true)

    try {
      // Map form data to task format
      const taskData = {
        title: data.title,
        description: data.description,
        status: "not-started" as const,
        priority: (data.priority as "low" | "medium" | "high") || "medium",
        assignedTo: data.assignee,
        team: data.team,
        dueDate: data.dueDate ? format(data.dueDate, "yyyy-MM-dd") : "",
        category: data.category,
        subcategory: data.subcategory,
        cptCode: data.cptCode,
        serviceType: data.serviceType,
      }

      // Create the task using the service
      const createdTask = await taskService.createTask(taskData)

      // Show success notification
      toast({
        title: "Task created",
        description: `Task "${data.title}" has been created successfully.`,
      })

      // Call the callback if provided
      if (onTaskCreated) {
        onTaskCreated(createdTask)
      }

      // Reset form and close dialog
      resetForm()
      onOpenChange(false)
    } catch (error) {
      // Show error notification
      toast({
        title: "Error creating task",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
      console.error("Error creating task:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen && !isSubmitting) {
          resetForm()
        }
        if (!isSubmitting) {
          onOpenChange(newOpen)
        }
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>Add a new task to the Autism Program implementation project.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className={errors.title ? "text-destructive" : ""}>
                Task Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Enter task title"
                {...register("title", {
                  required: "Title is required",
                  maxLength: {
                    value: 100,
                    message: "Title cannot exceed 100 characters",
                  },
                })}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className={errors.description ? "text-destructive" : ""}>
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Enter task description"
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 10,
                    message: "Description must be at least 10 characters",
                  },
                })}
                className={cn("min-h-[100px]", errors.description ? "border-destructive" : "")}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="team" className={errors.team ? "text-destructive" : ""}>
                  Team <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="team"
                  rules={{ required: "Team is required" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="team" className={errors.team ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="System-Build">System-Build</SelectItem>
                        <SelectItem value="Clinical">Clinical</SelectItem>
                        <SelectItem value="Billing">Billing</SelectItem>
                        <SelectItem value="HR & Training">HR & Training</SelectItem>
                        <SelectItem value="Leadership">Leadership</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.team && <p className="text-sm text-destructive">{errors.team.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="assignee" className={errors.assignee ? "text-destructive" : ""}>
                  Assign To <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="assignee"
                  rules={{ required: "Assignee is required" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="assignee" className={errors.assignee ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Stacy">Stacy</SelectItem>
                        <SelectItem value="Brittany">Brittany</SelectItem>
                        <SelectItem value="Dakota">Dakota</SelectItem>
                        <SelectItem value="Jaden">Jaden</SelectItem>
                        <SelectItem value="Bill">Bill</SelectItem>
                        <SelectItem value="Heather">Heather</SelectItem>
                        <SelectItem value="Amy">Amy</SelectItem>
                        <SelectItem value="Annabelle">Annabelle</SelectItem>
                        <SelectItem value="David">David</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.assignee && <p className="text-sm text-destructive">{errors.assignee.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority" className={errors.priority ? "text-destructive" : ""}>
                  Priority <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="priority"
                  rules={{ required: "Priority is required" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="priority" className={errors.priority ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.priority && <p className="text-sm text-destructive">{errors.priority.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="due-date">Due Date</Label>
                <Controller
                  control={control}
                  name="dueDate"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="due-date"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category" className={errors.category ? "text-destructive" : ""}>
                  Category <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="category"
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="category" className={errors.category ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="System-Build">System-Build</SelectItem>
                        <SelectItem value="Clinical">Clinical</SelectItem>
                        <SelectItem value="Billing">Billing</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="Leadership">Leadership</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Controller
                  control={control}
                  name="subcategory"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="subcategory">
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Functional Assessment">Functional Assessment</SelectItem>
                        <SelectItem value="Treatment Program">Treatment Program</SelectItem>
                        <SelectItem value="Attachments & Workflows">Attachments & Workflows</SelectItem>
                        <SelectItem value="Assessments">Assessments</SelectItem>
                        <SelectItem value="Treatment Plans">Treatment Plans</SelectItem>
                        <SelectItem value="Authorizations">Authorizations</SelectItem>
                        <SelectItem value="Job Descriptions">Job Descriptions</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Healthcare-specific fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cpt-code">CPT Code (if applicable)</Label>
                <Controller
                  control={control}
                  name="cptCode"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="cpt-code">
                        <SelectValue placeholder="Select CPT code" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="97151">97151 - Behavior Identification Assessment</SelectItem>
                        <SelectItem value="97153">97153 - Adaptive behavior treatment by protocol</SelectItem>
                        <SelectItem value="97154">97154 - Group adaptive behavior treatment</SelectItem>
                        <SelectItem value="97155">
                          97155 - Adaptive behavior treatment with protocol modification
                        </SelectItem>
                        <SelectItem value="97156">97156 - Family adaptive behavior treatment guidance</SelectItem>
                        <SelectItem value="97158">
                          97158 - Group adaptive behavior treatment w/ protocol modification
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="service-type">Service Type (if applicable)</Label>
                <Input id="service-type" placeholder="Enter service type" {...register("serviceType")} />
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm()
                onOpenChange(false)
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Task"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
