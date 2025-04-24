import { NextResponse } from "next/server"

export async function GET() {
  // Mock data for testing
  const data = [
    {
      employee: "Stacy",
      avgDuration: 45,
      availHours: 2080,
      expHours: 1040,
      goalEncounters: 1387,
      actualHours: 950,
      actualEncounters: 1200,
      percentHoursMet: 91,
      percentEncountersMet: 87,
      validFlag: "Valid",
    },
    {
      employee: "Dakota",
      avgDuration: 50,
      availHours: 2080,
      expHours: 1144,
      goalEncounters: 1373,
      actualHours: 800,
      actualEncounters: 900,
      percentHoursMet: 70,
      percentEncountersMet: 65,
      validFlag: "RecalcRate",
    },
    {
      employee: "Bill",
      avgDuration: 55,
      availHours: 2080,
      expHours: 1248,
      goalEncounters: 1364,
      actualHours: 1100,
      actualEncounters: 1300,
      percentHoursMet: 88,
      percentEncountersMet: 95,
      validFlag: "Valid",
    },
    {
      employee: "Amy",
      avgDuration: 60,
      availHours: 2080,
      expHours: 1352,
      goalEncounters: 1343,
      actualHours: 1200,
      actualEncounters: 1300,
      percentHoursMet: 89,
      percentEncountersMet: 97,
      validFlag: "Valid",
    },
    {
      employee: "David",
      avgDuration: 48,
      availHours: 2080,
      expHours: 1456,
      goalEncounters: 1820,
      actualHours: 1300,
      actualEncounters: 1600,
      percentHoursMet: 89,
      percentEncountersMet: 88,
      validFlag: "Valid",
    },
  ]

  return NextResponse.json(data)
}
