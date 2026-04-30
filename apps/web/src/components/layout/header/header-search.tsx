import { Search } from "lucide-react";
import { useTenant } from "@/core/tenant/tenant-provider";

export function HeaderSearch() {
  const { tenant } = useTenant();

  return (
    <div className="group relative flex w-full max-w-[420px] items-center">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[var(--primary)]" />
      <input
        type="search"
        id="header-search"
        placeholder={`Search everything in ${tenant.displayName}...`}
        className="h-10 w-full rounded-full border border-slate-200/80 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/40 pl-10 pr-4 text-[13px] text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all duration-300 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-[var(--primary)] focus:border-transparent"
      />
    </div>
  );
}
