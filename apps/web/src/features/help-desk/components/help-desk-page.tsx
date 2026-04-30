"use client";

import { useMemo, useState } from "react";
import {
  CalendarRange,
  CheckCircle2,
  Clock3,
  Eye,
  MessageSquare,
  Plus,
  Search,
  Send,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_TICKETS } from "@/features/help-desk/mock-data";
import type { SupportTicket, TicketCategory, TicketPriority, TicketStatus } from "@/features/help-desk/types";

type StatusFilter = "All" | TicketStatus;
type PriorityFilter = "All" | TicketPriority;
type CategoryFilter = "All" | TicketCategory;

export function HelpDeskPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [priority, setPriority] = useState<PriorityFilter>("All");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [reply, setReply] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets
      .filter((t) => (q ? `${t.id} ${t.title}`.toLowerCase().includes(q) : true))
      .filter((t) => (status === "All" ? true : t.status === status))
      .filter((t) => (priority === "All" ? true : t.priority === priority))
      .filter((t) => (category === "All" ? true : t.category === category))
      .filter((t) => {
        const created = new Date(t.createdAt).getTime();
        const from = dateFrom ? new Date(dateFrom).getTime() : Number.NEGATIVE_INFINITY;
        const to = dateTo ? new Date(dateTo).getTime() : Number.POSITIVE_INFINITY;
        return created >= from && created <= to;
      });
  }, [tickets, search, status, priority, category, dateFrom, dateTo]);

  const summary = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter((t) => t.status === "Open").length;
    const resolved = tickets.filter((t) => t.status === "Resolved").length;
    const avg = total ? tickets.reduce((sum, t) => sum + t.responseTimeHours, 0) / total : 0;
    return { total, open, resolved, avg };
  }, [tickets]);

  function resetFilters() {
    setSearch("");
    setStatus("All");
    setPriority("All");
    setCategory("All");
    setDateFrom("");
    setDateTo("");
  }

  function cycleStatus(ticket: SupportTicket) {
    const next: TicketStatus =
      ticket.status === "Open" ? "Resolved" : ticket.status === "Resolved" ? "Closed" : "Open";
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticket.id
          ? {
              ...t,
              status: next,
              lastReplyAt: new Date().toISOString(),
              activityLog: [`Status changed to ${next} - ${new Date().toLocaleString("en-US")}`, ...t.activityLog],
            }
          : t
      )
    );
  }

  function deleteTicket(ticketId: string) {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(null);
    }
  }

  function submitReply() {
    if (!selectedTicket || !reply.trim()) return;
    const message = {
      id: `MSG-${Date.now()}`,
      sender: "Admin User",
      role: "Admin" as const,
      content: reply.trim(),
      timestamp: new Date().toISOString(),
    };
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              messages: [...t.messages, message],
              lastReplyAt: new Date().toISOString(),
              activityLog: [`Reply added by Admin User - ${new Date().toLocaleString("en-US")}`, ...t.activityLog],
            }
          : t
      )
    );
    setReply("");
  }

  return (
    <section className="space-y-6">
      <header className="px-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text)]">Help Desk / Support Tickets</h1>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Internal ticketing workspace for reporting, tracking, and resolving system concerns.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateForm((v) => !v)}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            New Ticket
          </button>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Total Tickets" value={String(summary.total)} />
          <SummaryCard label="Open Tickets" value={String(summary.open)} />
          <SummaryCard label="Resolved Tickets" value={String(summary.resolved)} />
          <SummaryCard label="Average Response Time" value={`${summary.avg.toFixed(1)}h`} />
        </div>
      </header>

      {showCreateForm ? (
        <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-sm font-semibold text-[var(--text)]">Create New Ticket</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <Input label="Title" placeholder="Enter ticket title" />
            <Select label="Category" options={["Bug", "Request", "System", "Data"]} />
            <Select label="Priority" options={["Low", "Normal", "High"]} />
            <Input label="Attachment (optional)" placeholder="Attach file (placeholder)" />
            <label className="md:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Description</span>
              <textarea className="mt-1 h-24 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 py-2 text-sm text-[var(--text)] outline-none" />
            </label>
          </div>
        </section>
      ) : null}

      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <label className="xl:col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Search</span>
            <div className="relative mt-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ticket ID or title..."
                className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] pl-9 pr-3 text-sm text-[var(--text)] outline-none"
              />
            </div>
          </label>
          <Select label="Status" value={status} onChange={(v) => setStatus(v as StatusFilter)} options={["All", "Open", "Resolved", "Closed"]} />
          <Select label="Priority" value={priority} onChange={(v) => setPriority(v as PriorityFilter)} options={["All", "Low", "Normal", "High"]} />
          <Select label="Category" value={category} onChange={(v) => setCategory(v as CategoryFilter)} options={["All", "Bug", "Request", "System", "Data"]} />
          <label>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">From</span>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none" />
          </label>
          <label>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">To</span>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none" />
          </label>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="inline-flex h-9 items-center rounded-lg bg-[var(--primary)] px-3 text-sm font-semibold text-white">Apply Filters</button>
          <button onClick={resetFilters} className="inline-flex h-9 items-center rounded-lg border border-[var(--border)] px-3 text-sm font-semibold text-[var(--text)]">Reset Filters</button>
        </div>
      </section>

      <section className="space-y-3">
        {filtered.map((ticket) => (
          <article key={ticket.id} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[var(--muted)]">{ticket.id}</p>
                <h3 className="text-sm font-semibold text-[var(--text)]">{ticket.title}</h3>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Submitted by {ticket.submittedBy} • {new Date(ticket.createdAt).toLocaleString("en-US")}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">Last reply: {new Date(ticket.lastReplyAt).toLocaleString("en-US")}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge text={ticket.status} tone={ticket.status === "Open" ? "amber" : ticket.status === "Resolved" ? "emerald" : "slate"} />
                <Badge text={ticket.priority} tone={ticket.priority === "High" ? "rose" : ticket.priority === "Normal" ? "blue" : "slate"} />
                <Badge text={ticket.category} tone="blue" />
                <Badge text={`${ticket.messages.length} msgs`} tone="slate" />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <SmallAction label="View Details" icon={Eye} onClick={() => setSelectedTicket(ticket)} />
              <SmallAction label="Reply / Add Message" icon={MessageSquare} onClick={() => setSelectedTicket(ticket)} />
              <SmallAction label="Change Status" icon={CheckCircle2} onClick={() => cycleStatus(ticket)} />
              <SmallAction label="Assign User" icon={Clock3} />
              <SmallAction label="Delete" icon={Trash2} danger onClick={() => deleteTicket(ticket.id)} />
            </div>
          </article>
        ))}
      </section>

      {selectedTicket ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="mb-3 flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text)]">{selectedTicket.title}</h3>
                <p className="text-xs text-[var(--muted)]">{selectedTicket.id} • {selectedTicket.category}</p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs text-[var(--text)]">Close</button>
            </div>
            <div className="space-y-2">
              {selectedTicket.messages.map((msg) => (
                <div key={msg.id} className="rounded-lg border border-[var(--border)] bg-[var(--card-soft)] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-[var(--text)]">{msg.sender}</p>
                    <p className="text-xs text-[var(--muted)]">{new Date(msg.timestamp).toLocaleString("en-US")}</p>
                  </div>
                  <p className="mt-1 text-sm text-[var(--text)]">{msg.content}</p>
                  {msg.attachmentName ? <p className="mt-1 text-xs text-[var(--muted)]">Attachment: {msg.attachmentName}</p> : null}
                  {msg.internalNote ? <p className="mt-1 text-xs text-amber-600">Internal note</p> : null}
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--card-soft)] p-3">
              <p className="text-xs font-semibold text-[var(--text)]">Reply</p>
              <textarea value={reply} onChange={(e) => setReply(e.target.value)} className="mt-2 h-20 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] outline-none" />
              <div className="mt-2 flex flex-wrap gap-2">
                <button onClick={submitReply} className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--primary)] px-3 text-sm font-semibold text-white">
                  <Send className="h-4 w-4" />
                  Send Reply
                </button>
                <button onClick={() => cycleStatus(selectedTicket)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] px-3 text-sm font-semibold text-[var(--text)]">
                  <CalendarRange className="h-4 w-4" />
                  Update Status
                </button>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--card-soft)] p-3">
              <p className="text-xs font-semibold text-[var(--text)]">Activity Log</p>
              <ul className="mt-2 space-y-1 text-xs text-[var(--muted)]">
                {selectedTicket.activityLog.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
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

function Input({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <label>
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</span>
      <input placeholder={placeholder} className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none" />
    </label>
  );
}

function Select({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <label>
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Badge({ text, tone }: { text: string; tone: "amber" | "emerald" | "rose" | "blue" | "slate" }) {
  const style =
    tone === "amber"
      ? "border-amber-300/30 bg-amber-500/10 text-amber-700"
      : tone === "emerald"
        ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-700"
        : tone === "rose"
          ? "border-rose-300/30 bg-rose-500/10 text-rose-700"
          : tone === "blue"
            ? "border-indigo-300/30 bg-indigo-500/10 text-indigo-700"
            : "border-slate-300/30 bg-slate-500/10 text-slate-700";
  return <span className={cn("rounded-full border px-2 py-0.5 text-xs font-semibold", style)}>{text}</span>;
}

function SmallAction({
  label,
  icon: Icon,
  onClick,
  danger = false,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center gap-1 rounded-lg border px-2 text-xs font-semibold",
        danger ? "border-rose-300/30 bg-rose-500/10 text-rose-700" : "border-[var(--border)] text-[var(--text)]"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
