"use client";

import type { Resident, UserRole } from "../types";
import { ResidentCard } from "./resident-card";

interface ResidentsGridViewProps {
  residents: Resident[];
  onView: (resident: Resident) => void;
  onEdit: (resident: Resident) => void;
  onDelete: (ids: string[]) => void;
  role: UserRole;
}

export function ResidentsGridView({
  residents,
  onView,
  onEdit,
  onDelete,
  role,
}: ResidentsGridViewProps) {
  return (
    <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {residents.map((resident) => (
        <ResidentCard
          key={resident.id}
          resident={resident}
          onView={onView}
          onEdit={onEdit}
          onDelete={(id) => onDelete([id])}
          role={role}
        />
      ))}
    </div>
  );
}
