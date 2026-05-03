"use client";

import { useMemo, useState, useCallback } from "react";
import { 
  Request, 
  RequestStatus, 
  RequestFilters 
} from "../types";
import { 
  MOCK_REQUESTS, 
  INITIAL_FILTERS 
} from "../constants";

export function useRequestsManagement() {
  const [requests, setRequests] = useState<Request[]>(MOCK_REQUESTS);
  const [activeTab, setActiveTab] = useState<RequestStatus | "All">("All");
  const [filters, setFilters] = useState<RequestFilters>(INITIAL_FILTERS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<keyof Request>("submittedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [viewRequest, setViewRequest] = useState<Request | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Processed Requests (Filtered & Sorted)
  const processedRequests = useMemo(() => {
    let result = requests.filter((req) => {
      const matchTab = activeTab === "All" || req.status === activeTab;
      const matchSearch =
        !filters.search ||
        req.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        req.entityName.toLowerCase().includes(filters.search.toLowerCase()) ||
        req.purpose.toLowerCase().includes(filters.search.toLowerCase());
      const matchType = filters.type === "All" || req.type === filters.type;
      const matchSource = filters.source === "All" || req.entityType === filters.source;
      const matchStaff = filters.staff === "All" || req.assignedStaff === filters.staff;
      
      const matchDateFrom = !filters.dateFrom || new Date(req.submittedAt) >= new Date(filters.dateFrom);
      const matchDateTo = !filters.dateTo || new Date(req.submittedAt) <= new Date(filters.dateTo);

      return matchTab && matchSearch && matchType && matchSource && matchStaff && matchDateFrom && matchDateTo;
    });

    result.sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      if (valA === undefined || valB === undefined) return 0;
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [requests, activeTab, filters, sortBy, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(processedRequests.length / rowsPerPage);
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);
  const paginatedRequests = useMemo(() => {
    const start = (safeCurrentPage - 1) * rowsPerPage;
    return processedRequests.slice(start, start + rowsPerPage);
  }, [processedRequests, safeCurrentPage, rowsPerPage]);

  // Metrics
  const metrics = useMemo(() => ({
    total: requests.length,
    new: requests.filter((r) => r.status === "New").length,
    pending: requests.filter((r) => r.status === "Pending").length,
    processing: requests.filter((r) => r.status === "Processing").length,
    approved: requests.filter((r) => r.status === "Approved").length,
    rejected: requests.filter((r) => r.status === "Rejected").length,
    converted: requests.filter((r) => r.status === "Converted").length,
  }), [requests]);

  // Handlers
  const handleUpdateStatus = useCallback((id: string, newStatus: RequestStatus) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status: newStatus,
            timeline: [
              ...r.timeline,
              {
                id: `evt-${r.id}-${r.timeline.length + 1}`,
                status: newStatus,
                label: `Status updated to ${newStatus}`,
                timestamp: new Date().toISOString(),
                actor: "Staff",
              },
            ],
          };
        }
        return r;
      })
    );
  }, []);

  const handleBulkUpdateStatus = useCallback((ids: string[], newStatus: RequestStatus) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (ids.includes(r.id)) {
          return {
            ...r,
            status: newStatus,
            timeline: [
              ...r.timeline,
              {
                id: `evt-${r.id}-${r.timeline.length + 1}`,
                status: newStatus,
                label: `Bulk status update to ${newStatus}`,
                timestamp: new Date().toISOString(),
                actor: "Staff",
              },
            ],
          };
        }
        return r;
      })
    );
    setSelectedIds(new Set());
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setActiveTab("All");
    setCurrentPage(1);
  }, []);

  const toggleSelectRow = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === paginatedRequests.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedRequests.map((r) => r.id)));
    }
  }, [selectedIds.size, paginatedRequests]);

  const removeFilter = useCallback((key: keyof RequestFilters) => {
    setFilters((prev) => ({ ...prev, [key]: INITIAL_FILTERS[key] }));
  }, []);

  const activeFilterItems = useMemo(() => {
    const items: { id: keyof RequestFilters; label: string }[] = [];
    if (filters.search) items.push({ id: "search", label: `Search: ${filters.search}` });
    if (filters.type !== "All") items.push({ id: "type", label: `Type: ${filters.type}` });
    if (filters.source !== "All") items.push({ id: "source", label: `Source: ${filters.source}` });
    if (filters.staff !== "All") items.push({ id: "staff", label: `Staff: ${filters.staff}` });
    if (filters.dateFrom) items.push({ id: "dateFrom", label: `From: ${filters.dateFrom}` });
    if (filters.dateTo) items.push({ id: "dateTo", label: `To: ${filters.dateTo}` });
    return items;
  }, [filters]);

  return {
    requests,
    processedRequests,
    paginatedRequests,
    metrics,
    activeTab,
    setActiveTab,
    filters,
    setFilters,
    selectedIds,
    setSelectedIds,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    viewRequest,
    setViewRequest,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,
    safeCurrentPage,
    activeFilterItems,

    // Handlers
    handleUpdateStatus,
    handleBulkUpdateStatus,
    resetFilters,
    toggleSelectRow,
    toggleSelectAll,
    removeFilter,
  };
}
