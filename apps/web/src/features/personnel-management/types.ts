export type PersonnelType = "Elected" | "Staff" | "Appointed";

export type PersonnelStatus = "Active" | "Inactive";

export type PersonnelRecord = {
  id: string;
  fullName: string;
  employeeNumber: string;
  position: string;
  office: string;
  type: PersonnelType;
  status: PersonnelStatus;
  dateAppointed: string;
  contactNumber: string;
  emailAddress: string;
  address: string;
  profilePhoto?: string;
  attachmentName?: string;
};
