import { AuthorizationWorkflow } from "@/components/authorization/authorization-workflow"

export default function EnhancedAuthorizationsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Enhanced Authorization Management</h1>
      <AuthorizationWorkflow />
    </div>
  )
}
