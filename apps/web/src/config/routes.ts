export const ROUTES = {
  dashboard: "/dashboard",
  residents: "/residents",
  newResident: "/residents/new",
  voters: "/voters",
  caseRecords: "/case-records",
  blotterRecords: "/blotter-records",
  establishments: "/establishments",
  newEstablishment: "/establishments/new",
  properties: "/properties",
  newProperty: "/properties/new",
  documents: "/documents",
  generateDocument: "/documents/generate",
  requests: "/requests",
  reports: "/reports",
  settings: "/settings",
  systemUsers: "/system/users",
  systemRoles: "/system/roles",
  systemSettings: "/system/settings",
  systemLogs: "/system/logs",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
