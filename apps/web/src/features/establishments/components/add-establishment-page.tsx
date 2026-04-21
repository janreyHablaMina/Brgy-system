"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Building2, Camera, Save, Upload, X } from "lucide-react";

type AddEstablishmentForm = {
  businessName: string;
  businessType: string;
  contactNumber: string;
  emailAddress: string;
  houseNo: string;
  street: string;
  purok: string;
  ownerProfilePhotoName: string;
  ownerFullName: string;
  ownerContactNo: string;
  ownerEmail: string;
  ownerAddress: string;
};

const PENDING_ESTABLISHMENTS_KEY = "brgy-pending-establishments";

const EMPTY_FORM: AddEstablishmentForm = {
  businessName: "",
  businessType: "Retail",
  contactNumber: "",
  emailAddress: "",
  houseNo: "",
  street: "",
  purok: "",
  ownerProfilePhotoName: "",
  ownerFullName: "",
  ownerContactNo: "",
  ownerEmail: "",
  ownerAddress: "",
};

const BUSINESS_TYPE_OPTIONS = ["Retail", "Food & Beverage", "Service", "Health", "Manufacturing", "Transport"];

export function AddEstablishmentPage() {
  const router = useRouter();
  const [form, setForm] = useState<AddEstablishmentForm>(EMPTY_FORM);
  const [ownerPhotoPreview, setOwnerPhotoPreview] = useState<string | null>(null);

  function setValue<K extends keyof AddEstablishmentForm>(key: K, value: AddEstablishmentForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleOwnerPhotoChange(file: File | undefined) {
    if (!file) {
      return;
    }
    setValue("ownerProfilePhotoName", file.name);
    const previewUrl = URL.createObjectURL(file);
    setOwnerPhotoPreview((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return previewUrl;
    });
  }

  function clearOwnerPhoto() {
    setValue("ownerProfilePhotoName", "");
    setOwnerPhotoPreview((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return null;
    });
  }

  function saveEstablishment() {
    const raw = localStorage.getItem(PENDING_ESTABLISHMENTS_KEY);
    const existing = raw ? (JSON.parse(raw) as AddEstablishmentForm[]) : [];
    localStorage.setItem(PENDING_ESTABLISHMENTS_KEY, JSON.stringify([...existing, form]));
    router.push("/establishments");
  }

  useEffect(() => {
    return () => {
      if (ownerPhotoPreview) {
        URL.revokeObjectURL(ownerPhotoPreview);
      }
    };
  }, [ownerPhotoPreview]);

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-4">
        <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          <Link href="/dashboard" className="transition-colors hover:text-[var(--primary)]">Dashboard</Link>
          <span>/</span>
          <Link href="/establishments" className="transition-colors hover:text-[var(--primary)]">Establishments</Link>
          <span>/</span>
          <span className="text-[var(--primary)]">Add Establishment</span>
        </nav>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-[var(--text)]">Add New Establishment</h1>
            <p className="mt-1 text-xs text-[var(--muted)]">Create a business profile with owner and address details.</p>
          </div>
          <Link href="/establishments" className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--text)]">
            Back to List
          </Link>
        </div>
      </header>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="space-y-4">
          <SectionCard title="Business Information" icon={Building2}>
            <div className="grid gap-3 md:grid-cols-2">
              <InputField label="Business Name" value={form.businessName} onChange={(value) => setValue("businessName", value)} placeholder="Salaza Mini Mart" />
              <SelectField label="Business Type" value={form.businessType} options={BUSINESS_TYPE_OPTIONS} onChange={(value) => setValue("businessType", value)} />
            </div>
          </SectionCard>

          <SectionCard title="Contact Information">
            <div className="grid gap-3 md:grid-cols-2">
              <InputField label="Contact Number" value={form.contactNumber} onChange={(value) => setValue("contactNumber", value)} placeholder="09XXXXXXXXX" />
              <InputField label="Email Address" value={form.emailAddress} onChange={(value) => setValue("emailAddress", value)} placeholder="business@example.com" />
            </div>
          </SectionCard>

          <SectionCard title="Current Address">
            <div className="grid gap-3 md:grid-cols-3">
              <InputField label="House No" value={form.houseNo} onChange={(value) => setValue("houseNo", value)} placeholder="24" />
              <InputField label="Street" value={form.street} onChange={(value) => setValue("street", value)} placeholder="Rizal Street" />
              <InputField label="Purok" value={form.purok} onChange={(value) => setValue("purok", value)} placeholder="Purok 3" />
            </div>
          </SectionCard>

          <SectionCard title="Owner Information">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
              <p className="text-xs font-semibold text-[var(--muted)]">Profile Photo</p>
              <div className="mt-2 flex items-center gap-4">
                <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--card)]">
                  {ownerPhotoPreview ? (
                    <Image src={ownerPhotoPreview} alt="Owner preview" fill sizes="80px" unoptimized className="h-full w-full object-cover" />
                  ) : (
                    <Camera className="h-7 w-7 text-[var(--muted)]/60" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-semibold text-[var(--text)] hover:border-[var(--primary)]/40">
                    <Upload className="h-3.5 w-3.5" />
                    Choose File or Take Photo
                    <input type="file" accept="image/*" capture="user" onChange={(event) => handleOwnerPhotoChange(event.target.files?.[0])} className="hidden" />
                  </label>
                  <p className="text-[11px] text-[var(--muted)]">{form.ownerProfilePhotoName || "No file selected"}</p>
                  {form.ownerProfilePhotoName ? (
                    <button type="button" onClick={clearOwnerPhoto} className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500 hover:text-rose-600">
                      <X className="h-3 w-3" /> Remove photo
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <InputField label="Full Name" value={form.ownerFullName} onChange={(value) => setValue("ownerFullName", value)} placeholder="Juan Dela Cruz" />
              <InputField label="Contact No" value={form.ownerContactNo} onChange={(value) => setValue("ownerContactNo", value)} placeholder="09XXXXXXXXX" />
              <InputField label="Email" value={form.ownerEmail} onChange={(value) => setValue("ownerEmail", value)} placeholder="owner@example.com" />
              <InputField label="Owner Address" value={form.ownerAddress} onChange={(value) => setValue("ownerAddress", value)} placeholder="Purok 2, Brgy. Salaza" />
            </div>
          </SectionCard>
        </div>

        <div className="mt-5 flex justify-end gap-2 border-t border-[var(--border)] pt-4">
          <Link href="/establishments" className="rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--text)] transition hover:bg-[var(--card-soft)]">
            Cancel
          </Link>
          <button type="button" onClick={saveEstablishment} className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110">
            <Save className="h-4 w-4" />
            Save Establishment
          </button>
        </div>
      </div>
    </section>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="mb-3 flex items-center gap-2">
        {Icon ? <Icon className="h-4 w-4 text-[var(--primary)]" /> : null}
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{title}</p>
      </div>
      {children}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label>
      <span className="text-xs font-medium text-[var(--muted)]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
      />
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
