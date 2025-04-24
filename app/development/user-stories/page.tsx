import { UserStoryMapping } from "@/components/development/user-story-mapping"
import { userStories, componentDetails, epicDetails } from "@/data/user-stories"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"

export default function UserStoriesPage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Development", href: "/development" },
          { label: "User Stories", href: "/development/user-stories" },
        ]}
      />

      <div>
        <h1 className="text-3xl font-bold mb-2">User Story Mapping</h1>
        <p className="text-muted-foreground">
          This page maps user stories to components and epics, providing traceability between requirements and
          implementation.
        </p>
      </div>

      <UserStoryMapping stories={userStories} components={componentDetails} epics={epicDetails} />
    </div>
  )
}
