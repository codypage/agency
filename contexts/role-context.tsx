"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

// Define available roles
export type UserRole =
  | "clinical-director"
  | "bcba"
  | "billing-specialist"
  | "administrator"
  | "project-manager"
  | "it-manager"
  | "clinical-staff"
  | "executive"

interface RoleContextType {
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  hasPermission: (permission: string) => boolean
  roleDisplay: string
}

// Define role-based permissions
const rolePermissions: Record<UserRole, string[]> = {
  "clinical-director": [
    "view:all",
    "manage:programs",
    "manage:staff",
    "view:reports",
    "manage:authorizations",
    "manage:projects",
  ],
  bcba: ["view:clients", "manage:treatment-plans", "manage:authorizations", "view:reports:limited"],
  "billing-specialist": ["view:authorizations", "manage:authorizations", "view:reports:billing", "manage:claims"],
  administrator: ["manage:departments", "manage:forms", "manage:tickets", "manage:documentation", "view:reports:admin"],
  "project-manager": ["manage:projects", "manage:tasks", "view:reports:projects"],
  "it-manager": ["manage:integrations", "manage:feature-flags", "manage:system-settings"],
  "clinical-staff": ["view:clients:assigned", "view:tasks:assigned", "manage:tasks:assigned"],
  executive: ["view:all", "view:reports:executive", "view:dashboards"],
}

// Map roles to display names
const roleDisplayNames: Record<UserRole, string> = {
  "clinical-director": "Clinical Director",
  bcba: "BCBA",
  "billing-specialist": "Billing Specialist",
  administrator: "Administrator",
  "project-manager": "Project Manager",
  "it-manager": "IT Manager",
  "clinical-staff": "Clinical Staff",
  executive: "Executive",
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: React.ReactNode }) {
  // Default to administrator for demo purposes
  const [userRole, setUserRole] = useState<UserRole>("administrator")

  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    const permissions = rolePermissions[userRole] || []

    // Check for direct permission
    if (permissions.includes(permission)) return true

    // Check for wildcard permissions
    if (permissions.includes("view:all") && permission.startsWith("view:")) return true
    if (permissions.includes("manage:all") && permission.startsWith("manage:")) return true

    // Check for category permissions
    const category = permission.split(":")[0] + ":all"
    if (permissions.includes(category)) return true

    return false
  }

  return (
    <RoleContext.Provider
      value={{
        userRole,
        setUserRole,
        hasPermission,
        roleDisplay: roleDisplayNames[userRole],
      }}
    >
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
}
