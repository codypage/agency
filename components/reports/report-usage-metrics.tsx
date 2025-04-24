"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BarChart2, Clock, Star } from "lucide-react"
import type { SavedReport } from "./enhanced-reports-dashboard"

interface ReportUsageMetricsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  savedReports: SavedReport[]
}

export function ReportUsageMetrics({ open, onOpenChange, savedReports }: ReportUsageMetricsProps) {
  const [activeTab, setActiveTab] = useState("usage")

  // Mock usage data - in a real implementation, this would come from an analytics service
  const usageData = [
    { name: "Service Usage", runs: 42, avgTime: 1.2, users: 8 },
    { name: "Authorization", runs: 35, avgTime: 1.5, users: 6 },
    { name: "Client Detail", runs: 28, avgTime: 1.8, users: 5 },
    { name: "Project Status", runs: 20, avgTime: 2.1, users: 4 },
    { name: "Resource Allocation", runs: 15, avgTime: 1.9, users: 3 },
    { name: "Task Completion", runs: 12, avgTime: 1.7, users: 3 },
    { name: "Custom Reports", runs: 8, avgTime: 2.5, users: 2 },
  ]

  // Mock performance data
  const performanceData = [
    { name: "Service Usage", avgGenTime: 1.2, p95GenTime: 2.5, errorRate: 0.5 },
    { name: "Authorization", avgGenTime: 1.5, p95GenTime: 3.1, errorRate: 0.8 },
    { name: "Client Detail", avgGenTime: 1.8, p95GenTime: 3.5, errorRate: 1.2 },
    { name: "Project Status", avgGenTime: 2.1, p95GenTime: 4.2, errorRate: 1.5 },
    { name: "Resource Allocation", avgGenTime: 1.9, p95GenTime: 3.8, errorRate: 1.0 },
    { name: "Task Completion", avgGenTime: 1.7, p95GenTime: 3.4, errorRate: 0.7 },
    { name: "Custom Reports", avgGenTime: 2.5, p95GenTime: 5.0, errorRate: 2.0 },
  ]

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Report Usage Metrics</DialogTitle>
          <DialogDescription>Analytics on report usage and performance</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="usage" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="usage">
              <BarChart2 className="mr-2 h-4 w-4" />
              Usage
            </TabsTrigger>
            <TabsTrigger value="performance">
              <Clock className="mr-2 h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="history">
              <Star className="mr-2 h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="usage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Report Usage</CardTitle>
                <CardDescription>Number of times each report type has been run</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={usageData}
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
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="runs" fill="#8884d8" name="Report Runs" />
                      <Bar dataKey="users" fill="#82ca9d" name="Unique Users" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Details</CardTitle>
                <CardDescription>Detailed usage statistics by report type</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Type</TableHead>
                      <TableHead>Total Runs</TableHead>
                      <TableHead>Unique Users</TableHead>
                      <TableHead>Avg. Generation Time (s)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usageData.map((item) => (
                      <TableRow key={item.name}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.runs}</TableCell>
                        <TableCell>{item.users}</TableCell>
                        <TableCell>{item.avgTime.toFixed(1)}s</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Report Performance</CardTitle>
                <CardDescription>Generation time and error rates by report type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={performanceData}
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
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avgGenTime" fill="#8884d8" name="Avg. Generation Time (s)" />
                      <Bar dataKey="p95GenTime" fill="#82ca9d" name="P95 Generation Time (s)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Details</CardTitle>
                <CardDescription>Detailed performance metrics by report type</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Type</TableHead>
                      <TableHead>Avg. Generation Time (s)</TableHead>
                      <TableHead>P95 Generation Time (s)</TableHead>
                      <TableHead>Error Rate (%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performanceData.map((item) => (
                      <TableRow key={item.name}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.avgGenTime.toFixed(1)}s</TableCell>
                        <TableCell>{item.p95GenTime.toFixed(1)}s</TableCell>
                        <TableCell>{item.errorRate.toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Report History</CardTitle>
                <CardDescription>History of saved and run reports</CardDescription>
              </CardHeader>
              <CardContent>
                {savedReports.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No report history available</p>
                    <p className="text-sm">Save and run reports to see them here</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Last Run</TableHead>
                        <TableHead>Favorite</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {savedReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {report.type.charAt(0).toUpperCase() + report.type.slice(1).replace(/-/g, " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>{report.createdBy}</TableCell>
                          <TableCell>{formatDate(report.lastRun)}</TableCell>
                          <TableCell>
                            {report.isFavorite ? (
                              <Star className="h-4 w-4 text-yellow-400" />
                            ) : (
                              <span className="text-muted-foreground">No</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
