"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, CheckCircle, Clock, Search, User, UserPlus } from "lucide-react"

interface Client {
  id: string
  name: string
  avatar?: string
  insuranceProvider: string
  activeAuthorizations: number
  pendingAuthorizations: number
  expiringAuthorizations: number
}

interface ClientListProps {
  onClientSelect: (clientId: string) => void
}

export function ClientList({ onClientSelect }: ClientListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock client data
  const clients: Client[] = [
    {
      id: "client-001",
      name: "John Smith",
      avatar: "/abstract-blue-burst.png",
      insuranceProvider: "Blue Cross Blue Shield",
      activeAuthorizations: 4,
      pendingAuthorizations: 1,
      expiringAuthorizations: 1,
    },
    {
      id: "client-002",
      name: "Emily Johnson",
      avatar: "/letter-a-abstract.png",
      insuranceProvider: "Aetna",
      activeAuthorizations: 3,
      pendingAuthorizations: 0,
      expiringAuthorizations: 2,
    },
    {
      id: "client-003",
      name: "Michael Williams",
      avatar: "/abstract-s-design.png",
      insuranceProvider: "UnitedHealthcare",
      activeAuthorizations: 2,
      pendingAuthorizations: 1,
      expiringAuthorizations: 0,
    },
    {
      id: "client-004",
      name: "Sophia Brown",
      avatar: "/letter-d-floral.png",
      insuranceProvider: "Cigna",
      activeAuthorizations: 3,
      pendingAuthorizations: 2,
      expiringAuthorizations: 1,
    },
    {
      id: "client-005",
      name: "James Davis",
      avatar: "/abstract-letter-j.png",
      insuranceProvider: "Humana",
      activeAuthorizations: 1,
      pendingAuthorizations: 0,
      expiringAuthorizations: 1,
    },
  ]

  // Filter clients based on search query
  const filteredClients = clients.filter((client) => client.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Clients</CardTitle>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-1" /> Add Client
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clients..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onClientSelect(client.id)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={client.avatar || "/placeholder.svg"} alt={client.name} />
                  <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="font-medium">{client.name}</div>
                  <div className="text-sm text-muted-foreground">{client.insuranceProvider}</div>
                </div>

                <div className="flex flex-col gap-1 items-end">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="text-xs">{client.activeAuthorizations}</span>
                  </div>

                  {client.pendingAuthorizations > 0 && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs">{client.pendingAuthorizations}</span>
                    </div>
                  )}

                  {client.expiringAuthorizations > 0 && (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 text-red-500" />
                      <span className="text-xs">{client.expiringAuthorizations}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredClients.length === 0 && (
            <div className="text-center py-4">
              <User className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No clients found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
