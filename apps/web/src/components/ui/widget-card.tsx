import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type WidgetCardProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  noPadding?: boolean;
};

export function WidgetCard({
  title,
  action,
  children,
  className,
  headerClassName,
  noPadding = false,
}: WidgetCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm",
        noPadding ? "" : "p-4",
        className
      )}
    >
      <header className={cn("flex items-center justify-between", noPadding ? "px-4 pt-4 pb-3" : "mb-3", headerClassName)}>
        <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--muted)]">
          {title}
        </h3>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      {noPadding ? children : <div>{children}</div>}
    </article>
  );
}
