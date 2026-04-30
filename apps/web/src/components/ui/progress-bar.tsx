import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number; // 0-100
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
  color?: string; // CSS custom color
  size?: "xs" | "sm" | "md";
  animated?: boolean;
};

const sizeMap = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2",
};

export function ProgressBar({
  value,
  className,
  trackClassName,
  fillClassName,
  color,
  size = "sm",
  animated = false,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn("w-full overflow-hidden rounded-full bg-[var(--border)]", sizeMap[size], trackClassName, className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "rounded-full transition-all duration-700 ease-out",
          sizeMap[size],
          !color && "bg-[var(--primary)]",
          animated && "animate-pulse",
          fillClassName
        )}
        style={{
          width: `${clamped}%`,
          ...(color ? { backgroundColor: color } : {}),
        }}
      />
    </div>
  );
}
