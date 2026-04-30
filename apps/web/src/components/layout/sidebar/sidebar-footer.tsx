import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { DEFAULT_USER_NAME } from "@/lib/config";

type SidebarFooterProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
  userAvatarUrl?: string;
  userRole?: string;
};

export function SidebarFooter({
  collapsed,
  onToggleCollapse,
  userAvatarUrl,
  userRole = "Kapitan",
}: SidebarFooterProps) {
  return (
    <div className="mt-auto px-4 pb-6 pt-2">
      {/* Floating Profile Widget */}
      <div
        className={cn(
          "relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 transition-all duration-300",
          collapsed ? "justify-center px-2" : "px-3"
        )}
      >
        <div className="relative shrink-0">
          <Image
            src={userAvatarUrl ?? "/avatar.png"}
            alt="Janrey"
            width={34}
            height={34}
            className="rounded-full border border-white/20 object-cover"
          />
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#020817] bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        </div>

        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-black text-white leading-none">Janrey</p>
            <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-wider text-blue-200/20">
              {userRole}
            </p>
          </div>
        )}

        {!collapsed && (
          <button
            onClick={onToggleCollapse}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-blue-300/40 transition hover:bg-white/10 hover:text-white"
            aria-label="Collapse"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          onClick={onToggleCollapse}
          className="mt-3 flex w-full justify-center text-blue-300/20 hover:text-white"
          aria-label="Expand"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
