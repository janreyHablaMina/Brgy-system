"use client";

import { UserCircle2, FileCheck, UserPlus, Info } from "lucide-react";

const staff = [
  {
    name: "Maria Santos",
    role: "Process Officer",
    output: "12 documents processed",
    icon: FileCheck,
    color: "var(--primary)"
  },
  {
    name: "Juan Dela Cruz",
    role: "Registrar",
    output: "5 residents added",
    icon: UserPlus,
    color: "#10B981"
  }
];

export function StaffActivity() {
  return (
    <article className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800/50 px-6 py-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-200">
          <UserCircle2 className="h-5 w-5 text-slate-400" />
          Staff Accountability
        </h2>
        <Info className="h-4 w-4 text-slate-300" />
      </div>

      <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
        {staff.map((member, idx) => {
          const Icon = member.icon;
          return (
            <div key={idx} className="flex items-center gap-4 px-6 py-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/20">
              <div className="relative">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <span className="text-sm font-bold text-slate-400 uppercase">{member.name.charAt(0)}</span>
                </div>
                <div 
                  className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white dark:border-slate-900 shadow-sm"
                  style={{ backgroundColor: member.color }}
                >
                  <Icon className="h-3 w-3 text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 dark:text-white truncate">{member.name}</p>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <span>{member.role}</span>
                  <span className="h-0.5 w-0.5 rounded-full bg-slate-300" />
                  <span className="text-[var(--primary)]">{member.output}</span>
                </div>
              </div>
              
              <button className="rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all">
                Details
              </button>
            </div>
          );
        })}
      </div>
    </article>
  );
}
