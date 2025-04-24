"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle, Clock, FileText, Filter, Plus, RefreshCw, Search, X } from "lucide-react"
import { AuthorizationTable } from "./authorization-table"
import { AuthorizationRequestForm } from "./authorization-request-form"
import { AuthorizationMetrics } from "./authorization-metrics"
import { AuthorizationAlerts } from "./authorization-alerts"

export function AuthorizationWorkflow() {
  const [activeTab, setActiveTab] = useState("active")
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    to: new Date(new Date().setMonth(new Date().getMonth() + 6)),
  })
  const [provider, setProvider] = useState("all")
  const [cptCode, setCptCode] = useState("all")
  const [client, setClient] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [requestFormOpen, setRequestFormOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Mock data for filters
  const providers = [
    { id: "all", name: "All Providers" },
    { id: "dakota", name: "Dakota" },
    { id: "stacy", name: "Stacy" },
    { id: "brittany", name: "Brittany" },
    { id: "jaden", name: "Jaden" },
  ]

  const cptCodes = [
    { id: "all", name: "All CPT Codes" },
    { id: "97151", name: "97151 - Behavior Identification Assessment" },
    { id: "97153", name: "97153 - Adaptive behavior treatment by protocol" },
    { id: "97154", name: "97154 - Group adaptive behavior treatment" },
    { id: "97155", name: "97155 - Adaptive behavior treatment with protocol modification" },
    { id: "97156", name: "97156 - Family adaptive behavior treatment guidance" },
    { id: "97157", name: "97157 - Multiple-family group adaptive behavior treatment guidance" },
    { id: "97158", name: "97158 - Group adaptive behavior treatment with protocol modification" },
  ]

  const clients = [
    { id: "all", name: "All Clients" },
    { id: "incredible-test", name: "Incredible Test" },
    { id: "client1", name: "John D." },
    { id: "client2", name: "Sarah M." },
    { id: "client3", name: "Michael R." },
    { id: "client4", name: "Emma T." },
    { id: "previous1", name: "Previous Client" },
  ]

  const refreshData = () => {
    setRefreshing(true)
    // Simulate API refresh
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  const resetFilters = () => {
    setProvider("all")
    setCptCode("all")
    setClient("all")
    setSearchQuery("")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>Authorization Management</CardTitle>
                  <CardDescription>Manage client authorizations and track utilization</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                    <Filter className="h-4 w-4 mr-2" />
                    {showFilters ? "Hide Filters" : "Show Filters"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={refreshData} disabled={refreshing}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  <Button size="sm" onClick={() => setRequestFormOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Request
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {showFilters && (
                <div className="mb-6 p-4 border rounded-lg bg-muted/20">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={resetFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="provider-filter">Provider</Label>
                      <Select value={provider} onValueChange={setProvider}>
                        <SelectTrigger id="provider-filter">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {providers.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpt-filter">CPT Code</Label>
                      <Select value={cptCode} onValueChange={setCptCode}>
                        <SelectTrigger id="cpt-filter">
                          <SelectValue placeholder="Select CPT code" />
                        </SelectTrigger>
                        <SelectContent>
                          {cptCodes.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client-filter">Client</Label>
                      <Select value={client} onValueChange={setClient}>
                        <SelectTrigger id="client-filter">
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="search-filter">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search-filter"
                        placeholder="Search by client name, CPT code, or authorization ID"
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="active" className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Active
                    <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">12</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                    Pending
                    <Badge className="ml-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">2</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="expired" className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-gray-500" />
                    Expired
                    <Badge className="ml-2 bg-gray-100 text-gray-800 hover:bg-gray-100">2</Badge>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="active">
                  <AuthorizationTable
                    status="active"
                    dateRange={dateRange}
                    provider={provider}
                    cptCode={cptCode}
                    client={client}
                    searchQuery={searchQuery}
                  />
                </TabsContent>
                <TabsContent value="pending">
                  <AuthorizationTable
                    status="pending"
                    dateRange={dateRange}
                    provider={provider}
                    cptCode={cptCode}
                    client={client}
                    searchQuery={searchQuery}
                  />
                </TabsContent>
                <TabsContent value="expired">
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
            </CardContent>
          </Card>
        </div>
        <div className="w-full md:w-1/3 space-y-6">
          <AuthorizationMetrics />
          <AuthorizationAlerts />
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common authorization tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" onClick={() => setRequestFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Authorization Request
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Generate Utilization Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                View Expiring Authorizations
              </Button>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium">API Integration Status</h3>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Connected to Desk365 API</span>
                </div>
                <div className="text-xs text-muted-foreground">Last synced: {new Date().toLocaleTimeString()}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Authorization Request Form */}
      <AuthorizationRequestForm open={requestFormOpen} onOpenChange={setRequestFormOpen} />
    </div>
  )
}
