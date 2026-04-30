import type { BudgetRecord, CashbookEntry, CollectionRecord, DisbursementRecord } from "./types";

export const MOCK_BUDGETS: BudgetRecord[] = [
  {
    id: "BUD-2026",
    fiscalYear: 2026,
    appropriation: 5200000,
    allotment: 4700000,
    obligations: 2840000,
    unobligatedBalance: 1860000,
    status: "Active",
  },
  {
    id: "BUD-2025",
    fiscalYear: 2025,
    appropriation: 4800000,
    allotment: 4500000,
    obligations: 4500000,
    unobligatedBalance: 0,
    status: "Closed",
  },
];

export const MOCK_DISBURSEMENTS: DisbursementRecord[] = [
  {
    id: "DIS-001",
    date: "2026-04-25",
    amount: 45200,
    category: "Supplies",
    description: "Office supplies and printing materials for April operations",
    approvedBy: "Treasurer Cruz",
  },
  {
    id: "DIS-002",
    date: "2026-04-23",
    amount: 175000,
    category: "Projects",
    description: "Community drainage maintenance project (phase 1)",
    approvedBy: "Punong Barangay Ramos",
  },
  {
    id: "DIS-003",
    date: "2026-04-20",
    amount: 98000,
    category: "Salary",
    description: "Honorarium release for barangay personnel",
    approvedBy: "Treasurer Cruz",
  },
];

export const MOCK_CASHBOOK: CashbookEntry[] = [
  {
    id: "CB-001",
    date: "2026-04-20",
    transactionType: "Credit",
    description: "Opening balance carried forward",
    amount: 850000,
    runningBalance: 850000,
  },
  {
    id: "CB-002",
    date: "2026-04-23",
    transactionType: "Debit",
    description: "Drainage project phase 1 disbursement",
    amount: 175000,
    runningBalance: 675000,
  },
  {
    id: "CB-003",
    date: "2026-04-25",
    transactionType: "Debit",
    description: "Office supply procurement",
    amount: 45200,
    runningBalance: 629800,
  },
];

export const MOCK_COLLECTIONS: CollectionRecord[] = [
  {
    id: "COL-001",
    date: "2026-04-26",
    source: "Barangay Clearance",
    amount: 12500,
    collectedBy: "Clerk Santos",
    referenceNumber: "OR-2026-1182",
  },
  {
    id: "COL-002",
    date: "2026-04-27",
    source: "Business Permit",
    amount: 20800,
    collectedBy: "Clerk Dela Cruz",
    referenceNumber: "OR-2026-1186",
  },
  {
    id: "COL-003",
    date: "2026-04-28",
    source: "Certification Fee",
    amount: 3400,
    collectedBy: "Clerk Santos",
    referenceNumber: "OR-2026-1193",
  },
];
