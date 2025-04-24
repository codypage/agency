// Program configuration and data

// Define types for program configuration
interface ServiceCode {
  code: string
  description: string
}

interface Provider {
  id: string
  name: string
  role?: string
}

interface Client {
  id: string
  name: string
}

interface ServiceUsageData {
  cptCode: string
  description: string
  totalSessions: number
  totalHours: number
  totalUnits: number
  averageUnitsPerSession: number
  providers: string[]
  clients: number
}

interface AuthorizationData {
  id: string
  client: string
  cptCode: string
  description: string
  authorizedUnits: number
  usedUnits: number
  remainingUnits: number
  startDate: string
  endDate: string
  provider: string
  status: string
  percentUsed: number
}

interface ProgramConfig {
  id: string
  name: string
  description: string
  terminology: {
    serviceCode: string
    serviceUsage: string
    units: string
    authorization: string
  }
  serviceCodes: ServiceCode[]
  providers: Provider[]
  clients: Client[]
  serviceUsageData: ServiceUsageData[]
  authorizationData: AuthorizationData[]
  monthlyTrendData: any[]
  chartColors: string[]
}

// Program configurations
const programConfigs: Record<string, ProgramConfig> = {
  autism: {
    id: "autism",
    name: "Autism Program",
    description: "ABA therapy services for autism spectrum disorders",
    terminology: {
      serviceCode: "CPT Code",
      serviceUsage: "CPT Code",
      units: "Units",
      authorization: "Authorization",
    },
    serviceCodes: [
      { code: "97151", description: "Behavior Identification Assessment" },
      { code: "97153", description: "Adaptive behavior treatment by protocol" },
      { code: "97154", description: "Group adaptive behavior treatment" },
      { code: "97155", description: "Adaptive behavior treatment with protocol modification" },
      { code: "97156", description: "Family adaptive behavior treatment guidance" },
      { code: "97158", description: "Group adaptive behavior treatment w/ protocol modification" },
    ],
    providers: [
      { id: "stacy", name: "Stacy", role: "BCBA" },
      { id: "brittany", name: "Brittany", role: "RBT" },
      { id: "dakota", name: "Dakota", role: "BCBA" },
      { id: "jaden", name: "Jaden", role: "RBT" },
      { id: "bill", name: "Bill", role: "Admin" },
    ],
    clients: [
      { id: "incredible-test", name: "Incredible Test (Mock)" },
      { id: "client1", name: "John D." },
      { id: "client2", name: "Sarah M." },
      { id: "client3", name: "Michael R." },
      { id: "client4", name: "Emma T." },
    ],
    serviceUsageData: [
      {
        cptCode: "97151",
        description: "Behavior Identification Assessment",
        totalSessions: 42,
        totalHours: 105,
        totalUnits: 420, // 1 unit = 15 min
        averageUnitsPerSession: 10,
        providers: ["stacy", "dakota", "jaden"],
        clients: 15,
      },
      {
        cptCode: "97153",
        description: "Adaptive behavior treatment by protocol",
        totalSessions: 128,
        totalHours: 256,
        totalUnits: 1024,
        averageUnitsPerSession: 8,
        providers: ["stacy", "brittany", "dakota"],
        clients: 12,
      },
      {
        cptCode: "97154",
        description: "Group adaptive behavior treatment",
        totalSessions: 24,
        totalHours: 36,
        totalUnits: 144,
        averageUnitsPerSession: 6,
        providers: ["brittany", "jaden"],
        clients: 8,
      },
      {
        cptCode: "97155",
        description: "Adaptive behavior treatment with protocol modification",
        totalSessions: 56,
        totalHours: 84,
        totalUnits: 336,
        averageUnitsPerSession: 6,
        providers: ["dakota", "jaden"],
        clients: 10,
      },
      {
        cptCode: "97156",
        description: "Family adaptive behavior treatment guidance",
        totalSessions: 35,
        totalHours: 35,
        totalUnits: 140,
        averageUnitsPerSession: 4,
        providers: ["stacy", "dakota"],
        clients: 14,
      },
      {
        cptCode: "97158",
        description: "Group adaptive behavior treatment w/ protocol modification",
        totalSessions: 18,
        totalHours: 27,
        totalUnits: 108,
        averageUnitsPerSession: 6,
        providers: ["brittany", "jaden"],
        clients: 6,
      },
    ],
    authorizationData: [
      {
        id: "AUTH-001",
        client: "Incredible Test",
        cptCode: "97151",
        description: "Behavior Identification Assessment",
        authorizedUnits: 40,
        usedUnits: 32,
        remainingUnits: 8,
        startDate: "2023-01-15",
        endDate: "2023-07-15",
        provider: "dakota",
        status: "active",
        percentUsed: 80,
      },
      {
        id: "AUTH-002",
        client: "John D.",
        cptCode: "97153",
        description: "Adaptive behavior treatment by protocol",
        authorizedUnits: 480,
        usedUnits: 320,
        remainingUnits: 160,
        startDate: "2023-02-01",
        endDate: "2023-08-01",
        provider: "stacy",
        status: "active",
        percentUsed: 67,
      },
      {
        id: "AUTH-003",
        client: "Sarah M.",
        cptCode: "97153",
        description: "Adaptive behavior treatment by protocol",
        authorizedUnits: 480,
        usedUnits: 384,
        remainingUnits: 96,
        startDate: "2023-01-10",
        endDate: "2023-07-10",
        provider: "brittany",
        status: "active",
        percentUsed: 80,
      },
      {
        id: "AUTH-004",
        client: "Michael R.",
        cptCode: "97155",
        description: "Adaptive behavior treatment with protocol modification",
        authorizedUnits: 120,
        usedUnits: 96,
        remainingUnits: 24,
        startDate: "2023-03-01",
        endDate: "2023-09-01",
        provider: "jaden",
        status: "active",
        percentUsed: 80,
      },
      {
        id: "AUTH-005",
        client: "Emma T.",
        cptCode: "97156",
        description: "Family adaptive behavior treatment guidance",
        authorizedUnits: 48,
        usedUnits: 36,
        remainingUnits: 12,
        startDate: "2023-02-15",
        endDate: "2023-08-15",
        provider: "dakota",
        status: "active",
        percentUsed: 75,
      },
    ],
    monthlyTrendData: [
      { month: "Jan", "97151": 32, "97153": 78, "97154": 12, "97155": 28, "97156": 18, "97158": 9 },
      { month: "Feb", "97151": 38, "97153": 85, "97154": 15, "97155": 32, "97156": 22, "97158": 12 },
      { month: "Mar", "97151": 42, "97153": 92, "97154": 18, "97155": 38, "97156": 25, "97158": 14 },
      { month: "Apr", "97151": 40, "97153": 96, "97154": 20, "97155": 42, "97156": 28, "97158": 16 },
      { month: "May", "97151": 45, "97153": 105, "97154": 22, "97155": 45, "97156": 30, "97158": 18 },
      { month: "Jun", "97151": 48, "97153": 110, "97154": 24, "97155": 48, "97156": 32, "97158": 20 },
    ],
    chartColors: ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe", "#00C49F"],
  },
  "mental-health": {
    id: "mental-health",
    name: "Mental Health Program",
    description: "Outpatient mental health services",
    terminology: {
      serviceCode: "Service Code",
      serviceUsage: "Service",
      units: "Units",
      authorization: "Authorization",
    },
    serviceCodes: [
      { code: "90791", description: "Psychiatric diagnostic evaluation" },
      { code: "90837", description: "Psychotherapy, 60 minutes" },
      { code: "90847", description: "Family psychotherapy with patient present" },
      { code: "90853", description: "Group psychotherapy" },
      { code: "H0031", description: "Mental health assessment" },
      { code: "H2019", description: "Therapeutic behavioral services" },
    ],
    providers: [
      { id: "dr-smith", name: "Dr. Smith", role: "Psychiatrist" },
      { id: "dr-jones", name: "Dr. Jones", role: "Psychologist" },
      { id: "lisa", name: "Lisa", role: "LCSW" },
      { id: "mark", name: "Mark", role: "LPC" },
      { id: "sarah", name: "Sarah", role: "LMFT" },
    ],
    clients: [
      { id: "client5", name: "Robert J." },
      { id: "client6", name: "Patricia L." },
      { id: "client7", name: "Thomas W." },
      { id: "client8", name: "Jennifer K." },
      { id: "client9", name: "Christopher M." },
    ],
    serviceUsageData: [
      {
        cptCode: "90791",
        description: "Psychiatric diagnostic evaluation",
        totalSessions: 35,
        totalHours: 35,
        totalUnits: 35,
        averageUnitsPerSession: 1,
        providers: ["dr-smith", "dr-jones"],
        clients: 28,
      },
      {
        cptCode: "90837",
        description: "Psychotherapy, 60 minutes",
        totalSessions: 145,
        totalHours: 145,
        totalUnits: 145,
        averageUnitsPerSession: 1,
        providers: ["dr-jones", "lisa", "mark", "sarah"],
        clients: 42,
      },
      {
        cptCode: "90847",
        description: "Family psychotherapy with patient present",
        totalSessions: 68,
        totalHours: 68,
        totalUnits: 68,
        averageUnitsPerSession: 1,
        providers: ["lisa", "sarah"],
        clients: 24,
      },
      {
        cptCode: "90853",
        description: "Group psychotherapy",
        totalSessions: 52,
        totalHours: 78,
        totalUnits: 52,
        averageUnitsPerSession: 1,
        providers: ["mark", "sarah"],
        clients: 36,
      },
      {
        cptCode: "H0031",
        description: "Mental health assessment",
        totalSessions: 42,
        totalHours: 63,
        totalUnits: 42,
        averageUnitsPerSession: 1,
        providers: ["dr-jones", "lisa", "mark"],
        clients: 38,
      },
      {
        cptCode: "H2019",
        description: "Therapeutic behavioral services",
        totalSessions: 96,
        totalHours: 96,
        totalUnits: 96,
        averageUnitsPerSession: 1,
        providers: ["lisa", "mark", "sarah"],
        clients: 32,
      },
    ],
    authorizationData: [
      {
        id: "AUTH-101",
        client: "Robert J.",
        cptCode: "90837",
        description: "Psychotherapy, 60 minutes",
        authorizedUnits: 24,
        usedUnits: 16,
        remainingUnits: 8,
        startDate: "2023-01-10",
        endDate: "2023-07-10",
        provider: "dr-jones",
        status: "active",
        percentUsed: 67,
      },
      {
        id: "AUTH-102",
        client: "Patricia L.",
        cptCode: "90847",
        description: "Family psychotherapy with patient present",
        authorizedUnits: 12,
        usedUnits: 8,
        remainingUnits: 4,
        startDate: "2023-02-05",
        endDate: "2023-08-05",
        provider: "sarah",
        status: "active",
        percentUsed: 67,
      },
      {
        id: "AUTH-103",
        client: "Thomas W.",
        cptCode: "H2019",
        description: "Therapeutic behavioral services",
        authorizedUnits: 36,
        usedUnits: 24,
        remainingUnits: 12,
        startDate: "2023-01-20",
        endDate: "2023-07-20",
        provider: "mark",
        status: "active",
        percentUsed: 67,
      },
    ],
    monthlyTrendData: [
      { month: "Jan", "90791": 8, "90837": 28, "90847": 12, "90853": 8, H0031: 10, H2019: 18 },
      { month: "Feb", "90791": 6, "90837": 32, "90847": 14, "90853": 10, H0031: 8, H2019: 20 },
      { month: "Mar", "90791": 7, "90837": 30, "90847": 15, "90853": 12, H0031: 9, H2019: 22 },
      { month: "Apr", "90791": 8, "90837": 28, "90847": 14, "90853": 10, H0031: 8, H2019: 18 },
      { month: "May", "90791": 6, "90837": 27, "90847": 13, "90853": 12, H0031: 7, H2019: 18 },
      { month: "Jun", "90791": 0, "90837": 0, "90847": 0, "90853": 0, H0031: 0, H2019: 0 },
    ],
    chartColors: ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe", "#00C49F"],
  },
  "substance-use": {
    id: "substance-use",
    name: "Substance Use Program",
    description: "Substance use disorder treatment services",
    terminology: {
      serviceCode: "HCPCS Code",
      serviceUsage: "Service",
      units: "Units",
      authorization: "Authorization",
    },
    serviceCodes: [
      { code: "H0001", description: "Alcohol and/or drug assessment" },
      { code: "H0004", description: "Behavioral health counseling and therapy" },
      { code: "H0005", description: "Alcohol and/or drug services; group counseling" },
      { code: "H0015", description: "Intensive outpatient treatment" },
      { code: "H0020", description: "Methadone administration" },
      { code: "T1006", description: "Family/couple counseling" },
    ],
    providers: [
      { id: "dr-wilson", name: "Dr. Wilson", role: "Addiction Psychiatrist" },
      { id: "james", name: "James", role: "LCDC" },
      { id: "emily", name: "Emily", role: "LCSW" },
      { id: "michael", name: "Michael", role: "LPC" },
      { id: "rachel", name: "Rachel", role: "Nurse Practitioner" },
    ],
    clients: [
      { id: "client10", name: "David H." },
      { id: "client11", name: "Susan B." },
      { id: "client12", name: "Richard T." },
      { id: "client13", name: "Karen L." },
      { id: "client14", name: "Joseph M." },
    ],
    serviceUsageData: [
      {
        cptCode: "H0001",
        description: "Alcohol and/or drug assessment",
        totalSessions: 48,
        totalHours: 48,
        totalUnits: 48,
        averageUnitsPerSession: 1,
        providers: ["dr-wilson", "james", "emily"],
        clients: 42,
      },
      {
        cptCode: "H0004",
        description: "Behavioral health counseling and therapy",
        totalSessions: 156,
        totalHours: 156,
        totalUnits: 156,
        averageUnitsPerSession: 1,
        providers: ["james", "emily", "michael"],
        clients: 38,
      },
      {
        cptCode: "H0005",
        description: "Alcohol and/or drug services; group counseling",
        totalSessions: 72,
        totalHours: 144,
        totalUnits: 72,
        averageUnitsPerSession: 1,
        providers: ["james", "michael"],
        clients: 45,
      },
      {
        cptCode: "H0015",
        description: "Intensive outpatient treatment",
        totalSessions: 36,
        totalHours: 108,
        totalUnits: 36,
        averageUnitsPerSession: 1,
        providers: ["dr-wilson", "rachel"],
        clients: 12,
      },
      {
        cptCode: "H0020",
        description: "Methadone administration",
        totalSessions: 420,
        totalHours: 105,
        totalUnits: 420,
        averageUnitsPerSession: 1,
        providers: ["rachel"],
        clients: 15,
      },
      {
        cptCode: "T1006",
        description: "Family/couple counseling",
        totalSessions: 64,
        totalHours: 64,
        totalUnits: 64,
        averageUnitsPerSession: 1,
        providers: ["emily", "michael"],
        clients: 28,
      },
    ],
    authorizationData: [
      {
        id: "AUTH-201",
        client: "David H.",
        cptCode: "H0004",
        description: "Behavioral health counseling and therapy",
        authorizedUnits: 24,
        usedUnits: 18,
        remainingUnits: 6,
        startDate: "2023-02-01",
        endDate: "2023-08-01",
        provider: "james",
        status: "active",
        percentUsed: 75,
      },
      {
        id: "AUTH-202",
        client: "Susan B.",
        cptCode: "H0015",
        description: "Intensive outpatient treatment",
        authorizedUnits: 12,
        usedUnits: 8,
        remainingUnits: 4,
        startDate: "2023-01-15",
        endDate: "2023-07-15",
        provider: "dr-wilson",
        status: "active",
        percentUsed: 67,
      },
    ],
    monthlyTrendData: [
      { month: "Jan", H0001: 12, H0004: 32, H0005: 16, H0015: 8, H0020: 84, T1006: 14 },
      { month: "Feb", H0001: 10, H0004: 36, H0005: 18, H0015: 9, H0020: 86, T1006: 16 },
      { month: "Mar", H0001: 9, H0004: 34, H0005: 14, H0015: 7, H0020: 88, T1006: 12 },
      { month: "Apr", H0001: 8, H0004: 30, H0005: 12, H0015: 6, H0020: 82, T1006: 10 },
      { month: "May", H0001: 9, H0004: 24, H0005: 12, H0015: 6, H0020: 80, T1006: 12 },
      { month: "Jun", H0001: 0, H0004: 0, H0005: 0, H0015: 0, H0020: 0, T1006: 0 },
    ],
    chartColors: ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe", "#00C49F"],
  },
}

// Function to get program configuration
export function getProgramConfig(programId: string): ProgramConfig {
  return programConfigs[programId] || programConfigs["autism"] // Default to autism program if not found
}

// Export types
export type { ServiceCode, Provider, Client, ServiceUsageData, AuthorizationData, ProgramConfig }
