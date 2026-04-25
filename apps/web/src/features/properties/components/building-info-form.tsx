"use client";

import { ChevronRight, Plus } from "lucide-react";
import { PropertyFormInput } from "../types";
import { InputField, SelectField } from "./form-elements";

const STREET_OPTIONS = ["Rizal Street", "Magsaysay Ave", "Bonifacio St"];
const PUROK_OPTIONS = ["Purok 1", "Purok 2", "Purok 3", "Purok 4"];

type BuildingInfoFormProps = {
  form: PropertyFormInput;
  setValue: <K extends keyof PropertyFormInput>(key: K, value: PropertyFormInput[K]) => void;
  onNext: () => void;
  errors?: Partial<Record<keyof PropertyFormInput, string>>;
};

export function BuildingInfoForm({ form, setValue, onNext, errors }: BuildingInfoFormProps) {
  return (
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
             error={errors?.classification}
           />
           <InputField 
             label="Size (sqm)" 
             required
             value={form.sizeSqm}
             placeholder="ex. 100 sqm"
             onChange={(v) => setValue("sizeSqm", v)}
             error={errors?.sizeSqm}
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
             required
             value={form.street}
             options={STREET_OPTIONS}
             onChange={(v) => setValue("street", v)}
             error={errors?.street}
             footer={<button className="text-[10px] font-bold text-[var(--primary)] mt-1 flex items-center gap-1 hover:underline"><Plus className="h-3 w-3"/> Add street</button>}
           />
           <SelectField 
             label="Purok" 
             required
             value={form.purok}
             options={PUROK_OPTIONS}
             onChange={(v) => setValue("purok", v)}
             error={errors?.purok}
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
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--primary)] text-xs font-bold uppercase tracking-widest text-white hover:brightness-110 shadow-lg shadow-[var(--primary)]/20"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
