"use client";

import { 
  CivilStatus, 
  ResidentFormInput, 
  ResidentGender 
} from "../types";
import { 
  InputField, 
  ModalLayout, 
  SelectField, 
  TagToggle 
} from "./shared-ui";
import { SECTOR_OPTIONS } from "../constants";
import { computeAge } from "../utils";

interface ResidentFormModalProps {
  mode: "create" | "edit";
  input: ResidentFormInput;
  setInput: React.Dispatch<React.SetStateAction<ResidentFormInput>>;
  errors: Partial<Record<keyof ResidentFormInput, string>>;
  serverError: string | null;
  onClose: () => void;
  onSave: () => void;
}

export function ResidentFormModal({
  mode,
  input,
  setInput,
  errors,
  serverError,
  onClose,
  onSave,
}: ResidentFormModalProps) {
  function setFormValue<K extends keyof ResidentFormInput>(key: K, value: ResidentFormInput[K]) {
    setInput((previous) => ({ ...previous, [key]: value }));
  }

  function toggleSector(sector: string) {
    setInput((previous) => {
      const sectors = previous.sectors.includes(sector)
        ? previous.sectors.filter((item) => item !== sector)
        : [...previous.sectors, sector];
      return { ...previous, sectors };
    });
  }

  function addEducationalAttainment() {
    setInput((previous) => ({
      ...previous,
      educationalAttainments: [
        ...previous.educationalAttainments,
        {
          level: "",
          course: "",
          school: "",
          startYear: "",
          endYear: "",
          currentlyStudying: false,
        },
      ],
    }));
  }

  function updateEducationalAttainment(
    index: number,
    key: keyof ResidentFormInput["educationalAttainments"][number],
    value: string | boolean
  ) {
    setInput((previous) => ({
      ...previous,
      educationalAttainments: previous.educationalAttainments.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  }

  function addWorkExperience() {
    setInput((previous) => ({
      ...previous,
      workExperiences: [
        ...previous.workExperiences,
        {
          position: "",
          companyName: "",
          employmentType: "",
          startYear: "",
          endYear: "",
          jobDescription: "",
        },
      ],
    }));
  }

  function updateWorkExperience(
    index: number,
    key: keyof ResidentFormInput["workExperiences"][number],
    value: string
  ) {
    setInput((previous) => ({
      ...previous,
      workExperiences: previous.workExperiences.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  }

  return (
    <ModalLayout title={mode === "create" ? "Add Resident" : "Edit Resident"} onClose={onClose}>
      <div className="mb-4 rounded-xl border border-[var(--border)] bg-[var(--card-soft)]/70 px-4 py-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Resident Profile Form</p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Fields marked with <span className="font-semibold text-rose-500">*</span> are required.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Profile</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className="text-xs font-medium text-[var(--muted)]">Profile Photo</span>
            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={(event) => setFormValue("profilePhotoName", event.target.files?.[0]?.name ?? "")}
              className="mt-1 block w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2 text-sm text-[var(--text)] file:mr-3 file:rounded-md file:border-0 file:bg-[var(--primary)]/10 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[var(--primary)]"
            />
          </label>
          <InputField label="First Name *" value={input.firstName} onChange={(value) => setFormValue("firstName", value)} error={errors.firstName} />
          <InputField label="Middle Name" value={input.middleName} onChange={(value) => setFormValue("middleName", value)} />
          <InputField label="Last Name *" value={input.lastName} onChange={(value) => setFormValue("lastName", value)} error={errors.lastName} />
          <SelectField label="Gender *" value={input.gender} onChange={(value) => setFormValue("gender", value as ResidentGender)} options={["Male", "Female", "LGBTQIA+", "Other"]} error={errors.gender} />
          <InputField label="Date of Birth *" type="date" value={input.birthdate} onChange={(value) => setFormValue("birthdate", value)} error={errors.birthdate} />
          <InputField label="Place of Birth" value={input.placeOfBirth} onChange={(value) => setFormValue("placeOfBirth", value)} />
          <InputField label="Contact No" value={input.contactNumber} onChange={(value) => setFormValue("contactNumber", value)} error={errors.contactNumber} />
          <SelectField label="Civil Status" value={input.civilStatus} onChange={(value) => setFormValue("civilStatus", value as CivilStatus)} options={["Single", "Married", "Widowed", "Separated"]} />
          <SelectField label="Head of Household" value={input.headOfHousehold} onChange={(value) => setFormValue("headOfHousehold", value as "Yes" | "No")} options={["No", "Yes"]} />
          <SelectField label="Residence Type" value={input.residenceType} onChange={(value) => setFormValue("residenceType", value as "Village" | "Condominium" | "Other")} options={["Village", "Condominium", "Other"]} />
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Current Address</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <InputField label="Province" value={input.province} onChange={(value) => setFormValue("province", value)} />
          <InputField label="City / Municipality" value={input.cityMunicipality} onChange={(value) => setFormValue("cityMunicipality", value)} />
          <InputField label="Barangay" value={input.barangay} onChange={(value) => setFormValue("barangay", value)} />
          <InputField label="Street" value={input.street} onChange={(value) => setFormValue("street", value)} />
          <InputField label="Block / Lot" value={input.blockLot} onChange={(value) => setFormValue("blockLot", value)} />
          <InputField label="House No" value={input.houseNo} onChange={(value) => setFormValue("houseNo", value)} />
          <InputField label="Type of Resident" value={input.typeOfResident} onChange={(value) => setFormValue("typeOfResident", value)} />
          <InputField label="Address (Full)" value={input.address} onChange={(value) => setFormValue("address", value)} error={errors.address} />
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Other Information</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <InputField label="Email" value={input.email} onChange={(value) => setFormValue("email", value)} error={errors.email} />
          <InputField label="Current Employment Status" value={input.employmentStatus} onChange={(value) => setFormValue("employmentStatus", value)} />
          <InputField label="Citizenship" value={input.citizenship} onChange={(value) => setFormValue("citizenship", value)} />
          <InputField label="Religion" value={input.religion} onChange={(value) => setFormValue("religion", value)} />
          <InputField label="Precinct No" value={input.precinctNo} onChange={(value) => setFormValue("precinctNo", value)} />
          <InputField label="Blood Type" value={input.bloodType} onChange={(value) => setFormValue("bloodType", value)} />
          <SelectField label="Organ Donor" value={input.organDonor} onChange={(value) => setFormValue("organDonor", value as "Yes" | "No")} options={["No", "Yes"]} />
          <InputField label="Household Info" value={input.householdInfo} onChange={(value) => setFormValue("householdInfo", value)} />
          <label className="md:col-span-2">
            <span className="text-xs font-medium text-[var(--muted)]">Health History</span>
            <textarea
              value={input.healthHistory}
              onChange={(event) => setFormValue("healthHistory", event.target.value)}
              className="mt-1 min-h-20 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
            />
          </label>
        </div>
        <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Sector / Organization</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {SECTOR_OPTIONS.map((sector) => (
              <label key={sector} className="flex items-center gap-2 text-xs text-[var(--text)]">
                <input
                  type="checkbox"
                  checked={input.sectors.includes(sector)}
                  onChange={() => toggleSector(sector)}
                  className="rounded border-[var(--border)] accent-[var(--accent)]"
                />
                {sector}
              </label>
            ))}
          </div>
        </div>
        <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Quick Tags</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <TagToggle
              label="Senior (auto if age 60+)"
              checked={input.tags.senior || (input.birthdate ? computeAge(input.birthdate) >= 60 : false)}
              onChange={(checked) => setFormValue("tags", { ...input.tags, senior: checked })}
            />
            <TagToggle label="PWD" checked={input.tags.pwd} onChange={(checked) => setFormValue("tags", { ...input.tags, pwd: checked })} />
            <TagToggle label="Voter" checked={input.tags.voter} onChange={(checked) => setFormValue("tags", { ...input.tags, voter: checked })} />
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Educational Attainment</p>
        <div className="mt-3 space-y-3">
          {input.educationalAttainments.map((education, index) => (
            <div key={`education-${index}`} className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Entry {index + 1}</p>
              <div className="mt-2 grid gap-3 md:grid-cols-2">
                <InputField label="Level" value={education.level} onChange={(value) => updateEducationalAttainment(index, "level", value)} />
                <InputField label="Course" value={education.course} onChange={(value) => updateEducationalAttainment(index, "course", value)} />
                <InputField label="School" value={education.school} onChange={(value) => updateEducationalAttainment(index, "school", value)} />
                <InputField label="Start Year" value={education.startYear} onChange={(value) => updateEducationalAttainment(index, "startYear", value)} />
                <InputField label="End Year" value={education.endYear} onChange={(value) => updateEducationalAttainment(index, "endYear", value)} />
                <label className="mt-6 flex items-center gap-2 text-xs font-medium text-[var(--text)]">
                  <input type="checkbox" checked={education.currentlyStudying} onChange={(event) => updateEducationalAttainment(index, "currentlyStudying", event.target.checked)} className="rounded border-[var(--border)] accent-[var(--accent)]" />
                  Currently studying
                </label>
              </div>
            </div>
          ))}
          <button type="button" onClick={addEducationalAttainment} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--text)] hover:bg-[var(--card-soft)]">
            Add Another Educational Attainment
          </button>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Work Experience</p>
        <div className="mt-3 space-y-3">
          {input.workExperiences.map((work, index) => (
            <div key={`work-${index}`} className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Entry {index + 1}</p>
              <div className="mt-2 grid gap-3 md:grid-cols-2">
                <InputField label="Position" value={work.position} onChange={(value) => updateWorkExperience(index, "position", value)} />
                <InputField label="Company / Business Name" value={work.companyName} onChange={(value) => updateWorkExperience(index, "companyName", value)} />
                <InputField label="Type of Employment" value={work.employmentType} onChange={(value) => updateWorkExperience(index, "employmentType", value)} />
                <InputField label="Start Year" value={work.startYear} onChange={(value) => updateWorkExperience(index, "startYear", value)} />
                <InputField label="End Year" value={work.endYear} onChange={(value) => updateWorkExperience(index, "endYear", value)} />
                <label className="md:col-span-2">
                  <span className="text-xs font-medium text-[var(--muted)]">Job Description</span>
                  <textarea
                    value={work.jobDescription}
                    onChange={(event) => updateWorkExperience(index, "jobDescription", event.target.value)}
                    className="mt-1 min-h-20 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
                  />
                </label>
              </div>
            </div>
          ))}
          <button type="button" onClick={addWorkExperience} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--text)] hover:bg-[var(--card-soft)]">
            Add Another Work Experience
          </button>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Government Related Info</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <InputField label="GSIS / SSS No." value={input.gsisSssNo} onChange={(value) => setFormValue("gsisSssNo", value)} />
          <InputField label="GSIS / SSS Expiration Date" type="date" value={input.gsisSssExpiration} onChange={(value) => setFormValue("gsisSssExpiration", value)} />
          <InputField label="PhilHealth No." value={input.philHealthNo} onChange={(value) => setFormValue("philHealthNo", value)} />
          <InputField label="PhilHealth Expiration Date" type="date" value={input.philHealthExpiration} onChange={(value) => setFormValue("philHealthExpiration", value)} />
          <InputField label="Pag-IBIG No." value={input.pagIbigNo} onChange={(value) => setFormValue("pagIbigNo", value)} />
          <InputField label="Pag-IBIG Expiration Date" type="date" value={input.pagIbigExpiration} onChange={(value) => setFormValue("pagIbigExpiration", value)} />
          <InputField label="TIN No." value={input.tinNo} onChange={(value) => setFormValue("tinNo", value)} />
          <InputField label="TIN Expiration Date" type="date" value={input.tinExpiration} onChange={(value) => setFormValue("tinExpiration", value)} />
          <InputField label="PWD ID" value={input.pwdId} onChange={(value) => setFormValue("pwdId", value)} />
          <InputField label="PWD ID Expiration Date" type="date" value={input.pwdIdExpiration} onChange={(value) => setFormValue("pwdIdExpiration", value)} />
          <InputField label="Senior Citizen ID" value={input.seniorCitizenId} onChange={(value) => setFormValue("seniorCitizenId", value)} />
          <InputField label="Voter's No." value={input.votersNo} onChange={(value) => setFormValue("votersNo", value)} />
          <InputField label="Barangay Position" value={input.barangayPosition} onChange={(value) => setFormValue("barangayPosition", value)} />
          <InputField label="Barangay Role Start Date" type="date" value={input.barangayRoleStartDate} onChange={(value) => setFormValue("barangayRoleStartDate", value)} />
          <InputField label="Barangay Role End Date" type="date" value={input.barangayRoleEndDate} onChange={(value) => setFormValue("barangayRoleEndDate", value)} />
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">In Case of Emergency</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <InputField label="Full Name" value={input.emergencyFullName} onChange={(value) => setFormValue("emergencyFullName", value)} />
          <InputField label="Contact No." value={input.emergencyContactNo} onChange={(value) => setFormValue("emergencyContactNo", value)} error={errors.emergencyContactNo} />
          <InputField label="Address" value={input.emergencyAddress} onChange={(value) => setFormValue("emergencyAddress", value)} className="md:col-span-2" />
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Thumbmark Capture</p>
        <div className="mt-3">
          <label>
            <span className="text-xs font-medium text-[var(--muted)]">Upload thumbmark image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setFormValue("thumbmarkFileName", event.target.files?.[0]?.name ?? "")}
              className="mt-1 block w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2 text-sm text-[var(--text)] file:mr-3 file:rounded-md file:border-0 file:bg-[var(--primary)]/10 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[var(--primary)]"
            />
          </label>
        </div>
      </div>

      {serverError ? <p className="mt-3 rounded-lg border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-500">{serverError}</p> : null}

      <div className="mt-4 flex justify-end gap-2 border-t border-[var(--border)] pt-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--card-soft)]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          className="rounded-lg bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110"
        >
          {mode === "create" ? "Save Resident" : "Update Resident"}
        </button>
      </div>
    </ModalLayout>
  );
}
