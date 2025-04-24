"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Save } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { ReportType } from "./enhanced-reports-dashboard"

interface SaveReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (name: string) => void
  reportType: ReportType
}

export function SaveReportDialog({ open, onOpenChange, onSave, reportType }: SaveReportDialogProps) {
  const [reportName, setReportName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [addToFavorites, setAddToFavorites] = useState(false)

  const handleSave = () => {
    if (!reportName.trim()) {
      setError("Please enter a report name")
      return
    }

    onSave(reportName)
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setReportName("")
    setError(null)
    setAddToFavorites(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) resetForm()
        onOpenChange(newOpen)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Report</DialogTitle>
          <DialogDescription>Save your current report configuration for future use</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="report-name">Report Name</Label>
            <Input
              id="report-name"
              placeholder={`${reportType.charAt(0).toUpperCase() + reportType.slice(1).replace(/-/g, " ")} Report`}
              value={reportName}
              onChange={(e) => {
                setReportName(e.target.value)
                setError(null)
              }}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="add-to-favorites" checked={addToFavorites} onCheckedChange={setAddToFavorites} />
            <Label htmlFor="add-to-favorites">Add to favorites</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
