"use client";

import { CheckCircle2, Clock, History } from "lucide-react";
import { cn } from "@/lib/utils";

const requests = [
  { name: "Juan Dela Cruz", doc: "Clearance", time: "10m ago", status: "Pending" },
  { name: "Maria Santos", doc: "Residency Certificate", time: "25m ago", status: "Approved" },
  { name: "Antonio Luna", doc: "Indigency Certificate", time: "45m ago", status: "Pending" },
  { name: "Gabriela Silang", doc: "Business Permit", time: "1h ago", status: "Approved" },
];

function StatusBadge({ status }: { status: string }) {
  const isApproved = status === "Approved";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        isApproved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
      )}
    >
      {isApproved && <CheckCircle2 className="h-2.5 w-2.5" />}
      {status}
    </span>
  );
}

export function RecentRequests() {
  return (
    <article className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
      <header className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text)]">
          <History className="h-3.5 w-3.5 text-[var(--muted)]" />
          Recent Requests
        </h3>
        <button className="text-xs font-medium text-[var(--primary)] hover:underline">
          View all
        </button>
      </header>

      <div className="divide-y divide-[var(--border)]">
        {requests.map((item) => (
          <div
            key={`${item.name}-${item.doc}`}
            className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--card-soft)]"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--card-soft)] text-xs font-semibold text-[var(--muted)]">
              {item.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-[var(--text)]">{item.name}</p>
              <p className="truncate text-xs text-[var(--muted)]">{item.doc}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <StatusBadge status={item.status} />
              <div className="flex items-center gap-1 text-[10px] text-[var(--muted)]">
                <Clock className="h-3 w-3" />
                {item.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
