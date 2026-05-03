"use client";

import { ModalLayout } from "./shared-ui";
import { TagBadge } from "./resident-card";
import type { Resident } from "../types";
import { computeAge, formatDate, getFullName } from "../utils";

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-3">
      <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-sm text-[var(--text)]">{value}</p>
    </div>
  );
}

function HistoryCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{title}</p>
      <ul className="mt-2 space-y-1 text-sm text-[var(--text)]">
        {items.length === 0 ? <li className="text-[var(--muted)]">No records.</li> : null}
        {items.map((item) => (
          <li key={item} className="rounded-xl bg-[var(--card)] px-2 py-1.5">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface ResidentDetailsModalProps {
  resident: Resident;
  onClose: () => void;
}

export function ResidentDetailsModal({
  resident,
  onClose,
}: ResidentDetailsModalProps) {
  return (
    <ModalLayout title="Resident Details" onClose={onClose}>
      <div className="grid gap-3 text-sm text-[var(--text)] md:grid-cols-2">
        <DetailLine label="Resident ID" value={resident.id} />
        <DetailLine label="Full Name" value={getFullName(resident)} />
        <DetailLine
          label="Birthdate"
          value={`${formatDate(resident.birthdate)} (${computeAge(resident.birthdate)} years old)`}
        />
        <DetailLine label="Gender" value={resident.gender} />
        <DetailLine label="Civil Status" value={resident.civilStatus} />
        <DetailLine label="Address" value={resident.address} />
        <DetailLine label="Status" value={resident.status} />
        <DetailLine label="Date Registered" value={formatDate(resident.dateRegistered)} />
        <DetailLine label="Last Updated" value={formatDate(resident.lastUpdated)} />
        <DetailLine label="Household Info" value={resident.householdInfo ?? "N/A"} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {resident.tags.senior ? <TagBadge label="Senior Citizen" /> : null}
        {resident.tags.pwd ? <TagBadge label="PWD" /> : null}
        {resident.tags.voter ? <TagBadge label="Voter" /> : null}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <HistoryCard title="Document History" items={resident.documentHistory} />
        <HistoryCard title="Request History" items={resident.requestHistory} />
      </div>
    </ModalLayout>
  );
}
