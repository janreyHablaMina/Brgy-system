"use client";

import { useMemo, useState } from "react";
import { Download, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/features/residents/utils";
import {
  MOCK_DUTY_SCHEDULES,
  MOCK_INCIDENT_REPORTS,
  MOCK_PATROL_LOGS,
  MOCK_TANOD_MEMBERS,
} from "@/features/tanod-management/mock-data";
import type {
  DutySchedule,
  IncidentReport,
  IncidentStatus,
  PatrolLog,
  TanodMember,
  TanodStatus,
} from "@/features/tanod-management/types";

type TabKey = "members" | "schedules" | "patrol" | "incidents";

export function TanodManagementPage() {
  const [tab, setTab] = useState<TabKey>("members");
  const [members, setMembers] = useState<TanodMember[]>(MOCK_TANOD_MEMBERS);
  const [schedules] = useState<DutySchedule[]>(MOCK_DUTY_SCHEDULES);
  const [patrolLogs] = useState<PatrolLog[]>(MOCK_PATROL_LOGS);
  const [incidents, setIncidents] = useState<IncidentReport[]>(MOCK_INCIDENT_REPORTS);

  const [memberSearch, setMemberSearch] = useState("");
  const [memberStatus, setMemberStatus] = useState<"All" | TanodStatus>("All");
  const [teamFilter, setTeamFilter] = useState<"All" | "Alpha" | "Bravo">("All");

  const summary = useMemo(() => {
    const totalMembers = members.length;
    const active = members.filter((item) => item.status === "Active").length;
    const suspendedOrInactive = members.filter((item) => item.status !== "Active").length;
    return { totalMembers, active, suspendedOrInactive };
  }, [members]);

  const filteredMembers = useMemo(
    () =>
      members
        .filter((item) =>
          memberSearch
            ? `${item.fullName} ${item.badgeNumber}`.toLowerCase().includes(memberSearch.toLowerCase())
            : true
        )
        .filter((item) => (memberStatus === "All" ? true : item.status === memberStatus))
        .filter((item) => (teamFilter === "All" ? true : item.team === teamFilter)),
    [members, memberSearch, memberStatus, teamFilter]
  );

  function toggleMemberStatus(memberId: string) {
    setMembers((prev) =>
      prev.map((item) =>
        item.id === memberId
          ? {
              ...item,
              status:
                item.status === "Active"
                  ? "Suspended"
                  : item.status === "Suspended"
                    ? "Inactive"
                    : "Active",
            }
          : item
      )
    );
  }

  function cycleIncidentStatus(reportId: string) {
    setIncidents((prev) =>
      prev.map((item) => {
        if (item.id !== reportId) return item;
        const next: IncidentStatus =
          item.status === "Open" ? "Investigating" : item.status === "Investigating" ? "Resolved" : "Open";
        return { ...item, status: next };
      })
    );
  }

  return (
    <section className="space-y-6">
      <header className="px-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text)]">Tanod Management</h1>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Manage tanod members, duty schedules, patrol logs, and incident reports.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white">
              <Plus className="h-4 w-4" />
              Add Tanod Member
            </button>
            <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-semibold text-[var(--text)]">
              <Download className="h-4 w-4" />
              Export Data
            </button>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SummaryCard label="Total Members" value={String(summary.totalMembers)} />
          <SummaryCard label="Active Members" value={String(summary.active)} />
          <SummaryCard label="Inactive / Suspended" value={String(summary.suspendedOrInactive)} />
        </div>
      </header>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <div className="flex flex-wrap gap-2 border-b border-[var(--border)] p-3">
          <TabButton label="Members" active={tab === "members"} onClick={() => setTab("members")} />
          <TabButton label="Duty Schedules" active={tab === "schedules"} onClick={() => setTab("schedules")} />
          <TabButton label="Patrol Logs" active={tab === "patrol"} onClick={() => setTab("patrol")} />
          <TabButton label="Incident Reports" active={tab === "incidents"} onClick={() => setTab("incidents")} />
        </div>

        {tab === "members" ? (
          <div className="p-4">
            <div className="mb-4 grid gap-3 md:grid-cols-3">
              <label>
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Search</span>
                <div className="relative mt-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder="Name or badge"
                    className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] pl-9 pr-3 text-sm text-[var(--text)] outline-none"
                  />
                </div>
              </label>
              <SelectField
                label="Status"
                value={memberStatus}
                options={["All", "Active", "Inactive", "Suspended"]}
                onChange={(v) => setMemberStatus(v as "All" | TanodStatus)}
              />
              <SelectField
                label="Team"
                value={teamFilter}
                options={["All", "Alpha", "Bravo"]}
                onChange={(v) => setTeamFilter(v as "All" | "Alpha" | "Bravo")}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--card-soft)]/60">
                    {["Badge", "Full Name", "Team", "Beat Assignment", "Date Appointed", "Status", "Actions"].map(
                      (head) => (
                        <th key={head} className="px-4 py-3 text-left text-xs font-semibold text-[var(--muted)]">
                          {head}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]/50">
                  {filteredMembers.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-[var(--text)]">{item.badgeNumber}</td>
                      <td className="px-4 py-3 text-[var(--text)]">
                        {item.fullName} {item.isLeader ? <span className="text-xs text-[var(--primary)]">(Leader)</span> : null}
                      </td>
                      <td className="px-4 py-3 text-[var(--text)]">{item.team}</td>
                      <td className="px-4 py-3 text-[var(--text)]">{item.beatAssignment}</td>
                      <td className="px-4 py-3 text-[var(--muted)]">{formatDate(item.dateAppointed)}</td>
                      <td className="px-4 py-3">
                        <StatusPill text={item.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          <MiniAction label="Edit Member" />
                          <MiniAction label="View Profile" />
                          <MiniAction label="Deactivate / Suspend" onClick={() => toggleMemberStatus(item.id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {tab === "schedules" ? (
          <div className="p-4">
            <div className="mb-3 flex justify-end">
              <MiniAction label="Add Schedule" />
            </div>
            <SimpleTable
              headers={["Member Name", "Date", "Shift", "Assigned Area", "Actions"]}
              rows={schedules.map((s) => [
                s.memberName,
                formatDate(s.date),
                s.shift,
                s.assignedArea,
                "Edit Schedule / Delete Schedule",
              ])}
            />
          </div>
        ) : null}

        {tab === "patrol" ? (
          <div className="p-4">
            <div className="mb-3 flex justify-end">
              <MiniAction label="Add Log" />
            </div>
            <SimpleTable
              headers={["Date & Time", "Assigned Members", "Area Covered", "Notes", "Actions"]}
              rows={patrolLogs.map((p) => [
                new Date(p.dateTime).toLocaleString("en-US"),
                p.assignedMembers.join(", "),
                p.areaCovered,
                p.notes,
                "View Details / Edit / Delete",
              ])}
            />
          </div>
        ) : null}

        {tab === "incidents" ? (
          <div className="p-4">
            <div className="mb-3 flex justify-end gap-2">
              <MiniAction label="Add Report" />
              <MiniAction label="Attach Files" />
            </div>
            <div className="space-y-3">
              {incidents.map((item) => (
                <article key={item.id} className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-[var(--text)]">
                        {item.incidentType} • {item.location}
                      </p>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        {new Date(item.dateTime).toLocaleString("en-US")} {item.involvedPersons ? `• ${item.involvedPersons}` : ""}
                      </p>
                      <p className="mt-1 text-xs text-[var(--muted)]">{item.description}</p>
                    </div>
                    <StatusPill text={item.status} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <MiniAction label="View Details" />
                    <MiniAction label="Update Status" onClick={() => cycleIncidentStatus(item.id)} />
                    <MiniAction label="Link to Blotter" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}
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

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg px-3 py-1.5 text-xs font-semibold",
        active ? "bg-[var(--primary)] text-white" : "border border-[var(--border)] bg-[var(--card)] text-[var(--text)]"
      )}
    >
      {label}
    </button>
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
  onChange: (v: string) => void;
}) {
  return (
    <label>
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function MiniAction({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-7 items-center rounded-lg border border-[var(--border)] px-2 text-xs font-semibold text-[var(--text)]"
    >
      {label}
    </button>
  );
}

function StatusPill({ text }: { text: string }) {
  const tone =
    text === "Active" || text === "Resolved"
      ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-700"
      : text === "Open" || text === "Investigating"
        ? "border-amber-300/30 bg-amber-500/10 text-amber-700"
        : "border-slate-300/30 bg-slate-500/10 text-slate-700";
  return <span className={cn("rounded-full border px-2 py-0.5 text-xs font-semibold", tone)}>{text}</span>;
}

function SimpleTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--card-soft)]/60">
            {headers.map((head) => (
              <th key={head} className="px-4 py-3 text-left text-xs font-semibold text-[var(--muted)]">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]/50">
          {rows.map((row, idx) => (
            <tr key={idx}>
              {row.map((cell, i) => (
                <td key={i} className={cn("px-4 py-3", i === row.length - 1 ? "text-[var(--text)]" : "text-[var(--muted)]")}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
