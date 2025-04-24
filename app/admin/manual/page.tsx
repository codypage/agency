import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { departments } from "@/lib/admin-config"
import Link from "next/link"
import { ArrowRight, Search } from "lucide-react"

export default function AgencyManualHomePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Agency Manual</h1>
        <p className="text-muted-foreground">Comprehensive policies, procedures, and resources for all departments</p>
      </div>

      {/* Quick Search */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Search</CardTitle>
          <CardDescription>Find policies and procedures across all departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search manual (e.g., purchasing, claims, time off)..."
              className="w-full pl-10 py-2 border rounded-md h-12"
            />
          </div>
        </CardContent>
      </Card>

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Card key={dept.id}>
            <CardHeader>
              <CardTitle>{dept.name}</CardTitle>
              <CardDescription>{dept.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/admin/manual?department=${dept.id}`}>
                <Button variant="outline" className="w-full">
                  View {dept.name} Policies
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recently Updated */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Updated</CardTitle>
          <CardDescription>Policies and procedures that have been recently modified</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex justify-between border-b pb-2">
              <div>
                <Link href="/admin/manual/admin-policies/purchasing-policy" className="text-blue-600 hover:underline">
                  Purchasing Policy
                </Link>
                <p className="text-sm text-muted-foreground">Guidelines for requesting and approving purchases</p>
              </div>
              <div className="text-sm text-muted-foreground">May 15, 2023</div>
            </li>
            <li className="flex justify-between border-b pb-2">
              <div>
                <Link
                  href="/admin/manual/clinical-protocols/assessment-protocol"
                  className="text-blue-600 hover:underline"
                >
                  Assessment Protocol
                </Link>
                <p className="text-sm text-muted-foreground">Standardized assessment procedures</p>
              </div>
              <div className="text-sm text-muted-foreground">June 01, 2023</div>
            </li>
            <li className="flex justify-between">
              <div>
                <Link
                  href="/admin/manual/billing-procedures/claims-submission"
                  className="text-blue-600 hover:underline"
                >
                  Claims Submission Process
                </Link>
                <p className="text-sm text-muted-foreground">Step-by-step guide for submitting claims</p>
              </div>
              <div className="text-sm text-muted-foreground">May 25, 2023</div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
