"use client"

import { CardContent } from "@/components/ui/card"

import { CardDescription } from "@/components/ui/card"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { EmployeeDetails } from "./employee-details"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart"

interface Employee {
  employee: string
  avgDuration: number
  availHours: number
  expHours: number
  goalEncounters: number
  actualHours: number
  actualEncounters: number
  percentHoursMet: number
  percentEncountersMet: number
  validFlag: string
}

const EmployeePerformanceDashboard = () => {
  const [performanceData, setPerformanceData] = useState<Employee[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<keyof Employee>("employee")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/employee-performance")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setPerformanceData(data)
      } catch (e: any) {
        setError(`Failed to load performance data: ${e.message}`)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    const sortedData = [...performanceData].sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      } else {
        return 0
      }
    })
    setPerformanceData(sortedData)
  }, [sortBy, sortOrder])

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee)
  }

  const handleCloseDetails = () => {
    setSelectedEmployee(null)
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  if (loading) {
    return <p>Loading performance data...</p>
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Employee Performance Dashboard</h1>

      {selectedEmployee ? (
        <EmployeeDetails employee={selectedEmployee} onClose={handleCloseDetails} />
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Employee List</h2>
            </div>
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as keyof Employee)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Name</SelectItem>
                  <SelectItem value="avgDuration">Avg Duration</SelectItem>
                  <SelectItem value="percentHoursMet">Hours Met</SelectItem>
                  <SelectItem value="percentEncountersMet">Encounters Met</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={toggleSortOrder}>
                {sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Visual representation of employee performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  avgDuration: {
                    label: "Avg Duration",
                    color: "hsl(var(--chart-1))",
                  },
                  percentHoursMet: {
                    label: "Hours Met",
                    color: "hsl(var(--chart-2))",
                  },
                  percentEncountersMet: {
                    label: "Encounters Met",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[450px]"
              >
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
                    <XAxis dataKey="employee" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="avgDuration" fill="var(--color-avgDuration)" />
                    <Bar dataKey="percentHoursMet" fill="var(--color-percentHoursMet)" />
                    <Bar dataKey="percentEncountersMet" fill="var(--color-percentEncountersMet)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {performanceData.map((employee) => (
              <div
                key={employee.employee}
                className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300"
                onClick={() => handleEmployeeClick(employee)}
              >
                <h2 className="text-xl font-semibold mb-2">{employee.employee}</h2>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Valid Flag</h3>
                  <Badge variant="secondary">{employee.validFlag}</Badge>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Average Duration</h3>
                  <p>{employee.avgDuration} minutes</p>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Hours Met</h3>
                  <div className="flex items-center gap-2">
                    <Progress value={employee.percentHoursMet} className="h-4 w-20" />
                    <span>{employee.percentHoursMet}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Encounters Met</h3>
                  <div className="flex items-center gap-2">
                    <Progress value={employee.percentEncountersMet} className="h-4 w-20" />
                    <span>{employee.percentEncountersMet}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default EmployeePerformanceDashboard
