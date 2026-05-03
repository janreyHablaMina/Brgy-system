"use client";

import { useRequestsManagement } from "../hooks/use-requests-management";
import { RequestsListHeader } from "./requests-list-header";
import { RequestsTabs } from "./requests-tabs";
import { RequestsTableToolbar } from "./requests-table-toolbar";
import { RequestsTableView } from "./requests-table-view";
import { RequestsPagination } from "./requests-pagination";
import { RequestDetailsModal } from "./request-details-modal";
import { BulkActionsBar } from "./bulk-actions-bar";

export function RequestsManagementPage() {
  const {
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
    totalPages,
    safeCurrentPage,
    
    // Handlers
    handleUpdateStatus,
    handleBulkUpdateStatus,
    resetFilters,
    toggleSelectRow,
    toggleSelectAll,
  } = useRequestsManagement();

  return (
    <div className="space-y-6 pb-20">
      <RequestsListHeader 
        metrics={metrics} 
        onExport={() => {}} 
        onNewRequest={() => {}} 
      />

      <RequestsTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        metrics={metrics} 
      />

      {/* Main Container */}
      <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-none transition-all">
        <RequestsTableToolbar 
          filters={filters} 
          setFilters={setFilters} 
          onReset={resetFilters} 
        />

        <RequestsTableView 
          requests={paginatedRequests}
          selectedIds={selectedIds}
          allVisibleSelected={selectedIds.size === paginatedRequests.length && paginatedRequests.length > 0}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelectRow={toggleSelectRow}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={(key) => {
            if (sortBy === key) {
              setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
            } else {
              setSortBy(key);
              setSortDirection("asc");
            }
          }}
          onView={setViewRequest}
          onUpdateStatus={handleUpdateStatus}
        />

        <RequestsPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          safeCurrentPage={safeCurrentPage}
          totalRecords={requests.length}
          processedCount={processedRequests.length}
          onPageChange={setCurrentPage}
        />
      </section>

      {/* Bulk Actions Overlay */}
      <BulkActionsBar 
        selectedCount={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
        onUpdateStatus={(status) => handleBulkUpdateStatus(Array.from(selectedIds), status)}
      />

      {/* Details Modal */}
      {viewRequest && (
        <RequestDetailsModal 
          request={viewRequest} 
          onClose={() => setViewRequest(null)} 
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}
