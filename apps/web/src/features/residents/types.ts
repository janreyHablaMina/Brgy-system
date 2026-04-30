export type ResidentStatus = "Active" | "Inactive" | "Deceased";

export type ResidentGender = "Male" | "Female" | "LGBTQIA+" | "Other";

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
  profileData?: ResidentFormInput;
  documentHistory: string[];
  requestHistory: string[];
};

export type ResidentFormInput = {
  firstName: string;
  middleName: string;
  lastName: string;
  profilePhotoName: string;
  birthdate: string;
  placeOfBirth: string;
  gender: ResidentGender;
  headOfHousehold: "Yes" | "No";
  residenceType: "Village" | "Condominium" | "Other";
  address: string;
  province: string;
  cityMunicipality: string;
  barangay: string;
  street: string;
  blockLot: string;
  houseNo: string;
  typeOfResident: string;
  contactNumber: string;
  email: string;
  civilStatus: CivilStatus;
  employmentStatus: string;
  citizenship: string;
  religion: string;
  precinctNo: string;
  bloodType: string;
  sectors: string[];
  organDonor: "Yes" | "No";
  healthHistory: string;
  educationalAttainments: Array<{
    level: string;
    course: string;
    school: string;
    startYear: string;
    endYear: string;
    currentlyStudying: boolean;
  }>;
  workExperiences: Array<{
    position: string;
    companyName: string;
    employmentType: string;
    startYear: string;
    endYear: string;
    jobDescription: string;
  }>;
  gsisSssNo: string;
  gsisSssExpiration: string;
  philHealthNo: string;
  philHealthExpiration: string;
  pagIbigNo: string;
  pagIbigExpiration: string;
  tinNo: string;
  tinExpiration: string;
  pwdId: string;
  pwdIdExpiration: string;
  seniorCitizenId: string;
  votersNo: string;
  barangayPosition: string;
  barangayRoleStartDate: string;
  barangayRoleEndDate: string;
  emergencyFullName: string;
  emergencyContactNo: string;
  emergencyAddress: string;
  thumbmarkFileName: string;
  tags: ResidentTags;
  householdInfo: string;
  latitude: string;
  longitude: string;
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

export type SortBy = "id" | "name" | "age" | "dateRegistered";
export type SortDirection = "asc" | "desc";
