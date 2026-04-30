"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/config/navigation";

type SidebarNavItemProps = {
  item: NavItem;
  isActive: boolean;
  isOpen?: boolean;
  collapsed: boolean;
  onToggle?: () => void;
  onNavigate?: () => void;
};

const badgeColorMap: Record<string, string> = {
  blue: "bg-[var(--primary)]",
  accent: "bg-emerald-500",
};

export function SidebarNavItem({
  item,
  isActive,
  isOpen,
  collapsed,
  onToggle,
  onNavigate,
}: SidebarNavItemProps) {
  const Icon = item.icon;
  const hasChildren = Boolean(item.children?.length);

  const baseClasses = cn(
    "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
    isActive
      ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/30"
      : "text-blue-200/70 hover:bg-white/10 hover:text-white"
  );

  const iconEl = (
    <span
      className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
        isActive ? "bg-white/20 text-white" : "text-blue-300/60 group-hover:text-white"
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={isActive ? 2.5 : 2} />
    </span>
  );

  const badgeEl =
    !collapsed && item.badge ? (
      <span
        className={cn(
          "ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold text-white",
          badgeColorMap[item.badgeColor ?? "blue"] ?? "bg-[var(--primary)]"
        )}
      >
        {item.badge}
      </span>
    ) : null;

  // Collapsed: just icon, with tooltip
  if (collapsed) {
    if (hasChildren) {
      return (
        <button
          type="button"
          onClick={onToggle}
          title={item.label}
          className={baseClasses}
          aria-expanded={isOpen}
        >
          {iconEl}
        </button>
      );
    }

    return (
      <Link
        href={item.href ?? "#"}
        onClick={onNavigate}
        title={item.label}
        className={baseClasses}
      >
        {iconEl}
      </Link>
    );
  }

  // Expanded with children
  if (hasChildren) {
    return (
      <div>
        <button
          type="button"
          onClick={onToggle}
          className={baseClasses}
          aria-expanded={isOpen}
        >
          {iconEl}
          <span className="flex-1 text-left leading-none">{item.label}</span>
          {badgeEl}
          {isOpen ? (
            <ChevronUp className="ml-1 h-3.5 w-3.5 opacity-60" />
          ) : (
            <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-60" />
          )}
        </button>

        {isOpen && item.children && (
          <div className="mt-1 ml-3 space-y-0.5 border-l border-white/10 pl-4">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={onNavigate}
                className="block rounded-lg py-1.5 text-[13px] font-medium text-blue-200/60 transition hover:text-white"
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href={item.href ?? "#"} onClick={onNavigate} className={baseClasses}>
      {iconEl}
      <span className="flex-1 leading-none">{item.label}</span>
      {badgeEl}
    </Link>
  );
}
