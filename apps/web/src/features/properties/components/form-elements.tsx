"use client";

import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

export function TabButton({ 
  active, 
  onClick, 
  icon: Icon, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: LucideIcon; 
  label: string 
}) {
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

export function InputField({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  required, 
  className,
  error
}: { 
  label: string; 
  placeholder: string; 
  value: string; 
  onChange: (v: string) => void; 
  required?: boolean; 
  className?: string;
  error?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-xs font-bold text-[var(--text)]">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      <input 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-11 w-full rounded-xl border border-[var(--border)] bg-[#f8fafc] px-4 text-sm outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 transition-all",
          error && "border-rose-400 bg-rose-50"
        )}
      />
      {error && <span className="text-[10px] font-semibold text-rose-500">{error}</span>}
    </label>
  );
}

export function SelectField({ 
  label, 
  options, 
  value, 
  onChange, 
  required, 
  footer,
  error
}: { 
  label: string; 
  options: string[]; 
  value: string; 
  onChange: (v: string) => void; 
  required?: boolean; 
  footer?: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-[var(--text)]">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-11 w-full rounded-xl border border-[var(--border)] bg-[#f8fafc] px-4 text-sm outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/5 transition-all appearance-none",
          error && "border-rose-400 bg-rose-50"
        )}
      >
        <option value="" disabled>Please select</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <span className="text-[10px] font-semibold text-rose-500">{error}</span>}
      {footer}
    </div>
  );
}
