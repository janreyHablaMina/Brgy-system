"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  User, 
  ArrowLeft, 
  CheckCircle2,
} from "lucide-react";
import { PropertyFormInput } from "../types";
import { validatePropertyInput } from "../utils";
import { TabButton } from "./form-elements";
import { BuildingInfoForm } from "./building-info-form";
import { OwnerInfoForm } from "./owner-info-form";

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

export function AddPropertyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"building" | "owner">("building");
  const [form, setForm] = useState<PropertyFormInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof PropertyFormInput, string>>>({});
  const [ownerPhotoPreview, setOwnerPhotoPreview] = useState<string | null>(null);

  function setValue<K extends keyof PropertyFormInput>(key: K, value: PropertyFormInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function handlePhotoChange(file: File | undefined) {
    if (!file) {
      setOwnerPhotoPreview(null);
      setValue("ownerAvatar", "");
      return;
    }
    const url = URL.createObjectURL(file);
    setOwnerPhotoPreview(url);
    setValue("ownerAvatar", url);
  }

  function handleSubmit() {
    const validationErrors = validatePropertyInput(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Auto switch to tab with errors if necessary
      if (validationErrors.classification || validationErrors.sizeSqm || validationErrors.street || validationErrors.purok) {
        setActiveTab("building");
      }
      return;
    }
    
    // Success logic here
    router.push("/properties");
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      {/* Header & Alert Card */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4 shadow-sm">
        <header>
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-3">
            <Link href="/dashboard" className="hover:text-[var(--primary)] transition-colors">Dashboard</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-[var(--primary)] transition-colors">Lot / Buildings</Link>
            <span>/</span>
            <span className="text-[var(--primary)] font-black">Create</span>
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
            <span className="font-bold text-blue-800">Fill-out the form appropriately.</span>
            <span className="opacity-80 ml-1 italic">Note: Fields marked with an asterisk (*) are required.</span>
          </div>
        </div>
      </div>

      <main className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden">
        {/* Tabs Navigation */}
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
            <BuildingInfoForm 
              form={form} 
              setValue={setValue} 
              onNext={() => setActiveTab("owner")} 
              errors={errors}
            />
          ) : (
            <OwnerInfoForm 
              form={form} 
              setValue={setValue} 
              onPrevious={() => setActiveTab("building")} 
              onSubmit={handleSubmit}
              onPhotoChange={handlePhotoChange}
              photoPreview={ownerPhotoPreview}
              errors={errors}
            />
          )}
        </div>
      </main>
    </div>
  );
}
