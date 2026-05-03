"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type DropdownMenuItem = {
  label: string;
  icon?: LucideIcon;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
  className?: string;
  component?: ReactNode;
};

type DropdownMenuProps = {
  trigger: ReactNode;
  items: DropdownMenuItem[];
  align?: "left" | "right";
  className?: string;
};

export function DropdownMenu({ trigger, items, align = "right", className }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen((value) => !value);
          }
        }}
        className={cn("inline-flex items-center transition-all duration-300 focus:outline-none", className)}
      >
        {trigger}
      </div>

      {open ? (
        <div
          className={cn(
            "absolute top-[calc(100%+0.5rem)] z-50 min-w-52 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/90 dark:bg-slate-900/90 p-1.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {items.map((item, index) => {
            if (item.label === "Divider") {
              return <div key={index}>{item.component}</div>;
            }

            if (item.component) {
              return (
                <div key={index} className="p-1">
                  {item.component}
                </div>
              );
            }

            const Icon = item.icon;
            const classes = cn(
              "group/item relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-left transition-all duration-200 overflow-hidden",
              item.danger
                ? "text-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-500/10"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-[var(--primary)]",
              item.disabled ? "cursor-not-allowed opacity-50 pointer-events-none" : "",
              item.className,
            );

            const content = (
              <>
                {/* Left accent line on hover */}
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-[var(--primary)] opacity-0 transition-all duration-300 group-hover/item:opacity-100" />
                
                {Icon ? (
                  <Icon className="h-3.5 w-3.5 opacity-60 transition-transform duration-300 group-hover/item:scale-110 group-hover/item:opacity-100" />
                ) : null}
                <span className="transition-transform duration-300 group-hover/item:translate-x-0.5">
                  {item.label}
                </span>
              </>
            );

            if (item.href) {
              return (
                <Link key={index} href={item.href} className={classes} onClick={() => setOpen(false)}>
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={index}
                type="button"
                disabled={item.disabled}
                className={classes}
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
              >
                {content}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
