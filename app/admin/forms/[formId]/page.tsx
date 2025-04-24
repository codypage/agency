"use client"

import { useParams } from "next/navigation"
import { RequestForm } from "@/components/admin/request-form"
import { formTemplates } from "@/lib/admin-config"
import { Card, CardContent } from "@/components/ui/card"

export default function FormPage() {
  const params = useParams()
  const formId = params.formId as string

  // Find the form template by ID
  const formTemplate = formTemplates.find((template) => template.id === formId)

  if (!formTemplate) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-2">Form Not Found</h1>
              <p className="text-muted-foreground">The requested form could not be found.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">{formTemplate.name}</h1>
      <RequestForm formTemplate={formTemplate} />
    </div>
  )
}
