import { Search, ChevronDown, Calendar, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ResidentFilters, ResidentStatus, ResidentGender, CivilStatus, AgeGroup } from "../types";

type ResidentsFiltersProps = {
  searchInput: string;
  setSearchInput: (val: string) => void;
  filters: ResidentFilters;
  setFilters: (updater: (prev: ResidentFilters) => ResidentFilters) => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (val: boolean) => void;
  resetFilters: () => void;
  activeFilterItems: { id: keyof ResidentFilters; label: string }[];
  removeFilter: (id: keyof ResidentFilters) => void;
};

const STATUS_OPTIONS: Array<"All" | ResidentStatus> = ["All", "Active", "Inactive", "Deceased"];
const GENDER_OPTIONS: Array<"All" | ResidentGender> = ["All", "Male", "Female", "LGBTQIA+", "Other"];
const CIVIL_STATUS_OPTIONS: Array<"All" | CivilStatus> = ["All", "Single", "Married", "Widowed", "Separated"];
const AGE_GROUP_OPTIONS: Array<"All" | AgeGroup> = ["All", "Child", "Adult", "Senior"];

function SelectFilter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="px-1 text-[11px] font-bold text-[var(--text)]">{label}</span>
      <div className="group relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 pr-8 text-[13px] font-medium text-[var(--text)] outline-none transition hover:bg-[var(--card-soft)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)] transition-colors group-focus-within:text-[var(--primary)]" />
      </div>
    </div>
  );
}

function CheckboxFilter({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 transition hover:bg-[var(--card-soft)]">
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer h-4 w-4 appearance-none rounded-[4px] border border-[var(--muted)]/40 bg-[var(--card)] transition checked:border-[var(--primary)] checked:bg-[var(--primary)]"
        />
        <svg
          className="pointer-events-none absolute h-3 w-3 text-white opacity-0 transition peer-checked:opacity-100"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-[13px] font-medium text-[var(--text)]">{label}</span>
    </label>
  );
}

export function ResidentsFilters({
  searchInput,
  setSearchInput,
  filters,
  setFilters,
  showAdvancedFilters,
  setShowAdvancedFilters,
  resetFilters,
  activeFilterItems,
  removeFilter,
}: ResidentsFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-none">
        {/* Row 1: Search & Primary Selects */}
        <div className="grid gap-4 md:grid-cols-12 items-end">
          {/* Search Segment */}
          <div className="md:col-span-4 flex flex-col gap-1.5 group">
            <span className="px-1 text-[11px] font-bold text-[var(--text)]">Search Registry</span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)] transition-colors group-focus-within:text-[var(--primary)]" />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search name, address, or resident ID..."
                className="h-9 w-full rounded-lg border border-[var(--border)] bg-transparent pl-9 pr-4 text-[13px] text-[var(--text)] outline-none transition hover:bg-[var(--card-soft)] focus:border-[var(--primary)] focus:bg-[var(--card)] focus:ring-1 focus:ring-[var(--primary)] placeholder:text-[var(--muted)]/50"
              />
            </div>
          </div>
          
          <div className="md:col-span-2">
            <SelectFilter
              label="Status"
              value={filters.status}
              onChange={(value) => setFilters((prev) => ({ ...prev, status: value as ResidentFilters["status"] }))}
              options={STATUS_OPTIONS}
            />
          </div>
          <div className="md:col-span-2">
            <SelectFilter
              label="Gender"
              value={filters.gender}
              onChange={(value) => setFilters((prev) => ({ ...prev, gender: value as ResidentFilters["gender"] }))}
              options={GENDER_OPTIONS}
            />
          </div>
          <div className="md:col-span-2">
            <SelectFilter
              label="Civil Status"
              value={filters.civilStatus}
              onChange={(value) => setFilters((prev) => ({ ...prev, civilStatus: value as ResidentFilters["civilStatus"] }))}
              options={CIVIL_STATUS_OPTIONS}
            />
          </div>
          <div className="md:col-span-2 flex justify-end h-9">
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={cn(
                "flex h-9 w-full items-center justify-center gap-2 rounded-lg border px-3 text-[13px] font-semibold transition-colors focus:outline-none",
                showAdvancedFilters
                  ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "border-transparent bg-[var(--primary)]/5 text-[var(--primary)] hover:bg-[var(--primary)]/10"
              )}
            >
              <Filter className="h-4 w-4" /> 
              Filters ({activeFilterItems.length} applied)
              <ChevronDown className={cn("h-4 w-4 transition-transform", showAdvancedFilters && "rotate-180")} />
            </button>
          </div>
        </div>

        {/* Expanded Advanced Filters */}
        <div
          className={cn(
            "grid transition-all duration-300 ease-in-out",
            showAdvancedFilters ? "mt-5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <div className="rounded-xl bg-[var(--primary)]/[0.02] border border-[var(--primary)]/[0.05] p-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
                <div className="md:col-span-2">
                  <SelectFilter
                    label="Age Group"
                    value={filters.ageGroup}
                    onChange={(value) => setFilters((prev) => ({ ...prev, ageGroup: value as ResidentFilters["ageGroup"] }))}
                    options={AGE_GROUP_OPTIONS}
                  />
                </div>

                <div className="md:col-span-4 grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5 group">
                    <span className="px-1 text-[11px] font-bold text-[var(--text)]">Date From</span>
                    <div className="relative">
                      <input
                        type="date"
                        value={filters.registeredFrom}
                        onChange={(e) => setFilters((prev) => ({ ...prev, registeredFrom: e.target.value }))}
                        className="h-9 w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-[13px] text-[var(--text)] outline-none transition hover:bg-[var(--card-soft)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] [&::-webkit-calendar-picker-indicator]:opacity-50"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 group">
                    <span className="px-1 text-[11px] font-bold text-[var(--text)]">Date To</span>
                    <div className="relative">
                      <input
                        type="date"
                        value={filters.registeredTo}
                        onChange={(e) => setFilters((prev) => ({ ...prev, registeredTo: e.target.value }))}
                        className="h-9 w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-[13px] text-[var(--text)] outline-none transition hover:bg-[var(--card-soft)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] [&::-webkit-calendar-picker-indicator]:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-3 flex flex-col gap-1.5">
                  <span className="px-1 text-[11px] font-bold text-[var(--text)]">Demographics</span>
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    <CheckboxFilter
                      label="Senior"
                      checked={filters.seniorOnly}
                      onChange={(checked) => setFilters((prev) => ({ ...prev, seniorOnly: checked }))}
                    />
                    <CheckboxFilter
                      label="PWD"
                      checked={filters.pwdOnly}
                      onChange={(checked) => setFilters((prev) => ({ ...prev, pwdOnly: checked }))}
                    />
                    <CheckboxFilter
                      label="Voter"
                      checked={filters.voterOnly}
                      onChange={(checked) => setFilters((prev) => ({ ...prev, voterOnly: checked }))}
                    />
                  </div>
                </div>

                <div className="md:col-span-3 flex flex-col gap-1.5">
                  <span className="px-1 text-[11px] font-bold text-[var(--text)]">Bulk Status Change</span>
                  <div className="group relative">
                    <select
                      className="h-9 w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 pr-8 text-[13px] font-medium text-[var(--muted)] outline-none transition hover:bg-[var(--card-soft)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                      defaultValue=""
                    >
                      <option value="" disabled>Select status</option>
                      {STATUS_OPTIONS.filter(o => o !== "All").map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)] transition-colors group-focus-within:text-[var(--primary)]" />
                  </div>
                  
                  <div className="flex items-end justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="h-9 rounded-lg border border-[var(--primary)]/30 px-6 text-[13px] font-semibold text-[var(--primary)] transition hover:bg-[var(--primary)]/5"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAdvancedFilters(false)}
                      className="h-9 rounded-lg bg-[var(--primary)] px-6 text-[13px] font-semibold text-white transition hover:brightness-110 shadow-sm"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
