export type VawcCaseStatus = "Open" | "For Interview" | "For Referral" | "Closed";

export type VawcRiskLevel = "Low" | "Moderate" | "High" | "Critical";

export type VawcCaseType =
  | "Psychological Abuse"
  | "Physical Abuse"
  | "Economic Abuse"
  | "Sexual Abuse"
  | "Child Neglect"
  | "Other";

export type VawcCase = {
  id: string;
  survivorAlias: string;
  respondentAlias: string;
  caseType: VawcCaseType;
  riskLevel: VawcRiskLevel;
  status: VawcCaseStatus;
  dateReported: string;
  nextActionDate: string;
  protectionOrder: "None" | "BPO Drafted" | "BPO Issued";
  assignedOfficer: string;
  referralPartner: string;
  summary: string;
  safetyPlan: string[];
  updatedAt: string;
};
