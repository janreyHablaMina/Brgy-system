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
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex items-center transition-all duration-300 focus:outline-none",
          className
        )}
      >
        {trigger}
      </button>

      {open ? (
        <div
          className={cn(
            "absolute top-[calc(100%+0.75rem)] z-50 min-w-64 rounded-2xl border border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-900 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] animate-in fade-in zoom-in-95 duration-200",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {items.map((item, index) => {
            if (item.label === "Divider") {
              return item.component;
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
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-left transition-all duration-200",
              item.danger
                ? "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[var(--primary)]",
            );

            if (item.href) {
              return (
                <Link key={index} href={item.href} className={classes} onClick={() => setOpen(false)}>
                  {Icon ? <Icon className="h-4 w-4 opacity-70" /> : null}
                  {item.label}
                </Link>
              );
            }

            return (
              <button
                key={index}
                type="button"
                className={classes}
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
              >
                {Icon ? <Icon className="h-4 w-4 opacity-70" /> : null}
                {item.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
