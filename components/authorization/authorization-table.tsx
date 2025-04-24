"use client"

import { cn } from "@/lib/utils"
import { tableRowStyles } from "@/lib/design-system"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Clock, Edit, FileText, MoreHorizontal, Trash2 } from "lucide-react"
import { useState } from "react"
import { AuthorizationDetailsDialog } from "./authorization-details-dialog"

interface AuthorizationTableProps {
  status: "active" | "pending" | "expired"
  dateRange: {
    from: Date
    to: Date
  }
  provider: string
  cptCode: string
  client: string
  searchQuery: string
}

// Mock authorization data
const mockAuthorizations = [
  {
    id: "AUTH-001",
    client: "Incredible Test",
    clientId: "incredible-test",
    cptCode: "97151",
    description: "Behavior Identification Assessment",
    authorizedUnits: 40,
    usedUnits: 32,
    remainingUnits: 8,
    startDate: "2023-01-15",
    endDate: "2023-07-15",
    provider: "dakota",
    providerName: "Dakota",
    status: "active",
    percentUsed: 80,
    insuranceProvider: "Sunflower Health Plan",
    authorizationNumber: "SHP12345678",
    notes: "Initial assessment authorization",
  },
  {
    id: "AUTH-002",
    client: "John D.",
    clientId: "client1",
    cptCode: "97153",
    description: "Adaptive behavior treatment by protocol",
    authorizedUnits: 480,
    usedUnits: 320,
    remainingUnits: 160,
    startDate: "2023-02-01",
    endDate: "2023-08-01",
    provider: "stacy",
    providerName: "Stacy",
    status: "active",
    percentUsed: 67,
    insuranceProvider: "Blue Cross Blue Shield",
    authorizationNumber: "BCBS87654321",
    notes: "Treatment authorization for 6 months",
  },
  {
    id: "AUTH-003",
    client: "Sarah M.",
    clientId: "client2",
    cptCode: "97153",
    description: "Adaptive behavior treatment by protocol",
    authorizedUnits: 480,
    usedUnits: 384,
    remainingUnits: 96,
    startDate: "2023-01-10",
    endDate: "2023-07-10",
    provider: "brittany",
    providerName: "Brittany",
    status: "active",
    percentUsed: 80,
    insuranceProvider: "Aetna",
    authorizationNumber: "AET2023456789",
    notes: "Treatment authorization for 6 months",
  },
  {
    id: "AUTH-004",
    client: "Michael R.",
    clientId: "client3",
    cptCode: "97155",
    description: "Adaptive behavior treatment with protocol modification",
    authorizedUnits: 120,
    usedUnits: 96,
    remainingUnits: 24,
    startDate: "2023-03-01",
    endDate: "2023-09-01",
    provider: "jaden",
    providerName: "Jaden",
    status: "active",
    percentUsed: 80,
    insuranceProvider: "UnitedHealthcare",
    authorizationNumber: "UHC20235555",
    notes: "BCBA supervision authorization",
  },
  {
    id: "AUTH-005",
    client: "Emma T.",
    clientId: "client4",
    cptCode: "97156",
    description: "Family adaptive behavior treatment guidance",
    authorizedUnits: 48,
    usedUnits: 36,
    remainingUnits: 12,
    startDate: "2023-02-15",
    endDate: "2023-08-15",
    provider: "dakota",
    providerName: "Dakota",
    status: "active",
    percentUsed: 75,
    insuranceProvider: "Cigna",
    authorizationNumber: "CIG20237777",
    notes: "Parent training authorization",
  },
  {
    id: "AUTH-006",
    client: "John D.",
    clientId: "client1",
    cptCode: "97154",
    description: "Group adaptive behavior treatment",
    authorizedUnits: 96,
    usedUnits: 0,
    remainingUnits: 96,
    startDate: "2023-05-01",
    endDate: "2023-11-01",
    provider: "stacy",
    providerName: "Stacy",
    status: "pending",
    percentUsed: 0,
    insuranceProvider: "Blue Cross Blue Shield",
    authorizationNumber: "Pending",
    notes: "Pending approval for social skills group",
  },
  {
    id: "AUTH-007",
    client: "Sarah M.",
    clientId: "client2",
    cptCode: "97151",
    description: "Behavior Identification Assessment",
    authorizedUnits: 40,
    usedUnits: 0,
    remainingUnits: 40,
    startDate: "2023-06-01",
    endDate: "2023-12-01",
    provider: "dakota",
    providerName: "Dakota",
    status: "pending",
    percentUsed: 0,
    insuranceProvider: "Aetna",
    authorizationNumber: "Pending",
    notes: "Pending approval for reassessment",
  },
  {
    id: "AUTH-008",
    client: "Previous Client",
    clientId: "previous1",
    cptCode: "97153",
    description: "Adaptive behavior treatment by protocol",
    authorizedUnits: 320,
    usedUnits: 320,
    remainingUnits: 0,
    startDate: "2022-07-01",
    endDate: "2023-01-01",
    provider: "brittany",
    providerName: "Brittany",
    status: "expired",
    percentUsed: 100,
    insuranceProvider: "Medicaid",
    authorizationNumber: "MCD20221111",
    notes: "Expired treatment authorization",
  },
  {
    id: "AUTH-009",
    client: "Previous Client",
    clientId: "previous1",
    cptCode: "97156",
    description: "Family adaptive behavior treatment guidance",
    authorizedUnits: 24,
    usedUnits: 18,
    remainingUnits: 6,
    startDate: "2022-07-01",
    endDate: "2023-01-01",
    provider: "dakota",
    providerName: "Dakota",
    status: "expired",
    percentUsed: 75,
    insuranceProvider: "Medicaid",
    authorizationNumber: "MCD20222222",
    notes: "Expired parent training authorization",
  },
]

export function AuthorizationTable({
  status,
  dateRange,
  provider,
  cptCode,
  client,
  searchQuery,
}: AuthorizationTableProps) {
  const [selectedAuth, setSelectedAuth] = useState<any | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  // Filter authorizations based on selected filters
  const filteredAuthorizations = mockAuthorizations.filter((auth) => {
    // Filter by status
    if (auth.status !== status) return false

    // Filter by date range
    const authStartDate = new Date(auth.startDate)
    const authEndDate = new Date(auth.endDate)
    if (
      (authStartDate < dateRange.from && authEndDate < dateRange.from) ||
      (authStartDate > dateRange.to && authEndDate > dateRange.to)
    )
      return false

    // Filter by provider
    if (provider !== "all" && auth.provider !== provider) return false

    // Filter by CPT code
    if (cptCode !== "all" && auth.cptCode !== cptCode) return false

    // Filter by client
    if (client !== "all" && auth.clientId !== client) return false

    // Filter by search query
    if (
      searchQuery &&
      !auth.client.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !auth.cptCode.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !auth.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !auth.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false

    return true
  })

  const openAuthDetails = (auth: any) => {
    setSelectedAuth(auth)
    setDetailsOpen(true)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "expired":
        return <AlertCircle className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium">
            <CheckCircle className="h-3 w-3 mr-1" /> Active
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 font-medium">
            <Clock className="h-3 w-3 mr-1" /> Pending Approval
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 font-medium">
            <AlertCircle className="h-3 w-3 mr-1" /> Expired
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>
            {status === "active"
              ? "Active Authorizations"
              : status === "pending"
                ? "Pending Authorization Requests"
                : "Expired Authorizations"}
          </CardTitle>
          <CardDescription>
            {filteredAuthorizations.length} {status} authorization
            {filteredAuthorizations.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredAuthorizations.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="flex flex-col items-center max-w-md mx-auto">
                <div className="rounded-full bg-muted p-3 mb-4">
                  {status === "active" ? (
                    <CheckCircle className="h-8 w-8 text-muted-foreground" />
                  ) : status === "pending" ? (
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  ) : (
                    <AlertCircle className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <h3 className="text-lg font-medium mb-2">
                  {status === "active"
                    ? "No active authorizations found"
                    : status === "pending"
                      ? "No pending authorization requests"
                      : "No expired authorizations found"}
                </h3>
                <p className="text-muted-foreground mb-6 text-center">
                  {status === "active"
                    ? "Active authorizations will appear here once they've been approved. You can request a new authorization to get started."
                    : status === "pending"
                      ? "Pending authorization requests will appear here while they await approval from insurance providers."
                      : "Expired authorizations are kept for reference and renewal purposes."}
                </p>
                {(status === "active" || status === "pending") && (
                  <Button
                    className="mb-4"
                    onClick={(e) => {
                      e.stopPropagation()
                      // This would typically navigate to or open the authorization request form
                      console.log("Create new authorization request")
                    }}
                  >
                    {status === "active" ? "Request New Authorization" : "Create Authorization Request"}
                  </Button>
                )}
                {searchQuery && (
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filter criteria to find what you're looking for.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[100px]">Auth ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Service Code</TableHead>
                    <TableHead>Provider</TableHead>
                    {status !== "pending" && <TableHead>Usage</TableHead>}
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAuthorizations.map((auth) => (
                    <TableRow
                      key={auth.id}
                      className={cn(
                        tableRowStyles({ highlight: true }),
                        "group focus-within:bg-muted/70 focus-within:shadow-sm",
                      )}
                      onClick={() => openAuthDetails(auth)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          openAuthDetails(auth)
                        }
                      }}
                    >
                      <TableCell className="font-medium">{auth.id}</TableCell>
                      <TableCell>
                        <div className="font-medium group-hover:text-primary transition-colors">{auth.client}</div>
                      </TableCell>
                      <TableCell>{auth.cptCode}</TableCell>
                      <TableCell>{auth.providerName}</TableCell>
                      {status !== "pending" && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={auth.percentUsed}
                              className={cn(
                                "h-2 w-[100px]",
                                auth.percentUsed >= 90
                                  ? "bg-red-200"
                                  : auth.percentUsed >= 75
                                    ? "bg-yellow-200"
                                    : "bg-muted",
                              )}
                            />
                            <span className="text-sm">{auth.percentUsed}%</span>
                          </div>
                        </TableCell>
                      )}
                      <TableCell>{new Date(auth.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(auth.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getStatusIcon(auth.status)}
                          <span className="ml-2">{getStatusBadge(auth.status)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" className="h-8 w-8 p-0 opacity-70 group-hover:opacity-100">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[180px]">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                openAuthDetails(auth)
                              }}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            {status === "pending" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Authorization Details Dialog */}
      {selectedAuth && (
        <AuthorizationDetailsDialog authorization={selectedAuth} open={detailsOpen} onOpenChange={setDetailsOpen} />
      )}
    </>
  )
}
