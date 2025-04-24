import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ProjectSummaryProps {
  title: string
  count: number
  icon: React.ReactNode
  color?: "blue" | "green" | "yellow" | "red"
}

export function ProjectSummary({ title, count, icon, color }: ProjectSummaryProps) {
  return (
    <Card
      className={cn(
        color === "blue" && "bg-blue-50 border-blue-200",
        color === "green" && "bg-green-50 border-green-200",
        color === "yellow" && "bg-yellow-50 border-yellow-200",
        color === "red" && "bg-red-50 border-red-200",
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
      </CardContent>
    </Card>
  )
}
