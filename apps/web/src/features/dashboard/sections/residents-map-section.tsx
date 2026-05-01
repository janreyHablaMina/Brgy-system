import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { WidgetCard } from "@/components/ui/widget-card";
import type { DashboardOverviewData } from "@/features/dashboard/types";

type ResidentsMapSectionProps = {
  cluster: DashboardOverviewData["mapCluster"];
};

export function ResidentsMapSection({ cluster }: ResidentsMapSectionProps) {
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  const residentPins = [
    { id: "r1", name: "Ana Reyes", role: "Purok 1", left: "10%", top: "28%", avatar: "/avatar.png", tooltipSide: "top" },
    { id: "r2", name: "Pedro Santos", role: "Purok 2", left: "28%", top: "62%", avatar: "/avatar.png", tooltipSide: "top" },
    { id: "r3", name: "Maria Cruz", role: "Purok 3", left: "52%", top: "72%", avatar: "/avatar.png", tooltipSide: "top" },
    { id: "r4", name: "Juan Dela Cruz", role: "Purok 4", left: "66%", top: "18%", avatar: "/avatar.png", tooltipSide: "bottom" },
    { id: "r5", name: "Liza Gomez", role: "Purok 5", left: "80%", top: "42%", avatar: "/avatar.png", tooltipSide: "top" },
  ] as const;

  return (
    <WidgetCard
      title="Residents Map"
      
      action={
        <Link
          href="/barangay-map"
          className="text-xs font-semibold text-[var(--primary)] hover:underline"
        >
          View Full Map
        </Link>
      }
    >
      <div className="relative h-[360px] overflow-hidden rounded-xl border border-[var(--border)] bg-[#edf1f4]">
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="map-grid" width="38" height="38" patternUnits="userSpaceOnUse">
              <path d="M 38 0 L 0 0 0 38" fill="none" stroke="#dfe5ea" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#map-grid)" />
          <path d="M-40 310 L820 -10" stroke="#ffffff" strokeWidth="12" opacity="0.9" />
          <path d="M-20 120 L760 420" stroke="#ffffff" strokeWidth="10" opacity="0.85" />
          <path d="M90 -40 L300 430" stroke="#ffffff" strokeWidth="8" opacity="0.8" />
          <path d="M480 -60 L620 430" stroke="#ffffff" strokeWidth="7" opacity="0.75" />
          <path d="M20 20 L780 330" stroke="#f8fafc" strokeWidth="4" opacity="0.8" />
          <rect x="40" y="30" width="120" height="70" rx="10" fill="#d8ead1" opacity="0.8" />
          <rect x="520" y="40" width="95" height="62" rx="10" fill="#d8ead1" opacity="0.75" />
          <rect x="210" y="240" width="130" height="75" rx="10" fill="#d8ead1" opacity="0.7" />
        </svg>

        <span className="absolute left-[18%] top-[20%] flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white shadow-[0_0_0_8px_rgba(16,185,129,0.16)]">
          {cluster.green}
        </span>
        <span className="absolute left-[52%] top-[38%] flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white shadow-[0_0_0_8px_rgba(245,158,11,0.16)]">
          {cluster.amber}
        </span>
        <span className="absolute left-[36%] top-[60%] flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white shadow-[0_0_0_8px_rgba(59,130,246,0.16)]">
          {cluster.blue}
        </span>
        <span className="absolute left-[72%] top-[25%] flex h-11 w-11 items-center justify-center rounded-full bg-rose-500 text-sm font-bold text-white shadow-[0_0_0_8px_rgba(244,63,94,0.16)]">
          {cluster.red}
        </span>

        {residentPins.map((pin) => (
          <div
            key={pin.id}
            className="absolute"
            style={{ left: pin.left, top: pin.top }}
            onMouseEnter={() => setHoveredPin(pin.id)}
            onMouseLeave={() => setHoveredPin(null)}
          >
            <button type="button" className="group relative block">
              <svg className="h-7 w-7 text-emerald-500 drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.3a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6z" />
              </svg>
              {hoveredPin === pin.id ? (
                <div
                  className={`surface-card absolute left-1/2 z-10 w-24 -translate-x-1/2 p-2 text-center ${
                    pin.tooltipSide === "bottom" ? "top-8" : "-top-[88px]"
                  }`}
                >
                  <div className="flex justify-center">
                  <Image
                    src={pin.avatar}
                    alt={pin.name}
                    width={30}
                    height={30}
                    className="h-7.5 w-7.5 rounded-full border border-slate-200 object-cover"
                  />
                  </div>
                  <p className="mt-1 truncate text-[11px] font-semibold leading-tight text-slate-800">{pin.name}</p>
                  {pin.tooltipSide === "bottom" ? (
                    <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-[var(--border)] bg-[var(--card)]" />
                  ) : (
                    <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-[var(--border)] bg-[var(--card)]" />
                  )}
                </div>
              ) : null}
            </button>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
