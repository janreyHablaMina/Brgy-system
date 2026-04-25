"use client";

import { Camera, ChevronLeft, Upload, X } from "lucide-react";
import { PropertyFormInput } from "../types";
import { InputField } from "./form-elements";

type OwnerInfoFormProps = {
  form: PropertyFormInput;
  setValue: <K extends keyof PropertyFormInput>(key: K, value: PropertyFormInput[K]) => void;
  onPrevious: () => void;
  onSubmit: () => void;
  onPhotoChange: (file: File | undefined) => void;
  photoPreview: string | null;
  errors?: Partial<Record<keyof PropertyFormInput, string>>;
};

export function OwnerInfoForm({ 
  form, 
  setValue, 
  onPrevious, 
  onSubmit, 
  onPhotoChange, 
  photoPreview,
  errors 
}: OwnerInfoFormProps) {
  return (
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
              {photoPreview ? (
                <img src={photoPreview} alt="Owner preview" className="h-full w-full object-cover" />
              ) : (
                <Camera className="h-8 w-8 text-[var(--muted)]/40" />
              )}
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text)] hover:border-[var(--primary)]/40 transition-all">
                  <Upload className="h-4 w-4 text-[var(--primary)]" />
                  Choose File or Take Photo
                  <input type="file" accept="image/*" onChange={(e) => onPhotoChange(e.target.files?.[0])} className="hidden" />
                </label>
              </div>
              <p className="text-[11px] text-[var(--muted)]">
                {form.ownerAvatar ? "photo_ready.jpg" : "No file selected"}
              </p>
              {form.ownerAvatar ? (
                <button 
                  type="button" 
                  onClick={() => { onPhotoChange(undefined); setValue("ownerAvatar", ""); }} 
                  className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-rose-500 hover:text-rose-600 transition-colors"
                >
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
             error={errors?.ownerName}
           />
           <InputField 
             label="Contact No." 
             required
             placeholder="ex. 09123456789" 
             value={form.ownerContactNo} 
             onChange={(v) => setValue("ownerContactNo", v)} 
             error={errors?.ownerContactNo}
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
             error={errors?.ownerAddress}
           />
        </div>
      </section>

      <div className="flex justify-between pt-4 border-t border-[var(--border)]">
        <button 
          onClick={onPrevious}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-[var(--border)] text-xs font-bold uppercase tracking-widest text-[var(--muted)] hover:bg-[var(--card-soft)]"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        <button 
          onClick={onSubmit}
          className="inline-flex items-center gap-2 px-8 py-2.5 rounded-xl bg-[var(--primary)] text-xs font-bold uppercase tracking-widest text-white hover:brightness-110 shadow-lg shadow-[var(--primary)]/20"
        >
          Submit Property Record
        </button>
      </div>
    </div>
  );
}
