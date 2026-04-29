export type TanodStatus = "Active" | "Inactive" | "Suspended";

export type ShiftType = "Morning" | "Evening" | "Night";

export type IncidentStatus = "Open" | "Investigating" | "Resolved";

export type TanodMember = {
  id: string;
  badgeNumber: string;
  fullName: string;
  team: string;
  beatAssignment: string;
  dateAppointed: string;
  status: TanodStatus;
  isLeader?: boolean;
};

export type DutySchedule = {
  id: string;
  memberName: string;
  date: string;
  shift: ShiftType;
  assignedArea: string;
};

export type PatrolLog = {
  id: string;
  dateTime: string;
  assignedMembers: string[];
  areaCovered: string;
  notes: string;
};

export type IncidentReport = {
  id: string;
  incidentType: string;
  dateTime: string;
  location: string;
  involvedPersons?: string;
  description: string;
  status: IncidentStatus;
};
