import type { EvacuationEvent, EvacueeFamily, HazardArea } from "./types";

export const MOCK_EVACUATION_EVENTS: EvacuationEvent[] = [
  {
    id: "EVT-001",
    eventName: "Typhoon Auring Response",
    disasterType: "Typhoon",
    dateTime: "2026-04-28T05:30:00+08:00",
    location: "Purok 1 and Purok 2",
    status: "Active",
    description: "Preemptive evacuation due to continuous heavy rainfall and strong winds.",
  },
  {
    id: "EVT-002",
    eventName: "Market Area Fire Incident",
    disasterType: "Fire",
    dateTime: "2026-04-16T13:10:00+08:00",
    location: "Public Market, Purok 3",
    status: "Resolved",
    description: "Contained fire incident with coordinated response from BFP.",
  },
];

export const MOCK_HAZARD_AREAS: HazardArea[] = [
  {
    id: "HZD-001",
    purok: "Purok 1 Riverside",
    hazardType: "Flood",
    riskLevel: "High",
    notes: "Frequent water rise during monsoon and typhoon season.",
  },
  {
    id: "HZD-002",
    purok: "Purok 4 Hillside",
    hazardType: "Landslide",
    riskLevel: "Medium",
    notes: "Needs slope stabilization and regular monitoring.",
  },
  {
    id: "HZD-003",
    purok: "Public Market Zone",
    hazardType: "Fire",
    riskLevel: "High",
    notes: "Dense stalls and electrical overload risk during peak hours.",
  },
];

export const MOCK_EVACUEE_FAMILIES: EvacueeFamily[] = [
  {
    id: "FAM-001",
    familyHeadName: "Maria Lopez Santos",
    members: 5,
    evacuationCenter: "Brgy. Covered Court",
    status: "Evacuated",
    notes: "Priority for infant nutrition supplies.",
  },
  {
    id: "FAM-002",
    familyHeadName: "Pedro Cruz Luna",
    members: 3,
    evacuationCenter: "Brgy. Hall Annex",
    status: "Evacuated",
    notes: "One senior citizen requiring maintenance medication.",
  },
  {
    id: "FAM-003",
    familyHeadName: "Ana Garcia Reyes",
    members: 4,
    evacuationCenter: "Brgy. Covered Court",
    status: "Returned",
    notes: "Returned after safety clearance on April 18, 2026.",
  },
];
