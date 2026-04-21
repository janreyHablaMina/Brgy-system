"use client";

import { History } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    name: "Juan Dela Cruz",
    initials: "JD",
    action: "Requested Barangay Clearance",
    time: "5 mins ago",
    type: "REQUEST",
    avatarColor: "bg-indigo-600",
    badgeColor: "text-indigo-600 bg-indigo-50",
  },
  {
    name: "Ana Santos",
    initials: "AS",
    action: "Updated Registry Profile",
    time: "12 mins ago",
    type: "UPDATE",
    avatarColor: "bg-amber-500",
    badgeColor: "text-amber-600 bg-amber-50",
  },
  {
    name: "Pauline Seitz",
    initials: "PS",
    action: "Approved 12 Clearance Requests",
    time: "34 mins ago",
    type: "APPROVAL",
    avatarColor: "bg-emerald-500",
    badgeColor: "text-emerald-600 bg-emerald-50",
  },
  {
    name: "Mark Rivera",
    initials: "MR",
    action: "New Resident Registration",
    time: "48 mins ago",
    type: "REGISTRATION",
    avatarColor: "bg-blue-600",
    badgeColor: "text-blue-600 bg-blue-50",
  },
];

export function ActivityFeed() {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-slate-400" />
          <h3 className="text-sm font-bold tracking-tight text-slate-800">
            Operations Stream
          </h3>
        </div>
        <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline">
          View History
        </button>
      </header>

      <div className="grid gap-3 p-4 sm:grid-cols-2 2xl:grid-cols-4">
        {activities.map((item) => (
          <div
            key={item.name}
            className="group relative flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-4 transition-all hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5"
          >
            {/* Header: Avatar + Badge */}
            <div className="flex items-start justify-between">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white",
                  item.avatarColor
                )}
              >
                {item.initials}
              </div>
              <span
                className={cn(
                  "inline-flex rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest",
                  item.badgeColor
                )}
              >
                {item.type}
              </span>
            </div>

            {/* Body: Info */}
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {item.name}
              </p>
              <p className="text-xs text-slate-500 line-clamp-1">{item.action}</p>
            </div>

            {/* Footer: Time */}
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
              {item.time}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
