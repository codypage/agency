import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDroppable } from "@dnd-kit/core"
import type { ReactNode } from "react"

interface KanbanColumnProps {
  id: string
  title: string
  count: number
  colorClass: string
  children: ReactNode
}

export function KanbanColumn({ id, title, count, colorClass, children }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div className="space-y-3">
      <Card className={`${colorClass} ${isOver ? "ring-2 ring-primary" : ""}`}>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-medium flex justify-between">
            <span>{title}</span>
            <Badge variant="secondary">{count}</Badge>
          </CardTitle>
        </CardHeader>
      </Card>
      <div
        ref={setNodeRef}
        className={`space-y-3 min-h-[200px] p-1 rounded-md transition-colors ${isOver ? "bg-muted/50" : ""}`}
      >
        {children}
      </div>
    </div>
  )
}
