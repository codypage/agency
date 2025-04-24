"use client"

import Link from "next/link"
import { usePathname } from "@/next/navigation"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  homeHref?: string
}

// Map of path segments to readable names
const pathMap: Record<string, string> = {
  admin: "Admin",
  dashboard: "Dashboard",
  forms: "Forms",
  manual: "Manual",
  reports: "Reports",
  authorizations: "Authorizations",
  "project-management": "Project Management",
  "enhanced-authorizations": "Enhanced Authorizations",
  settings: "Settings",
  notifications: "Notifications",
  clinical: "Clinical",
  billing: "Billing",
}

export function Breadcrumbs({ items, homeHref = "/" }: BreadcrumbsProps) {
  const pathname = usePathname()

  // If no items are provided, generate them from the current path
  const breadcrumbItems = items || generateBreadcrumbsFromPath(pathname, homeHref)

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-muted-foreground mb-4">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
            {index === breadcrumbItems.length - 1 ? (
              <span className="font-medium text-foreground" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-foreground transition-colors">
                {index === 0 ? (
                  <span className="flex items-center">
                    <Home className="h-4 w-4 mr-1" />
                    {item.label !== "Home" && item.label}
                  </span>
                ) : (
                  item.label
                )}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Helper function to generate breadcrumb items from a path
function generateBreadcrumbsFromPath(pathname: string, homeHref: string): BreadcrumbItem[] {
  if (!pathname) return [{ label: "Home", href: homeHref }]

  const segments = pathname.split("/").filter(Boolean)

  // Start with home
  const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: homeHref }]

  // Build up the breadcrumbs based on path segments
  let currentPath = ""

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`

    // Get a readable name for the segment
    const label = pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)

    // For dynamic routes with IDs, try to make them more readable
    const isIdSegment = segment.match(/^\[.*\]$/) || segment.match(/^[0-9a-f]{24}$/)
    const displayLabel = isIdSegment ? "Details" : label

    breadcrumbs.push({
      label: displayLabel,
      href: currentPath,
    })
  })

  return breadcrumbs
}
