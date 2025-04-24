"use client"

import { useState } from "react"
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
import { CalendarIcon, Download, Filter, HelpCircle, Search, TicketIcon } from "lucide-react"
import { CptCodeUsageReport } from "./cpt-code-usage-report"
import { AuthorizationTrackingReport } from "./authorization-tracking-report"
import { ClientAuthorizationReport } from "./client-authorization-report"
import { ProgramSelector } from "./program-selector"
import { getProgramConfig } from "@/lib/program-config"
import { ReportTicketForm } from "./report-ticket-form"

export function ReportsDashboard() {
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
  const [activeTab, setActiveTab] = useState("service-usage")
  const [isTicketFormOpen, setIsTicketFormOpen] = useState(false)

  // Get program configuration
  const programConfig = getProgramConfig(selectedProgram)

  const handleProgramChange = (program: string) => {
    setSelectedProgram(program)
    // Reset filters when changing programs
    setProvider("all")
    setCptCode("all")
    setClient("all")
    setSearchQuery("")
  }

  const handleExport = (reportType: string) => {
    // In a real implementation, this would generate and download a CSV or PDF report
    console.log(`Exporting ${reportType} report with filters:`, {
      program: selectedProgram,
      dateRange,
      provider,
      cptCode,
      client,
      searchQuery,
    })
    alert(`Exporting ${reportType} report (this would download a file in the real implementation)`)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">{programConfig.name} - Service Usage and Authorization Tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsTicketFormOpen(true)}>
            <TicketIcon className="mr-2 h-4 w-4" /> Submit Report Ticket
          </Button>
          <Button onClick={() => handleExport("current")}>
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Program Selector */}
      <ProgramSelector selectedProgram={selectedProgram} onProgramChange={handleProgramChange} />

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>Customize your report view</CardDescription>
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
      <Tabs defaultValue="service-usage" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="service-usage">{programConfig.terminology.serviceUsage} Usage</TabsTrigger>
          <TabsTrigger value="authorization">{programConfig.terminology.authorization} Tracking</TabsTrigger>
          <TabsTrigger value="client-detail">Client Detail</TabsTrigger>
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
              : "Client Detail"
        }
      />
    </div>
  )
}
