import { cn } from "@/lib/utils";
import { type ReactNode, forwardRef } from "react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  badge?: string | number;
  badgeColor?: "blue" | "accent";
  className?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, badge, badgeColor = "blue", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        suppressHydrationWarning
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none",
          className
        )}
        {...props}
      >
        {icon}
        {badge !== undefined && (
          <span className={cn(
            "absolute -right-0.5 -top-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-[#0f172a]",
            badgeColor === "blue" ? "bg-blue-600" : "bg-[var(--primary)]"
          )}>
            {badge}
          </span>
        )}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
