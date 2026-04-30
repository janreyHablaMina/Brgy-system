import Image from "next/image";
import { cn } from "@/lib/utils";
import type { TenantBranding } from "@/core/tenant/types";

type SidebarHeaderProps = {
  tenant: TenantBranding;
  collapsed: boolean;
};

export function SidebarHeader({ tenant, collapsed }: SidebarHeaderProps) {
  return (
    <div className={cn("border-b border-white/10 py-5", collapsed ? "px-3" : "px-5")}>
      <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "")}>
        <div className="relative shrink-0">
          <Image
            src={tenant.sealUrl ?? "/brgy-seal.png"}
            alt={`${tenant.displayName} seal`}
            width={46}
            height={46}
            className="rounded-full border-2 border-white/20 bg-white/10 object-cover shadow-lg"
          />
          {/* Online pulse ring */}
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#04122f] bg-emerald-400" />
        </div>

        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-extrabold uppercase tracking-wide text-white">
              {tenant.displayName}
            </p>
            <p className="text-[11px] text-blue-200/70">Management System</p>
          </div>
        )}
      </div>
    </div>
  );
}
