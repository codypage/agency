"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "@/next/navigation"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, ChevronLeft, FileText, PlusCircle } from "lucide-react"
import { departments, manualSections } from "@/lib/admin-config"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"

export function ManualSidebar() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")

  // Filter manual sections based on search query
  const filteredSections = searchQuery
    ? manualSections.flatMap((section) => {
        const filteredItems = section.items.filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
        )

        return filteredItems.length > 0 ? [{ ...section, items: filteredItems }] : []
      })
    : manualSections

  // Get icon component based on section icon string
  const getSectionIcon = (iconName: string) => {
    // In a real implementation, you would dynamically import icons
    // For this example, we'll just use FileText for all
    return FileText
  }

  const NavItem = ({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <Link
      href={href}
      aria-current={pathname === href ? "page" : undefined}
      className={cn(
        "group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium",
        pathname === href
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
      )}
    >
      {icon}
      {children}
    </Link>
  )

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between px-4 pt-2">
          <Link href="/admin/dashboard">
            <Button variant="outline" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <div className="p-4">
          <SidebarInput
            placeholder="Search manual..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/admin/manual"}>
              <NavItem href="/admin/manual" icon={<Home className="h-4 w-4" />}>
                Manual Home
              </NavItem>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator />

        <ScrollArea className="h-[calc(100vh-200px)]">
          {filteredSections.map((section) => {
            const SectionIcon = getSectionIcon(section.icon)
            const department = departments.find((d) => d.id === section.departmentId)

            return (
              <SidebarGroup key={section.id}>
                <SidebarGroupLabel>
                  <div className="flex items-center gap-2">
                    <SectionIcon className="h-4 w-4" />
                    <span>{section.title}</span>
                  </div>
                </SidebarGroupLabel>

                {department && (
                  <div className="px-2 py-1">
                    <Badge variant="outline" className={cn("text-xs", department.color)}>
                      {department.name}
                    </Badge>
                  </div>
                )}

                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton asChild isActive={pathname === `/admin/manual/${section.id}/${item.id}`}>
                          <NavItem
                            href={`/admin/manual/${section.id}/${item.id}`}
                            icon={<FileText className="h-4 w-4" />}
                          >
                            {item.title}
                          </NavItem>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )
          })}
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4">
          <Link href="/admin/manual/editor">
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Entry
            </Button>
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
