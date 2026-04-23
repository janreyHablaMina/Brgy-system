// ─── Types ────────────────────────────────────────────────────────────────────

export type FieldType = "text" | "textarea" | "select" | "date" | "number";

export interface TemplateField {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
}

export interface DocumentTemplate {
  id: string;
  title: string;
  category: "Clearance" | "Certificate" | "Permit" | "Endorsement";
  description: string;
  controlPrefix: string;
  defaultValidity: string; // e.g. "6 months"
  fields: TemplateField[];
  bodyTemplate: string; // uses {{variable}} placeholders
  requiresORNumber: boolean;
  defaultFee: number;
}

export interface ResidentRecord {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  middleName: string;
  address: string;
  purok: string;
  age: number;
  gender: string;
  civilStatus: string;
  nationality: string;
  occupation: string;
  yearsInBarangay: number;
  birthDate: string;
}

export interface Official {
  id: string;
  name: string;
  role: string;
}

export interface GenerationHistoryEntry {
  id: string;
  controlNo: string;
  documentTitle: string;
  residentName: string;
  purpose: string;
  generatedBy: string;
  generatedAt: string;
  orNumber: string;
  fee: number;
  status: "Generated" | "Released" | "Archived";
}

// ─── Mock Document Templates ─────────────────────────────────────────────────

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: "brgy-clearance",
    title: "Barangay Clearance",
    category: "Clearance",
    description: "General clearance for legal and employment purposes",
    controlPrefix: "BC",
    defaultValidity: "6 months",
    requiresORNumber: true,
    defaultFee: 50,
    fields: [
      { key: "purpose", label: "Purpose", type: "select", required: true, options: ["Employment", "Loan", "School Requirement", "Travel", "Business", "Legal Requirement", "Others"] },
      { key: "remarks", label: "Remarks", type: "textarea", placeholder: "Additional remarks (optional)" },
    ],
    bodyTemplate: `This is to certify that {{fullName}}, {{age}} years old, {{gender}}, {{civilStatus}}, a resident of {{address}}, Barangay Salaza, is hereby CLEARED from any civil or criminal case pending before this Office.

This certification is being issued upon the request of the above-named person for the purpose of {{purpose}} and for whatever legal purpose it may serve.

This certificate is valid for a period of {{validity}} from the date of issue.`,
  },
  {
    id: "cert-indigency",
    title: "Certificate of Indigency",
    category: "Certificate",
    description: "For indigent residents requiring financial assistance",
    controlPrefix: "CI",
    defaultValidity: "3 months",
    requiresORNumber: false,
    defaultFee: 0,
    fields: [
      { key: "purpose", label: "Purpose", type: "select", required: true, options: ["Medical Assistance", "Educational Assistance", "Financial Aid", "Legal Aid", "Others"] },
      { key: "institution", label: "Requesting Institution", type: "text", required: true, placeholder: "e.g. Ospital ng Calamba" },
      { key: "remarks", label: "Remarks", type: "textarea", placeholder: "Additional details..." },
    ],
    bodyTemplate: `This is to certify that {{fullName}}, {{age}} years old, {{gender}}, {{civilStatus}}, a bonafide resident of {{address}}, Barangay Salaza, belongs to a low-income family and is classified as INDIGENT in this barangay.

This certification is issued upon request for the purpose of {{purpose}} at {{institution}}.

This certificate is valid for {{validity}} from date of issuance.`,
  },
  {
    id: "cert-residency",
    title: "Certificate of Residency",
    category: "Certificate",
    description: "Proof of residency in the barangay",
    controlPrefix: "CR",
    defaultValidity: "1 year",
    requiresORNumber: true,
    defaultFee: 30,
    fields: [
      { key: "purpose", label: "Purpose", type: "select", required: true, options: ["Employment", "School Enrollment", "Bank Requirement", "Government Requirement", "Others"] },
      { key: "yearsDisplay", label: "Years of Residency", type: "text", placeholder: "e.g. 10 years", required: true },
    ],
    bodyTemplate: `This is to certify that {{fullName}}, {{age}} years old, {{gender}}, is a bonafide resident of {{address}}, Barangay Salaza for {{yearsDisplay}}.

This certification is being issued upon request for the purpose of {{purpose}} and for whatever legal purpose it may serve.`,
  },
  {
    id: "cert-good-moral",
    title: "Certificate of Good Moral",
    category: "Certificate",
    description: "Certification of good moral character",
    controlPrefix: "CGM",
    defaultValidity: "6 months",
    requiresORNumber: true,
    defaultFee: 50,
    fields: [
      { key: "purpose", label: "Purpose", type: "select", required: true, options: ["Employment", "School", "Travel", "Others"] },
    ],
    bodyTemplate: `This is to certify that {{fullName}}, {{age}} years old, {{gender}}, {{civilStatus}}, a bonafide resident of {{address}}, Barangay Salaza, is known to be a person of GOOD MORAL CHARACTER and has no derogatory record in this Barangay.

This certification is issued for the purpose of {{purpose}} and for whatever legal purpose it may serve.`,
  },
  {
    id: "cert-no-pending",
    title: "Certificate of No Pending Case",
    category: "Certificate",
    description: "Certification of no pending case in barangay",
    controlPrefix: "CNPC",
    defaultValidity: "3 months",
    requiresORNumber: true,
    defaultFee: 50,
    fields: [
      { key: "purpose", label: "Purpose", type: "text", required: true, placeholder: "Reason for certification" },
    ],
    bodyTemplate: `This is to certify that {{fullName}}, {{age}} years old, {{gender}}, a resident of {{address}}, Barangay Salaza, has NO PENDING CIVIL OR CRIMINAL CASE filed or pending before the Office of the Punong Barangay of this Barangay.

This certification is issued for the purpose of {{purpose}}.`,
  },
  {
    id: "business-clearance",
    title: "Business Clearance",
    category: "Clearance",
    description: "Clearance for business operations",
    controlPrefix: "BIZ",
    defaultValidity: "1 year",
    requiresORNumber: true,
    defaultFee: 200,
    fields: [
      { key: "businessName", label: "Business Name", type: "text", required: true },
      { key: "businessType", label: "Type of Business", type: "text", required: true },
      { key: "businessAddress", label: "Business Address", type: "text", required: true },
    ],
    bodyTemplate: `This is to certify that {{fullName}}, is the owner/operator of {{businessName}}, a {{businessType}} business located at {{businessAddress}}, Barangay Salaza.

Said business is CLEARED from any objection from this Barangay and is hereby endorsed for renewal/application of necessary government permits.`,
  },
  {
    id: "event-permit",
    title: "Permit to Conduct Event",
    category: "Permit",
    description: "Permit for events or activities within the barangay",
    controlPrefix: "PE",
    defaultValidity: "Event date only",
    requiresORNumber: true,
    defaultFee: 100,
    fields: [
      { key: "eventName", label: "Event / Activity Name", type: "text", required: true },
      { key: "eventDate", label: "Date of Event", type: "date", required: true },
      { key: "eventVenue", label: "Venue / Location", type: "text", required: true },
      { key: "expectedAttendees", label: "Expected Number of Attendees", type: "number", required: true },
    ],
    bodyTemplate: `This is to certify that permission is hereby GRANTED to {{fullName}}, a resident of {{address}}, Barangay Salaza, to conduct the following activity:

Event / Activity: {{eventName}}
Date: {{eventDate}}
Venue: {{eventVenue}}
Expected Attendees: {{expectedAttendees}}

This permit is subject to compliance with all applicable laws and ordinances.`,
  },
  {
    id: "cert-single",
    title: "Certificate of Single Status",
    category: "Certificate",
    description: "Certification of civil status (single)",
    controlPrefix: "CSS",
    defaultValidity: "3 months",
    requiresORNumber: true,
    defaultFee: 50,
    fields: [
      { key: "purpose", label: "Purpose", type: "text", required: true, placeholder: "e.g. Retirement benefit, Marriage license" },
    ],
    bodyTemplate: `This is to certify that {{fullName}}, {{age}} years old, a bonafide resident of {{address}}, Barangay Salaza, is known to be SINGLE / UNMARRIED based on the records of this Barangay.

This certification is issued for the purpose of {{purpose}} and for whatever legal purpose it may serve.`,
  },
];

// ─── Mock Residents ───────────────────────────────────────────────────────────

export const RESIDENTS: ResidentRecord[] = [
  { id: "RES-2026-0001", displayName: "Maria Lopez Santos", firstName: "Maria", lastName: "Santos", middleName: "Lopez", address: "Purok 1, Brgy. Salaza", purok: "Purok 1", age: 32, gender: "Female", civilStatus: "Single", nationality: "Filipino", occupation: "Teacher", yearsInBarangay: 12, birthDate: "1994-03-15" },
  { id: "RES-2026-0002", displayName: "Juan Reyes Dela Cruz", firstName: "Juan", lastName: "Dela Cruz", middleName: "Reyes", address: "Purok 2, Brgy. Salaza", purok: "Purok 2", age: 45, gender: "Male", civilStatus: "Married", nationality: "Filipino", occupation: "Carpenter", yearsInBarangay: 20, birthDate: "1981-07-22" },
  { id: "RES-2026-0003", displayName: "Carla Mendoza Rivera", firstName: "Carla", lastName: "Rivera", middleName: "Mendoza", address: "Purok 3, Brgy. Salaza", purok: "Purok 3", age: 28, gender: "Female", civilStatus: "Single", nationality: "Filipino", occupation: "Nurse", yearsInBarangay: 8, birthDate: "1998-11-05" },
  { id: "RES-2026-0004", displayName: "Pedro Cruz Luna", firstName: "Pedro", lastName: "Luna", middleName: "Cruz", address: "Purok 4, Brgy. Salaza", purok: "Purok 4", age: 60, gender: "Male", civilStatus: "Widowed", nationality: "Filipino", occupation: "Farmer", yearsInBarangay: 35, birthDate: "1966-01-10" },
  { id: "RES-2026-0005", displayName: "Ana Garcia Reyes", firstName: "Ana", lastName: "Reyes", middleName: "Garcia", address: "Purok 1, Brgy. Salaza", purok: "Purok 1", age: 22, gender: "Female", civilStatus: "Single", nationality: "Filipino", occupation: "Student", yearsInBarangay: 22, birthDate: "2004-06-18" },
  { id: "RES-2026-0006", displayName: "Mark Lim Aquino", firstName: "Mark", lastName: "Aquino", middleName: "Lim", address: "Purok 2, Brgy. Salaza", purok: "Purok 2", age: 38, gender: "Male", civilStatus: "Married", nationality: "Filipino", occupation: "Driver", yearsInBarangay: 15, birthDate: "1988-09-25" },
  { id: "RES-2026-0007", displayName: "Rosa Bautista Flores", firstName: "Rosa", lastName: "Flores", middleName: "Bautista", address: "Purok 3, Brgy. Salaza", purok: "Purok 3", age: 52, gender: "Female", civilStatus: "Married", nationality: "Filipino", occupation: "Vendor", yearsInBarangay: 28, birthDate: "1974-04-30" },
  { id: "RES-2026-0008", displayName: "Carlos Santos Villanueva", firstName: "Carlos", lastName: "Villanueva", middleName: "Santos", address: "Purok 4, Brgy. Salaza", purok: "Purok 4", age: 35, gender: "Male", civilStatus: "Single", nationality: "Filipino", occupation: "Electrician", yearsInBarangay: 10, birthDate: "1991-12-01" },
];

// ─── Mock Officials ───────────────────────────────────────────────────────────

export const OFFICIALS: Official[] = [
  { id: "OFF-001", name: "Hon. Ricardo Santos", role: "Punong Barangay" },
  { id: "OFF-002", name: "Maria Elena Cruz", role: "Barangay Secretary" },
  { id: "OFF-003", name: "Jose Miguel Torres", role: "Barangay Treasurer" },
  { id: "OFF-004", name: "Aira Bautista Flores", role: "Kagawad - Peace & Order" },
  { id: "OFF-005", name: "Pedro Lim Reyes", role: "Kagawad - Health" },
];

// ─── Mock History ─────────────────────────────────────────────────────────────

export const GENERATION_HISTORY: GenerationHistoryEntry[] = [
  { id: "H-001", controlNo: "BC-2026-00125", documentTitle: "Barangay Clearance", residentName: "Maria Lopez Santos", purpose: "Employment", generatedBy: "Pauline Seitz", generatedAt: "2026-04-23T10:15:00Z", orNumber: "OR-2026-00890", fee: 50, status: "Released" },
  { id: "H-002", controlNo: "CR-2026-00044", documentTitle: "Certificate of Residency", residentName: "Juan Reyes Dela Cruz", purpose: "Bank Requirement", generatedBy: "Aira Flores", generatedAt: "2026-04-22T14:30:00Z", orNumber: "OR-2026-00885", fee: 30, status: "Released" },
  { id: "H-003", controlNo: "CI-2026-00018", documentTitle: "Certificate of Indigency", residentName: "Pedro Cruz Luna", purpose: "Medical Assistance", generatedBy: "Rico Santos", generatedAt: "2026-04-22T09:00:00Z", orNumber: "N/A", fee: 0, status: "Released" },
  { id: "H-004", controlNo: "CGM-2026-00031", documentTitle: "Certificate of Good Moral", residentName: "Carla Mendoza Rivera", purpose: "Employment", generatedBy: "Pauline Seitz", generatedAt: "2026-04-21T16:45:00Z", orNumber: "OR-2026-00870", fee: 50, status: "Generated" },
  { id: "H-005", controlNo: "BC-2026-00124", documentTitle: "Barangay Clearance", residentName: "Ana Garcia Reyes", purpose: "School Requirement", generatedBy: "Aira Flores", generatedAt: "2026-04-20T11:20:00Z", orNumber: "OR-2026-00862", fee: 50, status: "Archived" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function generateControlNumber(prefix: string, existingCodes: string[]): string {
  const year = new Date().getFullYear();
  const existing = existingCodes
    .filter(c => c.startsWith(`${prefix}-${year}-`))
    .map(c => parseInt(c.split("-").pop() ?? "0", 10))
    .filter(n => !isNaN(n));
  const next = existing.length > 0 ? Math.max(...existing) + 1 : 1;
  return `${prefix}-${year}-${String(next).padStart(5, "0")}`;
}

export function resolveTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `[${key}]`);
}

export function formatDateDisplay(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" });
}
