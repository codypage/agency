"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, FileText, PlusCircle, User } from "lucide-react"

export function BCBADashboard() {
  // Sample data - in a real app, this would come from an API
  const clients = [
    {
      id: "1",
      name: "Alex Johnson",
      age: 7,
      program: "Early Intervention",
      nextSession: "Today, 2:00 PM",
      authorizationStatus: "active",
      authorizationPercent: 65,
      avatar: "/abstract-aj.png",
    },
    {
      id: "2",
      name: "Maya Rodriguez",
      age: 5,
      program: "Language Development",
      nextSession: "Tomorrow, 10:00 AM",
      authorizationStatus: "expiring-soon",
      authorizationPercent: 82,
      avatar: "/abstract-geometric.png",
    },
    {
      id: "3",
      name: "Ethan Williams",
      age: 9,
      program: "Social Skills",
      nextSession: "Wed, 3:30 PM",
      authorizationStatus: "active",
      authorizationPercent: 45,
      avatar: "/graffiti-ew.png",
    },
    {
      id: "4",
      name: "Sophia Chen",
      age: 6,
      program: "Behavior Management",
      nextSession: "Thu, 1:00 PM",
      authorizationStatus: "renewal-needed",
      authorizationPercent: 92,
      avatar: "/abstract-geometric-shapes.png",
    },
  ]

  const treatmentPlans = [
    {
      id: "tp1",
      clientName: "Alex Johnson",
      status: "In Progress",
      lastUpdated: "2 days ago",
      dueForReview: false,
    },
    {
      id: "tp2",
      clientName: "Maya Rodriguez",
      status: "Review Needed",
      lastUpdated: "30 days ago",
      dueForReview: true,
    },
    {
      id: "tp3",
      clientName: "Ethan Williams",
      status: "Up to Date",
      lastUpdated: "12 days ago",
      dueForReview: false,
    },
    {
      id: "tp4",
      clientName: "Sophia Chen",
      status: "Pending Approval",
      lastUpdated: "5 days ago",
      dueForReview: false,
    },
  ]

  const supervisionHours = {
    completed: 12.5,
    required: 20,
    percentComplete: 62.5,
  }

  const getAuthStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "expiring-soon":
        return "bg-yellow-500"
      case "renewal-needed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">BCBA Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Client
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>My Caseload</CardTitle>
            <CardDescription>You have 12 active clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">New this month:</span> 2
              </div>
              <div>
                <span className="text-muted-foreground">Discharged:</span> 1
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Treatment Plans</CardTitle>
            <CardDescription>2 plans need review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Up to date:</span> 7
              </div>
              <div>
                <span className="text-muted-foreground">Review needed:</span> 2
              </div>
              <div>
                <span className="text-muted-foreground">Pending approval:</span> 1
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Supervision Hours</CardTitle>
            <CardDescription>Monthly progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {supervisionHours.completed} / {supervisionHours.required} hrs
              </div>
              <Badge variant="outline">{supervisionHours.percentComplete}%</Badge>
            </div>
            <Progress value={supervisionHours.percentComplete} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="clients">
        <TabsList>
          <TabsTrigger value="clients">My Clients</TabsTrigger>
          <TabsTrigger value="treatment-plans">Treatment Plans</TabsTrigger>
          <TabsTrigger value="authorizations">Authorizations</TabsTrigger>
        </TabsList>
        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Caseload</CardTitle>
              <CardDescription>Your active clients and upcoming sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={client.avatar || "/placeholder.svg"} alt={client.name} />
                        <AvatarFallback>
                          {client.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Age: {client.age} • {client.program}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-sm font-medium">{client.nextSession}</div>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${getAuthStatusColor(client.authorizationStatus)}`} />
                        <div className="text-xs text-muted-foreground">{client.authorizationPercent}% used</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Clients
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="treatment-plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Treatment Plans</CardTitle>
              <CardDescription>Status of client treatment plans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {treatmentPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{plan.clientName}</div>
                        <div className="text-sm text-muted-foreground">Last updated: {plan.lastUpdated}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={plan.dueForReview ? "destructive" : "outline"}>{plan.status}</Badge>
                      <Button variant="ghost" size="icon">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Manage Treatment Plans
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="authorizations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authorization Management</CardTitle>
              <CardDescription>Track and manage client authorizations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <User className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-muted-foreground">{client.program}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Progress value={client.authorizationPercent} className="h-2 w-24" />
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${getAuthStatusColor(client.authorizationStatus)}`} />
                        <div className="text-xs text-muted-foreground">{client.authorizationPercent}% used</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Authorizations
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
