export type ResidentStatus = "Active" | "Inactive" | "Deceased";

export type ResidentGender = "Male" | "Female" | "Other";

export type CivilStatus = "Single" | "Married" | "Widowed" | "Separated";

export type AgeGroup = "Child" | "Adult" | "Senior";

export type UserRole = "Admin" | "Staff";

export type ResidentTags = {
  senior: boolean;
  pwd: boolean;
  voter: boolean;
};

export type Resident = {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  birthdate: string;
  gender: ResidentGender;
  civilStatus: CivilStatus;
  address: string;
  contactNumber?: string;
  email?: string;
  status: ResidentStatus;
  tags: ResidentTags;
  dateRegistered: string;
  lastUpdated: string;
  deletedAt?: string | null;
  householdInfo?: string;
  documentHistory: string[];
  requestHistory: string[];
};

export type ResidentFormInput = {
  firstName: string;
  middleName: string;
  lastName: string;
  birthdate: string;
  gender: ResidentGender;
  address: string;
  contactNumber: string;
  email: string;
  civilStatus: CivilStatus;
  tags: ResidentTags;
  householdInfo: string;
};

export type ResidentFilters = {
  status: "All" | ResidentStatus;
  gender: "All" | ResidentGender;
  civilStatus: "All" | CivilStatus;
  ageGroup: "All" | AgeGroup;
  seniorOnly: boolean;
  pwdOnly: boolean;
  voterOnly: boolean;
  registeredFrom: string;
  registeredTo: string;
};

export type SortBy = "name" | "age" | "dateRegistered";
export type SortDirection = "asc" | "desc";
