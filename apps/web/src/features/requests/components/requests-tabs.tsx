"use client";

import { cn } from "@/lib/utils";
import { LayoutGrid, List } from "lucide-react";
import { STATUS_ORDER } from "../constants";
import type { RequestStatus } from "../types";

interface RequestsTabsProps {
  activeTab: RequestStatus | "All";
  onTabChange: (status: RequestStatus | "All") => void;
  metrics: Record<string, number>;
}

export function RequestsTabs({
  activeTab,
  onTabChange,
  metrics,
}: RequestsTabsProps) {
  return (
    <div className="flex flex-col gap-1 px-1">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-px">
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <TabButton 
            label="All Requests" 
            active={activeTab === "All"} 
            onClick={() => onTabChange("All")} 
          />
          <div className="h-4 w-px bg-[var(--border)] mx-2" />
          {STATUS_ORDER.map((status) => (
            <TabButton 
              key={status} 
              label={status} 
              active={activeTab === status} 
              onClick={() => onTabChange(status)} 
              count={metrics[status.toLowerCase()]}
            />
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-2 p-1 bg-[var(--card-soft)]/50 rounded-lg border border-[var(--border)]/50">
          <button className="p-1.5 rounded-md bg-[var(--card)] shadow-sm text-[var(--primary)] transition">
            <List className="h-4 w-4" />
          </button>
          <button className="p-1.5 rounded-md text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--text)] transition">
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function TabButton({ 
  label, 
  active, 
  onClick, 
  count 
}: { 
  label: string, 
  active: boolean, 
  onClick: () => void, 
  count?: number 
}) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "relative flex h-10 items-center gap-2 px-4 text-sm font-semibold transition-all whitespace-nowrap",
        active ? "text-[var(--primary)]" : "text-[var(--muted)] hover:text-[var(--text)]"
      )}
    >
      {label}
      {count !== undefined && (
        <span className={cn(
          "flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold transition-all",
          active ? "bg-[var(--primary)] text-white" : "bg-[var(--card-soft)] text-[var(--muted)]"
        )}>
          {count}
        </span>
      )}
      {active && <div className="absolute bottom-0 left-0 h-0.5 w-full bg-[var(--primary)]" />}
    </button>
  );
}
