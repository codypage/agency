"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { interactiveStyles, cardContentSpacing, tableRowStyles } from "@/lib/design-system"
import { cn } from "@/lib/utils"

export function DesignSystemShowcase() {
  return (
    <div className="space-y-8 p-6">
      <section>
        <h2 className="text-2xl font-bold mb-4">Interactive Elements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Subtle Interaction</CardTitle>
              <CardDescription>Minimal visual feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  "p-4 rounded-md border flex items-center justify-center",
                  interactiveStyles({ interactive: "subtle" }),
                )}
              >
                Hover over me
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medium Interaction</CardTitle>
              <CardDescription>Moderate visual feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  "p-4 rounded-md border flex items-center justify-center",
                  interactiveStyles({ interactive: "medium" }),
                )}
              >
                Hover over me
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prominent Interaction</CardTitle>
              <CardDescription>Strong visual feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  "p-4 rounded-md border flex items-center justify-center",
                  interactiveStyles({ interactive: "prominent" }),
                )}
              >
                Hover over me
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Card Spacing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Compact Spacing</CardTitle>
            </CardHeader>
            <CardContent className={cn(cardContentSpacing({ spacing: "compact" }), "bg-muted/20 border")}>
              <p>This card has compact spacing, ideal for dense UIs.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Normal Spacing</CardTitle>
            </CardHeader>
            <CardContent className={cn(cardContentSpacing({ spacing: "normal" }), "bg-muted/20 border")}>
              <p>This card has normal spacing, suitable for most content.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spacious Layout</CardTitle>
            </CardHeader>
            <CardContent className={cn(cardContentSpacing({ spacing: "spacious" }), "bg-muted/20 border")}>
              <p>This card has spacious layout, ideal for important content that needs breathing room.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Table Row Styles</h2>
        <Card>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="h-12 px-4 text-left font-medium">Name</th>
                    <th className="h-12 px-4 text-left font-medium">Role</th>
                    <th className="h-12 px-4 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={cn(tableRowStyles({ highlight: false }))}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>John Doe</div>
                      </div>
                    </td>
                    <td className="p-4">Developer</td>
                    <td className="p-4">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Active
                      </Badge>
                    </td>
                  </tr>
                  <tr className={cn(tableRowStyles({ highlight: true }))}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>JS</AvatarFallback>
                        </Avatar>
                        <div>Jane Smith</div>
                      </div>
                    </td>
                    <td className="p-4">Designer</td>
                    <td className="p-4">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        In Progress
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground pt-4">
            The second row has enhanced hover effects with subtle elevation.
          </CardFooter>
        </Card>
      </section>
    </div>
  )
}
