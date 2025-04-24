"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getProgramConfig } from "@/lib/program-config"

interface CptCodeUsageReportProps {
  program: string
  dateRange: {
    from: Date
    to: Date
  }
  provider: string
  cptCode: string
  searchQuery: string
}

export function CptCodeUsageReport({ program, dateRange, provider, cptCode, searchQuery }: CptCodeUsageReportProps) {
  // Get program-specific configuration
  const programConfig = getProgramConfig(program)

  // Get the appropriate data for the selected program
  const cptCodeData = programConfig.serviceUsageData

  // Filter data based on selected filters
  const filteredData = cptCodeData.filter((item) => {
    if (cptCode !== "all" && item.cptCode !== cptCode) return false
    if (provider !== "all" && !item.providers.includes(provider)) return false
    if (
      searchQuery &&
      !item.cptCode.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false
    return true
  })

  // Prepare chart data
  const chartData = filteredData.map((item) => ({
    name: item.cptCode,
    units: item.totalUnits,
    hours: item.totalHours,
    sessions: item.totalSessions,
  }))

  // Calculate totals
  const totals = filteredData.reduce(
    (acc, item) => {
      acc.totalSessions += item.totalSessions
      acc.totalHours += item.totalHours
      acc.totalUnits += item.totalUnits
      return acc
    },
    { totalSessions: 0, totalHours: 0, totalUnits: 0 },
  )

  // Prepare monthly trend data
  const monthlyTrendData = programConfig.monthlyTrendData

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{totals.totalSessions}</CardTitle>
            <CardDescription>Total Sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{totals.totalHours}</CardTitle>
            <CardDescription>Total Hours</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Average {totals.totalSessions ? (totals.totalHours / totals.totalSessions).toFixed(1) : "0"} hours per
              session
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{totals.totalUnits}</CardTitle>
            <CardDescription>Total {programConfig.terminology.units}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Average {totals.totalSessions ? (totals.totalUnits / totals.totalSessions).toFixed(1) : "0"}{" "}
              {programConfig.terminology.units.toLowerCase()} per session
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Service Code Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{programConfig.terminology.serviceCode} Usage</CardTitle>
          <CardDescription>
            Distribution of {programConfig.terminology.units.toLowerCase()} by{" "}
            {programConfig.terminology.serviceCode.toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ChartContainer
              config={{
                units: {
                  label: programConfig.terminology.units,
                  color: "hsl(var(--chart-1))",
                },
                hours: {
                  label: "Hours",
                  color: "hsl(var(--chart-2))",
                },
                sessions: {
                  label: "Sessions",
                  color: "hsl(var(--chart-3))",
                },
              }}
            >
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
                <Legend />
                <Bar dataKey="units" fill="var(--color-units)" />
                <Bar dataKey="hours" fill="var(--color-hours)" />
                <Bar dataKey="sessions" fill="var(--color-sessions)" />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trend</CardTitle>
          <CardDescription>{programConfig.terminology.serviceCode} usage over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyTrendData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {programConfig.serviceCodes.slice(0, 6).map((code, index) => (
                  <Bar
                    key={code.code}
                    dataKey={code.code}
                    stackId="a"
                    fill={programConfig.chartColors[index % programConfig.chartColors.length]}
                    name={code.code}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>{programConfig.terminology.serviceCode} Details</CardTitle>
          <CardDescription>Detailed breakdown by {programConfig.terminology.serviceCode.toLowerCase()}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{programConfig.terminology.serviceCode}</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Sessions</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>{programConfig.terminology.units}</TableHead>
                <TableHead>Avg {programConfig.terminology.units}/Session</TableHead>
                <TableHead>Providers</TableHead>
                <TableHead>Clients</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.cptCode}>
                  <TableCell className="font-medium">{item.cptCode}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.totalSessions}</TableCell>
                  <TableCell>{item.totalHours}</TableCell>
                  <TableCell>{item.totalUnits}</TableCell>
                  <TableCell>{item.averageUnitsPerSession}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.providers.map((providerId) => {
                        const providerName =
                          programConfig.providers.find((p) => p.id === providerId)?.name || providerId
                        return (
                          <Badge key={providerId} variant="outline">
                            {providerName}
                          </Badge>
                        )
                      })}
                    </div>
                  </TableCell>
                  <TableCell>{item.clients}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
