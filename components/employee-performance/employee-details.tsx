"use client"

import { CardFooter } from "@/components/ui/card"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, Mail, Phone, User } from "lucide-react"
import { OptimizedImage } from "@/components/ui/optimized-image"

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

interface EmployeeDetailsProps {
  employee: Employee
  onClose: () => void
}

export function EmployeeDetails({ employee, onClose }: EmployeeDetailsProps) {
  // Mock employee details
  const employeeDetails = {
    name: employee.employee,
    role: "Clinical Therapist",
    department: "Outpatient Services",
    email: "john.doe@example.com",
    phone: "555-123-4567",
    location: "Main Office",
    avatar: "/abstract-aj.png",
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Employee Details</CardTitle>
        <CardDescription>Information about {employeeDetails.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            {employeeDetails.avatar ? (
              <OptimizedImage
                src={employeeDetails.avatar}
                alt={`Avatar for ${employeeDetails.name}`}
                width={64}
                height={64}
                className="rounded-full object-cover"
              />
            ) : (
              <AvatarFallback>{employeeDetails.name.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{employeeDetails.name}</h3>
            <p className="text-sm text-muted-foreground">{employeeDetails.role}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{employeeDetails.department}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{employeeDetails.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{employeeDetails.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Available Hours: {employee.availHours}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Performance Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Avg Duration</p>
              <p className="text-lg">{employee.avgDuration} minutes</p>
            </div>
            <div>
              <p className="text-sm font-medium">Hours Met</p>
              <p className="text-lg">{employee.percentHoursMet}%</p>
            </div>
            <div>
              <p className="text-sm font-medium">Encounters Met</p>
              <p className="text-lg">{employee.percentEncountersMet}%</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onClose}>
          Close
        </Button>
      </CardFooter>
    </Card>
  )
}
