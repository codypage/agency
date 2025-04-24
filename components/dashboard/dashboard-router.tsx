"use client"

import { useRole } from "@/contexts/role-context"
import { ClinicalDirectorDashboard } from "@/components/dashboard/clinical-director-dashboard"
import { BCBADashboard } from "@/components/dashboard/bcba-dashboard"
import { BillingDashboard } from "@/components/dashboard/billing-dashboard"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { ProjectManagerDashboard } from "@/components/dashboard/project-manager-dashboard"
import { ITManagerDashboard } from "@/components/dashboard/it-manager-dashboard"
import { ClinicalStaffDashboard } from "@/components/dashboard/clinical-staff-dashboard"
import { ExecutiveDashboard } from "@/components/dashboard/executive-dashboard"

export function DashboardRouter() {
  const { userRole } = useRole()

  switch (userRole) {
    case "clinical-director":
      return <ClinicalDirectorDashboard />
    case "bcba":
      return <BCBADashboard />
    case "billing-specialist":
      return <BillingDashboard />
    case "administrator":
      return <AdminDashboard />
    case "project-manager":
      return <ProjectManagerDashboard />
    case "it-manager":
      return <ITManagerDashboard />
    case "clinical-staff":
      return <ClinicalStaffDashboard />
    case "executive":
      return <ExecutiveDashboard />
    default:
      return <AdminDashboard />
  }
}
