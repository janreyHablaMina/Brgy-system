"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type SettingsTab =
  | "barangay"
  | "contact"
  | "branding"
  | "fees"
  | "preferences"
  | "documents"
  | "notifications";

type SettingsState = {
  barangayName: string;
  psgcCode: string;
  population: string;
  cityMunicipality: string;
  province: string;
  zipCode: string;
  motto: string;
  establishedYear: string;
  captainName: string;
  officeHours: string;
  emailAddress: string;
  contactNumber: string;
  completeAddress: string;
  facebookPage: string;
  website: string;
  barangayLogo: string;
  systemName: string;
  themeColor: string;
  headerText: string;
  footerText: string;
  clearanceFee: string;
  certificateFee: string;
  businessPermitFee: string;
  otherDocumentFees: string;
  language: string;
  timeZone: string;
  dateFormat: string;
  currencyFormat: string;
  backupSettings: string;
  certificateTemplates: string;
  defaultSignatories: string;
  documentNumberFormat: string;
  footerNotes: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  requestAlerts: boolean;
  approvalAlerts: boolean;
};

const DEFAULT_SETTINGS: SettingsState = {
  barangayName: "Barangay Salaza",
  psgcCode: "0123456789",
  population: "12450",
  cityMunicipality: "Sample City",
  province: "Sample Province",
  zipCode: "3100",
  motto: "Serbisyong Tapat, Barangay Maunlad",
  establishedYear: "1987",
  captainName: "Rogelio Ramos",
  officeHours: "Mon-Fri, 8:00 AM - 5:00 PM",
  emailAddress: "barangay@salaza.gov.ph",
  contactNumber: "0917-000-1234",
  completeAddress: "Purok 1, Barangay Salaza, Sample City",
  facebookPage: "facebook.com/brgysalaza",
  website: "https://salaza.gov.ph",
  barangayLogo: "barangay-logo.png",
  systemName: "Lingkod Barangay Management System",
  themeColor: "#3C50E0",
  headerText: "Barangay Salaza Information System",
  footerText: "For internal administrative use only.",
  clearanceFee: "50",
  certificateFee: "30",
  businessPermitFee: "250",
  otherDocumentFees: "20",
  language: "English",
  timeZone: "Asia/Manila",
  dateFormat: "MMM DD, YYYY",
  currencyFormat: "PHP (₱)",
  backupSettings: "Daily auto backup at 11:00 PM",
  certificateTemplates: "Default Template Set A",
  defaultSignatories: "Punong Barangay, Secretary",
  documentNumberFormat: "DOC-{YEAR}-{SERIES}",
  footerNotes: "This document is system generated.",
  emailNotifications: true,
  smsNotifications: false,
  requestAlerts: true,
  approvalAlerts: true,
};

export function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("barangay");
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);

  function setField<K extends keyof SettingsState>(key: K, value: SettingsState[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function resetChanges() {
    setSettings(DEFAULT_SETTINGS);
  }

  return (
    <section className="space-y-6">
      <header className="px-1">
        <h1 className="text-2xl font-semibold text-[var(--text)]">System Settings</h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Configure barangay information, branding, fees, templates, and system preferences.
        </p>
      </header>

      <section className="grid gap-4 xl:grid-cols-[260px_1fr]">
        <aside className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
          <div className="space-y-1">
            <TabButton label="Barangay Info" active={activeTab === "barangay"} onClick={() => setActiveTab("barangay")} />
            <TabButton label="Contact Details" active={activeTab === "contact"} onClick={() => setActiveTab("contact")} />
            <TabButton label="Branding" active={activeTab === "branding"} onClick={() => setActiveTab("branding")} />
            <TabButton label="Fees & Charges" active={activeTab === "fees"} onClick={() => setActiveTab("fees")} />
            <TabButton label="System Preferences" active={activeTab === "preferences"} onClick={() => setActiveTab("preferences")} />
            <TabButton label="Document Settings" active={activeTab === "documents"} onClick={() => setActiveTab("documents")} />
            <TabButton label="Notifications" active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} />
          </div>
        </aside>

        <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          {activeTab === "barangay" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <Input label="Barangay Name" value={settings.barangayName} onChange={(v) => setField("barangayName", v)} />
              <Input label="PSGC Code" value={settings.psgcCode} onChange={(v) => setField("psgcCode", v)} />
              <Input label="Population" value={settings.population} onChange={(v) => setField("population", v)} />
              <Input label="City / Municipality" value={settings.cityMunicipality} onChange={(v) => setField("cityMunicipality", v)} />
              <Input label="Province" value={settings.province} onChange={(v) => setField("province", v)} />
              <Input label="ZIP Code" value={settings.zipCode} onChange={(v) => setField("zipCode", v)} />
              <Input label="Motto / Tagline" value={settings.motto} onChange={(v) => setField("motto", v)} />
              <Input label="Established Year" value={settings.establishedYear} onChange={(v) => setField("establishedYear", v)} />
              <Input label="Captain Name" value={settings.captainName} onChange={(v) => setField("captainName", v)} />
              <Input label="Office Hours" value={settings.officeHours} onChange={(v) => setField("officeHours", v)} />
            </div>
          ) : null}

          {activeTab === "contact" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <Input label="Email Address" value={settings.emailAddress} onChange={(v) => setField("emailAddress", v)} />
              <Input label="Contact Number" value={settings.contactNumber} onChange={(v) => setField("contactNumber", v)} />
              <Input label="Complete Address" value={settings.completeAddress} onChange={(v) => setField("completeAddress", v)} />
              <Input label="Facebook Page" value={settings.facebookPage} onChange={(v) => setField("facebookPage", v)} />
              <Input label="Website" value={settings.website} onChange={(v) => setField("website", v)} />
            </div>
          ) : null}

          {activeTab === "branding" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <Input label="Barangay Logo Upload" value={settings.barangayLogo} onChange={(v) => setField("barangayLogo", v)} />
              <Input label="System Name" value={settings.systemName} onChange={(v) => setField("systemName", v)} />
              <Input label="Theme Color" value={settings.themeColor} onChange={(v) => setField("themeColor", v)} />
              <Input label="Header Text" value={settings.headerText} onChange={(v) => setField("headerText", v)} />
              <Input label="Footer Text" value={settings.footerText} onChange={(v) => setField("footerText", v)} />
              <ActionOnly label="Upload Logo" />
            </div>
          ) : null}

          {activeTab === "fees" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <Input label="Barangay Clearance Fee" value={settings.clearanceFee} onChange={(v) => setField("clearanceFee", v)} />
              <Input label="Certificate Fee" value={settings.certificateFee} onChange={(v) => setField("certificateFee", v)} />
              <Input label="Business Permit Fee" value={settings.businessPermitFee} onChange={(v) => setField("businessPermitFee", v)} />
              <Input label="Other Document Fees" value={settings.otherDocumentFees} onChange={(v) => setField("otherDocumentFees", v)} />
              <ActionOnly label="Update Fees" />
            </div>
          ) : null}

          {activeTab === "preferences" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <Input label="Language" value={settings.language} onChange={(v) => setField("language", v)} />
              <Input label="Time Zone" value={settings.timeZone} onChange={(v) => setField("timeZone", v)} />
              <Input label="Date Format" value={settings.dateFormat} onChange={(v) => setField("dateFormat", v)} />
              <Input label="Currency Format" value={settings.currencyFormat} onChange={(v) => setField("currencyFormat", v)} />
              <Input label="Backup Settings" value={settings.backupSettings} onChange={(v) => setField("backupSettings", v)} />
            </div>
          ) : null}

          {activeTab === "documents" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <Input label="Certificate Templates" value={settings.certificateTemplates} onChange={(v) => setField("certificateTemplates", v)} />
              <Input label="Default Signatories" value={settings.defaultSignatories} onChange={(v) => setField("defaultSignatories", v)} />
              <Input label="Document Number Format" value={settings.documentNumberFormat} onChange={(v) => setField("documentNumberFormat", v)} />
              <Input label="Footer Notes" value={settings.footerNotes} onChange={(v) => setField("footerNotes", v)} />
              <ActionOnly label="Manage Templates" />
            </div>
          ) : null}

          {activeTab === "notifications" ? (
            <div className="grid gap-3 md:grid-cols-2">
              <Toggle label="Email Notifications" checked={settings.emailNotifications} onChange={(v) => setField("emailNotifications", v)} />
              <Toggle label="SMS Notifications" checked={settings.smsNotifications} onChange={(v) => setField("smsNotifications", v)} />
              <Toggle label="Request Alerts" checked={settings.requestAlerts} onChange={(v) => setField("requestAlerts", v)} />
              <Toggle label="Approval Alerts" checked={settings.approvalAlerts} onChange={(v) => setField("approvalAlerts", v)} />
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--border)] pt-4">
            <button className="inline-flex h-10 items-center rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white">
              Save Changes
            </button>
            <button
              onClick={resetChanges}
              className="inline-flex h-10 items-center rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-4 text-sm font-semibold text-[var(--text)]"
            >
              Reset Changes
            </button>
          </div>
        </article>
      </section>
    </section>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-lg px-3 py-2 text-left text-sm font-semibold",
        active ? "bg-[var(--primary)] text-white" : "text-[var(--text)] hover:bg-[var(--card-soft)]"
      )}
    >
      {label}
    </button>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label>
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none"
      />
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2">
      <span className="text-sm text-[var(--text)]">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "h-6 w-11 rounded-full transition-all",
          checked ? "bg-[var(--primary)]" : "bg-slate-300"
        )}
      >
        <span
          className={cn(
            "block h-5 w-5 rounded-full bg-white transition-all",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </button>
    </label>
  );
}

function ActionOnly({ label }: { label: string }) {
  return (
    <div className="flex items-end">
      <button
        type="button"
        className="inline-flex h-10 items-center rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-semibold text-[var(--text)]"
      >
        {label}
      </button>
    </div>
  );
}
