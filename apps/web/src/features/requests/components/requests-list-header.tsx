"use client";

import { Download, Inbox, Plus, BadgeAlert, Clock, ArrowRightLeft, CheckCircle2, XCircle } from "lucide-react";
import { RequestSummaryCard } from "./request-summary-card";

interface RequestsListHeaderProps {
  metrics: {
    total: number;
    new: number;
    pending: number;
    processing: number;
    approved: number;
    rejected: number;
  };
  onExport: () => void;
  onNewRequest: () => void;
}

export function RequestsListHeader({
  metrics,
  onExport,
  onNewRequest,
}: RequestsListHeaderProps) {
  return (
    <header className="px-1">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Requests Management</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Manage all incoming service requests, process approvals, and track workflow status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExport}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] px-4 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--card-soft)] hover:border-[var(--primary)]/40"
          >
            <Download className="h-4 w-4 text-[var(--primary)]" />
            Export Report
          </button>
          <button
            type="button"
            onClick={onNewRequest}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white transition hover:brightness-110 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New Request
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <RequestSummaryCard 
          icon={Inbox} 
          label="Total Requests" 
          value={metrics.total} 
          tone="blue" 
          viewAllText="View all requests" 
        />
        <RequestSummaryCard 
          icon={BadgeAlert} 
          label="New Requests" 
          value={metrics.new} 
          tone="amber" 
          viewAllText="View new" 
        />
        <RequestSummaryCard 
          icon={Clock} 
          label="Pending Review" 
          value={metrics.pending} 
          tone="violet" 
          viewAllText="View pending" 
        />
        <RequestSummaryCard 
          icon={ArrowRightLeft} 
          label="In Processing" 
          value={metrics.processing} 
          tone="indigo" 
          viewAllText="View processing" 
        />
        <RequestSummaryCard 
          icon={CheckCircle2} 
          label="Approved" 
          value={metrics.approved} 
          tone="emerald" 
          viewAllText="View approved" 
        />
        <RequestSummaryCard 
          icon={XCircle} 
          label="Rejected" 
          value={metrics.rejected} 
          tone="rose" 
          viewAllText="View rejected" 
        />
      </div>
    </header>
  );
}
