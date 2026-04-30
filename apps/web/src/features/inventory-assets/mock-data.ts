import type { Asset, InventoryItem, InventoryTransaction, Supplier } from "./types";

export const MOCK_ITEMS: InventoryItem[] = [
  {
    id: "ITM-001",
    itemName: "Bond Paper A4",
    category: "Office Supplies",
    quantity: 40,
    unit: "reams",
    condition: "Good",
    status: "In Stock",
    location: "Storage Room A",
  },
  {
    id: "ITM-002",
    itemName: "Printer Ink (Black)",
    category: "Office Supplies",
    quantity: 3,
    unit: "cartridges",
    condition: "Good",
    status: "Low",
    location: "Storage Room A",
  },
  {
    id: "ITM-003",
    itemName: "Emergency Flashlights",
    category: "Safety",
    quantity: 0,
    unit: "units",
    condition: "Damaged",
    status: "Out of Stock",
    location: "Tanod Office",
  },
];

export const MOCK_TRANSACTIONS: InventoryTransaction[] = [
  {
    id: "TRX-001",
    date: "2026-04-25",
    itemName: "Bond Paper A4",
    type: "IN",
    quantity: 20,
    remarks: "Purchased from approved supplier",
  },
  {
    id: "TRX-002",
    date: "2026-04-27",
    itemName: "Bond Paper A4",
    type: "OUT",
    quantity: 8,
    remarks: "Used for resident certificate printing",
  },
  {
    id: "TRX-003",
    date: "2026-04-28",
    itemName: "Printer Ink (Black)",
    type: "OUT",
    quantity: 2,
    remarks: "Consumed by frontdesk printing unit",
  },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: "SUP-001",
    supplierName: "Metro Office Depot",
    contactInfo: "0917-555-0134 / sales@metrooffice.ph",
    address: "City Proper, Main Ave, Building 12",
  },
  {
    id: "SUP-002",
    supplierName: "Barangay Hardware Hub",
    contactInfo: "0928-440-8821 / bhh@example.com",
    address: "Market Road, Purok 2",
  },
];

export const MOCK_ASSETS: Asset[] = [
  {
    id: "AST-001",
    assetName: "Desktop Computer Unit #1",
    category: "IT Equipment",
    assignedTo: "Frontdesk",
    condition: "Good",
    dateAcquired: "2025-08-12",
  },
  {
    id: "AST-002",
    assetName: "Motorcycle Patrol Unit",
    category: "Transportation",
    assignedTo: "Tanod Team Alpha",
    condition: "Good",
    dateAcquired: "2024-11-05",
  },
  {
    id: "AST-003",
    assetName: "Public Address Speaker",
    category: "Communications",
    assignedTo: "Barangay Hall",
    condition: "Damaged",
    dateAcquired: "2023-06-20",
  },
];
