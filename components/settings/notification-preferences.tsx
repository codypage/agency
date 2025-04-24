"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEmailPreferences } from "@/hooks/use-notifications"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Bell, Mail } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function NotificationPreferences() {
  const { preferences, updatePreferences, isOffline, setOffline, hasEmailService } = useEmailPreferences()
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // If email service is not available, show a message
  if (!hasEmailService) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Configure how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Email service not available</AlertTitle>
            <AlertDescription>
              Email notification preferences are not available. Please contact your administrator.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const handleSave = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setShowSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isOffline ? "destructive" : "outline"}>{isOffline ? "Offline" : "Online"}</Badge>
            <Button variant="outline" size="sm" onClick={() => setOffline(!isOffline)}>
              {isOffline ? "Go Online" : "Simulate Offline"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Preferences saved</AlertTitle>
            <AlertDescription className="text-green-700">
              Your notification preferences have been updated successfully.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Email Notifications</h3>
          <p className="text-sm text-muted-foreground">
            Configure which notifications you want to receive via email when you're offline
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="ticket-status">Ticket Status Changes</Label>
                <p className="text-sm text-muted-foreground">Receive emails when ticket statuses change</p>
              </div>
              <Switch
                id="ticket-status"
                checked={preferences?.ticketStatusChanges}
                onCheckedChange={(checked) => updatePreferences({ ticketStatusChanges: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="form-submissions">Form Submissions</Label>
                <p className="text-sm text-muted-foreground">Receive emails when forms are submitted</p>
              </div>
              <Switch
                id="form-submissions"
                checked={preferences?.formSubmissions}
                onCheckedChange={(checked) => updatePreferences({ formSubmissions: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auth-alerts">Authorization Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive emails for authorization alerts</p>
              </div>
              <Switch
                id="auth-alerts"
                checked={preferences?.authorizationAlerts}
                onCheckedChange={(checked) => updatePreferences({ authorizationAlerts: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="system-notifications">System Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive emails for system-wide notifications</p>
              </div>
              <Switch
                id="system-notifications"
                checked={preferences?.systemNotifications}
                onCheckedChange={(checked) => updatePreferences({ systemNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="admin-notifications">Administrative Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive emails for administrative notifications</p>
              </div>
              <Switch
                id="admin-notifications"
                checked={preferences?.adminNotifications}
                onCheckedChange={(checked) => updatePreferences({ adminNotifications: checked })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-medium">Priority Settings</h3>
          <p className="text-sm text-muted-foreground">
            Configure the minimum priority level for notifications to be sent via email
          </p>

          <div className="grid gap-2">
            <Label htmlFor="min-priority">Minimum Priority</Label>
            <Select
              value={preferences?.minPriority}
              onValueChange={(value) => updatePreferences({ minPriority: value as any })}
            >
              <SelectTrigger id="min-priority">
                <SelectValue placeholder="Select minimum priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (All notifications)</SelectItem>
                <SelectItem value="medium">Medium (Medium and high priority only)</SelectItem>
                <SelectItem value="high">High (High priority only)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Only notifications with this priority or higher will be sent via email
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-medium">Delivery Methods</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2 border-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Bell className="mr-2 h-4 w-4" />
                  In-App Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Always delivered while you're using the application</p>
              </CardContent>
            </Card>

            <Card className={isOffline ? "border-2 border-primary" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {isOffline ? "Currently active - you're offline" : "Delivered when you're offline"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </CardFooter>
    </Card>
  )
}
