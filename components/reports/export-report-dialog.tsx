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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Table2 } from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"
import type { ReportType } from "./enhanced-reports-dashboard"

interface ExportReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reportType: ReportType
  program: string
  dateRange: {
    from: Date
    to: Date
  }
}

export function ExportReportDialog({ open, onOpenChange, reportType, program, dateRange }: ExportReportDialogProps) {
  const [format, setFormat] = useState<"pdf" | "excel" | "csv">("pdf")
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeRawData, setIncludeRawData] = useState(true)
  const [includeFilters, setIncludeFilters] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const { notifySystem } = useNotifications()

  const handleExport = async () => {
    setIsExporting(true)

    try {
      // In a real implementation, this would call an API to generate the export
      console.log("Exporting report:", {
        reportType,
        program,
        dateRange,
        format,
        includeCharts,
        includeRawData,
        includeFilters,
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      notifySystem(
        "Report Exported",
        `Report has been exported successfully in ${format.toUpperCase()} format.`,
        "success",
      )

      // Close dialog
      onOpenChange(false)
    } catch (error) {
      console.error("Error exporting report:", error)
      notifySystem("Export Failed", "An error occurred while exporting the report. Please try again.", "error")
    } finally {
      setIsExporting(false)
    }
  }

  const getFormatIcon = () => {
    switch (format) {
      case "pdf":
        return <FileText className="h-4 w-4" />
      case "excel":
      case "csv":
        return <Table2 className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Report</DialogTitle>
          <DialogDescription>Choose export format and options</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Export Format</Label>
            <RadioGroup value={format} onValueChange={(value) => setFormat(value as "pdf" | "excel" | "csv")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf">PDF Document</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel">Excel Spreadsheet</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv">CSV File</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Export Options</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-charts"
                  checked={includeCharts}
                  onCheckedChange={(checked) => setIncludeCharts(!!checked)}
                  disabled={format === "csv"}
                />
                <Label htmlFor="include-charts">Include charts and visualizations</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-raw-data"
                  checked={includeRawData}
                  onCheckedChange={(checked) => setIncludeRawData(!!checked)}
                />
                <Label htmlFor="include-raw-data">Include raw data tables</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-filters"
                  checked={includeFilters}
                  onCheckedChange={(checked) => setIncludeFilters(!!checked)}
                />
                <Label htmlFor="include-filters">Include applied filters</Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              "Exporting..."
            ) : (
              <>
                {getFormatIcon()}
                <span className="ml-2">Export as {format.toUpperCase()}</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
