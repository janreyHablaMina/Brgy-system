import Image from "next/image";
import { cn } from "@/lib/utils";
import type { TenantBranding } from "@/core/tenant/types";

type SidebarHeaderProps = {
  tenant: TenantBranding;
  collapsed: boolean;
};

export function SidebarHeader({ tenant, collapsed }: SidebarHeaderProps) {
  return (
    <div className={cn("pt-8 pb-6", collapsed ? "px-3" : "px-5")}>
      <div className={cn("flex flex-col items-center", collapsed ? "justify-center" : "")}>
        <div className="relative shrink-0 transition-transform hover:scale-105">
          <Image
            src={tenant.sealUrl ?? "/brgy-seal.png"}
            alt={`${tenant.displayName} seal`}
            width={72}
            height={72}
            className="rounded-full border-2 border-white/10 bg-white/5 object-cover shadow-2xl shadow-black/40"
          />
          {/* Online status indicator */}
          <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-[#04122f] bg-emerald-400" />
        </div>

        {!collapsed && (
          <>
            <div className="mt-4 text-center">
              <p className="text-[15px] font-black uppercase tracking-[0.08em] text-white leading-tight">
                {tenant.displayName}
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-blue-200/40">
                Barangay Office
              </p>
            </div>
            {/* Thicker partial width separator using accent color */}
            <div className="mt-6 h-[2px] w-32 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent" />
          </>
        )}

        {collapsed && (
          <div className="mt-6 h-[2px] w-10 bg-[var(--primary)] opacity-80" />
        )}
      </div>
    </div>
  );
}
