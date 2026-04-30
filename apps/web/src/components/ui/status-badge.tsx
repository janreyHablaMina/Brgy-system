import { cn } from "@/lib/utils";

type StatusTone = "success" | "warning" | "danger" | "info" | "accent" | "neutral" | "new";

type StatusBadgeProps = {
  label: string;
  tone?: StatusTone;
  className?: string;
  dot?: boolean;
};

const toneStyles: Record<StatusTone, string> = {
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  danger: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
  info: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  accent: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  neutral: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  new: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
};

const dotColors: Record<StatusTone, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
  info: "bg-blue-500",
  accent: "bg-violet-500",
  neutral: "bg-slate-400",
  new: "bg-rose-500",
};

export function StatusBadge({ label, tone = "neutral", className, dot = false }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        toneStyles[tone],
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dotColors[tone])} />}
      {label}
    </span>
  );
}
