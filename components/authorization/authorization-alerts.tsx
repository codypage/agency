"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowRight, Calendar } from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"

// Mock alerts data
const alertsData = [
  {
    id: "alert-1",
    client: "John D.",
    clientId: "client1",
    cptCode: "97153",
    description: "Adaptive behavior treatment by protocol",
    authorizedUnits: 480,
    usedUnits: 320,
    remainingUnits: 160,
    endDate: "2023-08-01",
    percentUsed: 67,
    daysRemaining: 28,
    provider: "stacy",
    providerName: "Stacy",
    alertType: "expiring-soon",
    status: "active",
  },
  {
    id: "alert-2",
    client: "Sarah M.",
    clientId: "client2",
    cptCode: "97153",
    description: "Adaptive behavior treatment by protocol",
    authorizedUnits: 480,
    usedUnits: 384,
    remainingUnits: 96,
    endDate: "2023-07-10",
    percentUsed: 80,
    daysRemaining: 6,
    provider: "brittany",
    providerName: "Brittany",
    alertType: "expiring-soon",
    status: "active",
  },
  {
    id: "alert-3",
    client: "Emma T.",
    clientId: "client4",
    cptCode: "97156",
    description: "Family adaptive behavior treatment guidance",
    authorizedUnits: 48,
    usedUnits: 36,
    remainingUnits: 12,
    endDate: "2023-08-15",
    percentUsed: 75,
    daysRemaining: 42,
    provider: "dakota",
    providerName: "Dakota",
    alertType: "high-utilization",
    status: "active",
  },
]

// Enhance alerts to be more timely and relevant
// Add a function to prioritize alerts:

const getPriorityLevel = (auth: any) => {
  const daysUntilExpiration = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    return Math.ceil(diff / (1000 * 3600 * 24))
  }
  // Expiring within 7 days
  if (auth.status === "active" && daysUntilExpiration(auth.endDate) <= 7) {
    return "high"
  }
  // Usage over 90%
  if (auth.status === "active" && auth.percentUsed >= 90) {
    return "high"
  }
  // Expiring within 30 days
  if (auth.status === "active" && daysUntilExpiration(auth.endDate) <= 30) {
    return "medium"
  }
  // Usage over 75%
  if (auth.status === "active" && auth.percentUsed >= 75) {
    return "medium"
  }
  return "low"
}

// Sort alerts by priority
const sortedAlerts = [...alertsData].sort((a, b) => {
  const daysUntilExpiration = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    return Math.ceil(diff / (1000 * 3600 * 24))
  }
  const priorityA = getPriorityLevel(a)
  const priorityB = getPriorityLevel(b)

  const priorityMap = { high: 0, medium: 1, low: 2 }
  return priorityMap[priorityA] - priorityMap[priorityB]
})

export function AuthorizationAlerts() {
  const { notifyAuthorizationAlert } = useNotifications()

  // Function to send notification for an alert
  const sendAlert = (alert: any) => {
    const message =
      alert.alertType === "expiring-soon"
        ? `Authorization expires in ${alert.daysRemaining} days (${alert.percentUsed}% used)`
        : `Authorization at ${alert.percentUsed}% utilization (${alert.remainingUnits} units remaining)`

    notifyAuthorizationAlert(
      alert.client,
      alert.id,
      message,
      alert.daysRemaining <= 7 || alert.percentUsed >= 90 ? "error" : "warning",
      alert.provider,
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authorization Alerts</CardTitle>
        <CardDescription>Authorizations that need attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedAlerts.length > 0 ? (
            sortedAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <h3 className="font-medium">{alert.client}</h3>
                    <Badge
                      variant="outline"
                      className={
                        alert.alertType === "expiring-soon"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }
                    >
                      {alert.alertType === "expiring-soon" ? "Expiring Soon" : "High Utilization"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {alert.cptCode} - {alert.description}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{alert.daysRemaining} days remaining</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">
                        {alert.percentUsed}% used ({alert.remainingUnits} units remaining)
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => sendAlert(alert)}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p>No alerts at this time.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
