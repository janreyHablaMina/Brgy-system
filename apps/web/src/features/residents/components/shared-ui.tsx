"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ModalLayout({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-3">
          <h3 className="text-xl font-semibold tracking-tight text-[var(--text)]">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-xl border border-[var(--border)] p-1.5 text-[var(--muted)] transition hover:bg-[var(--card-soft)] hover:text-[var(--text)]" aria-label="Close modal">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function InputField({
  label,
  value,
  onChange,
  type = "text",
  error,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="text-xs font-medium text-[var(--muted)]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15"
      />
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </label>
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
  error,
}: {
  label: string;
  value: string;
  options: readonly string[] | string[];
  onChange: (value: string) => void;
  error?: string;
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
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </label>
  );
}

export function TagToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all",
        checked
          ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-sm"
          : "border-[var(--border)] bg-[var(--card)] text-[var(--muted)] hover:border-[var(--primary)]/40 hover:text-[var(--text)]"
      )}
    >
      <div
        className={cn(
          "h-1.5 w-1.5 rounded-full transition-colors",
          checked ? "bg-white" : "bg-[var(--muted)]"
        )}
      />
      {label}
    </button>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-12 text-center">
      <p className="text-lg font-semibold tracking-tight text-[var(--text)]">{title}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
    </div>
  );
}
