export type GadPlanStatus = "Draft" | "Submitted" | "Approved" | "Implemented";

export type GadPlan = {
  id: string;
  planTitle: string;
  description: string;
  targetBeneficiaries: string;
  budgetAllocation: number;
  year: number;
  status: GadPlanStatus;
  dateCreated: string;
  lastUpdated: string;
  attachmentName?: string;
};
