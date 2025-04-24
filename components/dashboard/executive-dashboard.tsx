"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { ArrowDownIcon, ArrowUpIcon, Download, FileText, TrendingUp, Users } from "lucide-react"

export function ExecutiveDashboard() {
  // Sample data - in a real app, this would come from an API
  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [65000, 72000, 68000, 75000, 82000, 88000],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
      },
      {
        label: "Expenses",
        data: [52000, 55000, 53000, 58000, 62000, 65000],
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        borderColor: "rgb(239, 68, 68)",
      },
    ],
  }

  const clientGrowthData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Active Clients",
        data: [120, 132, 145, 162, 178, 195],
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        borderColor: "rgb(16, 185, 129)",
        tension: 0.3,
        fill: true,
      },
    ],
  }

  const serviceDistributionData = {
    labels: ["ABA Therapy", "Speech Therapy", "Occupational Therapy", "Physical Therapy", "Other Services"],
    datasets: [
      {
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(107, 114, 128, 0.7)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(245, 158, 11)",
          "rgb(239, 68, 68)",
          "rgb(107, 114, 128)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const departmentPerformanceData = {
    labels: ["Clinical", "Billing", "Admin", "IT", "HR"],
    datasets: [
      {
        label: "Performance Score",
        data: [92, 85, 88, 90, 86],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
      },
      {
        label: "Target",
        data: [85, 85, 85, 85, 85],
        backgroundColor: "rgba(107, 114, 128, 0.5)",
        borderColor: "rgb(107, 114, 128)",
        type: "line",
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Reports
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$450,000</div>
            <div className="flex items-center pt-1">
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-500">12% from last quarter</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">195</div>
            <div className="flex items-center pt-1">
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-500">9% from last quarter</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">26.5%</div>
            <div className="flex items-center pt-1">
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-500">2.5% from last quarter</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Retention</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <div className="flex items-center pt-1">
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
              <span className="text-xs text-red-500">1% from last quarter</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="financial">
        <TabsList>
          <TabsTrigger value="financial">Financial Performance</TabsTrigger>
          <TabsTrigger value="clients">Client Growth</TabsTrigger>
          <TabsTrigger value="services">Service Distribution</TabsTrigger>
          <TabsTrigger value="departments">Department Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs. Expenses</CardTitle>
              <CardDescription>Financial performance over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <BarChart data={revenueData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Growth Trend</CardTitle>
              <CardDescription>Active clients over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <LineChart data={clientGrowthData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Distribution</CardTitle>
              <CardDescription>Breakdown of services by revenue</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <PieChart data={serviceDistributionData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Performance scores by department</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <BarChart data={departmentPerformanceData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
