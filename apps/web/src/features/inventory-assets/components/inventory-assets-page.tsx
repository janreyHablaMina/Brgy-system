"use client";

import { useMemo, useState } from "react";
import { Download, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/features/residents/utils";
import {
  MOCK_ASSETS,
  MOCK_ITEMS,
  MOCK_SUPPLIERS,
  MOCK_TRANSACTIONS,
} from "@/features/inventory-assets/mock-data";
import type {
  Asset,
  InventoryItem,
  InventoryTransaction,
  StockStatus,
  Supplier,
} from "@/features/inventory-assets/types";

type TabKey = "items" | "transactions" | "suppliers" | "assets";

export function InventoryAssetsPage() {
  const [tab, setTab] = useState<TabKey>("items");
  const [items] = useState<InventoryItem[]>(MOCK_ITEMS);
  const [transactions] = useState<InventoryTransaction[]>(MOCK_TRANSACTIONS);
  const [suppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [assets] = useState<Asset[]>(MOCK_ASSETS);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"All" | "Office Supplies" | "Safety">("All");
  const [statusFilter, setStatusFilter] = useState<"All" | StockStatus>("All");

  const summary = useMemo(() => {
    const total = items.length;
    const inStock = items.filter((i) => i.status === "In Stock").length;
    const low = items.filter((i) => i.status === "Low").length;
    const out = items.filter((i) => i.status === "Out of Stock").length;
    return { total, inStock, low, out };
  }, [items]);

  const filteredItems = useMemo(
    () =>
      items
        .filter((i) => (search ? i.itemName.toLowerCase().includes(search.toLowerCase()) : true))
        .filter((i) => (categoryFilter === "All" ? true : i.category === categoryFilter))
        .filter((i) => (statusFilter === "All" ? true : i.status === statusFilter)),
    [items, search, categoryFilter, statusFilter]
  );

  function resetFilters() {
    setSearch("");
    setCategoryFilter("All");
    setStatusFilter("All");
  }

  return (
    <section className="space-y-6">
      <header className="px-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text)]">Inventory & Assets Management</h1>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Track inventory, monitor stock movements, manage suppliers, and maintain long-term assets.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-white">
              <Plus className="h-4 w-4" />
              Add Item
            </button>
            <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-semibold text-[var(--text)]">
              <Download className="h-4 w-4" />
              Export Data
            </button>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Total Items" value={String(summary.total)} />
          <SummaryCard label="In Stock" value={String(summary.inStock)} />
          <SummaryCard label="Low Stock" value={String(summary.low)} />
          <SummaryCard label="Out of Stock" value={String(summary.out)} />
        </div>
      </header>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="xl:col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">Search</span>
            <div className="relative mt-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by item name..."
                className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card-soft)] pl-9 pr-3 text-sm text-[var(--text)] outline-none"
              />
            </div>
          </label>
          <SelectField
            label="Category"
            value={categoryFilter}
            options={["All", "Office Supplies", "Safety"]}
            onChange={(v) => setCategoryFilter(v as "All" | "Office Supplies" | "Safety")}
          />
          <SelectField
            label="Status"
            value={statusFilter}
            options={["All", "In Stock", "Low", "Out of Stock"]}
            onChange={(v) => setStatusFilter(v as "All" | StockStatus)}
          />
        </div>
        <div className="mt-3 flex gap-2">
          <button className="inline-flex h-9 items-center rounded-lg bg-[var(--primary)] px-3 text-sm font-semibold text-white">Apply Filters</button>
          <button onClick={resetFilters} className="inline-flex h-9 items-center rounded-lg border border-[var(--border)] px-3 text-sm font-semibold text-[var(--text)]">Reset Filters</button>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <div className="flex flex-wrap gap-2 border-b border-[var(--border)] p-3">
          <TabButton label="Items" active={tab === "items"} onClick={() => setTab("items")} />
          <TabButton label="Transactions" active={tab === "transactions"} onClick={() => setTab("transactions")} />
          <TabButton label="Suppliers" active={tab === "suppliers"} onClick={() => setTab("suppliers")} />
          <TabButton label="Assets" active={tab === "assets"} onClick={() => setTab("assets")} />
        </div>

        {tab === "items" ? (
          <div className="p-4">
            <SimpleTable
              headers={["Item Name", "Category", "Quantity / Unit", "Condition", "Status", "Location", "Actions"]}
              rows={filteredItems.map((i) => [
                i.itemName,
                i.category,
                `${i.quantity} ${i.unit}`,
                i.condition,
                i.status,
                i.location,
                "View Details / Edit Item / Delete Item",
              ])}
            />
          </div>
        ) : null}

        {tab === "transactions" ? (
          <div className="p-4">
            <div className="mb-3 flex justify-end gap-2">
              <MiniAction label="Add Transaction" />
              <MiniAction label="View History" />
            </div>
            <SimpleTable
              headers={["Date", "Item Name", "Type", "Quantity", "Remarks", "Actions"]}
              rows={transactions.map((t) => [
                formatDate(t.date),
                t.itemName,
                t.type,
                String(t.quantity),
                t.remarks,
                "View Details",
              ])}
            />
          </div>
        ) : null}

        {tab === "suppliers" ? (
          <div className="p-4">
            <div className="mb-3 flex justify-end">
              <MiniAction label="Add Supplier" />
            </div>
            <SimpleTable
              headers={["Supplier Name", "Contact Information", "Address", "Actions"]}
              rows={suppliers.map((s) => [s.supplierName, s.contactInfo, s.address, "Edit Supplier / Delete Supplier"])}
            />
          </div>
        ) : null}

        {tab === "assets" ? (
          <div className="p-4">
            <div className="mb-3 flex justify-end">
              <MiniAction label="Add Asset" />
            </div>
            <SimpleTable
              headers={["Asset Name", "Category", "Assigned To", "Condition", "Date Acquired", "Actions"]}
              rows={assets.map((a) => [
                a.assetName,
                a.category,
                a.assignedTo,
                a.condition,
                formatDate(a.dateAcquired),
                "Edit Asset / Delete Asset",
              ])}
            />
          </div>
        ) : null}
      </section>
    </section>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[var(--text)]">{value}</p>
    </article>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg px-3 py-1.5 text-xs font-semibold",
        active ? "bg-[var(--primary)] text-white" : "border border-[var(--border)] bg-[var(--card)] text-[var(--text)]"
      )}
    >
      {label}
    </button>
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

function MiniAction({ label }: { label: string }) {
  return (
    <button className="inline-flex h-8 items-center rounded-lg border border-[var(--border)] px-2 text-xs font-semibold text-[var(--text)]">
      {label}
    </button>
  );
}

function SimpleTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--card-soft)]/60">
            {headers.map((head) => (
              <th key={head} className="px-4 py-3 text-left text-xs font-semibold text-[var(--muted)]">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]/50">
          {rows.map((row, idx) => (
            <tr key={idx}>
              {row.map((cell, i) => (
                <td key={i} className={cn("px-4 py-3", i === row.length - 1 ? "text-[var(--text)]" : "text-[var(--muted)]")}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
