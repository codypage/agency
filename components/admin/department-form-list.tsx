"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formTemplates, departments } from "@/lib/admin-config"
import { ChevronRight, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface DepartmentFormListProps {
  departmentId: string
  searchQuery: string
}

export function DepartmentFormList({ departmentId, searchQuery }: DepartmentFormListProps) {
  // Filter forms based on department and search query
  const filteredForms = formTemplates.filter((form) => {
    if (departmentId !== "all" && form.departmentId !== departmentId) return false

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return form.name.toLowerCase().includes(query) || form.description.toLowerCase().includes(query)
    }

    return true
  })

  // Group forms by department
  const formsByDepartment: Record<string, typeof formTemplates> = {}

  filteredForms.forEach((form) => {
    if (!formsByDepartment[form.departmentId]) {
      formsByDepartment[form.departmentId] = []
    }
    formsByDepartment[form.departmentId].push(form)
  })

  // If specific department is selected, only show that department
  const departmentsToDisplay =
    departmentId !== "all"
      ? [departments.find((d) => d.id === departmentId)!]
      : departments.filter((d) => formsByDepartment[d.id]?.length > 0)

  if (departmentsToDisplay.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <p>No forms match your search criteria.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {departmentsToDisplay.map((dept) => (
        <Card key={dept.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn("py-1", dept.color)}>
                  {dept.name}
                </Badge>
                <CardTitle>{dept.name} Forms</CardTitle>
              </div>
              <Link href={`/admin/departments/${dept.id}`}>
                <Button variant="ghost" size="sm">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <CardDescription>{dept.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formsByDepartment[dept.id]?.map((form) => (
                <Link key={form.id} href={`/admin/forms/${form.id}`}>
                  <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors h-full flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-sm flex items-center">
                        {form.name}
                        <ArrowUpRight className="ml-1 h-3 w-3" />
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{form.description}</p>
                    </div>
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {form.fields.length} field{form.fields.length !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
