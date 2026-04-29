import type { DutySchedule, IncidentReport, PatrolLog, TanodMember } from "./types";

export const MOCK_TANOD_MEMBERS: TanodMember[] = [
  {
    id: "TM-001",
    badgeNumber: "TND-1001",
    fullName: "Ramon Dela Cruz",
    team: "Alpha",
    beatAssignment: "Purok 1",
    dateAppointed: "2024-06-10",
    status: "Active",
    isLeader: true,
  },
  {
    id: "TM-002",
    badgeNumber: "TND-1002",
    fullName: "Leo Ramos",
    team: "Alpha",
    beatAssignment: "Purok 2",
    dateAppointed: "2025-01-15",
    status: "Active",
  },
  {
    id: "TM-003",
    badgeNumber: "TND-1003",
    fullName: "Jun Santos",
    team: "Bravo",
    beatAssignment: "Purok 3",
    dateAppointed: "2023-11-02",
    status: "Suspended",
  },
  {
    id: "TM-004",
    badgeNumber: "TND-1004",
    fullName: "Carlito Reyes",
    team: "Bravo",
    beatAssignment: "Purok 4",
    dateAppointed: "2022-08-18",
    status: "Inactive",
  },
];

export const MOCK_DUTY_SCHEDULES: DutySchedule[] = [
  { id: "DS-001", memberName: "Ramon Dela Cruz", date: "2026-05-01", shift: "Night", assignedArea: "Purok 1" },
  { id: "DS-002", memberName: "Leo Ramos", date: "2026-05-01", shift: "Evening", assignedArea: "Purok 2" },
  { id: "DS-003", memberName: "Jun Santos", date: "2026-05-02", shift: "Morning", assignedArea: "Purok 3" },
];

export const MOCK_PATROL_LOGS: PatrolLog[] = [
  {
    id: "PL-001",
    dateTime: "2026-04-29T21:30:00+08:00",
    assignedMembers: ["Ramon Dela Cruz", "Leo Ramos"],
    areaCovered: "Purok 1 to Purok 2",
    notes: "Routine patrol completed. No major incidents observed.",
  },
  {
    id: "PL-002",
    dateTime: "2026-04-28T23:15:00+08:00",
    assignedMembers: ["Jun Santos"],
    areaCovered: "Purok 3",
    notes: "Responded to noise complaint and coordinated mediation.",
  },
];

export const MOCK_INCIDENT_REPORTS: IncidentReport[] = [
  {
    id: "IR-001",
    incidentType: "Disturbance",
    dateTime: "2026-04-29T22:10:00+08:00",
    location: "Purok 2 Covered Court",
    involvedPersons: "2 residents",
    description: "Verbal altercation during late-night gathering.",
    status: "Investigating",
  },
  {
    id: "IR-002",
    incidentType: "Theft",
    dateTime: "2026-04-27T05:40:00+08:00",
    location: "Purok 1 Main Road",
    description: "Motorcycle side mirror reported stolen.",
    status: "Open",
  },
  {
    id: "IR-003",
    incidentType: "Public Safety",
    dateTime: "2026-04-20T18:00:00+08:00",
    location: "Purok 4",
    description: "Damaged streetlight near pedestrian crossing.",
    status: "Resolved",
  },
];
