export type BudgetStatus = "Active" | "Closed";

export type DisbursementCategory = "Supplies" | "Projects" | "Salary" | "Utilities" | "Other";

export type CashTransactionType = "Debit" | "Credit";

export type BudgetRecord = {
  id: string;
  fiscalYear: number;
  appropriation: number;
  allotment: number;
  obligations: number;
  unobligatedBalance: number;
  status: BudgetStatus;
};

export type DisbursementRecord = {
  id: string;
  date: string;
  amount: number;
  category: DisbursementCategory;
  description: string;
  approvedBy: string;
};

export type CashbookEntry = {
  id: string;
  date: string;
  transactionType: CashTransactionType;
  description: string;
  amount: number;
  runningBalance: number;
};

export type CollectionRecord = {
  id: string;
  date: string;
  source: string;
  amount: number;
  collectedBy: string;
  referenceNumber: string;
};
