import { adminProjects } from "@/data/admin-projects"
import { ProjectTable } from "@/components/project-table"

export default function ExportDemoPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Task Export Demo</h1>
      <p className="mb-6 text-muted-foreground">
        Select multiple tasks and use the Export button in the toolbar to download them as CSV or Excel.
      </p>

      <ProjectTable
        projects={adminProjects}
        allProjects={adminProjects}
        onUpdateProjects={async (projects) => {
          console.log("Updated projects:", projects)
          return Promise.resolve()
        }}
        onDeleteProjects={async (projects) => {
          console.log("Deleted projects:", projects)
          return Promise.resolve()
        }}
      />
    </div>
  )
}
