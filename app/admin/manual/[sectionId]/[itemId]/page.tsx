"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { manualSections, departments } from "@/lib/admin-config"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, FileText, Tag } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function ManualItemPage() {
  const params = useParams()
  const sectionId = params.sectionId as string
  const itemId = params.itemId as string

  // Find the section and item
  const section = manualSections.find((s) => s.id === sectionId)
  const item = section?.items.find((i) => i.id === itemId)

  if (!section || !item) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-2">Manual Entry Not Found</h1>
              <p className="text-muted-foreground">The requested manual entry could not be found.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const department = departments.find((d) => d.id === section.departmentId)

  // Mock content - in a real implementation, this would be loaded from the item.path
  const mockContent = `
  # ${item.title}
  
  ## Purpose
  
  This policy outlines the procedures and guidelines for ${item.title.toLowerCase()}.
  
  ## Scope
  
  This policy applies to all employees and contractors working for the organization.
  
  ## Procedures
  
  1. Identify the need for the requested action
  2. Complete the appropriate form in the administrative portal
  3. Submit for supervisor approval
  4. Track status through the ticketing system
  
  ## Responsibilities
  
  **Employees:**
  - Follow the procedures as outlined
  - Submit requests in a timely manner
  
  **Supervisors:**
  - Review and approve/reject requests within 48 hours
  - Provide feedback for rejected requests
  
  **Department Heads:**
  - Monitor compliance with this policy
  - Suggest improvements to the process
  
  ## Related Policies
  
  - Budget Management Policy
  - Approval Hierarchy Policy
  
  ## Contact
  
  For questions regarding this policy, contact the ${department?.name} department.
  `

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2">
        <Link href="/admin/manual" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link href={`/admin/manual?section=${sectionId}`} className="text-muted-foreground hover:text-foreground">
          {section.title}
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          {department && (
            <Badge variant="outline" className={cn("text-xs", department.color)}>
              {department.name}
            </Badge>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Last updated: {item.lastUpdated}</span>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            {mockContent.split("\n").map((line, index) => {
              if (line.startsWith("# ")) {
                return (
                  <h1 key={index} className="text-2xl font-bold mt-0">
                    {line.substring(2)}
                  </h1>
                )
              } else if (line.startsWith("## ")) {
                return (
                  <h2 key={index} className="text-xl font-semibold mt-6 mb-3">
                    {line.substring(3)}
                  </h2>
                )
              } else if (line.startsWith("**")) {
                return (
                  <p key={index} className="font-bold my-2">
                    {line}
                  </p>
                )
              } else if (line.startsWith("- ")) {
                return (
                  <li key={index} className="ml-6 my-1">
                    {line.substring(2)}
                  </li>
                )
              } else if (line.match(/^\d+\./)) {
                return (
                  <li key={index} className="ml-6 my-1">
                    {line.substring(line.indexOf(".") + 1)}
                  </li>
                )
              } else if (line.trim() === "") {
                return <div key={index} className="h-2"></div>
              } else {
                return (
                  <p key={index} className="my-2">
                    {line}
                  </p>
                )
              }
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Related Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <Link href="#" className="text-blue-600 hover:underline">
                {item.title} Form Template
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <Link href="#" className="text-blue-600 hover:underline">
                {item.title} Procedure Flowchart
              </Link>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
