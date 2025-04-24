"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface UserStory {
  id: string
  title: string
  description: string
  acceptanceCriteria: string[]
  priority: "high" | "medium" | "low"
  status: "implemented" | "in-progress" | "planned" | "backlog"
  epic?: string
  components: string[]
}

interface UserStoryMappingProps {
  stories: UserStory[]
  components?: Record<string, { description: string; path: string }>
  epics?: Record<string, { title: string; description: string }>
  defaultView?: "stories" | "components" | "epics"
}

export function UserStoryMapping({
  stories,
  components = {},
  epics = {},
  defaultView = "stories",
}: UserStoryMappingProps) {
  // Group stories by component
  const storiesByComponent = React.useMemo(() => {
    const grouped: Record<string, UserStory[]> = {}

    stories.forEach((story) => {
      story.components.forEach((component) => {
        if (!grouped[component]) {
          grouped[component] = []
        }
        grouped[component].push(story)
      })
    })

    return grouped
  }, [stories])

  // Group stories by epic
  const storiesByEpic = React.useMemo(() => {
    const grouped: Record<string, UserStory[]> = {}

    stories.forEach((story) => {
      if (story.epic) {
        if (!grouped[story.epic]) {
          grouped[story.epic] = []
        }
        grouped[story.epic].push(story)
      }
    })

    return grouped
  }, [stories])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "implemented":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "planned":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "backlog":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const renderStoryCard = (story: UserStory) => (
    <Card key={story.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-base">{story.title}</CardTitle>
            <CardDescription>{story.id}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className={getPriorityColor(story.priority)}>
              {story.priority}
            </Badge>
            <Badge variant="outline" className={getStatusColor(story.status)}>
              {story.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">{story.description}</p>
        {story.acceptanceCriteria.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Acceptance Criteria:</h4>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {story.acceptanceCriteria.map((criteria, index) => (
                <li key={index}>{criteria}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {story.components.map((component) => (
            <Badge key={component} variant="secondary" className="text-xs">
              {component}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Tabs defaultValue={defaultView} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="stories">All Stories</TabsTrigger>
        <TabsTrigger value="components">By Component</TabsTrigger>
        <TabsTrigger value="epics">By Epic</TabsTrigger>
      </TabsList>

      <TabsContent value="stories">
        <ScrollArea className="h-[600px] pr-4">{stories.map(renderStoryCard)}</ScrollArea>
      </TabsContent>

      <TabsContent value="components">
        <ScrollArea className="h-[600px] pr-4">
          {Object.entries(storiesByComponent).map(([component, componentStories]) => (
            <div key={component} className="mb-8">
              <div className="mb-4">
                <h3 className="text-lg font-bold">{component}</h3>
                {components[component] && (
                  <p className="text-sm text-muted-foreground">
                    {components[component].description}
                    <span className="text-xs ml-2 text-muted-foreground">Path: {components[component].path}</span>
                  </p>
                )}
              </div>
              {componentStories.map(renderStoryCard)}
            </div>
          ))}
        </ScrollArea>
      </TabsContent>

      <TabsContent value="epics">
        <ScrollArea className="h-[600px] pr-4">
          {Object.entries(storiesByEpic).map(([epic, epicStories]) => (
            <div key={epic} className="mb-8">
              <div className="mb-4">
                <h3 className="text-lg font-bold">{epics[epic]?.title || epic}</h3>
                {epics[epic] && <p className="text-sm text-muted-foreground">{epics[epic].description}</p>}
              </div>
              {epicStories.map(renderStoryCard)}
            </div>
          ))}
        </ScrollArea>
      </TabsContent>
    </Tabs>
  )
}
