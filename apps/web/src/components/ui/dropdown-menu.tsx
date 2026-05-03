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

import { createPortal } from "react-dom";

export function DropdownMenu({ trigger, items, align = "right", className }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, right: 0, width: 0, openUp: false });
  const [mounted, setMounted] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openMenu = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const menuHeight = items.length * 40 + 20; 
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUp = spaceBelow < menuHeight && rect.top > menuHeight;

      setCoords({
        top: openUp ? rect.top : rect.bottom,
        left: rect.left,
        right: window.innerWidth - rect.right,
        width: rect.width,
        openUp,
      });
      setOpen(true);
    }
  };

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

    function handleScroll() {
      setOpen(false);
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      window.addEventListener("scroll", handleScroll, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  const menuContent = open && mounted ? createPortal(
    <div
      style={{
        position: "fixed",
        top: coords.openUp ? "auto" : `${coords.top + 8}px`,
        bottom: coords.openUp ? `${window.innerHeight - coords.top + 8}px` : "auto",
        ...(align === "right" 
          ? { right: `${coords.right}px` } 
          : { left: `${coords.left}px` }),
        zIndex: 99999,
      }}
      className={cn(
        "min-w-52 rounded-xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200",
        coords.openUp ? "slide-in-from-bottom-2" : "slide-in-from-top-2"
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
            ? "text-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-500/20"
            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[var(--primary)] dark:hover:text-white",
          item.disabled ? "cursor-not-allowed opacity-50 pointer-events-none" : "",
          item.className,
        );

        const content = (
          <>
            {/* Left accent line on hover */}
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-[var(--primary)] opacity-0 transition-all duration-300 group-hover/item:opacity-100" />
            
            {Icon ? (
              <Icon className="h-3.5 w-3.5 opacity-70 transition-transform duration-300 group-hover/item:scale-110 group-hover/item:opacity-100" />
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
    </div>,
    document.body
  ) : null;

  return (
    <div className="relative inline-block" ref={wrapperRef}>
      <div
        ref={triggerRef}
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            open ? setOpen(false) : openMenu();
          }
        }}
        className={cn("inline-flex items-center transition-all duration-300 focus:outline-none", className)}
      >
        {trigger}
      </div>
      {menuContent}
    </div>
  );
}
