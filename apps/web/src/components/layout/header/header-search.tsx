import { Search } from "lucide-react";

export function HeaderSearch() {
  return (
    <label
      htmlFor="global-search"
      className="relative flex w-full max-w-[360px] items-center"
    >
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
      <input
        id="global-search"
        type="search"
        placeholder="Search anything..."
        className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/60 pl-10 pr-4 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-[var(--primary)] focus:bg-white dark:focus:bg-slate-800 focus:ring-3 focus:ring-[var(--primary)]/10"
      />
    </label>
  );
}
