import type { AdminProject } from "@/types/admin-project"

// Generate unique IDs for projects
const generateId = () => `proj-${Math.random().toString(36).substring(2, 9)}`

export const adminProjects: AdminProject[] = [
  {
    id: generateId(),
    task: "Productivity Report",
    furtherBreakdown:
      "Exceptions for ACT, IPS, Supervision of Students\n\nProductivity Update\nCreate process for universal language across agency - incl feedback from directors\nClarify billable vs. nonbillable\nEstablish process for creating new depts\nIs discipline protocol being followed?\nDiscipline Consequenses (Late Notes)",
    projectLead: "Cody/Lori",
    poc: "Amy/Lori",
    dueDate: "6-May",
    status: "In Progress",
    implemented: "No",
    checkedBy: "Cody/Lori",
    reportsDataUsed: "WIP",
    results: "In progress",
    communicatedBy: "Cody",
    category: "Reporting",
  },
  {
    id: generateId(),
    task: "Average Duration Proj",
    furtherBreakdown: "Pulled Data, going through protocol - w/i week",
    projectLead: "Cody/Lori",
    status: "In Progress",
    category: "Reporting",
  },
  {
    id: generateId(),
    task: "Reporting Enhancement",
    projectLead: "Cody",
    status: "In Progress",
    category: "Reporting",
  },
  {
    id: generateId(),
    task: "Project Mgr Software Demo",
    furtherBreakdown: "Demo Day (Admin Structure)\nDevlopment Server - ~$20/mo\nCody get credit card",
    projectLead: "Cody",
    dueDate: "6-May",
    status: "In Progress",
    category: "Technology",
  },
  {
    id: generateId(),
    task: "Projects for PM Software - Insurance Contracts",
    furtherBreakdown:
      "Are there claims we're paying 100%?\nAre we charging enough?\nEvaluate Current/Create protocol on rate increases, how often reviewed\nUnpaid costs/revenues - create cost of service delv",
    projectLead: "Billing",
    dueDate: "6-May",
    status: "In Progress",
    category: "Finance",
  },
  {
    id: generateId(),
    task: "Protocols",
    furtherBreakdown:
      "Indentify any protocols for dept - List\nReview for updates (esp if 2yrs or older)\nUpdate with new technology and tools\nBring new protocols/workflows to be created/developed\nDiscuss as group when and where those protocols intersect with other depts and what the new workflows should be.\n\nCreate process for protocols to added to Policy Manager and finalized from Admin structure Meetings",
    projectLead: "All Admin Dept Dir",
    poc: "Stacy",
    status: "Not Started",
    category: "Administration",
  },
  {
    id: generateId(),
    task: "Tours Protocol - To be developed",
    furtherBreakdown:
      "Approval - Exec, Deputy, or COO\nChecklist - Staff involved, Info req by guests, Confidentiality, Training for staff giving tour (client exposure), Lunch orders, Marketing swag",
    projectLead: "Amy/Lori",
    dueDate: "13-May",
    status: "In Progress",
    category: "Administration",
  },
  {
    id: generateId(),
    task: "Practicum Protocol",
    furtherBreakdown:
      "Update protocol with new forms and new info about justification for productivity\nMeeting with Practicum Students & Directors - changes effective 6/1/2025 with new justification form - verify",
    dueDate: "31-May",
    status: "In Progress",
    category: "Training",
  },
  {
    id: generateId(),
    task: "EBP/CEU/Agency Trng",
    furtherBreakdown:
      "# of CEUs required per regs and how many agency provides per training plan\nCreate agency standard for approved # of hours and $ per licensed individual - Standard for non-licensed individuals - should be what is provided by agency; Standard for agency sponsored training - how to est financially sustainable training and process for who attends factoring cost of lost revenue for training\n\nSettling on CEU Protocol/take to leadership",
    projectLead: "Lori/Amy",
    dueDate: "6-May",
    status: "In Progress",
    category: "Training",
  },
  {
    id: generateId(),
    task: "New Program/Service/EHR Design Devlp Protocol",
    furtherBreakdown:
      "Identify Key Stakeholders - Apply to Training Plan, Productivity, Director Checklist, EBP/CEUs\n\nDraft protocol - reviewed/edited\nReady to show to other stakeholders (MOU mtg format)",
    projectLead: "Stacy/Amy",
    status: "In Progress",
    category: "Administration",
  },
  {
    id: generateId(),
    task: "Pending Items from Finance & Ops Meeting",
    furtherBreakdown: "Finance and Ops Tab",
    projectLead: "All",
    status: "Not Started",
    category: "Finance",
  },
  {
    id: generateId(),
    task: "Office Space",
    furtherBreakdown: "Apt G\nApt F (with James - 3 spots)",
    projectLead: "Heather",
    dueDate: "29-Apr",
    status: "In Progress",
    category: "Facilities",
  },
  {
    id: generateId(),
    task: "Policy Manager",
    furtherBreakdown:
      "Process to read through policies and protocols - Identify keywords: any laws, regs, statutes, proper names, repeated words",
    projectLead: "Stacy/Jill",
    status: "Not Started",
    category: "Administration",
  },
  {
    id: generateId(),
    task: "Autism Program - Assessments",
    furtherBreakdown:
      "Assessment Tracking - Which assessments are performed? (ABLES, BB Map, ADOS, etc)\nWhich MCO require which assessments?\nReports: assessment frequency and results",
    status: "Not Started",
    category: "Clinical",
  },
  {
    id: generateId(),
    task: "Autism Program - Authorizations",
    furtherBreakdown:
      "Can we track pre-auth status and timelines? (Credible?)\nReport: Pre-auth statuses & timelines, staff certifications & required training hours, service delivery vs. TX\nAlerts, Notifications, Recurring Tasks: When approaching re-authorization deadline (starting at 4-month mark, alert & assign tasks)\nQuality Reports: Based on quality/fidelity checklist (long-term validation)",
    status: "Not Started",
    category: "Clinical",
  },
  {
    id: generateId(),
    task: "Autism Program - Treatment Design",
    furtherBreakdown:
      "Authorization is approved then _____.\nWhat is the day and time - how interacts with interlocal. Staff ratio. How combines with mh pps. Any services provided dual time? Like ac? Send to Lori to review for regulations and staffing ratios etc. please provide a due date that you think this can be done by.",
    status: "Not Started",
    category: "Clinical",
  },
  {
    id: generateId(),
    task: "Signs",
    furtherBreakdown: "RH Pfeiffer, Leadership Wall signs, Donor Wall signs, Pavers\nDirectional Signs",
    projectLead: "David/Marc",
    status: "Not Started",
    category: "Facilities",
  },
  {
    id: generateId(),
    task: "Ticketing System",
    furtherBreakdown:
      "Central Ticketing System Created\nPosted/Announced\nReport that shows all requests, information on each task - completed, rejected, timelines, etc from Oct 2024-Present\nReport - Incident Reporter\nReport - Marketing Requests",
    projectLead: "Chris/Lori/David",
    status: "Not Started",
    category: "Technology",
  },
  {
    id: generateId(),
    task: "Patient Navigators/Care Coordinators",
    furtherBreakdown:
      "Are we capturing what they're doing in Credible?\nWhat are the services? Has it been built right? - Evaluate Staff needs\nList of all the services they are trained to do - present to leadership/Sherise attend staffing meetings\nWorkflow - Process to request backup\nStagger Schedules to cover evening hours?",
    projectLead: "Stacy/Amy",
    status: "Not Started",
    category: "Clinical",
  },
  {
    id: generateId(),
    task: "Presumptive Medicaid",
    projectLead: "Brittany",
    status: "Not Started",
    category: "Finance",
  },
  {
    id: generateId(),
    task: "Protocol for Credible Form Building",
    furtherBreakdown: "Who is backup?\nWho is trainied?\nHow do you Delegate?\nCreate Process",
    projectLead: "Stacy",
    status: "Not Started",
    category: "Technology",
  },
  {
    id: generateId(),
    task: "Update Productivity and Bonus Protocol",
    projectLead: "Lori/Cody",
    status: "Not Started",
    category: "HR",
  },
  {
    id: generateId(),
    task: "Update Electronic Records Protocol with Terri",
    projectLead: "Stacy",
    status: "Not Started",
    category: "Technology",
  },
  {
    id: generateId(),
    task: "Vehicle Primary work location",
    furtherBreakdown: "Email Marc",
    projectLead: "All Directors/Marc",
    dueDate: "22-Apr",
    status: "Not Started",
    category: "Administration",
  },
  {
    id: generateId(),
    task: "Tuition Reimbursement & Clinical Supervision Forms Updated",
    furtherBreakdown: "Get Signatures on Contracts",
    projectLead: "Anavel",
    dueDate: "25-Apr",
    status: "Not Started",
    category: "HR",
  },
  {
    id: generateId(),
    task: "Employee & Family Member Treatment",
    furtherBreakdown: "Send to contracted employment lawyer for review",
    projectLead: "Lori",
    status: "Not Started",
    category: "HR",
  },
  {
    id: generateId(),
    task: "No Shows with On-Call Portal",
    furtherBreakdown: "Follow-up\nhow to utilize better\nsolution for reminders",
    projectLead: "Stacy",
    status: "Not Started",
    category: "Clinical",
  },
  {
    id: generateId(),
    task: "Smoking Areas",
    furtherBreakdown: "Identify at all buildings; send to Lori",
    projectLead: "All Directors",
    status: "Not Started",
    category: "Facilities",
  },
  {
    id: generateId(),
    task: "Panic Buttons",
    furtherBreakdown: "Designate # and location for panic buttons\nTicketing System",
    projectLead: "Chris",
    status: "Not Started",
    category: "Facilities",
  },
  {
    id: generateId(),
    task: "SUD Restructure Residential Groups",
    furtherBreakdown:
      "Timeline and new Productivity expectations for SUD counselors for OP\nReport: Co-occuring clients, relapse",
    status: "Not Started",
    category: "Clinical",
  },
  {
    id: generateId(),
    task: "CC Groups and Scheduling to be handled by SDA",
    status: "Not Started",
    category: "Clinical",
  },
  {
    id: generateId(),
    task: "Expanding Children's SUD treatment",
    furtherBreakdown:
      "Any data to showcase need\nRequest report children on psych meds that are clients that are seing meds with outside providers",
    projectLead: "Amy/Brittany",
    status: "Not Started",
    category: "Clinical",
  },
  {
    id: generateId(),
    task: "Director's Checklist",
    furtherBreakdown: "Create standard for what should be measured during supervision\nUpdate list saved in Teams",
    reportsDataUsed:
      "Credible reports\nEmpl Case Load Report\nServices Appt History Report\nServices Incomplete Visit Rpt\nCredible BI Reports\nAssigned Clients by Last Visit Date\nFull Time Empl Perf Dashboard\nPart Time Empl Perf Dashboard\nCensus Residential (SUD)\nAssessment Tracking (Filter to Employee)\n**Clients Program Management: Services Tab (Filter to Empl)\nExpiring Credible Plans Dashboard\nExec Empl Perfmance 12.0\nManagers Empl Performance 11.1 Dashboard",
    status: "Not Started",
    category: "Administration",
  },
  {
    id: generateId(),
    task: "Children's home services need to be documented",
    status: "Not Started",
    category: "Clinical",
  },
  {
    id: generateId(),
    task: "90 day treatment Plan Expectations",
    furtherBreakdown:
      "QMHP to review services that are being provided\nLori to consult with Amy on previous expectations\nSupervisors/Directors to review dept and employee for standards",
    status: "Not Started",
    category: "Clinical",
  },
  {
    id: generateId(),
    task: "Standards",
    furtherBreakdown:
      "Last visit Days 30 Days or Under\nNo clients that have not received services in 120+ days\nOnce rolled out, 6 weeks to meet expectation\nCreate standard check offs by department",
    status: "Not Started",
    category: "Administration",
  },
  {
    id: generateId(),
    task: "Service Definitions",
    furtherBreakdown: "Create a list with service definitions\nMeeting scheduled with case managers and definitions",
    status: "Not Started",
    category: "Clinical",
  },
  {
    id: generateId(),
    task: "Care Coordination",
    furtherBreakdown:
      "Re-evaluate job title for all navigators to see if a new title is needed\nEvaluate client encounter expectations for navigators - at what point should it be case manager\n- process for assigning navigators according to insurance source - like patients with credentialed providers\n- workflow and training for scheduling patients when navs contact and they want re-engaged - enter on schedules then - process for current MH diagnosis - process for SUD diagnosis - how connect to MH (SDA??)\nUpdate Jessica Keys to Crisis Case Manager?",
    status: "Not Started",
    category: "Clinical",
  },
  {
    id: generateId(),
    task: "Community Based Services for Uninsured",
    furtherBreakdown:
      "Billing Protocol & Agency Clinical Care\nData and report for CBS we are not compensated for\nAre we required/not required to provide\nAgency process getting clients into CBS and how we handle that clinically and financially.",
    status: "Not Started",
    category: "Finance",
  },
  {
    id: generateId(),
    task: "Productivity/Billing Analysis",
    furtherBreakdown:
      "Psych Testing: What does each insurance pay for 96130/96131 vs. 96136/96137?\nWhich should be used to maximize reimbursement?\nHow do we determine this? (Would JIT be a factor?)\n\nAre there other areas where we have the option of utilizing different codes and if so how did/do we justify one over the other (assuming credentials, hiring or other pre-reqs. not a concern)\n\nWhich non-billable services are *essential* services and how would you categorize them?\nHow would you categorize remaining non-billable services and how do you measure them? (Non-billable, non-essential, but leads to billable service)\nOutside of required or essential non-billable services, what is preventing us from converting non-billable time to billable time? How would we identify opportunities? (Assuming same provider, same credentials/certifications)\nWhat is the true cost of providing services compared to reimbursement? How do we factor in essential non-billable services? In addition/on top of that, how do we factor in administration department utilization? (e.g. Telehealth -> IT software, configuration, administration, training, ongoing maintenance & support)",
    status: "Not Started",
    category: "Finance",
  },
  {
    id: generateId(),
    task: "IT/Technology Infrastructure",
    furtherBreakdown:
      "Identify ALL current and existing technical debt. (e.g. on-prem AD, network, door systems) - These are projects we already have and will have to be completed or addressed someday.\n\nFor every new major project, renovation, or anything else where technology is involved factor in and consider technical debt.\n\nOur network needs to be properly segmented and secured vs. currently being an open, flat network. (Can by done by location, by device, or combination of both)\n\nOn-prem AD server is non-essential and Chris and I have discussed migrating away from it. Chris has put in a lot of work recently getting all the essentials moved over to M365. This should be prioritized because it's a significant un-needed complexity for any workflow automations we are looking to implement on user accounts.\n\nPaylocity API + Graph API (Microsoft) can be used by IT/HR/Admin to automatically perform onboarding/offboarding/other tasks on user accounts. (e.g. Instead of creating staff accounts multiple times across multiple services, create it once and create it everywhere using a defined process)",
    status: "Not Started",
    category: "Technology",
  },
]
