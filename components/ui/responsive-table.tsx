"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { responsiveTableStyles } from "@/lib/design-system"

// Add a new prop for mobile card layout options
interface ResponsiveTableProps extends React.HTMLAttributes<HTMLDivElement> {
  headers: string[]
  data: any[]
  renderRow: (item: any, index: number) => React.ReactNode
  renderMobileRow?: (item: any, index: number) => React.ReactNode
  keyExtractor: (item: any, index: number) => string
  emptyState?: React.ReactNode
  mobileLayout?: "card" | "list" | "compact"
}

export function ResponsiveTable({
  headers,
  data,
  renderRow,
  renderMobileRow,
  keyExtractor,
  emptyState,
  className,
  mobileLayout,
  ...props
}: ResponsiveTableProps) {
  if (data.length === 0 && emptyState) {
    return (
      <div className={cn("py-8", className)} {...props}>
        {emptyState}
      </div>
    )
  }

  // Update the mobile cards section to support different layouts
  const mobileLayoutStyles = {
    card: "border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow",
    list: "border-b py-3",
    compact: "border-b py-2 text-sm",
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      {/* Desktop Table */}
      <div className={cn("hidden md:block", responsiveTableStyles.container)}>
        <table className={responsiveTableStyles.table}>
          <thead className={responsiveTableStyles.header}>
            <tr>
              {headers.map((header, index) => (
                <th key={index} className={responsiveTableStyles.headerCell}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={keyExtractor(item, index)} className={responsiveTableStyles.row}>
                {renderRow(item, index)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {data.map((item, index) => (
          <div key={keyExtractor(item, index)} className={mobileLayoutStyles[mobileLayout || "card"]}>
            {renderMobileRow ? renderMobileRow(item, index) : renderRow(item, index)}
          </div>
        ))}
      </div>
    </div>
  )
}
