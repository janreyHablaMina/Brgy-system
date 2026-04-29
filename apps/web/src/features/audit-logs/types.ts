export type AuditSeverity = "Info" | "Warning" | "Critical";

export type AuditRole = "Admin" | "Staff" | "Treasurer" | "Secretary";

export type AuditLog = {
  id: string;
  timestamp: string;
  userName: string;
  role: AuditRole;
  action: string;
  module: string;
  description: string;
  severity: AuditSeverity;
  ipAddress?: string;
  device?: string;
  affectedRecord?: string;
  oldValue?: string;
  newValue?: string;
};
