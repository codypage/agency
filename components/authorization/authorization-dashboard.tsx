"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, subDays } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon, Download, Filter, Plus, Search } from "lucide-react"
import { AuthorizationTable } from "./authorization-table"
import { AuthorizationAlerts } from "./authorization-alerts"
import { AuthorizationMetrics } from "./authorization-metrics"
import { AuthorizationRequestForm } from "./authorization-request-form"

export function AuthorizationDashboard() {
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
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false)

  // Mock data for filters
  const providers = [
    { id: "stacy", name: "Stacy", role: "BCBA" },
    { id: "brittany", name: "Brittany", role: "RBT" },
    { id: "dakota", name: "Dakota", role: "BCBA" },
    { id: "jaden", name: "Jaden", role: "RBT" },
    { id: "bill", name: "Bill", role: "Admin" },
  ]

  const serviceCodes = [
    { code: "97151", description: "Behavior Identification Assessment" },
    { code: "97153", description: "Adaptive behavior treatment by protocol" },
    { code: "97154", description: "Group adaptive behavior treatment" },
    { code: "97155", description: "Adaptive behavior treatment with protocol modification" },
    { code: "97156", description: "Family adaptive behavior treatment guidance" },
    { code: "97158", description: "Group adaptive behavior treatment w/ protocol modification" },
  ]

  const clients = [
    { id: "incredible-test", name: "Incredible Test (Mock)" },
    { id: "client1", name: "John D." },
    { id: "client2", name: "Sarah M." },
    { id: "client3", name: "Michael R." },
    { id: "client4", name: "Emma T." },
  ]

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Authorization Management</h1>
          <p className="text-muted-foreground">Track and manage service authorizations</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsRequestFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Authorization
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter authorizations by date, provider, service, or client</CardDescription>
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
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name} {provider.role ? `(${provider.role})` : ""}
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
                  {serviceCodes.map((code) => (
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
                  {clients.map((client) => (
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
                placeholder="Search authorizations..."
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

      {/* Alerts and Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AuthorizationAlerts />
        </div>
        <div>
          <AuthorizationMetrics />
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Authorizations</TabsTrigger>
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
          <TabsTrigger value="expired">Expired Authorizations</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <AuthorizationTable
            status="active"
            dateRange={dateRange}
            provider={provider}
            cptCode={cptCode}
            client={client}
            searchQuery={searchQuery}
          />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <AuthorizationTable
            status="pending"
            dateRange={dateRange}
            provider={provider}
            cptCode={cptCode}
            client={client}
            searchQuery={searchQuery}
          />
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          <AuthorizationTable
            status="expired"
            dateRange={dateRange}
            provider={provider}
            cptCode={cptCode}
            client={client}
            searchQuery={searchQuery}
          />
        </TabsContent>
      </Tabs>

      {/* Authorization Request Form */}
      <AuthorizationRequestForm open={isRequestFormOpen} onOpenChange={setIsRequestFormOpen} />
    </div>
  )
}
