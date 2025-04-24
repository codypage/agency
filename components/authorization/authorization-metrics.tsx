"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// Mock metrics data
const metricsData = {
  totalAuthorizations: 9,
  activeAuthorizations: 5,
  pendingAuthorizations: 2,
  expiredAuthorizations: 2,
  totalAuthorizedUnits: 1628,
  totalUsedUnits: 1186,
  totalRemainingUnits: 442,
  overallUtilizationPercentage: 73,
  averageUtilizationPercentage: 68,
  authorizationsNearingExpiration: 2,
  authorizationsHighUtilization: 1,
}

export function AuthorizationMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Authorization Metrics</CardTitle>
        <CardDescription>Key metrics and statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Authorization Status</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-green-50 p-2 rounded-md">
                <p className="text-xl font-bold text-green-700">{metricsData.activeAuthorizations}</p>
                <p className="text-xs text-green-700">Active</p>
              </div>
              <div className="bg-yellow-50 p-2 rounded-md">
                <p className="text-xl font-bold text-yellow-700">{metricsData.pendingAuthorizations}</p>
                <p className="text-xs text-yellow-700">Pending</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-md">
                <p className="text-xl font-bold text-gray-700">{metricsData.expiredAuthorizations}</p>
                <p className="text-xs text-gray-700">Expired</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Overall Utilization</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Used: {metricsData.totalUsedUnits} units</span>
                <span>Remaining: {metricsData.totalRemainingUnits} units</span>
              </div>
              <Progress value={metricsData.overallUtilizationPercentage} className="h-2" />
              <div className="text-right text-xs text-muted-foreground">
                {metricsData.overallUtilizationPercentage}% of {metricsData.totalAuthorizedUnits} units
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Alerts</h3>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-yellow-50 p-2 rounded-md">
                <p className="text-xl font-bold text-yellow-700">{metricsData.authorizationsNearingExpiration}</p>
                <p className="text-xs text-yellow-700">Expiring Soon</p>
              </div>
              <div className="bg-red-50 p-2 rounded-md">
                <p className="text-xl font-bold text-red-700">{metricsData.authorizationsHighUtilization}</p>
                <p className="text-xs text-red-700">High Utilization</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
