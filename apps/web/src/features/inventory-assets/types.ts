export type StockStatus = "In Stock" | "Low" | "Out of Stock";

export type ItemCondition = "Good" | "Damaged";

export type TransactionType = "IN" | "OUT";

export type InventoryItem = {
  id: string;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  condition: ItemCondition;
  status: StockStatus;
  location: string;
};

export type InventoryTransaction = {
  id: string;
  date: string;
  itemName: string;
  type: TransactionType;
  quantity: number;
  remarks: string;
};

export type Supplier = {
  id: string;
  supplierName: string;
  contactInfo: string;
  address: string;
};

export type Asset = {
  id: string;
  assetName: string;
  category: string;
  assignedTo: string;
  condition: ItemCondition;
  dateAcquired: string;
};
