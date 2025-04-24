"use client"

import { useState } from "react"
import { ClientList } from "./client-list"
import { ClientAuthorizationDashboard } from "./client-authorization-dashboard"

export function ClientAuthorizationManagement() {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ClientList onClientSelect={setSelectedClientId} />
        </div>

        <div className="lg:col-span-3">
          {selectedClientId ? (
            <ClientAuthorizationDashboard clientId={selectedClientId} />
          ) : (
            <div className="flex items-center justify-center h-full min-h-[400px] border rounded-lg bg-muted/20">
              <div className="text-center p-6">
                <h2 className="text-xl font-bold mb-2">Select a Client</h2>
                <p className="text-muted-foreground">
                  Choose a client from the list to view and manage their authorizations
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
