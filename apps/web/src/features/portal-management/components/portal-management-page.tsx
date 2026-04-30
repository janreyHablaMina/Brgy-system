"use client";

import { useState } from "react";
import {
  CalendarDays,
  Eye,
  Globe,
  ImageIcon,
  Landmark,
  Megaphone,
  MapPinned,
  MessageSquareWarning,
  Newspaper,
  Save,
  Settings2,
  ShieldCheck,
  SquarePen,
  ToggleLeft,
  ToggleRight,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PortalModule = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  section: "Content" | "Service" | "Transparency";
  icon: React.ComponentType<{ className?: string }>;
};

const INITIAL_MODULES: PortalModule[] = [
  {
    id: "mod-profile",
    title: "Barangay Profile",
    description: "Manage barangay overview, mission, vision, and contact details.",
    enabled: true,
    section: "Content",
    icon: Landmark,
  },
  {
    id: "mod-announcements",
    title: "Announcements",
    description: "Publish public notices and barangay advisories.",
    enabled: true,
    section: "Content",
    icon: Megaphone,
  },
  {
    id: "mod-officials",
    title: "Officials Directory",
    description: "Maintain elected officials and office assignments.",
    enabled: true,
    section: "Content",
    icon: Users,
  },
  {
    id: "mod-events",
    title: "Events Calendar",
    description: "Schedule upcoming events and barangay activities.",
    enabled: true,
    section: "Content",
    icon: CalendarDays,
  },
  {
    id: "mod-gallery",
    title: "Photo Gallery",
    description: "Manage albums and featured community images.",
    enabled: false,
    section: "Content",
    icon: ImageIcon,
  },
  {
    id: "mod-map",
    title: "Barangay Map",
    description: "Configure map markers, purok boundaries, and landmarks.",
    enabled: true,
    section: "Service",
    icon: MapPinned,
  },
  {
    id: "mod-docs",
    title: "Online Document Request",
    description: "Prepare online forms and processing flow for future portal launch.",
    enabled: true,
    section: "Service",
    icon: Newspaper,
  },
  {
    id: "mod-feedback",
    title: "Complaint / Feedback",
    description: "Set intake rules and moderation behavior for complaints.",
    enabled: true,
    section: "Service",
    icon: MessageSquareWarning,
  },
  {
    id: "mod-transparency",
    title: "Transparency Board",
    description: "Publish budgets, procurement notices, and governance documents.",
    enabled: true,
    section: "Transparency",
    icon: ShieldCheck,
  },
];

export function PortalManagementPage() {
  const [modules, setModules] = useState<PortalModule[]>(INITIAL_MODULES);

  const activeModules = modules.filter((item) => item.enabled).length;

  function toggleModule(id: string) {
    setModules((prev) => prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)));
  }

  return (
    <section className="space-y-6">
      <header className="px-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text)]">Portal Management</h1>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Admin control center for preparing future public portal content, modules, and settings.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ActionButton label="Portal Settings" icon={Settings2} />
            <ActionButton label="Preview Portal" icon={Eye} />
            <ActionButton label="Add Announcement" icon={Megaphone} />
            <ActionButton label="Manage Modules" icon={Globe} primary />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Portal Status" value="Configured" />
          <SummaryCard label="Active Modules" value={String(activeModules)} />
          <SummaryCard label="Published Announcements" value="12" />
          <SummaryCard label="Monthly Visits" value="2,480" />
        </div>
      </header>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 xl:col-span-2">
          <h2 className="text-sm font-semibold text-[var(--text)]">Main Sections</h2>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Enable or disable modules, then manage content before public release.
          </p>
          <div className="mt-4 space-y-3">
            {modules.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-2">
                      <Icon className="h-4 w-4 text-[var(--primary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--text)]">{item.title}</p>
                      <p className="mt-1 text-xs text-[var(--muted)]">{item.description}</p>
                      <span className="mt-2 inline-flex rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-semibold text-[var(--muted)]">
                        {item.section}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleModule(item.id)}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold",
                        item.enabled
                          ? "border-emerald-300/40 bg-emerald-500/10 text-emerald-700"
                          : "border-slate-300/40 bg-slate-500/10 text-slate-600"
                      )}
                    >
                      {item.enabled ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                      {item.enabled ? "Enabled" : "Disabled"}
                    </button>
                    <ActionButton label="Edit / Manage" icon={SquarePen} compact />
                    <ActionButton label="Preview" icon={Eye} compact />
                    <ActionButton label="Save" icon={Save} compact />
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <aside className="space-y-4">
          <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <h3 className="text-sm font-semibold text-[var(--text)]">Admin Notes</h3>
            <ul className="mt-2 space-y-2 text-xs text-[var(--muted)]">
              <li>Resident/public portal is not yet exposed.</li>
              <li>Changes here prepare future portal content only.</li>
              <li>Use module toggles for staged rollout per feature.</li>
            </ul>
          </article>
          <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <h3 className="text-sm font-semibold text-[var(--text)]">Permissions</h3>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Recommended: only `Admin` role can publish changes to portal content and module status.
            </p>
          </article>
        </aside>
      </section>
    </section>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{value}</p>
    </article>
  );
}

function ActionButton({
  label,
  icon: Icon,
  primary = false,
  compact = false,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  primary?: boolean;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border font-semibold transition-all",
        compact ? "h-8 px-2 text-xs" : "h-10 px-4 text-sm",
        primary
          ? "border-[var(--primary)] bg-[var(--primary)] text-white"
          : "border-[var(--border)] bg-[var(--card)] text-[var(--text)] hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"
      )}
    >
      <Icon className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      {label}
    </button>
  );
}
