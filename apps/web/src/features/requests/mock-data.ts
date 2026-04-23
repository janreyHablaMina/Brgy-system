import { Request } from "./types";

export const MOCK_REQUESTS: Request[] = [
  {
    id: "REQ-2026-001",
    type: "Barangay Clearance",
    entityName: "Juan Dela Cruz",
    entityType: "Residents",
    entityId: "RES-2024-001",
    purpose: "Employment Requirement",
    submittedAt: "2026-04-20T08:30:00Z",
    status: "New",
    priority: "Normal",
    timeline: [
      {
        id: "evt-1",
        status: "New",
        label: "Request Submitted",
        timestamp: "2026-04-20T08:30:00Z",
        actor: "Resident (Online Portal)"
      }
    ]
  },
  {
    id: "REQ-2026-002",
    type: "Certificate of Indigency",
    entityName: "Maria Clara",
    entityType: "Residents",
    entityId: "RES-2024-045",
    purpose: "Medical Assistance",
    submittedAt: "2026-04-21T10:15:00Z",
    status: "Pending",
    priority: "High",
    assignedStaff: "Sgt. Pepper",
    timeline: [
      {
        id: "evt-1",
        status: "New",
        label: "Request Submitted",
        timestamp: "2026-04-21T10:15:00Z",
        actor: "Resident (Walk-in)"
      },
      {
        id: "evt-2",
        status: "Pending",
        label: "Assigned to Staff",
        timestamp: "2026-04-21T11:00:00Z",
        actor: "Admin",
        remarks: "Assigned to Sgt. Pepper for verification."
      }
    ]
  },
  {
    id: "REQ-2026-003",
    type: "Business Endorsement",
    entityName: "Salaza Mart",
    entityType: "Establishments",
    entityId: "EST-2026-0001",
    purpose: "Business Permit Renewal",
    submittedAt: "2026-04-22T14:00:00Z",
    status: "Processing",
    priority: "Normal",
    assignedStaff: "Officer Jenny",
    timeline: [
      {
        id: "evt-1",
        status: "New",
        label: "Request Submitted",
        timestamp: "2026-04-22T14:00:00Z",
        actor: "Business Owner"
      },
      {
        id: "evt-2",
        status: "Pending",
        label: "Assigned to Staff",
        timestamp: "2026-04-22T14:30:00Z",
        actor: "Admin"
      },
      {
        id: "evt-3",
        status: "Processing",
        label: "Document Verification",
        timestamp: "2026-04-23T09:00:00Z",
        actor: "Officer Jenny",
        remarks: "Verifying building permit records."
      }
    ]
  },
  {
    id: "REQ-2026-004",
    type: "Certificate of Residency",
    entityName: "Ricardo Dalisay",
    entityType: "Residents",
    entityId: "RES-2024-112",
    purpose: "Bank Account Opening",
    submittedAt: "2026-04-19T16:45:00Z",
    status: "Approved",
    priority: "Low",
    assignedStaff: "Sgt. Pepper",
    timeline: [
      {
        id: "evt-1",
        status: "New",
        label: "Request Submitted",
        timestamp: "2026-04-19T16:45:00Z",
        actor: "Resident"
      },
      {
        id: "evt-2",
        status: "Approved",
        label: "Request Approved",
        timestamp: "2026-04-20T10:00:00Z",
        actor: "Sgt. Pepper",
        remarks: "Resident record is active and verified."
      }
    ]
  },
  {
    id: "REQ-2026-005",
    type: "Certificate of Good Moral",
    entityName: "Pedro Penduko",
    entityType: "Residents",
    entityId: "RES-2025-002",
    purpose: "Scholarship Application",
    submittedAt: "2026-04-22T11:20:00Z",
    status: "Rejected",
    priority: "Urgent",
    assignedStaff: "Admin",
    remarks: "Incomplete supporting documents.",
    timeline: [
      {
        id: "evt-1",
        status: "New",
        label: "Request Submitted",
        timestamp: "2026-04-22T11:20:00Z",
        actor: "Resident"
      },
      {
        id: "evt-2",
        status: "Rejected",
        label: "Request Rejected",
        timestamp: "2026-04-22T13:00:00Z",
        actor: "Admin",
        remarks: "Resident failed to provide valid ID."
      }
    ]
  }
];
