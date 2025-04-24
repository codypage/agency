"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, CheckCircle, Clock, Edit, FileText, Printer, User } from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"

interface AuthorizationDetailsDialogProps {
  authorization: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthorizationDetailsDialog({ authorization, open, onOpenChange }: AuthorizationDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState("details")
  const { notifyAuthorizationAlert } = useNotifications()

  // Mock session data
  const sessionData = [
    {
      date: "2023-04-15",
      provider: authorization.providerName,
      units: 8,
      notes: "Worked on communication skills and following instructions",
    },
    {
      date: "2023-04-12",
      provider: authorization.providerName,
      units: 8,
      notes: "Focused on self-regulation and coping strategies",
    },
    {
      date: "2023-04-10",
      provider: authorization.providerName,
      units: 4,
      notes: "Protocol modification to address new behaviors",
    },
    {
      date: "2023-04-08",
      provider: authorization.providerName,
      units: 8,
      notes: "Worked on social skills and peer interactions",
    },
    {
      date: "2023-04-05",
      provider: authorization.providerName,
      units: 4,
      notes: "Parent training on reinforcement strategies",
    },
  ]

  // Mock authorization history
  const authorizationHistory = [
    {
      date: "2023-01-15",
      action: "Authorization Created",
      user: "Bill",
      details: "Initial authorization created for 40 units",
    },
    {
      date: "2023-02-10",
      action: "Units Updated",
      user: "Bill",
      details: "Used units updated to 8 after first session",
    },
    {
      date: "2023-03-05",
      action: "Units Updated",
      user: "Bill",
      details: "Used units updated to 16 after second session",
    },
    {
      date: "2023-04-01",
      action: "Units Updated",
      user: "Bill",
      details: "Used units updated to 24 after third session",
    },
    {
      date: "2023-04-20",
      action: "Units Updated",
      user: "Bill",
      details: "Used units updated to 32 after fourth session",
    },
  ]

  // Function to send notification for this authorization
  const sendAlert = () => {
    const daysRemaining = Math.round(
      (new Date(authorization.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    )

    const message =
      daysRemaining <= 30
        ? `Authorization expires in ${daysRemaining} days (${authorization.percentUsed}% used)`
        : `Authorization at ${authorization.percentUsed}% utilization (${authorization.remainingUnits} units remaining)`

    notifyAuthorizationAlert(
      authorization.client,
      authorization.id,
      message,
      daysRemaining <= 7 || authorization.percentUsed >= 90 ? "error" : "warning",
      authorization.provider,
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Authorization {authorization.id}</span>
            <Badge
              variant="outline"
              className={
                authorization.status === "active"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : authorization.status === "pending"
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                    : "bg-gray-50 text-gray-700 border-gray-200"
              }
            >
              {authorization.status === "active"
                ? "Active"
                : authorization.status === "pending"
                  ? "Pending"
                  : "Expired"}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {authorization.client} - {authorization.cptCode} ({authorization.description})
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">
              <FileText className="mr-2 h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="sessions">
              <Clock className="mr-2 h-4 w-4" />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="history">
              <Calendar className="mr-2 h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Client Information</h3>
                  <p className="font-medium">{authorization.client}</p>
                  <p className="text-sm text-muted-foreground">Client ID: {authorization.clientId}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Service Information</h3>
                  <p className="font-medium">
                    {authorization.cptCode} - {authorization.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Provider</h3>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p>{authorization.providerName}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Insurance Information</h3>
                  <p className="font-medium">{authorization.insuranceProvider}</p>
                  <p className="text-sm text-muted-foreground">Authorization #: {authorization.authorizationNumber}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
                  <p className="text-sm">{authorization.notes}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Authorization Period</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p>
                      {new Date(authorization.startDate).toLocaleDateString()} to{" "}
                      {new Date(authorization.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Units</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Authorized Units:</span>
                      <span className="font-medium">{authorization.authorizedUnits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Used Units:</span>
                      <span className="font-medium">{authorization.usedUnits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining Units:</span>
                      <span className="font-medium">{authorization.remainingUnits}</span>
                    </div>
                    <Separator />
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Utilization:</span>
                        <span>{authorization.percentUsed}%</span>
                      </div>
                      <Progress
                        value={authorization.percentUsed}
                        className={
                          authorization.percentUsed >= 90
                            ? "h-2 bg-red-200"
                            : authorization.percentUsed >= 75
                              ? "h-2 bg-yellow-200"
                              : "h-2"
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full" onClick={sendAlert}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Send Alert
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4 mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessionData.map((session, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(session.date).toLocaleDateString()}</TableCell>
                    <TableCell>{session.provider}</TableCell>
                    <TableCell>{session.units}</TableCell>
                    <TableCell>{session.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {authorizationHistory.map((history, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(history.date).toLocaleDateString()}</TableCell>
                    <TableCell>{history.action}</TableCell>
                    <TableCell>{history.user}</TableCell>
                    <TableCell>{history.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
