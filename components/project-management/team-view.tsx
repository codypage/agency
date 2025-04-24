"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

interface TeamViewProps {
  teams: {
    name: string
    lead: string
    members: number
    tasksAssigned: number
    tasksCompleted: number
  }[]
}

export function TeamView({ teams }: TeamViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {teams.map((team) => {
        const completionPercentage = Math.round((team.tasksCompleted / team.tasksAssigned) * 100)

        return (
          <Card key={team.name}>
            <CardHeader>
              <CardTitle>{team.name}</CardTitle>
              <CardDescription>
                Lead: {team.lead} • {team.members} team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Task Completion</p>
                    <p className="text-2xl font-bold">{completionPercentage}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {team.tasksCompleted} of {team.tasksAssigned} tasks
                    </p>
                  </div>
                </div>

                <Progress value={completionPercentage} className="h-2" />

                <div className="pt-4">
                  <p className="text-sm font-medium mb-2">Team Members</p>
                  <div className="flex -space-x-2">
                    <Avatar className="h-8 w-8 border-2 border-background">
                      <AvatarImage
                        src={`/placeholder.svg?height=40&width=40&query=${team.lead.charAt(0)}`}
                        alt={team.lead}
                      />
                      <AvatarFallback>{team.lead.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {/* Placeholder for other team members */}
                    {Array.from({ length: team.members - 1 }).map((_, i) => (
                      <Avatar key={i} className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={`/placeholder.svg?height=40&width=40&query=TM`} alt="Team Member" />
                        <AvatarFallback>TM</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
