"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  PauseCircle,
  User,
  Trash2,
  AlertTriangle,
  Download,
  FileSpreadsheet,
  FileText,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { AdminProject } from "@/types/admin-project"
import { exportTasksToCSV, exportTasksToExcel, formatDateForFilename } from "@/lib/export-utils"

interface BulkOperationsToolbarProps {
  selectedTasks: AdminProject[]
  onClearSelection: () => void
  onAssignTasks: (tasks: AdminProject[], assignee: string) => Promise<void>
  onUpdateStatus: (tasks: AdminProject[], status: AdminProject["status"]) => Promise<void>
  onUpdatePriority: (tasks: AdminProject[], priority: AdminProject["priority"]) => Promise<void>
  onDeleteTasks: (tasks: AdminProject[]) => Promise<void>
  isLoading?: boolean
  allTasks?: AdminProject[]
}

export function BulkOperationsToolbar({
  selectedTasks,
  onClearSelection,
  onAssignTasks,
  onUpdateStatus,
  onUpdatePriority,
  onDeleteTasks,
  isLoading = false,
  allTasks = [],
}: BulkOperationsToolbarProps) {
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [assignee, setAssignee] = useState("")
  const [exportFilename, setExportFilename] = useState(`tasks-${formatDateForFilename()}`)
  const [exportScope, setExportScope] = useState<"selected" | "all">("selected")
  const { toast } = useToast()

  const handleAssign = async () => {
    if (assignee.trim()) {
      await onAssignTasks(selectedTasks, assignee)
      setAssignDialogOpen(false)
      setAssignee("")
    }
  }

  const handleDelete = async () => {
    await onDeleteTasks(selectedTasks)
    setDeleteDialogOpen(false)
    onClearSelection()
  }

  const handleExportCSV = () => {
    try {
      const tasksToExport = exportScope === "selected" ? selectedTasks : allTasks
      exportTasksToCSV(tasksToExport, `${exportFilename}.csv`)
      setExportDialogOpen(false)
      toast({
        title: "Export successful",
        description: `${tasksToExport.length} tasks exported to CSV`,
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting the tasks. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleExportExcel = () => {
    try {
      const tasksToExport = exportScope === "selected" ? selectedTasks : allTasks
      exportTasksToExcel(tasksToExport, `${exportFilename}.xlsx`)
      setExportDialogOpen(false)
      toast({
        title: "Export successful",
        description: `${tasksToExport.length} tasks exported to Excel`,
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting the tasks. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-background border rounded-lg shadow-lg p-4 z-50 flex items-center gap-2 min-w-[320px] flex-wrap justify-center">
        <div className="flex items-center gap-2 mr-4">
          <span className="font-medium">{selectedTasks.length} selected</span>
          <Button variant="ghost" size="icon" onClick={onClearSelection} disabled={isLoading}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={isLoading}>
              Set Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onUpdateStatus(selectedTasks, "Not Started")}>
              <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
              Not Started
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdateStatus(selectedTasks, "In Progress")}>
              <Clock className="mr-2 h-4 w-4 text-blue-500" />
              In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdateStatus(selectedTasks, "Completed")}>
              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
              Completed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdateStatus(selectedTasks, "On Hold")}>
              <PauseCircle className="mr-2 h-4 w-4 text-gray-500" />
              On Hold
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={isLoading}>
              Set Priority
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onUpdatePriority(selectedTasks, "High")}>
              <span className="mr-2 h-3 w-3 rounded-full bg-red-500" />
              High
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdatePriority(selectedTasks, "Medium")}>
              <span className="mr-2 h-3 w-3 rounded-full bg-yellow-500" />
              Medium
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdatePriority(selectedTasks, "Low")}>
              <span className="mr-2 h-3 w-3 rounded-full bg-green-500" />
              Low
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="sm" onClick={() => setAssignDialogOpen(true)} disabled={isLoading}>
          <User className="mr-2 h-4 w-4" />
          Assign
        </Button>

        <Button variant="outline" size="sm" onClick={() => setExportDialogOpen(true)} disabled={isLoading}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700"
          onClick={() => setDeleteDialogOpen(true)}
          disabled={isLoading}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Tasks</DialogTitle>
            <DialogDescription>
              Assign {selectedTasks.length} task{selectedTasks.length !== 1 ? "s" : ""} to a team member.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Input
                id="assignee"
                placeholder="Enter assignee name"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={!assignee.trim() || isLoading}>
              {isLoading ? "Assigning..." : "Assign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Tasks</DialogTitle>
            <DialogDescription>Export tasks to CSV or Excel format for analysis in external tools.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="filename">Filename</Label>
              <Input
                id="filename"
                placeholder="Enter filename without extension"
                value={exportFilename}
                onChange={(e) => setExportFilename(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Export Scope</Label>
              <div className="flex gap-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="selected-tasks"
                    name="export-scope"
                    className="mr-2"
                    checked={exportScope === "selected"}
                    onChange={() => setExportScope("selected")}
                  />
                  <Label htmlFor="selected-tasks" className="cursor-pointer">
                    Selected Tasks ({selectedTasks.length})
                  </Label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="all-tasks"
                    name="export-scope"
                    className="mr-2"
                    checked={exportScope === "all"}
                    onChange={() => setExportScope("all")}
                  />
                  <Label htmlFor="all-tasks" className="cursor-pointer">
                    All Tasks ({allTasks.length})
                  </Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button onClick={handleExportCSV} className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Export as CSV
              </Button>
              <Button onClick={handleExportExcel} className="flex items-center">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export as Excel
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedTasks.length} task{selectedTasks.length !== 1 ? "s" : ""}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
