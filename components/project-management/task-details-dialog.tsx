"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Paperclip,
  Calendar,
  Users,
  Tag,
  Clock8,
  Edit,
  Trash2,
  Link,
  Plus,
  Send,
} from "lucide-react"
import { OptimizedImage } from "@/components/ui/optimized-image"

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  assignedTo: { name: string; avatar: string }
  team: string
  dueDate: string
  category: string
  subcategory: string
  percentComplete?: number
  estimatedHours?: number
  actualHours?: number
  attachments?: number
  comments?: number
}

interface TaskDetailsDialogProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskDetailsDialog({ task, open, onOpenChange }: TaskDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState("details")
  const [newComment, setNewComment] = useState("")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "not-started":
        return <AlertCircle className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            In Progress
          </Badge>
        )
      case "not-started":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Not Started
          </Badge>
        )
      default:
        return null
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Low
          </Badge>
        )
      default:
        return null
    }
  }

  // Mock comments data
  const mockComments = [
    {
      id: 1,
      user: { name: "Sarah Johnson", avatar: "/abstract-geometric-sm.png" },
      text: "I've started working on this. Will need some clarification on the assessment dropdown fields.",
      timestamp: "2023-04-25T14:30:00Z",
    },
    {
      id: 2,
      user: { name: "David Lee", avatar: "/letter-d-floral.png" },
      text: "Let's schedule a meeting to discuss the dropdown options. I have some suggestions based on our previous implementation.",
      timestamp: "2023-04-25T15:45:00Z",
    },
    {
      id: 3,
      user: { name: "Stacy", avatar: "/abstract-s-design.png" },
      text: "I've added some initial dropdown options based on our standard assessment tools. Please review and let me know if we need to add more.",
      timestamp: "2023-04-26T09:15:00Z",
    },
  ]

  // Mock attachments data
  const mockAttachments = [
    {
      id: 1,
      name: "Assessment_Fields_Draft.xlsx",
      size: "245 KB",
      uploadedBy: "Stacy",
      uploadedAt: "2023-04-25T10:30:00Z",
      type: "excel",
    },
    {
      id: 2,
      name: "Functional_Assessment_Template.pdf",
      size: "1.2 MB",
      uploadedBy: "Dakota",
      uploadedAt: "2023-04-26T14:20:00Z",
      type: "pdf",
    },
  ]

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Format timestamp for comments
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return formatDate(timestamp)
    }
  }

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // In a real app, you would add the comment to the database
      // For now, we'll just clear the input
      setNewComment("")
      // You could also update a local state array of comments here
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">{task.id}</span>
              {getStatusBadge(task.status)}
              {getPriorityBadge(task.priority)}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-600">
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
          </div>
          <DialogTitle className="text-xl mt-2">{task.title}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="comments">Comments ({mockComments.length})</TabsTrigger>
            <TabsTrigger value="attachments">Attachments ({mockAttachments.length})</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 pr-4">
            <TabsContent value="details" className="space-y-6 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                    <p className="text-sm">{task.description}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Progress</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completion</span>
                        <span>{task.percentComplete}%</span>
                      </div>
                      <Progress value={task.percentComplete} className="h-2" />
                    </div>
                  </div>

                  {(task.estimatedHours || task.actualHours) && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Time Tracking</h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Clock8 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Estimated: {task.estimatedHours} hours</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Actual: {task.actualHours || 0} hours</span>
                        </div>
                      </div>
                      {task.estimatedHours && task.actualHours && (
                        <Progress value={(task.actualHours / task.estimatedHours) * 100} className="h-2 mt-2" />
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Assigned To</h3>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <OptimizedImage
                            src={task.assignedTo.avatar || "/placeholder.svg"}
                            alt={task.assignedTo.name}
                            width={24}
                            height={24}
                            className="rounded-full object-cover"
                          />
                          <AvatarFallback>{task.assignedTo.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{task.assignedTo.name}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Due Date</h3>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(task.dueDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Team</h3>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{task.team}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Category</h3>
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{task.category}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Subcategory</h3>
                    <span className="text-sm">{task.subcategory}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
                    <div className="flex gap-2">
                      <Button
                        variant={task.status === "not-started" ? "default" : "outline"}
                        size="sm"
                        className="flex-1"
                      >
                        Not Started
                      </Button>
                      <Button
                        variant={task.status === "in-progress" ? "default" : "outline"}
                        size="sm"
                        className="flex-1"
                      >
                        In Progress
                      </Button>
                      <Button
                        variant={task.status === "completed" ? "default" : "outline"}
                        size="sm"
                        className="flex-1"
                      >
                        Completed
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comments" className="space-y-4 mt-0">
              {mockComments.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <OptimizedImage
                          src={comment.user.avatar || "/placeholder.svg"}
                          alt={comment.user.name}
                          width={24}
                          height={24}
                          className="rounded-full object-cover"
                        />
                        <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{comment.user.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatTimestamp(comment.timestamp)}</span>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              ))}

              <div className="pt-4">
                <div className="flex items-start gap-2">
                  <Avatar className="h-8 w-8">
                    <OptimizedImage
                      src="/abstract-s-design.png"
                      alt="You"
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                    <AvatarFallback>Y</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <div className="flex justify-between mt-2">
                      <Button variant="outline" size="sm">
                        <Paperclip className="h-4 w-4 mr-1" /> Attach
                      </Button>
                      <Button size="sm" onClick={handleSubmitComment} disabled={!newComment.trim()}>
                        <Send className="h-4 w-4 mr-1" /> Send
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attachments" className="space-y-4 mt-0">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Files and Attachments</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Add File
                </Button>
              </div>

              <div className="space-y-2">
                {mockAttachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between border rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted rounded-md p-2">
                        <Paperclip className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{attachment.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {attachment.size} • Uploaded by {attachment.uploadedBy} on {formatDate(attachment.uploadedAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Link className="h-4 w-4 mr-1" /> Copy Link
                      </Button>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 mt-0">
              <h3 className="text-sm font-medium">Activity Log</h3>
              <div className="space-y-4">
                <div className="relative pl-6 pb-4 border-l border-muted">
                  <div className="absolute left-[-4px] top-0 w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="text-sm">
                    <span className="font-medium">Stacy</span> updated the task status to{" "}
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      In Progress
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Today at 9:30 AM</div>
                </div>

                <div className="relative pl-6 pb-4 border-l border-muted">
                  <div className="absolute left-[-4px] top-0 w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="text-sm">
                    <span className="font-medium">David</span> added a comment
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Yesterday at 3:45 PM</div>
                </div>

                <div className="relative pl-6 pb-4 border-l border-muted">
                  <div className="absolute left-[-4px] top-0 w-2 h-2 rounded-full bg-purple-500"></div>
                  <div className="text-sm">
                    <span className="font-medium">Sarah</span> attached a file{" "}
                    <span className="font-medium">Assessment_Fields_Draft.xlsx</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">April 25, 2023 at 10:30 AM</div>
                </div>

                <div className="relative pl-6">
                  <div className="absolute left-[-4px] top-0 w-2 h-2 rounded-full bg-gray-500"></div>
                  <div className="text-sm">
                    <span className="font-medium">System</span> created this task
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">April 24, 2023 at 2:15 PM</div>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="flex justify-between items-center border-t pt-4 mt-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Clock8 className="h-4 w-4 mr-1" /> Log Time
            </Button>
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-1" /> Assign
            </Button>
          </div>
          <div>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
