"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Camera, ChevronLeft, ChevronRight, Save, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CivilStatus, ResidentFormInput, ResidentGender } from "../types";
import { validateResidentInput } from "../utils";

const PENDING_RESIDENTS_KEY = "brgy-pending-residents";

const SECTOR_OPTIONS = [
  "Senior Citizen",
  "Persons with Disability",
  "Solo Parent",
  "Displaced Worker",
  "Indigenous People",
  "Indigent Person",
  "Informal Settlers",
  "4Ps Beneficiary",
  "Farmer",
  "Nano/Micro Entrepreneur",
  "Student",
  "OFW",
  "TODA Driver",
  "JODA Driver",
  "Other Drivers",
  "Vendor",
  "With Comorbidities",
  "Working Student",
  "LGBTQIA+",
] as const;

const EMPTY_FORM: ResidentFormInput = {
  firstName: "",
  middleName: "",
  lastName: "",
  profilePhotoName: "",
  birthdate: "",
  placeOfBirth: "",
  gender: "Male",
  headOfHousehold: "No",
  residenceType: "Village",
  address: "",
  province: "",
  cityMunicipality: "",
  barangay: "",
  street: "",
  blockLot: "",
  houseNo: "",
  typeOfResident: "",
  contactNumber: "",
  email: "",
  civilStatus: "Single",
  employmentStatus: "",
  citizenship: "",
  religion: "",
  precinctNo: "",
  bloodType: "",
  sectors: [],
  organDonor: "No",
  healthHistory: "",
  educationalAttainments: [{ level: "", course: "", school: "", startYear: "", endYear: "", currentlyStudying: false }],
  workExperiences: [{ position: "", companyName: "", employmentType: "", startYear: "", endYear: "", jobDescription: "" }],
  gsisSssNo: "",
  gsisSssExpiration: "",
  philHealthNo: "",
  philHealthExpiration: "",
  pagIbigNo: "",
  pagIbigExpiration: "",
  tinNo: "",
  tinExpiration: "",
  pwdId: "",
  pwdIdExpiration: "",
  seniorCitizenId: "",
  votersNo: "",
  barangayPosition: "",
  barangayRoleStartDate: "",
  barangayRoleEndDate: "",
  emergencyFullName: "",
  emergencyContactNo: "",
  emergencyAddress: "",
  thumbmarkFileName: "",
  tags: { senior: false, pwd: false, voter: false },
  householdInfo: "",
};

const STEPS = [
  "Profile",
  "Address",
  "Other Info",
  "Education",
  "Work",
  "Government",
  "Emergency",
  "Review",
] as const;

export function ResidentOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ResidentFormInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof ResidentFormInput, string>>>({});
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);

  const progress = useMemo(() => Math.round(((step + 1) / STEPS.length) * 100), [step]);

  function setValue<K extends keyof ResidentFormInput>(key: K, value: ResidentFormInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleSector(sector: string) {
    setForm((prev) => ({
      ...prev,
      sectors: prev.sectors.includes(sector) ? prev.sectors.filter((s) => s !== sector) : [...prev.sectors, sector],
    }));
  }

  function handleProfilePhotoChange(file: File | undefined) {
    if (!file) {
      return;
    }

    setValue("profilePhotoName", file.name);
    const previewUrl = URL.createObjectURL(file);
    setProfilePhotoPreview((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      return previewUrl;
    });
  }

  function clearProfilePhoto() {
    setValue("profilePhotoName", "");
    setProfilePhotoPreview((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      return null;
    });
  }

  useEffect(() => {
    return () => {
      if (profilePhotoPreview) {
        URL.revokeObjectURL(profilePhotoPreview);
      }
    };
  }, [profilePhotoPreview]);

  function savePendingResident() {
    const validation = validateResidentInput(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      setStep(0);
      return;
    }

    const existingRaw = localStorage.getItem(PENDING_RESIDENTS_KEY);
    const existing = existingRaw ? (JSON.parse(existingRaw) as ResidentFormInput[]) : [];
    localStorage.setItem(PENDING_RESIDENTS_KEY, JSON.stringify([...existing, form]));
    router.push("/residents");
  }

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-4">
        <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          <Link href="/dashboard" className="transition-colors hover:text-[var(--primary)]">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/residents" className="transition-colors hover:text-[var(--primary)]">
            Residents
          </Link>
          <span>/</span>
          <span className="text-[var(--primary)]">New Resident</span>
        </nav>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-[var(--text)]">New Resident Registration</h1>
            <p className="mt-1 text-xs text-[var(--muted)]">Complete the resident profile through guided steps.</p>
          </div>
          <Link href="/residents" className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--text)]">
            Back to List
          </Link>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[var(--card-soft)]">
          <div className="h-full bg-[var(--primary)] transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {STEPS.map((label, index) => (
            <span
              key={label}
              className={cn(
                "rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
                index === step ? "border-[var(--primary)] text-[var(--primary)]" : "border-[var(--border)] text-[var(--muted)]"
              )}
            >
              {index + 1}. {label}
            </span>
          ))}
        </div>
      </header>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
        {step === 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
              <p className="text-xs font-semibold text-[var(--muted)]">Profile Photo</p>
              <div className="mt-2 flex items-center gap-4">
                <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--card)]">
                  {profilePhotoPreview ? (
                    <Image src={profilePhotoPreview} alt="Profile preview" fill sizes="80px" unoptimized className="h-full w-full object-cover" />
                  ) : (
                    <Camera className="h-7 w-7 text-[var(--muted)]/60" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-semibold text-[var(--text)] hover:border-[var(--primary)]/40">
                    <Upload className="h-3.5 w-3.5" />
                    Choose File or Take Photo
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      onChange={(e) => handleProfilePhotoChange(e.target.files?.[0])}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-[var(--muted)]">
                    {form.profilePhotoName || "No file selected"}
                  </p>
                  {form.profilePhotoName ? (
                    <button
                      type="button"
                      onClick={clearProfilePhoto}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500 hover:text-rose-600"
                    >
                      <X className="h-3 w-3" /> Remove photo
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
            <InputField label="First Name *" value={form.firstName} onChange={(v) => setValue("firstName", v)} error={errors.firstName} placeholder="Juan" />
            <InputField label="Middle Name" value={form.middleName} onChange={(v) => setValue("middleName", v)} placeholder="Santos" />
            <InputField label="Last Name *" value={form.lastName} onChange={(v) => setValue("lastName", v)} error={errors.lastName} placeholder="Dela Cruz" />
            <SelectField label="Gender *" value={form.gender} onChange={(v) => setValue("gender", v as ResidentGender)} options={["Male", "Female", "LGBTQIA+", "Other"]} />
            <InputField label="Date of Birth *" type="date" value={form.birthdate} onChange={(v) => setValue("birthdate", v)} error={errors.birthdate} />
            <InputField label="Place of Birth" value={form.placeOfBirth} onChange={(v) => setValue("placeOfBirth", v)} placeholder="Manila City" />
            <InputField label="Contact No" value={form.contactNumber} onChange={(v) => setValue("contactNumber", v)} error={errors.contactNumber} placeholder="09XXXXXXXXX" />
            <SelectField label="Civil Status" value={form.civilStatus} onChange={(v) => setValue("civilStatus", v as CivilStatus)} options={["Single", "Married", "Widowed", "Separated"]} />
            <SelectField label="Head of Household" value={form.headOfHousehold} onChange={(v) => setValue("headOfHousehold", v as "Yes" | "No")} options={["No", "Yes"]} />
            <SelectField label="Residence Type" value={form.residenceType} onChange={(v) => setValue("residenceType", v as "Village" | "Condominium" | "Other")} options={["Village", "Condominium", "Other"]} />
          </div>
        ) : null}

        {step === 1 ? (
          <div className="grid gap-3 md:grid-cols-2">
            <InputField label="Province" value={form.province} onChange={(v) => setValue("province", v)} placeholder="Metro Manila" />
            <InputField label="City / Municipality" value={form.cityMunicipality} onChange={(v) => setValue("cityMunicipality", v)} placeholder="Makati City" />
            <InputField label="Barangay" value={form.barangay} onChange={(v) => setValue("barangay", v)} placeholder="Salaza" />
            <InputField label="Street" value={form.street} onChange={(v) => setValue("street", v)} placeholder="Rizal St." />
            <InputField label="Block / Lot" value={form.blockLot} onChange={(v) => setValue("blockLot", v)} placeholder="Block 3 Lot 12" />
            <InputField label="House No" value={form.houseNo} onChange={(v) => setValue("houseNo", v)} placeholder="24" />
            <InputField label="Type of Resident" value={form.typeOfResident} onChange={(v) => setValue("typeOfResident", v)} placeholder="Permanent" />
            <InputField label="Current Address *" value={form.address} onChange={(v) => setValue("address", v)} error={errors.address} placeholder="House 24, Rizal St., Brgy. Salaza" />
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <InputField label="Email" value={form.email} onChange={(v) => setValue("email", v)} error={errors.email} />
              <InputField label="Current Employment Status" value={form.employmentStatus} onChange={(v) => setValue("employmentStatus", v)} />
              <InputField label="Citizenship" value={form.citizenship} onChange={(v) => setValue("citizenship", v)} />
              <InputField label="Religion" value={form.religion} onChange={(v) => setValue("religion", v)} />
              <InputField label="Precinct No" value={form.precinctNo} onChange={(v) => setValue("precinctNo", v)} />
              <InputField label="Blood Type" value={form.bloodType} onChange={(v) => setValue("bloodType", v)} />
              <SelectField label="Organ Donor" value={form.organDonor} onChange={(v) => setValue("organDonor", v as "Yes" | "No")} options={["No", "Yes"]} />
            </div>
            <label>
              <span className="text-xs text-[var(--muted)]">Health History</span>
              <textarea value={form.healthHistory} onChange={(e) => setValue("healthHistory", e.target.value)} placeholder="List allergies, maintenance medicines, and relevant conditions." className="mt-1 min-h-24 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2 text-sm" />
            </label>
            <div>
              <p className="text-xs font-semibold text-[var(--muted)]">Sector / Organization</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {SECTOR_OPTIONS.map((sector) => (
                  <label key={sector} className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={form.sectors.includes(sector)} onChange={() => toggleSector(sector)} className="rounded border-[var(--border)] accent-[var(--accent)]" />
                    {sector}
                  </label>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-3">
            {form.educationalAttainments.map((education, index) => (
              <div key={index} className="grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3 md:grid-cols-2">
                <InputField label="Level" value={education.level} onChange={(v) => setForm((prev) => ({ ...prev, educationalAttainments: prev.educationalAttainments.map((item, i) => i === index ? { ...item, level: v } : item) }))} />
                <InputField label="Course" value={education.course} onChange={(v) => setForm((prev) => ({ ...prev, educationalAttainments: prev.educationalAttainments.map((item, i) => i === index ? { ...item, course: v } : item) }))} />
                <InputField label="School" value={education.school} onChange={(v) => setForm((prev) => ({ ...prev, educationalAttainments: prev.educationalAttainments.map((item, i) => i === index ? { ...item, school: v } : item) }))} />
                <InputField label="Start Year" value={education.startYear} onChange={(v) => setForm((prev) => ({ ...prev, educationalAttainments: prev.educationalAttainments.map((item, i) => i === index ? { ...item, startYear: v } : item) }))} />
                <InputField label="End Year" value={education.endYear} onChange={(v) => setForm((prev) => ({ ...prev, educationalAttainments: prev.educationalAttainments.map((item, i) => i === index ? { ...item, endYear: v } : item) }))} />
                <label className="mt-6 flex items-center gap-2 text-xs"><input type="checkbox" checked={education.currentlyStudying} onChange={(e) => setForm((prev) => ({ ...prev, educationalAttainments: prev.educationalAttainments.map((item, i) => i === index ? { ...item, currentlyStudying: e.target.checked } : item) }))} className="rounded border-[var(--border)] accent-[var(--accent)]" />Currently studying</label>
              </div>
            ))}
            <button type="button" onClick={() => setForm((prev) => ({ ...prev, educationalAttainments: [...prev.educationalAttainments, { level: "", course: "", school: "", startYear: "", endYear: "", currentlyStudying: false }] }))} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold">Add another educational attainment</button>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-3">
            {form.workExperiences.map((work, index) => (
              <div key={index} className="grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3 md:grid-cols-2">
                <InputField label="Position" value={work.position} onChange={(v) => setForm((prev) => ({ ...prev, workExperiences: prev.workExperiences.map((item, i) => i === index ? { ...item, position: v } : item) }))} />
                <InputField label="Company / Business Name" value={work.companyName} onChange={(v) => setForm((prev) => ({ ...prev, workExperiences: prev.workExperiences.map((item, i) => i === index ? { ...item, companyName: v } : item) }))} />
                <InputField label="Type of Employment" value={work.employmentType} onChange={(v) => setForm((prev) => ({ ...prev, workExperiences: prev.workExperiences.map((item, i) => i === index ? { ...item, employmentType: v } : item) }))} />
                <InputField label="Start Year" value={work.startYear} onChange={(v) => setForm((prev) => ({ ...prev, workExperiences: prev.workExperiences.map((item, i) => i === index ? { ...item, startYear: v } : item) }))} />
                <InputField label="End Year" value={work.endYear} onChange={(v) => setForm((prev) => ({ ...prev, workExperiences: prev.workExperiences.map((item, i) => i === index ? { ...item, endYear: v } : item) }))} />
                <label className="md:col-span-2">
                  <span className="text-xs text-[var(--muted)]">Job Description</span>
                  <textarea value={work.jobDescription} onChange={(e) => setForm((prev) => ({ ...prev, workExperiences: prev.workExperiences.map((item, i) => i === index ? { ...item, jobDescription: e.target.value } : item) }))} placeholder="Describe main responsibilities and scope of work." className="mt-1 min-h-24 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2 text-sm" />
                </label>
              </div>
            ))}
            <button type="button" onClick={() => setForm((prev) => ({ ...prev, workExperiences: [...prev.workExperiences, { position: "", companyName: "", employmentType: "", startYear: "", endYear: "", jobDescription: "" }] }))} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold">Add another work experience</button>
          </div>
        ) : null}

        {step === 5 ? (
          <div className="grid gap-3 md:grid-cols-2">
            <InputField label="GSIS / SSS No." value={form.gsisSssNo} onChange={(v) => setValue("gsisSssNo", v)} />
            <InputField label="GSIS / SSS Expiration Date" type="date" value={form.gsisSssExpiration} onChange={(v) => setValue("gsisSssExpiration", v)} />
            <InputField label="PhilHealth No." value={form.philHealthNo} onChange={(v) => setValue("philHealthNo", v)} />
            <InputField label="PhilHealth Expiration Date" type="date" value={form.philHealthExpiration} onChange={(v) => setValue("philHealthExpiration", v)} />
            <InputField label="Pag-IBIG No." value={form.pagIbigNo} onChange={(v) => setValue("pagIbigNo", v)} />
            <InputField label="Pag-IBIG Expiration Date" type="date" value={form.pagIbigExpiration} onChange={(v) => setValue("pagIbigExpiration", v)} />
            <InputField label="TIN No." value={form.tinNo} onChange={(v) => setValue("tinNo", v)} />
            <InputField label="TIN Expiration Date" type="date" value={form.tinExpiration} onChange={(v) => setValue("tinExpiration", v)} />
            <InputField label="PWD ID" value={form.pwdId} onChange={(v) => setValue("pwdId", v)} />
            <InputField label="PWD ID Expiration Date" type="date" value={form.pwdIdExpiration} onChange={(v) => setValue("pwdIdExpiration", v)} />
            <InputField label="Senior Citizen ID" value={form.seniorCitizenId} onChange={(v) => setValue("seniorCitizenId", v)} />
            <InputField label="Voter's No." value={form.votersNo} onChange={(v) => setValue("votersNo", v)} />
            <InputField label="Barangay Position" value={form.barangayPosition} onChange={(v) => setValue("barangayPosition", v)} />
            <InputField label="Start Date" type="date" value={form.barangayRoleStartDate} onChange={(v) => setValue("barangayRoleStartDate", v)} />
            <InputField label="End Date" type="date" value={form.barangayRoleEndDate} onChange={(v) => setValue("barangayRoleEndDate", v)} />
          </div>
        ) : null}

        {step === 6 ? (
          <div className="grid gap-3 md:grid-cols-2">
            <InputField label="Emergency Contact Full Name" value={form.emergencyFullName} onChange={(v) => setValue("emergencyFullName", v)} />
            <InputField label="Emergency Contact No." value={form.emergencyContactNo} onChange={(v) => setValue("emergencyContactNo", v)} error={errors.emergencyContactNo} />
            <InputField label="Emergency Address" value={form.emergencyAddress} onChange={(v) => setValue("emergencyAddress", v)} className="md:col-span-2" />
            <label className="md:col-span-2">
              <span className="text-xs text-[var(--muted)]">Thumbmark Capture</span>
              <input type="file" accept="image/*" onChange={(e) => setValue("thumbmarkFileName", e.target.files?.[0]?.name ?? "")} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2 text-sm" />
            </label>
          </div>
        ) : null}

        {step === 7 ? (
          <div className="space-y-3 text-sm">
            <p className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3 text-[var(--muted)]">
              Review the details, then save. Required fields: First Name, Last Name, Birthdate, Gender, Current Address.
            </p>
            <ul className="space-y-1 text-[var(--text)]">
              <li><strong>Name:</strong> {form.firstName} {form.middleName} {form.lastName}</li>
              <li><strong>Gender:</strong> {form.gender}</li>
              <li><strong>Birthdate:</strong> {form.birthdate || "N/A"}</li>
              <li><strong>Address:</strong> {form.address || "N/A"}</li>
              <li><strong>Contact:</strong> {form.contactNumber || "N/A"}</li>
            </ul>
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-sm">
        <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold disabled:opacity-40">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white">
            Next <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button type="button" onClick={savePendingResident} className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white">
            <Save className="h-4 w-4" /> Save Resident
          </button>
        )}
      </div>
    </section>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  error,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="text-xs font-medium text-[var(--muted)]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
      />
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="text-xs font-medium text-[var(--muted)]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
