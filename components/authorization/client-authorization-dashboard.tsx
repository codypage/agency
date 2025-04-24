"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Calendar, CheckCircle, Clock, FileText, Plus, RefreshCw } from "lucide-react"
import { AuthorizationDetailsDialog } from "./authorization-details-dialog"
import { AuthorizationRequestForm } from "./authorization-request-form"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface Client {
  id: string
  name: string
  avatar?: string
  insuranceProvider: string
  memberID: string
  dateOfBirth: string
}

interface Authorization {
  id: string
  clientId: string
  serviceCode: string
  serviceDescription: string
  authorizedUnits: number
  usedUnits: number
  startDate: string
  endDate: string
  status: "active" | "pending" | "expired"
  insuranceProvider: string
  approvalDate?: string
  notes?: string
}

interface ClientAuthorizationDashboardProps {
  clientId: string
}

export function ClientAuthorizationDashboard({ clientId }: ClientAuthorizationDashboardProps) {
  const [selectedAuth, setSelectedAuth] = useState<Authorization | null>(null)
  const [isAuthDetailsOpen, setIsAuthDetailsOpen] = useState(false)
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false)

  // Mock client data
  const client: Client = {
    id: clientId,
    name: "John Smith",
    avatar: "/abstract-blue-burst.png",
    insuranceProvider: "Blue Cross Blue Shield",
    memberID: "BCBS12345678",
    dateOfBirth: "2015-06-12",
  }

  // Mock authorization data
  const authorizations: Authorization[] = [
    {
      id: "AUTH-001",
      clientId,
      serviceCode: "97151",
      serviceDescription: "Behavior Identification Assessment",
      authorizedUnits: 40,
      usedUnits: 32,
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      status: "active",
      insuranceProvider: "Blue Cross Blue Shield",
      approvalDate: "2022-12-15",
    },
    {
      id: "AUTH-002",
      clientId,
      serviceCode: "97153",
      serviceDescription: "Adaptive behavior treatment by protocol",
      authorizedUnits: 960,
      usedUnits: 720,
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      status: "active",
      insuranceProvider: "Blue Cross Blue Shield",
      approvalDate: "2022-12-15",
    },
    {
      id: "AUTH-003",
      clientId,
      serviceCode: "97155",
      serviceDescription: "Adaptive behavior treatment with protocol modification",
      authorizedUnits: 120,
      usedUnits: 60,
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      status: "active",
      insuranceProvider: "Blue Cross Blue Shield",
      approvalDate: "2022-12-15",
    },
    {
      id: "AUTH-004",
      clientId,
      serviceCode: "97156",
      serviceDescription: "Family adaptive behavior treatment guidance",
      authorizedUnits: 48,
      usedUnits: 24,
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      status: "active",
      insuranceProvider: "Blue Cross Blue Shield",
      approvalDate: "2022-12-15",
    },
    {
      id: "AUTH-005",
      clientId,
      serviceCode: "97151",
      serviceDescription: "Behavior Identification Assessment",
      authorizedUnits: 40,
      usedUnits: 0,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      status: "pending",
      insuranceProvider: "Blue Cross Blue Shield",
    },
  ]

  const activeAuths = authorizations.filter((auth) => auth.status === "active")
  const pendingAuths = authorizations.filter((auth) => auth.status === "pending")
  const expiredAuths = authorizations.filter((auth) => auth.status === "expired")

  const openAuthDetails = (auth: Authorization) => {
    setSelectedAuth(auth)
    setIsAuthDetailsOpen(true)
  }

  const getUtilizationPercentage = (auth: Authorization) => {
    return Math.round((auth.usedUnits / auth.authorizedUnits) * 100)
  }

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-500"
    if (percentage >= 75) return "text-yellow-500"
    return "text-green-500"
  }

  const getUtilizationProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500"
    if (percentage >= 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const today = new Date()
    const diffTime = end.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Prepare service utilization data for the chart
  const serviceUtilizationData = activeAuths.map((auth) => ({
    name: auth.serviceCode,
    used: auth.usedUnits,
    authorized: auth.authorizedUnits,
  }))

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Client Authorizations</h1>
          <p className="text-muted-foreground">Manage authorizations for {client.name}</p>
        </div>
        <Button onClick={() => setIsRequestFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Authorization
        </Button>
      </div>

      {/* Client Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={client.avatar || "/placeholder.svg"} alt={client.name} />
              <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{client.name}</h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-1">
                <div className="text-sm">
                  <span className="text-muted-foreground">DOB:</span>{" "}
                  {new Date(client.dateOfBirth).toLocaleDateString()}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Insurance:</span> {client.insuranceProvider}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Member ID:</span> {client.memberID}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Active Authorizations:</span> {activeAuths.length}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authorization Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Active Authorizations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeAuths.length}</div>
            <p className="text-sm text-muted-foreground">
              {activeAuths.length === 1 ? "Authorization" : "Authorizations"} currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Clock className="h-4 w-4 text-yellow-500 mr-2" />
              Pending Authorizations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingAuths.length}</div>
            <p className="text-sm text-muted-foreground">
              {pendingAuths.length === 1 ? "Authorization" : "Authorizations"} awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {activeAuths.filter((auth) => getDaysRemaining(auth.endDate) <= 30).length}
            </div>
            <p className="text-sm text-muted-foreground">
              {activeAuths.filter((auth) => getDaysRemaining(auth.endDate) <= 30).length === 1
                ? "Authorization"
                : "Authorizations"}{" "}
              expiring within 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Service Utilization Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Service Utilization</CardTitle>
          <CardDescription>Units used vs. authorized for active authorizations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceUtilizationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="used" fill="#82ca9d" name="Used Units" />
                <Bar dataKey="authorized" fill="#8884d8" name="Authorized Units" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Authorization Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Authorization Timeline</CardTitle>
          <CardDescription>Visual overview of current and upcoming authorizations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />

            <div className="space-y-6">
              {[...activeAuths, ...pendingAuths].map((auth) => (
                <div key={auth.id} className="relative">
                  <div className="flex items-center mb-2">
                    <div
                      className={`z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                        auth.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {auth.status === "active" ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <h3 className="text-base font-semibold">{auth.serviceCode}</h3>
                      <span className="text-sm text-muted-foreground">{auth.serviceDescription}</span>
                      <Badge variant={auth.status === "active" ? "default" : "outline"}>
                        {auth.status === "active" ? "Active" : "Pending"}
                      </Badge>
                    </div>
                  </div>

                  <div
                    className="ml-10 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => openAuthDetails(auth)}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(auth.startDate).toLocaleDateString()} -{" "}
                          {new Date(auth.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-1" /> Details
                        </Button>
                      </div>
                    </div>

                    {auth.status === "active" && (
                      <>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Utilization</span>
                          <span
                            className={`text-sm font-medium ${getUtilizationColor(getUtilizationPercentage(auth))}`}
                          >
                            {auth.usedUnits} / {auth.authorizedUnits} units ({getUtilizationPercentage(auth)}%)
                          </span>
                        </div>
                        <Progress
                          value={getUtilizationPercentage(auth)}
                          className="h-2"
                          indicatorClassName={getUtilizationProgressColor(getUtilizationPercentage(auth))}
                        />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authorization Tabs */}
      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Authorizations</CardTitle>
              <CardDescription>Currently approved authorizations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeAuths.map((auth) => (
                  <div
                    key={auth.id}
                    className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => openAuthDetails(auth)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{auth.serviceCode}</h3>
                          <span className="text-sm text-muted-foreground">{auth.serviceDescription}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(auth.startDate).toLocaleDateString()} -{" "}
                          {new Date(auth.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge>Active</Badge>
                    </div>

                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Utilization</span>
                      <span className={`text-sm font-medium ${getUtilizationColor(getUtilizationPercentage(auth))}`}>
                        {auth.usedUnits} / {auth.authorizedUnits} units ({getUtilizationPercentage(auth)}%)
                      </span>
                    </div>
                    <Progress
                      value={getUtilizationPercentage(auth)}
                      className="h-2"
                      indicatorClassName={getUtilizationProgressColor(getUtilizationPercentage(auth))}
                    />

                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-muted-foreground">
                        {getDaysRemaining(auth.endDate)} days remaining
                      </span>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-1" /> Renew
                      </Button>
                    </div>
                  </div>
                ))}

                {activeAuths.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No active authorizations</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Authorizations</CardTitle>
              <CardDescription>Authorizations awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingAuths.map((auth) => (
                  <div
                    key={auth.id}
                    className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => openAuthDetails(auth)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{auth.serviceCode}</h3>
                          <span className="text-sm text-muted-foreground">{auth.serviceDescription}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(auth.startDate).toLocaleDateString()} -{" "}
                          {new Date(auth.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline">Pending</Badge>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-muted-foreground">Requested: {auth.authorizedUnits} units</span>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" /> Details
                      </Button>
                    </div>
                  </div>
                ))}

                {pendingAuths.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No pending authorizations</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authorization History</CardTitle>
              <CardDescription>Past authorizations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expiredAuths.map((auth) => (
                  <div
                    key={auth.id}
                    className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors opacity-70"
                    onClick={() => openAuthDetails(auth)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{auth.serviceCode}</h3>
                          <span className="text-sm text-muted-foreground">{auth.serviceDescription}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(auth.startDate).toLocaleDateString()} -{" "}
                          {new Date(auth.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline">Expired</Badge>
                    </div>

                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Final Utilization</span>
                      <span className="text-sm font-medium">
                        {auth.usedUnits} / {auth.authorizedUnits} units ({getUtilizationPercentage(auth)}%)
                      </span>
                    </div>
                    <Progress value={getUtilizationPercentage(auth)} className="h-2" />
                  </div>
                ))}

                {expiredAuths.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No authorization history</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Authorization Details Dialog */}
      {selectedAuth && (
        <AuthorizationDetailsDialog
          authorization={selectedAuth}
          open={isAuthDetailsOpen}
          onOpenChange={setIsAuthDetailsOpen}
        />
      )}

      {/* Authorization Request Form */}
      <AuthorizationRequestForm
        open={isRequestFormOpen}
        onOpenChange={setIsRequestFormOpen}
        clientId={clientId}
        clientName={client.name}
      />
    </div>
  )
}
