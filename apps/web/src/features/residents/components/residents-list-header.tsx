"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { ResidentsMetrics } from "./residents-metrics";

interface ResidentsListHeaderProps {
  metrics: {
    total: number;
    seniors: number;
    pwd: number;
    voters: number;
  };
}

export function ResidentsListHeader({ metrics }: ResidentsListHeaderProps) {
  return (
    <header className="px-1">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">Residents List</h1>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Manage resident profiles, tags, and records with searchable and auditable actions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/residents/new"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white transition hover:brightness-110 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Resident
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <ResidentsMetrics metrics={metrics} />
      </div>
    </header>
  );
}
