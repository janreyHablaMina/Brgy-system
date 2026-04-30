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
  userRole = "Barangay Admin",
}: SidebarFooterProps) {
  return (
    <div className="border-t border-white/10">
      {/* User Profile Card */}
      {!collapsed && (
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="relative shrink-0">
            <Image
              src={userAvatarUrl ?? "/brgy-seal.png"}
              alt="User avatar"
              width={36}
              height={36}
              className="rounded-full border border-white/20 bg-white/10 object-cover"
            />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#04122f] bg-emerald-400" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-white leading-tight">
              {DEFAULT_USER_NAME}
            </p>
            <p className="truncate text-[11px] text-blue-200/60 leading-tight">{userRole}</p>
          </div>
        </div>
      )}

      {/* Collapsed avatar */}
      {collapsed && (
        <div className="flex justify-center py-3">
          <div className="relative">
            <Image
              src={userAvatarUrl ?? "/brgy-seal.png"}
              alt="User avatar"
              width={32}
              height={32}
              className="rounded-full border border-white/20 object-cover"
            />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#04122f] bg-emerald-400" />
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <div className={cn("pb-4", collapsed ? "px-2" : "px-4")}>
        <button
          onClick={onToggleCollapse}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl bg-white/8 px-3 py-2 text-xs font-medium text-blue-200/70 transition hover:bg-white/15 hover:text-white"
          )}
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
