"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  User, 
  ArrowLeft, 
  Camera, 
  Upload, 
  X, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PropertyFormInput } from "../types";

const EMPTY_FORM: PropertyFormInput = {
  classification: "Lot Only",
  sizeSqm: "",
  houseNumber: "",
  street: "",
  purok: "",
  landmarkNorth: "",
  landmarkSouth: "",
  landmarkEast: "",
  landmarkWest: "",
  ownerName: "",
  ownerContactNo: "",
  ownerEmail: "",
  ownerAddress: "",
};

const STREET_OPTIONS = ["Rizal Street", "Magsaysay Ave", "Bonifacio St"];
const PUROK_OPTIONS = ["Purok 1", "Purok 2", "Purok 3", "Purok 4"];

export function AddPropertyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"building" | "owner">("building");
  const [form, setForm] = useState<PropertyFormInput>(EMPTY_FORM);
  const [ownerPhotoPreview, setOwnerPhotoPreview] = useState<string | null>(null);

  function setValue<K extends keyof PropertyFormInput>(key: K, value: PropertyFormInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handlePhotoChange(file: File | undefined) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setOwnerPhotoPreview(url);
    setValue("ownerAvatar", url);
  }

  return (
    <div className="w-full space-y-6">
      {/* Header & Alert Card */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4">
        <header>
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-3">
            <Link href="/dashboard" className="hover:text-[var(--primary)] transition-colors">Dashboard</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-[var(--primary)] transition-colors">Lot / Buildings</Link>
            <span>/</span>
            <span className="text-[var(--primary)]">Create</span>
          </nav>
          <div className="flex items-center justify-between">
             <div>
               <h1 className="text-xl font-bold tracking-tight text-[var(--text)]">Add New Property</h1>
               <p className="text-xs text-[var(--muted)] mt-1">Register a new lot or building record in the barangay registry.</p>
             </div>
             <Link href="/properties" className="inline-flex h-10 items-center gap-2 px-4 rounded-xl border border-[var(--border)] text-[10px] font-bold uppercase tracking-widest text-[var(--text)] hover:bg-[var(--card-soft)] transition-all">
               <ArrowLeft className="h-4 w-4" />
               Back to List
             </Link>
          </div>
        </header>

        <div className="flex items-center gap-3 p-3 rounded-xl border border-blue-200 bg-blue-50/50 text-blue-700">
          <CheckCircle2 className="h-4 w-4 text-blue-500" />
          <div className="text-[11px]">
            <span className="font-bold">Fill-out the form appropriately.</span>
            <span className="opacity-80 ml-1">Note: Fields marked with an asterisk (*) are required.</span>
          </div>
        </div>
      </div>

      <main className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-[var(--border)] bg-[var(--card-soft)]/30">
           <TabButton 
             active={activeTab === "building"} 
             onClick={() => setActiveTab("building")}
             icon={Building2}
             label="Building Information"
           />
           <TabButton 
             active={activeTab === "owner"} 
             onClick={() => setActiveTab("owner")}
             icon={User}
             label="Owner Information"
           />
        </div>

        <div className="p-8">
          {activeTab === "building" ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
              <section className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[var(--text)]">Building Information</h3>
                  <p className="text-xs text-[var(--muted)] mt-1">Public information displayed on your profile — please review carefully.</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                   <SelectField 
                     label="Classification" 
                     required
                     value={form.classification} 
                     options={["Lot Only", "Building Only"]}
                     onChange={(v) => setValue("classification", v as any)}
                   />
                   <InputField 
                     label="Size (sqm)" 
                     required
                     value={form.sizeSqm}
                     placeholder="ex. 100 sqm"
                     onChange={(v) => setValue("sizeSqm", v)}
                   />
                </div>
              </section>

              <div className="h-px bg-[var(--border)]/50" />

              <section className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text)]">Current Address</h3>
                <div className="grid gap-6 md:grid-cols-3">
                   <InputField 
                     label="House Number" 
                     value={form.houseNumber}
                     placeholder="ex. 123"
                     onChange={(v) => setValue("houseNumber", v)}
                   />
                   <SelectField 
                     label="Street" 
                     value={form.street}
                     options={STREET_OPTIONS}
                     onChange={(v) => setValue("street", v)}
                     footer={<button className="text-[10px] font-bold text-[var(--primary)] mt-1 flex items-center gap-1 hover:underline"><Plus className="h-3 w-3"/> Add street</button>}
                   />
                   <SelectField 
                     label="Purok" 
                     value={form.purok}
                     options={PUROK_OPTIONS}
                     onChange={(v) => setValue("purok", v)}
                     footer={<button className="text-[10px] font-bold text-[var(--primary)] mt-1 flex items-center gap-1 hover:underline"><Plus className="h-3 w-3"/> Add purok</button>}
                   />
                </div>
              </section>

              <div className="h-px bg-[var(--border)]/50" />

              <section className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text)]">Landmarks</h3>
                <div className="grid gap-6 md:grid-cols-2">
                   <InputField label="North" placeholder="Ex. Near the church" value={form.landmarkNorth} onChange={(v) => setValue("landmarkNorth", v)} />
                   <InputField label="South" placeholder="Ex. Near the market" value={form.landmarkSouth} onChange={(v) => setValue("landmarkSouth", v)} />
                   <InputField label="East" placeholder="Ex. Near the school" value={form.landmarkEast} onChange={(v) => setValue("landmarkEast", v)} />
                   <InputField label="West" placeholder="Ex. Near the park" value={form.landmarkWest} onChange={(v) => setValue("landmarkWest", v)} />
                </div>
              </section>

              <div className="flex justify-end pt-4">
                <button 
                  onClick={() => setActiveTab("owner")}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--primary)] text-xs font-bold uppercase tracking-widest text-white hover:brightness-110 shadow-lg shadow-[var(--primary)]/20"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
              <section className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[var(--text)]">Owner Information</h3>
                  <p className="text-xs text-[var(--muted)] mt-1">Public information displayed on your profile — please review carefully.</p>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[#f8fafc] p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">Owner Profile Photo</p>
                  <div className="mt-3 flex items-center gap-6">
                    <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--card)] shadow-inner">
                      {ownerPhotoPreview ? (
                        <img src={ownerPhotoPreview} alt="Owner preview" className="h-full w-full object-cover" />
                      ) : (
                        <Camera className="h-8 w-8 text-[var(--muted)]/40" />
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text)] hover:border-[var(--primary)]/40 transition-all">
                          <Upload className="h-4 w-4 text-[var(--primary)]" />
                          Choose File or Take Photo
                          <input type="file" accept="image/*" onChange={(e) => handlePhotoChange(e.target.files?.[0])} className="hidden" />
                        </label>
                      </div>
                      <p className="text-[11px] text-[var(--muted)]">
                        {form.ownerAvatar ? "photo_ready.jpg" : "No file selected"}
                      </p>
                      {form.ownerAvatar ? (
                        <button type="button" onClick={() => { setOwnerPhotoPreview(null); setValue("ownerAvatar", ""); }} className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-rose-500 hover:text-rose-600 transition-colors">
                          <X className="h-3 w-3" /> Remove photo
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                   <InputField 
                     label="Full Name" 
                     required
                     placeholder="ex. Juan Dela Cruz" 
                     value={form.ownerName} 
                     onChange={(v) => setValue("ownerName", v)} 
                   />
                   <InputField 
                     label="Contact No." 
                     required
                     placeholder="ex. 09123456789" 
                     value={form.ownerContactNo} 
                     onChange={(v) => setValue("ownerContactNo", v)} 
                   />
                   <InputField 
                     label="Email" 
                     placeholder="ex. owner@email.com" 
                     value={form.ownerEmail} 
                     onChange={(v) => setValue("ownerEmail", v)} 
                   />
                   <InputField 
                     label="Current Address" 
                     required
                     placeholder="ex. 123 Barangay St., Barangay 1, City" 
                     className="md:col-span-3"
                     value={form.ownerAddress} 
                     onChange={(v) => setValue("ownerAddress", v)} 
                   />
                </div>
              </section>

              <div className="flex justify-between pt-4 border-t border-[var(--border)]">
                <button 
                  onClick={() => setActiveTab("building")}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-[var(--border)] text-xs font-bold uppercase tracking-widest text-[var(--muted)] hover:bg-[var(--card-soft)]"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <button 
                  onClick={() => router.push("/properties")}
                  className="inline-flex items-center gap-2 px-8 py-2.5 rounded-xl bg-[var(--primary)] text-xs font-bold uppercase tracking-widest text-white hover:brightness-110 shadow-lg shadow-[var(--primary)]/20"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest transition-all relative",
        active ? "text-[var(--primary)]" : "text-[var(--muted)] hover:text-[var(--text)]"
      )}
    >
      <Icon className={cn("h-4 w-4", active ? "text-[var(--primary)]" : "text-[var(--muted)]")} />
      {label}
      {active && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--primary)]" />}
    </button>
  );
}

function InputField({ label, placeholder, value, onChange, required, className }: { label: string; placeholder: string; value: string; onChange: (v: string) => void; required?: boolean; className?: string }) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-xs font-bold text-[var(--text)]">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      <input 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-[var(--border)] bg-[#f8fafc] px-4 text-sm outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 transition-all"
      />
    </label>
  );
}

function SelectField({ label, options, value, onChange, required, footer }: { label: string; options: string[]; value: string; onChange: (v: string) => void; required?: boolean; footer?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-[var(--text)]">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-[var(--border)] bg-[#f8fafc] px-4 text-sm outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 transition-all appearance-none"
      >
        <option value="" disabled>Please select</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {footer}
    </div>
  );
}
