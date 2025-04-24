"use client"
import { getProgramConfig } from "@/lib/program-config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { TicketIcon } from "lucide-react"

interface ClientAuthorizationReportProps {
  program: string
  client: string
  dateRange: {
    from: Date
    to: Date
  }
}

export function ClientAuthorizationReport({ program, client, dateRange }: ClientAuthorizationReportProps) {
  // Get program-specific configuration
  const programConfig = getProgramConfig(program)

  // Find client data
  const clientInfo = programConfig.clients.find((c) => c.id === client) || programConfig.clients[0]

  // Mock client data
  const clientData = {
    id: client,
    name: clientInfo.name,
    dateOfBirth: "2015-05-12",
    insuranceProvider: "Sunflower Health Plan",
    memberId: "SHP12345678",
    startDate: "2023-01-15",
  }

  // Filter authorization data for this client
  const authorizationData = programConfig.authorizationData.filter((auth) =>
    auth.client.toLowerCase().includes(clientInfo.name.toLowerCase()),
  )

  // Mock session history data - this would come from your API in a real implementation
  const sessionHistory = [
    {
      date: "2023-04-15",
      cptCode: programConfig.serviceCodes[1].code,
      provider: programConfig.providers[0].id,
      units: 8,
      notes: "Worked on communication skills and following instructions",
    },
    {
      date: "2023-04-12",
      cptCode: programConfig.serviceCodes[1].code,
      provider: programConfig.providers[0].id,
      units: 8,
      notes: "Focused on self-regulation and coping strategies",
    },
    {
      date: "2023-04-10",
      cptCode: programConfig.serviceCodes[2].code,
      provider: programConfig.providers[1].id,
      units: 4,
      notes: "Protocol modification to address new behaviors",
    },
    {
      date: "2023-04-08",
      cptCode: programConfig.serviceCodes[1].code,
      provider: programConfig.providers[0].id,
      units: 8,
      notes: "Worked on social skills and peer interactions",
    },
    {
      date: "2023-04-05",
      cptCode: programConfig.serviceCodes[3].code,
      provider: programConfig.providers[2].id,
      units: 4,
      notes: "Parent training on reinforcement strategies",
    },
    {
      date: "2023-04-03",
      cptCode: programConfig.serviceCodes[1].code,
      provider: programConfig.providers[0].id,
      units: 8,
      notes: "Focused on academic readiness skills",
    },
    {
      date: "2023-04-01",
      cptCode: programConfig.serviceCodes[1].code,
      provider: programConfig.providers[0].id,
      units: 8,
      notes: "Worked on daily living skills and independence",
    },
  ]

  // Calculate totals
  const totals = authorizationData.reduce(
    (acc, item) => {
      acc.authorizedUnits += item.authorizedUnits
      acc.usedUnits += item.usedUnits
      acc.remainingUnits += item.remainingUnits
      return acc
    },
    { authorizedUnits: 0, usedUnits: 0, remainingUnits: 0 },
  )

  // Calculate overall percentage used
  const overallPercentUsed =
    totals.authorizedUnits > 0 ? Math.round((totals.usedUnits / totals.authorizedUnits) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle>{clientData.name}</CardTitle>
          <CardDescription>Client Information and Authorization Summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Client ID</h3>
                <p>{clientData.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Date of Birth</h3>
                <p>{clientData.dateOfBirth}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Insurance Provider</h3>
                <p>{clientData.insuranceProvider}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Member ID</h3>
                <p>{clientData.memberId}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
                <p>{clientData.startDate}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Authorization Summary</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Total Authorized Units:</span>
                    <span className="font-medium">{totals.authorizedUnits}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Used Units:</span>
                    <span className="font-medium">{totals.usedUnits}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Remaining Units:</span>
                    <span className="font-medium">{totals.remainingUnits}</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Usage:</span>
                      <span>{overallPercentUsed}%</span>
                    </div>
                    <Progress value={overallPercentUsed} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm">
                  <TicketIcon className="mr-2 h-4 w-4" />
                  Request Authorization Update
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authorization Details */}
      <Card>
        <CardHeader>
          <CardTitle>Authorization Details</CardTitle>
          <CardDescription>Current authorizations for {clientData.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Auth ID</TableHead>
                <TableHead>{programConfig.terminology.serviceCode}</TableHead>
                <TableHead>Authorized</TableHead>
                <TableHead>Used</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authorizationData.map((auth) => (
                <TableRow key={auth.id}>
                  <TableCell className="font-medium">{auth.id}</TableCell>
                  <TableCell>{auth.cptCode}</TableCell>
                  <TableCell>{auth.authorizedUnits}</TableCell>
                  <TableCell>{auth.usedUnits}</TableCell>
                  <TableCell>{auth.remainingUnits}</TableCell>
                  <TableCell>{new Date(auth.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(auth.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        auth.status === "exhausted"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : auth.percentUsed >= 80
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-green-50 text-green-700 border-green-200"
                      }
                    >
                      {auth.status === "exhausted" ? "Exhausted" : auth.percentUsed >= 80 ? "Near Limit" : "Active"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
          <CardDescription>Recent service sessions for {clientData.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>{programConfig.terminology.serviceCode}</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessionHistory.map((session, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(session.date).toLocaleDateString()}</TableCell>
                  <TableCell>{session.cptCode}</TableCell>
                  <TableCell>
                    {programConfig.providers.find((p) => p.id === session.provider)?.name || session.provider}
                  </TableCell>
                  <TableCell>{session.units}</TableCell>
                  <TableCell className="max-w-xs truncate">{session.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
