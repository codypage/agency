"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Calendar, CheckCircle2, Clock, Users } from "lucide-react"

export function ClinicalDirectorDashboard() {
  // Sample data - in a real app, this would come from an API
  const programImplementationData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Programs",
        data: [12, 19, 15, 22, 18, 24],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
      },
      {
        label: "Completed Programs",
        data: [8, 15, 12, 19, 15, 21],
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        borderColor: "rgb(16, 185, 129)",
      },
    ],
  }

  const staffPerformanceData = {
    labels: ["Assessment", "Treatment Planning", "Direct Service", "Documentation", "Supervision"],
    datasets: [
      {
        label: "Team Average",
        data: [85, 78, 92, 81, 88],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 2,
      },
      {
        label: "Organization Benchmark",
        data: [80, 75, 85, 80, 85],
        backgroundColor: "rgba(249, 115, 22, 0.5)",
        borderColor: "rgb(249, 115, 22)",
        borderWidth: 2,
      },
    ],
  }

  const authorizationData = {
    labels: ["Active", "Pending", "Expiring Soon", "Renewal Needed"],
    datasets: [
      {
        data: [65, 15, 12, 8],
        backgroundColor: [
          "rgba(16, 185, 129, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(239, 68, 68, 0.7)",
        ],
        borderColor: ["rgb(16, 185, 129)", "rgb(59, 130, 246)", "rgb(245, 158, 11)", "rgb(239, 68, 68)"],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Clinical Director Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
          <Button size="sm">
            <Users className="mr-2 h-4 w-4" />
            Staff Management
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Authorizations</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">-3 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <div className="flex items-center mt-1">
              <Badge variant="destructive" className="text-xs">
                Requires Attention
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="programs">
        <TabsList>
          <TabsTrigger value="programs">Program Implementation</TabsTrigger>
          <TabsTrigger value="staff">Staff Performance</TabsTrigger>
          <TabsTrigger value="authorizations">Authorizations</TabsTrigger>
          <TabsTrigger value="quality">Quality Indicators</TabsTrigger>
        </TabsList>
        <TabsContent value="programs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Program Implementation Timeline</CardTitle>
              <CardDescription>New and completed programs over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <BarChart data={programImplementationData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Performance Metrics</CardTitle>
              <CardDescription>
                Performance across key clinical areas compared to organizational benchmarks
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <LineChart data={staffPerformanceData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="authorizations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authorization Overview</CardTitle>
              <CardDescription>Current status of client authorizations</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <PieChart data={authorizationData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Quality Indicators</CardTitle>
              <CardDescription>Key quality metrics across clinical services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Treatment Plan Compliance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">94%</div>
                      <p className="text-xs text-muted-foreground">+2% from last quarter</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Assessment Timeliness</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">87%</div>
                      <p className="text-xs text-muted-foreground">-3% from last quarter</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Documentation Accuracy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">91%</div>
                      <p className="text-xs text-muted-foreground">+1% from last quarter</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Client Satisfaction</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">4.7/5</div>
                      <p className="text-xs text-muted-foreground">+0.2 from last quarter</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
