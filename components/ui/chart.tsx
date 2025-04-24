"use client"

import * as React from "react"
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config?: Record<string, { label: string; color: string }>
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, config, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        style={
          {
            "--color-units": config?.units?.color,
            "--color-hours": config?.hours?.color,
            "--color-sessions": config?.sessions?.color,
          } as React.CSSProperties
        }
        {...props}
      >
        {React.Children.map(children, (child) => {
          return React.cloneElement(React.Children.only(child) as React.ReactElement, {
            color: config,
          })
        })}
      </div>
    )
  },
)
ChartContainer.displayName = "ChartContainer"

interface ChartTooltipContentProps {
  indicator?: "circle" | "dashed"
}

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  ({ indicator = "circle", ...props }, ref) => {
    return <div className="rounded-md border bg-secondary p-2 text-sm text-secondary-foreground" ref={ref} {...props} />
  },
)
ChartTooltipContent.displayName = "ChartTooltipContent"

interface ChartTooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const ChartTooltip = React.forwardRef<HTMLDivElement, ChartTooltipProps>(({ className, children, ...props }, ref) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipContent>{children}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
})
ChartTooltip.displayName = "ChartTooltip"

export {
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  RechartsTooltip as Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
}
