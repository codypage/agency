import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ManualSidebar } from "@/components/admin/manual-sidebar"

export default function ManualLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <ManualSidebar />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </SidebarProvider>
  )
}
