"use client";

import { FileText, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { RECENT_REQUESTS } from "@/lib/mock-data";

export function RecentRequests() {
  return (
    <article className="rounded-xl border border-slate-200 bg-white">
      <header className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
          <ClipboardList className="h-3.5 w-3.5 text-indigo-500" />
          Recent Requests
        </h2>
        <button className="text-xs font-medium text-[var(--primary)] hover:underline">
          View all
        </button>
      </header>

      <div className="divide-y divide-slate-100">
        {RECENT_REQUESTS.map((request) => (
          <div
            key={request.id}
            className="flex items-center justify-between p-3 transition-colors hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{request.resident}</p>
                <p className="text-xs text-slate-400">{request.type}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <StatusBadge status={request.status} />
              <span className="text-[10px] whitespace-nowrap text-slate-400">
                {request.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    processing: "bg-blue-50 text-blue-600 border-blue-100",
    ready: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <span
      className={cn(
        "rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
        styles[status as keyof typeof styles]
      )}
    >
      {status}
    </span>
  );
}
