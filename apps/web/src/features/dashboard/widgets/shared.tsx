import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function DashboardPanel({ title, action, children, className }: { title: string; action?: string; children: ReactNode; className?: string }) {
  return (
    <article className={cn("rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4", className)}>
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-[0.06em] text-[var(--text)]">{title}</h3>
        {action ? <button className="text-xs font-semibold text-[var(--primary)]">{action}</button> : null}
      </header>
      {children}
    </article>
  );
}

export function StatusDot({ tone }: { tone: "success" | "info" | "warning" | "accent" }) {
  const toneClass = {
    success: "bg-emerald-500",
    info: "bg-blue-500",
    warning: "bg-amber-500",
    accent: "bg-violet-500",
  }[tone];

  return <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded-full", toneClass)} />;
}
