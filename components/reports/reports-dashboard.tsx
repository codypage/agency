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
import { CalendarIcon, Download, Filter, Search } from "lucide-react"
import { CptCodeUsageReport } from "./cpt-code-usage-report"
import { AuthorizationTrackingReport } from "./authorization-tracking-report"
import { ClientAuthorizationReport } from "./client-authorization-report"
import { ProgramSelector } from "./program-selector"
import { getProgramConfig } from "@/lib/program-config"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ReportsDashboard() {
  const [program, setProgram] = useState<string>("autism")
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

  // Get program-specific configuration
  const programConfig = getProgramConfig(program)

  const handleExport = async (reportType: string) => {
    try {
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType,
          program,
          dateRange,
          provider,
          cptCode,
          client,
          searchQuery,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Failed to generate report:", errorData)
        alert("Failed to generate report: " + errorData.message)
        return
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "report.pdf"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating report:", error)
      alert("An unexpected error occurred while generating the report.")
    }
  }

  const handleProgramChange = (newProgram: string) => {
    setProgram(newProgram)
    // Reset CPT code when changing programs since they're program-specific
    setCptCode("all")
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Service Usage and Authorization Tracking</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Download className="mr-2 h-4 w-4" /> Export Report
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Export Format</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleExport("excel")}>Excel (.xlsx)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("pdf")}>PDF Document</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("csv")}>CSV File</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Program Selector */}
      <ProgramSelector selectedProgram={program} onProgramChange={handleProgramChange} />

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
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpt-code">Service Code</Label>
              <Select value={cptCode} onValueChange={setCptCode}>
                <SelectTrigger id="cpt-code">
                  <SelectValue placeholder="All Service Codes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Service Codes</SelectItem>
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

          <div className="mt-4 border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Advanced Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="group-by">Group By</Label>
                <Select defaultValue="none">
                  <SelectTrigger id="group-by">
                    <SelectValue placeholder="No Grouping" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Grouping</SelectItem>
                    <SelectItem value="provider">Provider</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="service">Service Code</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chart-type">Chart Type</Label>
                <Select defaultValue="bar">
                  <SelectTrigger id="chart-type">
                    <SelectValue placeholder="Bar Chart" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fields">Display Fields</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant="outline" className="cursor-pointer">
                    Client Name ✓
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer">
                    Service Code ✓
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer opacity-50">
                    Provider +
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer opacity-50">
                    Units +
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs defaultValue="service-usage">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="service-usage">{programConfig.terminology.serviceUsage} Usage</TabsTrigger>
          <TabsTrigger value="authorization">{programConfig.terminology.authorization} Tracking</TabsTrigger>
          <TabsTrigger value="client-detail">Client Detail</TabsTrigger>
        </TabsList>

        <TabsContent value="service-usage" className="space-y-4">
          <CptCodeUsageReport
            program={program}
            dateRange={dateRange}
            provider={provider}
            cptCode={cptCode}
            searchQuery={searchQuery}
          />
        </TabsContent>

        <TabsContent value="authorization" className="space-y-4">
          <AuthorizationTrackingReport
            program={program}
            dateRange={dateRange}
            provider={provider}
            cptCode={cptCode}
            searchQuery={searchQuery}
          />
        </TabsContent>

        <TabsContent value="client-detail" className="space-y-4">
          <ClientAuthorizationReport
            program={program}
            client={client !== "all" ? client : programConfig.clients[0].id}
            dateRange={dateRange}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
