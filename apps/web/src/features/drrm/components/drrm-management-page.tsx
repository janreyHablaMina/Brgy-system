"use client";

import { useMemo, useState } from "react";
import { Download, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MOCK_EVACUATION_EVENTS,
  MOCK_EVACUEE_FAMILIES,
  MOCK_HAZARD_AREAS,
} from "@/features/drrm/mock-data";
import type {
  EvacuationEvent,
  EvacueeFamily,
  EventStatus,
  HazardArea,
} from "@/features/drrm/types";

type TabKey = "events" | "hazards" | "evacuees";

export function DrrmManagementPage() {
  const [tab, setTab] = useState<TabKey>("events");
  const [events, setEvents] = useState<EvacuationEvent[]>(MOCK_EVACUATION_EVENTS);
  const [hazardAreas] = useState<HazardArea[]>(MOCK_HAZARD_AREAS);
  const [evacuees, setEvacuees] = useState<EvacueeFamily[]>(MOCK_EVACUEE_FAMILIES);

  const [statusFilter, setStatusFilter] = useState<"All" | EventStatus>("All");
  const [dateFilter, setDateFilter] = useState("");

  const summary = useMemo(() => {
    const totalHazardSites = hazardAreas.length;
    const highRisk = hazardAreas.filter((h) => h.riskLevel === "High").length;
    const activeEvacuations = events.filter((e) => e.status === "Active").length;
    const totalEvacuees = evacuees
      .filter((e) => e.status === "Evacuated")
      .reduce((sum, current) => sum + current.members, 0);
    return { totalHazardSites, highRisk, activeEvacuations, totalEvacuees };
  }, [hazardAreas, events, evacuees]);

  const filteredEvents = useMemo(
    () =>
      events
        .filter((item) => (statusFilter === "All" ? true : item.status === statusFilter))
        .filter((item) => (dateFilter ? item.dateTime.slice(0, 10) === dateFilter : true)),
    [events, statusFilter, dateFilter]
  );

  function resetFilters() {
    setStatusFilter("All");
    setDateFilter("");
  }

  function cycleEventStatus(id: string) {
    setEvents((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: item.status === "Active" ? "Resolved" : "Active" } : item
      )
    );
  }

  function cycleFamilyStatus(id: string) {
    setEvacuees((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: item.status === "Evacuated" ? "Returned" : "Evacuated" } : item
      )
    );
  }

  return (
    <section className="space-y-6">
      <header className="px-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text)]">Disaster & Emergency Management</h1>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Monitor disaster events, evacuation operations, hazard areas, and affected families.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white">
              <Plus className="h-4 w-4" />
              Log Event
            </button>
            <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-semibold text-[var(--text)]">
              <Download className="h-4 w-4" />
              Export Data
            </button>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Total Hazard Sites" value={String(summary.totalHazardSites)} />
          <SummaryCard label="High / Critical Risk Areas" value={String(summary.highRisk)} />
          <SummaryCard label="Active Evacuations" value={String(summary.activeEvacuations)} />
          <SummaryCard label="Total Evacuees" value={String(summary.totalEvacuees)} />
        </div>
      </header>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SelectField
            label="Filter by Status"
            value={statusFilter}
            options={["All", "Active", "Resolved"]}
            onChange={(v) => setStatusFilter(v as "All" | EventStatus)}
          />
          <label>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Filter by Date</span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none"
            />
          </label>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="inline-flex h-9 items-center rounded-lg bg-[var(--primary)] px-3 text-sm font-semibold text-white">Apply Filters</button>
          <button onClick={resetFilters} className="inline-flex h-9 items-center rounded-lg border border-[var(--border)] px-3 text-sm font-semibold text-[var(--text)]">Reset Filters</button>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <div className="flex flex-wrap gap-2 border-b border-[var(--border)] p-3">
          <TabButton label="Evacuation Events" active={tab === "events"} onClick={() => setTab("events")} />
          <TabButton label="Hazard Areas" active={tab === "hazards"} onClick={() => setTab("hazards")} />
          <TabButton label="Evacuees / Families" active={tab === "evacuees"} onClick={() => setTab("evacuees")} />
        </div>

        {tab === "events" ? (
          <div className="p-4">
            <SimpleTable
              headers={["Event Name", "Disaster Type", "Date & Time", "Location", "Status", "Description", "Actions"]}
              rows={filteredEvents.map((e) => [
                e.eventName,
                e.disasterType,
                new Date(e.dateTime).toLocaleString("en-US"),
                e.location,
                e.status,
                e.description,
                "View Details / Update Status / Close Event",
              ])}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {filteredEvents.map((e) => (
                <MiniAction key={e.id} label={`Toggle ${e.id}`} onClick={() => cycleEventStatus(e.id)} />
              ))}
            </div>
          </div>
        ) : null}

        {tab === "hazards" ? (
          <div className="p-4">
            <div className="mb-3 flex justify-end">
              <MiniAction label="Add Hazard Area" />
            </div>
            <SimpleTable
              headers={["Location / Purok", "Hazard Type", "Risk Level", "Notes", "Actions"]}
              rows={hazardAreas.map((h) => [h.purok, h.hazardType, h.riskLevel, h.notes, "Edit / Delete"])}
            />
          </div>
        ) : null}

        {tab === "evacuees" ? (
          <div className="p-4">
            <div className="mb-3 flex justify-end">
              <MiniAction label="Add Record" />
            </div>
            <SimpleTable
              headers={["Family Head Name", "Number of Members", "Evacuation Center", "Status", "Notes", "Actions"]}
              rows={evacuees.map((f) => [
                f.familyHeadName,
                String(f.members),
                f.evacuationCenter,
                f.status,
                f.notes,
                "View Details / Update Status",
              ])}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {evacuees.map((f) => (
                <MiniAction key={f.id} label={`Update ${f.id}`} onClick={() => cycleFamilyStatus(f.id)} />
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
      className="inline-flex h-8 items-center rounded-lg border border-[var(--border)] px-2 text-xs font-semibold text-[var(--text)]"
    >
      {label}
    </button>
  );
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
