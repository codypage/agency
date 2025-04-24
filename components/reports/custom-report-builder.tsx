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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { getProgramConfig } from "@/lib/program-config"
import { BarChart2, PieChart, LineChart, TableIcon, X, Move, Save, Eye } from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CustomReportBuilderProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  program: string
  dateRange: {
    from: Date
    to: Date
  }
  onSave: (name: string) => void
}

export function CustomReportBuilder({ open, onOpenChange, program, dateRange, onSave }: CustomReportBuilderProps) {
  const [reportName, setReportName] = useState("")
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [selectedCharts, setSelectedCharts] = useState<string[]>([])
  const [groupBy, setGroupBy] = useState<string>("none")
  const [sortBy, setSortBy] = useState<string>("none")
  const [activeTab, setActiveTab] = useState<string>("fields")
  const [previewMode, setPreviewMode] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const { notifySystem } = useNotifications()

  // Get program configuration
  const programConfig = getProgramConfig(program)

  // Available fields
  const availableFields = [
    { id: "client", name: "Client" },
    { id: "provider", name: "Provider" },
    { id: "cptCode", name: "Service Code" },
    { id: "description", name: "Service Description" },
    { id: "authorizedUnits", name: "Authorized Units" },
    { id: "usedUnits", name: "Used Units" },
    { id: "remainingUnits", name: "Remaining Units" },
    { id: "startDate", name: "Start Date" },
    { id: "endDate", name: "End Date" },
    { id: "status", name: "Status" },
    { id: "percentUsed", name: "Utilization Percentage" },
  ]

  // Available charts
  const availableCharts = [
    { id: "serviceUsageBar", name: "Service Usage Bar Chart", type: "bar", icon: BarChart2 },
    { id: "statusPie", name: "Status Distribution Pie Chart", type: "pie", icon: PieChart },
    { id: "utilizationLine", name: "Utilization Trend Line Chart", type: "line", icon: LineChart },
    { id: "providerBar", name: "Provider Allocation Bar Chart", type: "bar", icon: BarChart2 },
  ]

  // Handle field selection
  const toggleField = (fieldId: string) => {
    if (selectedFields.includes(fieldId)) {
      setSelectedFields(selectedFields.filter((id) => id !== fieldId))
    } else {
      setSelectedFields([...selectedFields, fieldId])
    }
  }

  // Handle chart selection
  const toggleChart = (chartId: string) => {
    if (selectedCharts.includes(chartId)) {
      setSelectedCharts(selectedCharts.filter((id) => id !== chartId))
    } else {
      setSelectedCharts([...selectedCharts, chartId])
    }
  }

  // Handle drag and drop for fields
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(selectedFields)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSelectedFields(items)
  }

  // Handle drag and drop for charts
  const handleChartDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(selectedCharts)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSelectedCharts(items)
  }

  // Handle save
  const handleSave = () => {
    if (!reportName.trim()) {
      setError("Please enter a report name")
      return
    }

    if (selectedFields.length === 0) {
      setError("Please select at least one field")
      return
    }

    onSave(reportName)

    notifySystem("Custom Report Created", `Custom report "${reportName}" has been created successfully.`, "success")

    // Reset form
    resetForm()

    // Close dialog if in dialog mode
    if (onOpenChange) {
      onOpenChange(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setReportName("")
    setSelectedFields([])
    setSelectedCharts([])
    setGroupBy("none")
    setSortBy("none")
    setActiveTab("fields")
    setPreviewMode(false)
    setError(null)
  }

  // Get chart icon
  const getChartIcon = (type: string) => {
    switch (type) {
      case "bar":
        return <BarChart2 className="h-4 w-4" />
      case "pie":
        return <PieChart className="h-4 w-4" />
      case "line":
        return <LineChart className="h-4 w-4" />
      default:
        return <BarChart2 className="h-4 w-4" />
    }
  }

  const content = (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Report Name */}
      <div className="grid gap-2">
        <Label htmlFor="report-name">Report Name</Label>
        <Input
          id="report-name"
          placeholder="My Custom Report"
          value={reportName}
          onChange={(e) => {
            setReportName(e.target.value)
            setError(null)
          }}
        />
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="fields" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fields">
            <TableIcon className="mr-2 h-4 w-4" />
            Fields
          </TabsTrigger>
          <TabsTrigger value="charts">
            <BarChart2 className="mr-2 h-4 w-4" />
            Charts
          </TabsTrigger>
          <TabsTrigger value="options">
            <PieChart className="mr-2 h-4 w-4" />
            Options
          </TabsTrigger>
        </TabsList>

        {/* Fields Tab */}
        <TabsContent value="fields" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Available Fields */}
            <Card>
              <CardHeader>
                <CardTitle>Available Fields</CardTitle>
                <CardDescription>Select fields to include in your report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {availableFields.map((field) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`field-${field.id}`}
                        checked={selectedFields.includes(field.id)}
                        onCheckedChange={() => toggleField(field.id)}
                      />
                      <Label htmlFor={`field-${field.id}`}>{field.name}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Fields */}
            <Card>
              <CardHeader>
                <CardTitle>Selected Fields</CardTitle>
                <CardDescription>Drag to reorder fields in your report</CardDescription>
              </CardHeader>
              <CardContent>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="selected-fields">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 min-h-[200px]">
                        {selectedFields.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                            <p>No fields selected</p>
                            <p className="text-sm">Select fields from the left panel</p>
                          </div>
                        ) : (
                          selectedFields.map((fieldId, index) => {
                            const field = availableFields.find((f) => f.id === fieldId)
                            if (!field) return null

                            return (
                              <Draggable key={fieldId} draggableId={fieldId} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="flex items-center justify-between p-2 border rounded-md bg-background"
                                  >
                                    <div className="flex items-center">
                                      <div {...provided.dragHandleProps} className="mr-2">
                                        <Move className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                      <span>{field.name}</span>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => toggleField(fieldId)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </Draggable>
                            )
                          })
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Charts Tab */}
        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Available Charts */}
            <Card>
              <CardHeader>
                <CardTitle>Available Charts</CardTitle>
                <CardDescription>Select charts to include in your report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {availableCharts.map((chart) => {
                    const ChartIcon = chart.icon
                    return (
                      <div key={chart.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`chart-${chart.id}`}
                          checked={selectedCharts.includes(chart.id)}
                          onCheckedChange={() => toggleChart(chart.id)}
                        />
                        <Label htmlFor={`chart-${chart.id}`} className="flex items-center">
                          <ChartIcon className="h-4 w-4 mr-2" />
                          {chart.name}
                        </Label>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Selected Charts */}
            <Card>
              <CardHeader>
                <CardTitle>Selected Charts</CardTitle>
                <CardDescription>Drag to reorder charts in your report</CardDescription>
              </CardHeader>
              <CardContent>
                <DragDropContext onDragEnd={handleChartDragEnd}>
                  <Droppable droppableId="selected-charts">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 min-h-[200px]">
                        {selectedCharts.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                            <p>No charts selected</p>
                            <p className="text-sm">Select charts from the left panel</p>
                          </div>
                        ) : (
                          selectedCharts.map((chartId, index) => {
                            const chart = availableCharts.find((c) => c.id === chartId)
                            if (!chart) return null

                            return (
                              <Draggable key={chartId} draggableId={chartId} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="flex items-center justify-between p-2 border rounded-md bg-background"
                                  >
                                    <div className="flex items-center">
                                      <div {...provided.dragHandleProps} className="mr-2">
                                        <Move className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                      <span className="flex items-center">
                                        {getChartIcon(chart.type)}
                                        <span className="ml-2">{chart.name}</span>
                                      </span>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => toggleChart(chartId)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </Draggable>
                            )
                          })
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Options Tab */}
        <TabsContent value="options" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Options</CardTitle>
              <CardDescription>Configure additional report options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="group-by">Group By</Label>
                <Select value={groupBy} onValueChange={setGroupBy}>
                  <SelectTrigger id="group-by">
                    <SelectValue placeholder="Select grouping" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Grouping</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="provider">Provider</SelectItem>
                    <SelectItem value="cptCode">Service Code</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sort-by">Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort-by">
                    <SelectValue placeholder="Select sorting" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Sorting</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="provider">Provider</SelectItem>
                    <SelectItem value="cptCode">Service Code</SelectItem>
                    <SelectItem value="authorizedUnits">Authorized Units</SelectItem>
                    <SelectItem value="usedUnits">Used Units</SelectItem>
                    <SelectItem value="percentUsed">Utilization Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Additional Options</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-totals" />
                  <Label htmlFor="include-totals">Include summary totals</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-filters" />
                  <Label htmlFor="include-filters">Show applied filters</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-date" />
                  <Label htmlFor="include-date">Include report generation date</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview/Save Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
          <Eye className="mr-2 h-4 w-4" />
          {previewMode ? "Edit Report" : "Preview Report"}
        </Button>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Report
        </Button>
      </div>

      {/* Preview Mode */}
      {previewMode && (
        <Card>
          <CardHeader>
            <CardTitle>{reportName || "Custom Report"}</CardTitle>
            <CardDescription>Preview of your custom report</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedFields.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        {selectedFields.map((fieldId) => {
                          const field = availableFields.find((f) => f.id === fieldId)
                          return (
                            <th key={fieldId} className="px-4 py-2 text-left font-medium">
                              {field?.name}
                            </th>
                          )
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Sample data rows */}
                      {[1, 2, 3].map((row) => (
                        <tr key={row} className="border-t">
                          {selectedFields.map((fieldId) => (
                            <td key={`${row}-${fieldId}`} className="px-4 py-2">
                              {fieldId === "client"
                                ? `Client ${row}`
                                : fieldId === "provider"
                                  ? `Provider ${row}`
                                  : fieldId === "cptCode"
                                    ? `97${150 + row}`
                                    : fieldId === "description"
                                      ? "Sample description"
                                      : fieldId === "authorizedUnits"
                                        ? Math.floor(Math.random() * 100)
                                        : fieldId === "usedUnits"
                                          ? Math.floor(Math.random() * 50)
                                          : fieldId === "remainingUnits"
                                            ? Math.floor(Math.random() * 50)
                                            : fieldId === "startDate"
                                              ? "2023-01-01"
                                              : fieldId === "endDate"
                                                ? "2023-12-31"
                                                : fieldId === "status"
                                                  ? "Active"
                                                  : fieldId === "percentUsed"
                                                    ? `${Math.floor(Math.random() * 100)}%`
                                                    : "Sample data"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                  <p>No fields selected</p>
                  <p className="text-sm">Select fields to preview the report</p>
                </div>
              )}

              {selectedCharts.length > 0 && (
                <div className="space-y-4 mt-6">
                  <h3 className="text-lg font-medium">Charts</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCharts.map((chartId) => {
                      const chart = availableCharts.find((c) => c.id === chartId)
                      if (!chart) return null

                      return (
                        <div key={chartId} className="border rounded-md p-4">
                          <h4 className="text-sm font-medium mb-2">{chart.name}</h4>
                          <div className="h-40 bg-muted/50 rounded-md flex items-center justify-center">
                            {getChartIcon(chart.type)}
                            <span className="ml-2">Chart Preview</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  // If used as a dialog
  if (open !== undefined && onOpenChange) {
    return (
      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          if (!newOpen) resetForm()
          onOpenChange(newOpen)
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Custom Report Builder</DialogTitle>
            <DialogDescription>Create a custom report by selecting fields, charts, and options</DialogDescription>
          </DialogHeader>
          {content}
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

  // If used as a standalone component
  return content
}
