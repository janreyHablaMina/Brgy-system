import { ProgressBar } from "@/components/ui/progress-bar";

type SmsCreditsCardProps = {
  remaining: number;
  usedThisMonth: number;
  total: number;
};

export function SmsCreditsCard({ remaining, usedThisMonth, total }: SmsCreditsCardProps) {
  const usedPercent = Math.round((usedThisMonth / total) * 100);

  return (
    <article className="relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#4F46E5] to-[#7C3AED] p-5 text-white shadow-lg shadow-[#4F46E5]/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#4F46E5]/30 group">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-6 right-10 h-24 w-24 rounded-full bg-white/5" />

      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">
          SMS Credits
        </p>
        <button 
          suppressHydrationWarning
          className="rounded-lg bg-white/15 px-3 py-1 text-[11px] font-semibold text-white transition hover:bg-white/25"
        >
          Buy Credits
        </button>
      </div>

      {/* Main number */}
      <p className="text-5xl font-extrabold tracking-tight leading-none">
        {remaining.toLocaleString()}
      </p>
      <p className="mt-1.5 text-sm font-medium text-white/70">Credits Remaining</p>

      {/* Progress */}
      <div className="mt-5">
        <div className="h-2 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-2 rounded-full bg-white transition-all duration-700"
            style={{ width: `${usedPercent}%` }}
          />
        </div>
      </div>

      {/* Footer stats */}
      <div className="mt-3 flex justify-between text-xs font-medium text-white/60">
        <span>Used this month: {usedThisMonth.toLocaleString()} SMS</span>
        <span>Total: {total.toLocaleString()} SMS</span>
      </div>
    </article>
  );
}
