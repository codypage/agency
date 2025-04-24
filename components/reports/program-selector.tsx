"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface ProgramSelectorProps {
  selectedProgram: string
  onProgramChange: (program: string) => void
}

export function ProgramSelector({ selectedProgram, onProgramChange }: ProgramSelectorProps) {
  // Mock data for available programs
  const availablePrograms = [
    {
      id: "autism",
      name: "Autism Program",
      description: "ABA therapy services for autism spectrum disorders",
      cptCodes: ["97151", "97153", "97154", "97155", "97156", "97158"],
      active: true,
    },
    {
      id: "mental-health",
      name: "Mental Health Program",
      description: "Outpatient mental health services",
      cptCodes: ["90791", "90837", "90847", "90853", "H0031", "H2019"],
      active: true,
    },
    {
      id: "substance-use",
      name: "Substance Use Program",
      description: "Substance use disorder treatment services",
      cptCodes: ["H0001", "H0004", "H0005", "H0015", "H0020", "T1006"],
      active: true,
    },
    {
      id: "developmental",
      name: "Developmental Disabilities Program",
      description: "Services for individuals with developmental disabilities",
      cptCodes: ["T1017", "T1020", "T2021", "T2025", "H2014", "H2023"],
      active: true,
    },
    {
      id: "early-intervention",
      name: "Early Intervention Program",
      description: "Services for children ages 0-3 with developmental delays",
      cptCodes: ["92507", "92508", "92526", "97110", "97530", "T1027"],
      active: true,
    },
  ]

  const selectedProgramData =
    availablePrograms.find((program) => program.id === selectedProgram) || availablePrograms[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Program Selection</CardTitle>
        <CardDescription>Select a program to view reports</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="program-select">Current Program</Label>
            <Select value={selectedProgram} onValueChange={onProgramChange}>
              <SelectTrigger id="program-select">
                <SelectValue placeholder="Select a program" />
              </SelectTrigger>
              <SelectContent>
                {availablePrograms.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Program Details</h3>
            <p className="text-sm mb-2">{selectedProgramData.description}</p>
            <div className="flex flex-wrap gap-1">
              {selectedProgramData.cptCodes.map((code) => (
                <Badge key={code} variant="outline">
                  {code}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
