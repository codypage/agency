"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { departments } from "@/lib/admin-config"
import { Building2, Stethoscope, Receipt, Laptop, GraduationCap, Users, BarChart3 } from "lucide-react"

export function DepartmentStats() {
  // Mock data for department statistics
  const departmentStats = [
    { id: "administrative", activeTickets: 12, completedTickets: 45, forms: 8 },
    { id: "clinical", activeTickets: 8, completedTickets: 32, forms: 6 },
    { id: "billing", activeTickets: 5, completedTickets: 28, forms: 4 },
    { id: "it", activeTickets: 10, completedTickets: 56, forms: 5 },
    { id: "training", activeTickets: 3, completedTickets: 18, forms: 3 },
    { id: "hr", activeTickets: 6, completedTickets: 24, forms: 7 },
    { id: "reporting", activeTickets: 4, completedTickets: 31, forms: 4 },
  ]

  // Get icon component based on department ID
  const getDepartmentIcon = (deptId: string) => {
    switch (deptId) {
      case "administrative":
        return Building2
      case "clinical":
        return Stethoscope
      case "billing":
        return Receipt
      case "it":
        return Laptop
      case "training":
        return GraduationCap
      case "hr":
        return Users
      case "reporting":
        return BarChart3
      default:
        return Building2
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {departments.map((dept) => {
        const stats = departmentStats.find((s) => s.id === dept.id) || {
          activeTickets: 0,
          completedTickets: 0,
          forms: 0,
        }
        const IconComponent = getDepartmentIcon(dept.id)

        return (
          <Card key={dept.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{dept.name}</CardTitle>
              <IconComponent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeTickets}</div>
              <p className="text-xs text-muted-foreground">Active Tickets ({stats.completedTickets} completed)</p>
              <div className="mt-2">
                <div className="text-sm">{stats.forms} Forms Available</div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
