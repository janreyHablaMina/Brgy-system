export type DisasterType = "Flood" | "Typhoon" | "Fire" | "Earthquake" | "Other";

export type EventStatus = "Active" | "Resolved";

export type HazardType = "Flood" | "Landslide" | "Fire";

export type RiskLevel = "Low" | "Medium" | "High";

export type EvacueeStatus = "Evacuated" | "Returned";

export type EvacuationEvent = {
  id: string;
  eventName: string;
  disasterType: DisasterType;
  dateTime: string;
  location: string;
  status: EventStatus;
  description: string;
};

export type HazardArea = {
  id: string;
  purok: string;
  hazardType: HazardType;
  riskLevel: RiskLevel;
  notes: string;
};

export type EvacueeFamily = {
  id: string;
  familyHeadName: string;
  members: number;
  evacuationCenter: string;
  status: EvacueeStatus;
  notes: string;
};
