import type React from "react"
import { cn } from "@/lib/utils"

interface ResponsiveFormLayoutProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: "none" | "sm" | "md" | "lg"
  className?: string
}

export function ResponsiveFormLayout({ children, columns = 1, gap = "md", className }: ResponsiveFormLayoutProps) {
  const gapMap = {
    none: "gap-0",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  }

  const columnsMap = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }

  return <div className={cn("grid", columnsMap[columns], gapMap[gap], className)}>{children}</div>
}

export function FormField({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("space-y-2", className)}>{children}</div>
}

export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      {children}
    </div>
  )
}
