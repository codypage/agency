"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { departments } from "@/lib/admin-config"
import { DepartmentFormList } from "./department-form-list"
import { RecentTickets } from "./recent-tickets"
import { DepartmentStats } from "./department-stats"
import { Search, BarChart3, FileText, Settings, PlusCircle, UserPlus, Database } from "lucide-react"
import Link from "next/link"
import { Loading } from "@/components/ui/loading"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"

export function AdminDashboard() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Breadcrumbs />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Administrative Dashboard</h1>
          <p className="text-muted-foreground">Department forms, tickets, and agency manual</p>
        </div>
        <div className="flex space-x-2">
          <Link href="/admin/forms/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Request
            </Button>
          </Link>
          <Link href="/admin/manual">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" /> Agency Manual
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
        <Button size="sm" variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          System Settings
        </Button>
        <Button size="sm" variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Audit Logs
        </Button>
        <Button size="sm" variant="outline">
          <Database className="h-4 w-4 mr-2" />
          Backup Data
        </Button>
      </div>

      {/* Department filter and search */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
        <div className="space-y-2 flex-1">
          <Label htmlFor="department-filter">Department</Label>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger id="department-filter">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search forms, tickets, or manuals..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Department Stats Cards */}
      <DepartmentStats />

      {/* Main Content */}
      <Tabs defaultValue="forms">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forms">
            <FileText className="mr-2 h-4 w-4" />
            Request Forms
          </TabsTrigger>
          <TabsTrigger value="tickets">
            <Settings className="mr-2 h-4 w-4" />
            Active Tickets
          </TabsTrigger>
          <TabsTrigger value="reports">
            <BarChart3 className="mr-2 h-4 w-4" />
            Department Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-4">
          {isLoading ? (
            <Loading variant="skeleton" count={3} />
          ) : (
            <DepartmentFormList departmentId={selectedDepartment} searchQuery={searchQuery} />
          )}
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          {isLoading ? (
            <Loading variant="skeleton" count={3} />
          ) : (
            <RecentTickets departmentId={selectedDepartment} searchQuery={searchQuery} />
          )}
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Activity</CardTitle>
              <CardDescription>Request volume by department over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {/* This would be connected to your reporting framework */}
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <p>Department activity charts would appear here, using the same reporting framework you've built</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
