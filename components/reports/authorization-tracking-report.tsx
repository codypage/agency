"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { getProgramConfig } from "@/lib/program-config"

interface AuthorizationTrackingReportProps {
  program: string
  dateRange: {
    from: Date
    to: Date
  }
  provider: string
  cptCode: string
  searchQuery: string
}

export function AuthorizationTrackingReport({
  program,
  dateRange,
  provider,
  cptCode,
  searchQuery,
}: AuthorizationTrackingReportProps) {
  // Get program-specific configuration
  const programConfig = getProgramConfig(program)

  // Get the appropriate data for the selected program
  const authorizationData = programConfig.authorizationData

  // Filter data based on selected filters
  const filteredData = authorizationData.filter((item) => {
    if (cptCode !== "all" && item.cptCode !== cptCode) return false
    if (provider !== "all" && item.provider !== provider) return false
    if (
      searchQuery &&
      !item.client.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.cptCode.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false
    return true
  })

  // Calculate totals
  const totals = filteredData.reduce(
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

  // Prepare pie chart data
  const pieChartData = [
    { name: "Used", value: totals.usedUnits },
    { name: "Remaining", value: totals.remainingUnits },
  ]

  const COLORS = ["#0088FE", "#00C49F"]

  // Prepare CPT code distribution data
  const cptCodeDistribution = filteredData.reduce((acc, item) => {
    if (!acc[item.cptCode]) {
      acc[item.cptCode] = {
        cptCode: item.cptCode,
        description: item.description,
        authorizedUnits: 0,
        usedUnits: 0,
        remainingUnits: 0,
      }
    }
    acc[item.cptCode].authorizedUnits += item.authorizedUnits
    acc[item.cptCode].usedUnits += item.usedUnits
    acc[item.cptCode].remainingUnits += item.remainingUnits
    return acc
  }, {})

  const cptCodeDistributionArray = Object.values(cptCodeDistribution)

  // Get authorizations that need attention (high usage or expiring soon)
  const needsAttention = filteredData.filter(
    (item) => item.percentUsed >= 80 || new Date(item.endDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  )

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{totals.authorizedUnits}</CardTitle>
            <CardDescription>Total Authorized {programConfig.terminology.units}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Across {filteredData.length} authorizations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{totals.usedUnits}</CardTitle>
            <CardDescription>Total Used {programConfig.terminology.units}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {overallPercentUsed}% of authorized {programConfig.terminology.units.toLowerCase()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{totals.remainingUnits}</CardTitle>
            <CardDescription>Total Remaining {programConfig.terminology.units}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {Math.round((totals.remainingUnits / 4) * 60)} minutes remaining
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Usage</CardTitle>
            <CardDescription>Used vs. Remaining {programConfig.terminology.units}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Needs Attention */}
        <Card>
          <CardHeader>
            <CardTitle>Needs Attention</CardTitle>
            <CardDescription>{programConfig.terminology.authorization}s that require action</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {needsAttention.length > 0 ? (
                needsAttention.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.client}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.cptCode} - Expires: {new Date(item.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          item.percentUsed >= 90
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }
                      >
                        {item.percentUsed}% Used
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.remainingUnits} {programConfig.terminology.units.toLowerCase()} remaining
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No authorizations need immediate attention.</p>
              )}
              {needsAttention.length > 4 && (
                <Button variant="link" className="p-0">
                  View all {needsAttention.length} items
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Code Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>{programConfig.terminology.serviceCode} Distribution</CardTitle>
          <CardDescription>
            Authorized and used {programConfig.terminology.units.toLowerCase()} by{" "}
            {programConfig.terminology.serviceCode.toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{programConfig.terminology.serviceCode}</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Authorized {programConfig.terminology.units}</TableHead>
                <TableHead>Used {programConfig.terminology.units}</TableHead>
                <TableHead>Remaining {programConfig.terminology.units}</TableHead>
                <TableHead>Usage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cptCodeDistributionArray.map((item: any) => (
                <TableRow key={item.cptCode}>
                  <TableCell className="font-medium">{item.cptCode}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.authorizedUnits}</TableCell>
                  <TableCell>{item.usedUnits}</TableCell>
                  <TableCell>{item.remainingUnits}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={item.authorizedUnits > 0 ? (item.usedUnits / item.authorizedUnits) * 100 : 0}
                        className="h-2 w-[100px]"
                      />
                      <span className="text-sm">
                        {item.authorizedUnits > 0 ? Math.round((item.usedUnits / item.authorizedUnits) * 100) : 0}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>{programConfig.terminology.authorization} Details</CardTitle>
          <CardDescription>Complete list of authorizations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Auth ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>{programConfig.terminology.serviceCode}</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Authorized</TableHead>
                <TableHead>Used</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.client}</TableCell>
                  <TableCell>{item.cptCode}</TableCell>
                  <TableCell>
                    {programConfig.providers.find((p) => p.id === item.provider)?.name || item.provider}
                  </TableCell>
                  <TableCell>{item.authorizedUnits}</TableCell>
                  <TableCell>{item.usedUnits}</TableCell>
                  <TableCell>{item.remainingUnits}</TableCell>
                  <TableCell>{new Date(item.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        item.status === "exhausted"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : item.percentUsed >= 80
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-green-50 text-green-700 border-green-200"
                      }
                    >
                      {item.status === "exhausted" ? "Exhausted" : item.percentUsed >= 80 ? "Near Limit" : "Active"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
