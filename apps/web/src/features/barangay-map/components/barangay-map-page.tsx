"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { RefreshCcw, Search } from "lucide-react";

type ResidentPin = {
  id: string;
  fullName: string;
  address: string;
  purok: string;
  status: "Active" | "Inactive" | "Transferred";
  lat?: number;
  lng?: number;
};

const RESIDENT_PINS: ResidentPin[] = [
  { id: "RES-2026-0001", fullName: "Maria Lopez Santos", address: "Purok 1, Brgy. Salaza", purok: "Purok 1", status: "Active", lat: 14.60321, lng: 120.9872 },
  { id: "RES-2026-0002", fullName: "Juan Reyes Dela Cruz", address: "Purok 2, Brgy. Salaza", purok: "Purok 2", status: "Active", lat: 14.60114, lng: 120.99033 },
  { id: "RES-2026-0003", fullName: "Ana Garcia Reyes", address: "Purok 3, Brgy. Salaza", purok: "Purok 3", status: "Inactive", lat: 14.59892, lng: 120.98281 },
  { id: "RES-2026-0004", fullName: "Pedro Cruz Luna", address: "Purok 1, Brgy. Salaza", purok: "Purok 1", status: "Transferred" },
];

function pinColor(status: ResidentPin["status"]) {
  if (status === "Active") return "#16a34a";
  if (status === "Inactive") return "#6b7280";
  return "#eab308";
}

export function BarangayMapPage() {
  const mapId = useId().replace(/:/g, "");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ResidentPin["status"]>("All");
  const [purokFilter, setPurokFilter] = useState<"All" | "Purok 1" | "Purok 2" | "Purok 3">("All");
  const [refreshToken, setRefreshToken] = useState(0);

  const filteredResidents = useMemo(
    () =>
      RESIDENT_PINS.filter((r) =>
        search ? r.fullName.toLowerCase().includes(search.toLowerCase()) : true
      )
        .filter((r) => (statusFilter === "All" ? true : r.status === statusFilter))
        .filter((r) => (purokFilter === "All" ? true : r.purok === purokFilter)),
    [search, statusFilter, purokFilter]
  );

  const stats = useMemo(() => {
    const totalResidents = RESIDENT_PINS.length;
    const mappedResidents = RESIDENT_PINS.filter((r) => typeof r.lat === "number" && typeof r.lng === "number").length;
    const unmappedResidents = totalResidents - mappedResidents;
    const coverage = totalResidents ? Math.round((mappedResidents / totalResidents) * 100) : 0;
    return { totalResidents, mappedResidents, unmappedResidents, coverage };
  }, []);

  useEffect(() => {
    let disposed = false;
    const cssId = "leaflet-css-cdn";
    const jsId = "leaflet-js-cdn";

    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    function initMap() {
      if (disposed) return;
      const L = (window as { L?: unknown }).L as
        | {
            map: (id: string) => { setView: (coords: [number, number], zoom: number) => unknown; remove: () => void };
            tileLayer: (url: string, opts: Record<string, unknown>) => { addTo: (map: unknown) => void };
            divIcon: (opts: Record<string, unknown>) => unknown;
            marker: (coords: [number, number], opts?: Record<string, unknown>) => {
              addTo: (map: unknown) => {
                bindPopup: (html: string) => void;
              };
            };
          }
        | undefined;
      if (!L) return;

      const map = L.map(mapId).setView([14.5995, 120.9842], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      filteredResidents
        .filter((r) => typeof r.lat === "number" && typeof r.lng === "number")
        .forEach((resident) => {
          const color = pinColor(resident.status);
          const icon = L.divIcon({
            className: "",
            html: `<div style="width:14px;height:14px;border-radius:999px;background:${color};border:2px solid white;box-shadow:0 0 0 2px ${color};"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
          });
          L.marker([resident.lat as number, resident.lng as number], { icon })
            .addTo(map)
            .bindPopup(
              `<div style="min-width:220px">
                <strong>${resident.fullName}</strong><br/>
                <span>${resident.address}</span><br/>
                <span>Status: ${resident.status}</span><br/>
                <a href="/residents" style="color:#3C50E0;font-weight:600;">View Profile</a>
              </div>`
            );
        });

      return () => map.remove();
    }

    let teardown: (() => void) | undefined;
    const existingScript = document.getElementById(jsId) as HTMLScriptElement | null;
    if ((window as { L?: unknown }).L) {
      teardown = initMap();
    } else if (existingScript) {
      existingScript.addEventListener("load", () => {
        teardown = initMap();
      });
    } else {
      const script = document.createElement("script");
      script.id = jsId;
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = () => {
        teardown = initMap();
      };
      document.body.appendChild(script);
    }

    return () => {
      disposed = true;
      if (teardown) teardown();
    };
  }, [mapId, filteredResidents, refreshToken]);

  return (
    <section className="space-y-6">
      <header className="px-1">
        <h1 className="text-2xl font-semibold text-[var(--text)]">Barangay Map</h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Static address-based resident mapping for location visualization and coverage monitoring.
        </p>
      </header>

      <section className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
          <div className="mb-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="xl:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Search Resident</span>
              <div className="relative mt-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search resident name..."
                  className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] pl-9 pr-3 text-sm text-[var(--text)] outline-none"
                />
              </div>
            </label>
            <SelectField
              label="Status"
              value={statusFilter}
              options={["All", "Active", "Inactive", "Transferred"]}
              onChange={(v) => setStatusFilter(v as "All" | ResidentPin["status"])}
            />
            <SelectField
              label="Purok"
              value={purokFilter}
              options={["All", "Purok 1", "Purok 2", "Purok 3"]}
              onChange={(v) => setPurokFilter(v as "All" | "Purok 1" | "Purok 2" | "Purok 3")}
            />
          </div>
          <div className="mb-3 flex justify-end">
            <button
              onClick={() => setRefreshToken((t) => t + 1)}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] px-3 text-xs font-semibold text-[var(--text)]"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Refresh Map
            </button>
          </div>
          <div id={mapId} className="h-[520px] w-full overflow-hidden rounded-xl border border-[var(--border)]" />
        </div>

        <aside className="space-y-3">
          <StatCard label="Total Residents" value={String(stats.totalResidents)} />
          <StatCard label="Mapped Residents" value={String(stats.mappedResidents)} />
          <StatCard label="Unmapped Residents" value={String(stats.unmappedResidents)} />
          <StatCard label="Coverage %" value={`${stats.coverage}%`} />

          <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
            <p className="text-xs font-semibold text-[var(--text)]">Legend</p>
            <div className="mt-2 space-y-1 text-xs text-[var(--muted)]">
              <LegendItem color="#16a34a" label="Active" />
              <LegendItem color="#6b7280" label="Inactive" />
              <LegendItem color="#eab308" label="Transferred" />
            </div>
          </article>

          <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
            <p className="text-xs font-semibold text-[var(--text)]">Quick Actions</p>
            <div className="mt-2 space-y-2">
              <Link
                href="/residents/new"
                className="inline-flex h-8 w-full items-center justify-center rounded-lg border border-[var(--border)] text-xs font-semibold text-[var(--text)]"
              >
                Add / Update Resident Location
              </Link>
              <Link
                href="/residents"
                className="inline-flex h-8 w-full items-center justify-center rounded-lg border border-[var(--border)] text-xs font-semibold text-[var(--text)]"
              >
                View Resident Profiles
              </Link>
            </div>
          </article>
        </aside>
      </section>
    </section>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label>
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-3 text-sm text-[var(--text)] outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{value}</p>
    </article>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}
