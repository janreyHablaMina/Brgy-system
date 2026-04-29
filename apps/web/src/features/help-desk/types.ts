export type TicketStatus = "Open" | "Resolved" | "Closed";

export type TicketPriority = "Low" | "Normal" | "High";

export type TicketCategory = "Bug" | "Request" | "System" | "Data";

export type TicketMessage = {
  id: string;
  sender: string;
  role: "Admin" | "Staff";
  content: string;
  timestamp: string;
  attachmentName?: string;
  internalNote?: boolean;
};

export type SupportTicket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  submittedBy: string;
  assignedTo?: string;
  createdAt: string;
  lastReplyAt: string;
  responseTimeHours: number;
  messages: TicketMessage[];
  tags: string[];
  activityLog: string[];
};
