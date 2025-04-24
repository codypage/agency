"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type UserRole, useRole } from "@/contexts/role-context"
import {
  User,
  Stethoscope,
  Receipt,
  Settings,
  PlaneTakeoffIcon as LayoutPlaneTakeoff,
  Server,
  UserCog,
  BarChart4,
} from "lucide-react"

export function RoleSelector() {
  const { userRole, setUserRole, roleDisplay } = useRole()
  const [open, setOpen] = useState(false)

  const roleIcons: Record<UserRole, React.ReactNode> = {
    "clinical-director": <Stethoscope className="h-4 w-4 mr-2" />,
    bcba: <User className="h-4 w-4 mr-2" />,
    "billing-specialist": <Receipt className="h-4 w-4 mr-2" />,
    administrator: <Settings className="h-4 w-4 mr-2" />,
    "project-manager": <LayoutPlaneTakeoff className="h-4 w-4 mr-2" />,
    "it-manager": <Server className="h-4 w-4 mr-2" />,
    "clinical-staff": <UserCog className="h-4 w-4 mr-2" />,
    executive: <BarChart4 className="h-4 w-4 mr-2" />,
  }

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role)
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 h-9 px-3">
          {roleIcons[userRole]}
          <span>{roleDisplay}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center" onClick={() => handleRoleChange("clinical-director")}>
          <Stethoscope className="h-4 w-4 mr-2" />
          <span>Clinical Director</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center" onClick={() => handleRoleChange("bcba")}>
          <User className="h-4 w-4 mr-2" />
          <span>BCBA</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center" onClick={() => handleRoleChange("billing-specialist")}>
          <Receipt className="h-4 w-4 mr-2" />
          <span>Billing Specialist</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center" onClick={() => handleRoleChange("administrator")}>
          <Settings className="h-4 w-4 mr-2" />
          <span>Administrator</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center" onClick={() => handleRoleChange("project-manager")}>
          <LayoutPlaneTakeoff className="h-4 w-4 mr-2" />
          <span>Project Manager</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center" onClick={() => handleRoleChange("it-manager")}>
          <Server className="h-4 w-4 mr-2" />
          <span>IT Manager</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center" onClick={() => handleRoleChange("clinical-staff")}>
          <UserCog className="h-4 w-4 mr-2" />
          <span>Clinical Staff</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center" onClick={() => handleRoleChange("executive")}>
          <BarChart4 className="h-4 w-4 mr-2" />
          <span>Executive</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
