"use client";

import { useMemo, useState } from "react";
import { Download, Eye, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_AUDIT_LOGS } from "@/features/audit-logs/mock-data";
import type { AuditLog, AuditSeverity } from "@/features/audit-logs/types";

type SeverityFilter = "All" | AuditSeverity;

export function AuditLogsPage() {
  const [logs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [actionFilter, setActionFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("All");

  const filteredLogs = useMemo(
    () =>
      logs
        .filter((log) =>
          search ? `${log.userName} ${log.module} ${log.action}`.toLowerCase().includes(search.toLowerCase()) : true
        )
        .filter((log) => (moduleFilter === "All" ? true : log.module === moduleFilter))
        .filter((log) => (actionFilter === "All" ? true : log.action === actionFilter))
        .filter((log) => (severityFilter === "All" ? true : log.severity === severityFilter))
        .filter((log) => {
          const ts = new Date(log.timestamp).getTime();
          const from = fromDate ? new Date(fromDate).getTime() : Number.NEGATIVE_INFINITY;
          const to = toDate ? new Date(toDate).getTime() : Number.POSITIVE_INFINITY;
          return ts >= from && ts <= to;
        }),
    [logs, search, moduleFilter, actionFilter, fromDate, toDate, severityFilter]
  );

  const summary = useMemo(() => {
    const totalLogs = logs.length;
    const today = new Date().toISOString().slice(0, 10);
    const todaysActivities = logs.filter((log) => log.timestamp.slice(0, 10) === today).length;
    const criticalActions = logs.filter((log) => log.severity === "Critical").length;
    const activeUsers = new Set(logs.map((log) => log.userName)).size;
    return { totalLogs, todaysActivities, criticalActions, activeUsers };
  }, [logs]);

  function resetFilters() {
    setSearch("");
    setModuleFilter("All");
    setActionFilter("All");
    setFromDate("");
    setToDate("");
    setSeverityFilter("All");
  }

  return (
    <section className="space-y-6">
      <header className="px-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text)]">Audit Logs</h1>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Security and accountability tracking of critical user actions across modules.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-semibold text-[var(--text)]">
              <Download className="h-4 w-4" />
              Export Logs CSV / PDF
            </button>
            <button
              onClick={resetFilters}
              className="inline-flex h-10 items-center rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-4 text-sm font-semibold text-[var(--text)]"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Total Logs" value={String(summary.totalLogs)} />
          <SummaryCard label="Today's Activities" value={String(summary.todaysActivities)} />
          <SummaryCard label="Critical Actions" value={String(summary.criticalActions)} />
          <SummaryCard label="Active Users" value={String(summary.activeUsers)} />
        </div>
      </header>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <label className="xl:col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Search</span>
            <div className="relative mt-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="User, module, action..."
                className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] pl-9 pr-3 text-sm text-[var(--text)] outline-none"
              />
            </div>
          </label>
          <SelectField
            label="Module"
            value={moduleFilter}
            options={[
              "All",
              "Authentication",
              "Residents",
              "Finance Management",
              "System Settings",
              "Reports",
              "Requests",
              "Documents",
            ]}
            onChange={setModuleFilter}
          />
          <SelectField
            label="Action Type"
            value={actionFilter}
            options={[
              "All",
              "Login",
              "Logout",
              "Create Record",
              "Update Record",
              "Delete Record",
              "Approve Request",
              "Generate Report",
              "Finance Change",
              "Settings Change",
            ]}
            onChange={setActionFilter}
          />
          <label>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">From</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none"
            />
          </label>
          <label>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">To</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none"
            />
          </label>
          <SelectField
            label="Severity"
            value={severityFilter}
            options={["All", "Info", "Warning", "Critical"]}
            onChange={(v) => setSeverityFilter(v as SeverityFilter)}
          />
        </div>
        <div className="mt-3 flex gap-2">
          <button className="inline-flex h-9 items-center rounded-lg bg-[var(--primary)] px-3 text-sm font-semibold text-white">Apply Filters</button>
          <button onClick={resetFilters} className="inline-flex h-9 items-center rounded-lg border border-[var(--border)] px-3 text-sm font-semibold text-[var(--text)]">Reset Filters</button>
        </div>
      </section>

      <section className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--card-soft)]/60">
              {[
                "Date & Time",
                "User Name",
                "Role",
                "Action",
                "Module",
                "Description",
                "Severity",
                "IP Address",
                "Device / Browser",
                "Actions",
              ].map((head) => (
                <th key={head} className="px-4 py-3 text-left text-xs font-semibold text-[var(--muted)]">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]/50">
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td className="px-4 py-3 text-[var(--muted)]">{new Date(log.timestamp).toLocaleString("en-US")}</td>
                <td className="px-4 py-3 text-[var(--text)]">{log.userName}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{log.role}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{log.action}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{log.module}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{log.description}</td>
                <td className="px-4 py-3">
                  <SeverityPill severity={log.severity} />
                </td>
                <td className="px-4 py-3 text-[var(--muted)]">{log.ipAddress ?? "-"}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{log.device ?? "-"}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedLog(log)}
                    className="inline-flex h-7 items-center gap-1 rounded-lg border border-[var(--border)] px-2 text-xs font-semibold text-[var(--text)]"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View Log Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {selectedLog ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="mb-3 flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="text-lg font-semibold text-[var(--text)]">Audit Log Details</h3>
              <button onClick={() => setSelectedLog(null)} className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs text-[var(--text)]">Close</button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Detail label="User" value={selectedLog.userName} />
              <Detail label="Role" value={selectedLog.role} />
              <Detail label="Action" value={selectedLog.action} />
              <Detail label="Module" value={selectedLog.module} />
              <Detail label="Timestamp" value={new Date(selectedLog.timestamp).toLocaleString("en-US")} />
              <Detail label="Severity" value={selectedLog.severity} />
              <Detail label="Affected Record" value={selectedLog.affectedRecord ?? "-"} />
              <Detail label="IP Address / Device" value={`${selectedLog.ipAddress ?? "-"} / ${selectedLog.device ?? "-"}`} />
            </div>
            <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">Full Description</p>
              <p className="mt-1 text-sm text-[var(--text)]">{selectedLog.description}</p>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <Detail label="Old Value" value={selectedLog.oldValue ?? "-"} />
              <Detail label="New Value" value={selectedLog.newValue ?? "-"} />
            </div>
          </div>
        </div>
      ) : null}
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

function SeverityPill({ severity }: { severity: AuditSeverity }) {
  const tone =
    severity === "Critical"
      ? "border-rose-300/30 bg-rose-500/10 text-rose-700"
      : severity === "Warning"
        ? "border-amber-300/30 bg-amber-500/10 text-amber-700"
        : "border-indigo-300/30 bg-indigo-500/10 text-indigo-700";
  return <span className={cn("rounded-full border px-2 py-0.5 text-xs font-semibold", tone)}>{severity}</span>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-sm text-[var(--text)]">{value}</p>
    </div>
  );
}
