"use client";

import { useEffect, useState } from "react";

export function LiveClockBadge() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const dateString = time.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-slate-200/50 bg-slate-100/50 px-4 py-2 dark:border-slate-800/50 dark:bg-slate-800/50">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
      </span>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
        {timeString} | {dateString}
      </p>
    </div>
  );
}
