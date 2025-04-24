"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, subDays } from "date-fns"
import { cn } from "@/lib/utils"
import {
  CalendarIcon,
  Download,
  Filter,
  HelpCircle,
  Search,
  TicketIcon,
  Star,
  StarOff,
  BarChart2,
  PieChart,
  FileText,
  Save,
  Clock,
  Users,
  CheckSquare,
  Sliders,
  X,
} from "lucide-react"
import { CptCodeUsageReport } from "./cpt-code-usage-report"
import { AuthorizationTrackingReport } from "./authorization-tracking-report"
import { ClientAuthorizationReport } from "./client-authorization-report"
import { ProgramSelector } from "./program-selector"
import { getProgramConfig } from "@/lib/program-config"
import { ReportTicketForm } from "./report-ticket-form"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/hooks/use-notifications"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProjectStatusReport } from "./project-status-report"
import { ResourceAllocationReport } from "./resource-allocation-report"
import { TaskCompletionReport } from "./task-completion-report"
import { SaveReportDialog } from "./save-report-dialog"
import { ExportReportDialog } from "./export-report-dialog"
import { ReportUsageMetrics } from "./report-usage-metrics"
import { CustomReportBuilder } from "./custom-report-builder"

// Define report types
export type ReportType =
  | "service-usage"
  | "authorization"
  | "client-detail"
  | "project-status"
  | "resource-allocation"
  | "task-completion"
  | "custom"

// Define saved report interface
export interface SavedReport {
  id: string
  name: string
  type: ReportType
  program: string
  dateRange: {
    from: Date
    to: Date
  }
  filters: {
    provider: string
    cptCode: string
    client: string
    searchQuery: string
    [key: string]: any
  }
  isFavorite: boolean
  lastRun: Date
  createdBy: string
}

export function EnhancedReportsDashboard() {
  const [selectedProgram, setSelectedProgram] = useState<string>("autism")
  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date
  }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [provider, setProvider] = useState<string>("all")
  const [cptCode, setCptCode] = useState<string>("all")
  const [client, setClient] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<ReportType>("service-usage")
  const [isTicketFormOpen, setIsTicketFormOpen] = useState(false)
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [savedReports, setSavedReports] = useState<SavedReport[]>([])
  const [favoriteReports, setFavoriteReports] = useState<SavedReport[]>([])
  const [showReportMetrics, setShowReportMetrics] = useState(false)
  const [isCustomReportOpen, setIsCustomReportOpen] = useState(false)

  // Get program configuration
  const programConfig = getProgramConfig(selectedProgram)
  const { notifySystem } = useNotifications()

  // Load saved reports from localStorage on component mount
  useEffect(() => {
    const loadSavedReports = () => {
      const savedReportsJson = localStorage.getItem("savedReports")
      if (savedReportsJson) {
        try {
          const reports = JSON.parse(savedReportsJson)
          // Convert date strings back to Date objects
          const reportsWithDates = reports.map((report: any) => ({
            ...report,
            dateRange: {
              from: new Date(report.dateRange.from),
              to: new Date(report.dateRange.to),
            },
            lastRun: new Date(report.lastRun),
          }))
          setSavedReports(reportsWithDates)
          setFavoriteReports(reportsWithDates.filter((r: SavedReport) => r.isFavorite))
        } catch (error) {
          console.error("Error loading saved reports:", error)
        }
      }
    }

    loadSavedReports()
  }, [])

  const handleProgramChange = (program: string) => {
    setSelectedProgram(program)
    // Reset filters when changing programs
    setProvider("all")
    setCptCode("all")
    setClient("all")
    setSearchQuery("")
  }

  const handleExport = (format: string) => {
    // Track report generation
    trackReportUsage(activeTab)

    // Open export dialog
    setIsExportDialogOpen(true)
  }

  const handleSaveReport = () => {
    setIsSaveDialogOpen(true)
  }

  const saveReport = (name: string) => {
    const newReport: SavedReport = {
      id: `report-${Date.now()}`,
      name,
      type: activeTab,
      program: selectedProgram,
      dateRange,
      filters: {
        provider,
        cptCode,
        client,
        searchQuery,
      },
      isFavorite: false,
      lastRun: new Date(),
      createdBy: "Current User", // In a real app, this would be the current user
    }

    const updatedReports = [...savedReports, newReport]
    setSavedReports(updatedReports)

    // Save to localStorage
    localStorage.setItem("savedReports", JSON.stringify(updatedReports))

    notifySystem("Report Saved", `Report "${name}" has been saved successfully.`, "success")
  }

  const loadReport = (report: SavedReport) => {
    setSelectedProgram(report.program)
    setDateRange(report.dateRange)
    setProvider(report.filters.provider)
    setCptCode(report.filters.cptCode)
    setClient(report.filters.client)
    setSearchQuery(report.filters.searchQuery)
    setActiveTab(report.type)

    // Update last run time
    const updatedReport = { ...report, lastRun: new Date() }
    const updatedReports = savedReports.map((r) => (r.id === report.id ? updatedReport : r))
    setSavedReports(updatedReports)

    // Update favorites if needed
    if (report.isFavorite) {
      setFavoriteReports(favoriteReports.map((r) => (r.id === report.id ? updatedReport : r)))
    }

    // Save to localStorage
    localStorage.setItem("savedReports", JSON.stringify(updatedReports))

    // Track report usage
    trackReportUsage(report.type)

    notifySystem("Report Loaded", `Report "${report.name}" has been loaded successfully.`, "info")
  }

  const toggleFavorite = (reportId: string) => {
    const updatedReports = savedReports.map((report) => {
      if (report.id === reportId) {
        const updated = { ...report, isFavorite: !report.isFavorite }
        return updated
      }
      return report
    })

    setSavedReports(updatedReports)
    setFavoriteReports(updatedReports.filter((r) => r.isFavorite))

    // Save to localStorage
    localStorage.setItem("savedReports", JSON.stringify(updatedReports))

    const report = updatedReports.find((r) => r.id === reportId)
    if (report) {
      notifySystem(
        report.isFavorite ? "Added to Favorites" : "Removed from Favorites",
        `Report "${report.name}" has been ${report.isFavorite ? "added to" : "removed from"} favorites.`,
        "info",
      )
    }
  }

  const deleteReport = (reportId: string) => {
    const reportToDelete = savedReports.find((r) => r.id === reportId)
    const updatedReports = savedReports.filter((report) => report.id !== reportId)

    setSavedReports(updatedReports)
    setFavoriteReports(updatedReports.filter((r) => r.isFavorite))

    // Save to localStorage
    localStorage.setItem("savedReports", JSON.stringify(updatedReports))

    if (reportToDelete) {
      notifySystem("Report Deleted", `Report "${reportToDelete.name}" has been deleted.`, "info")
    }
  }

  // Track report usage
  const trackReportUsage = (reportType: ReportType) => {
    // In a real implementation, this would send usage data to an analytics service
    console.log(`Report generated: ${reportType}`, {
      timestamp: new Date(),
      program: selectedProgram,
      reportType,
      filters: {
        dateRange,
        provider,
        cptCode,
        client,
        searchQuery,
      },
    })
  }

  const getReportIcon = (type: ReportType) => {
    switch (type) {
      case "service-usage":
        return <BarChart2 className="h-4 w-4" />
      case "authorization":
        return <FileText className="h-4 w-4" />
      case "client-detail":
        return <Users className="h-4 w-4" />
      case "project-status":
        return <PieChart className="h-4 w-4" />
      case "resource-allocation":
        return <Users className="h-4 w-4" />
      case "task-completion":
        return <CheckSquare className="h-4 w-4" />
      case "custom":
        return <Sliders className="h-4 w-4" />
      default:
        return <BarChart2 className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Enhanced Reports</h1>
          <p className="text-muted-foreground">{programConfig.name} - Comprehensive Reporting Dashboard</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsCustomReportOpen(true)}>
            <Sliders className="mr-2 h-4 w-4" /> Custom Report
          </Button>
          <Button variant="outline" onClick={() => setIsTicketFormOpen(true)}>
            <TicketIcon className="mr-2 h-4 w-4" /> Submit Report Ticket
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Export Format</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>PDF Document</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")}>Excel Spreadsheet</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv")}>CSV File</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Favorites Bar */}
      {favoriteReports.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-2" />
              Favorite Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {favoriteReports.map((report) => (
                <Badge
                  key={report.id}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent flex items-center gap-1 py-1 px-3"
                  onClick={() => loadReport(report)}
                >
                  {getReportIcon(report.type)}
                  <span>{report.name}</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Program Selector */}
      <ProgramSelector selectedProgram={selectedProgram} onProgramChange={handleProgramChange} />

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Report Filters</CardTitle>
              <CardDescription>Customize your report view</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSaveReport}>
                <Save className="mr-2 h-4 w-4" /> Save Report
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" /> Load Report
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[240px]">
                  <DropdownMenuLabel>Saved Reports</DropdownMenuLabel>
                  {savedReports.length === 0 ? (
                    <DropdownMenuItem disabled>No saved reports</DropdownMenuItem>
                  ) : (
                    savedReports.map((report) => (
                      <DropdownMenuItem key={report.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-2" onClick={() => loadReport(report)}>
                          {getReportIcon(report.type)}
                          <span>{report.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(report.id)
                            }}
                          >
                            {report.isFavorite ? (
                              <Star className="h-3.5 w-3.5 text-yellow-400" />
                            ) : (
                              <StarOff className="h-3.5 w-3.5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteReport(report.id)
                            }}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowReportMetrics(true)}>
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Report Usage Metrics</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date-range">Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-range"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal")}
                  >
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
                      <span>Pick a date</span>
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
                      if (range?.from && range?.to) {
                        setDateRange({ from: range.from, to: range.to })
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger id="provider">
                  <SelectValue placeholder="All Providers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  {programConfig.providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name} {provider.role ? `(${provider.role})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpt-code">{programConfig.terminology.serviceCode}</Label>
              <Select value={cptCode} onValueChange={setCptCode}>
                <SelectTrigger id="cpt-code">
                  <SelectValue placeholder={`All ${programConfig.terminology.serviceCode}s`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{`All ${programConfig.terminology.serviceCode}s`}</SelectItem>
                  {programConfig.serviceCodes.map((code) => (
                    <SelectItem key={code.code} value={code.code}>
                      {code.code} - {code.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select value={client} onValueChange={setClient}>
                <SelectTrigger id="client">
                  <SelectValue placeholder="All Clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {programConfig.clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs defaultValue="service-usage" value={activeTab} onValueChange={(value) => setActiveTab(value as ReportType)}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="service-usage">
            <BarChart2 className="mr-2 h-4 w-4" />
            {programConfig.terminology.serviceUsage} Usage
          </TabsTrigger>
          <TabsTrigger value="authorization">
            <FileText className="mr-2 h-4 w-4" />
            {programConfig.terminology.authorization} Tracking
          </TabsTrigger>
          <TabsTrigger value="client-detail">
            <Users className="mr-2 h-4 w-4" />
            Client Detail
          </TabsTrigger>
          <TabsTrigger value="project-status">
            <PieChart className="mr-2 h-4 w-4" />
            Project Status
          </TabsTrigger>
          <TabsTrigger value="resource-allocation">
            <Users className="mr-2 h-4 w-4" />
            Resource Allocation
          </TabsTrigger>
          <TabsTrigger value="task-completion">
            <CheckSquare className="mr-2 h-4 w-4" />
            Task Completion
          </TabsTrigger>
          <TabsTrigger value="custom">
            <Sliders className="mr-2 h-4 w-4" />
            Custom Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="service-usage" className="space-y-4">
          <CptCodeUsageReport
            program={selectedProgram}
            dateRange={dateRange}
            provider={provider}
            cptCode={cptCode}
            searchQuery={searchQuery}
          />
        </TabsContent>

        <TabsContent value="authorization" className="space-y-4">
          <AuthorizationTrackingReport
            program={selectedProgram}
            dateRange={dateRange}
            provider={provider}
            cptCode={cptCode}
            searchQuery={searchQuery}
          />
        </TabsContent>

        <TabsContent value="client-detail" className="space-y-4">
          <ClientAuthorizationReport
            program={selectedProgram}
            client={client !== "all" ? client : "incredible-test"}
            dateRange={dateRange}
          />
        </TabsContent>

        <TabsContent value="project-status" className="space-y-4">
          <ProjectStatusReport
            program={selectedProgram}
            dateRange={dateRange}
            provider={provider}
            searchQuery={searchQuery}
          />
        </TabsContent>

        <TabsContent value="resource-allocation" className="space-y-4">
          <ResourceAllocationReport
            program={selectedProgram}
            dateRange={dateRange}
            provider={provider}
            searchQuery={searchQuery}
          />
        </TabsContent>

        <TabsContent value="task-completion" className="space-y-4">
          <TaskCompletionReport
            program={selectedProgram}
            dateRange={dateRange}
            provider={provider}
            searchQuery={searchQuery}
          />
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <CustomReportBuilder program={selectedProgram} dateRange={dateRange} onSave={saveReport} />
        </TabsContent>
      </Tabs>

      {/* Help text with ticket submission reminder */}
      <Card className="bg-muted/30">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <HelpCircle className="h-5 w-5 text-muted-foreground mr-2" />
            <p className="text-sm text-muted-foreground">
              Need a custom report or having issues with the data? Submit a report ticket to the reporting team.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsTicketFormOpen(true)}>
            <TicketIcon className="mr-2 h-4 w-4" /> Submit Ticket
          </Button>
        </CardContent>
      </Card>

      {/* Report Ticket Form Dialog */}
      <ReportTicketForm
        open={isTicketFormOpen}
        onOpenChange={setIsTicketFormOpen}
        programName={programConfig.name}
        reportType={
          activeTab === "service-usage"
            ? `${programConfig.terminology.serviceUsage} Usage`
            : activeTab === "authorization"
              ? `${programConfig.terminology.authorization} Tracking`
              : activeTab === "client-detail"
                ? "Client Detail"
                : activeTab === "project-status"
                  ? "Project Status"
                  : activeTab === "resource-allocation"
                    ? "Resource Allocation"
                    : activeTab === "task-completion"
                      ? "Task Completion"
                      : "Custom Report"
        }
      />

      {/* Save Report Dialog */}
      <SaveReportDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        onSave={saveReport}
        reportType={activeTab}
      />

      {/* Export Report Dialog */}
      <ExportReportDialog
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        reportType={activeTab}
        program={selectedProgram}
        dateRange={dateRange}
      />

      {/* Report Usage Metrics Dialog */}
      <ReportUsageMetrics open={showReportMetrics} onOpenChange={setShowReportMetrics} savedReports={savedReports} />

      {/* Custom Report Builder Dialog */}
      <CustomReportBuilder
        open={isCustomReportOpen}
        onOpenChange={setIsCustomReportOpen}
        program={selectedProgram}
        dateRange={dateRange}
        onSave={saveReport}
      />
    </div>
  )
}
