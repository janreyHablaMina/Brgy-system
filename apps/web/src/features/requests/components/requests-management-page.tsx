"use client";

import { useRequestsManagement } from "../hooks/use-requests-management";
import { RequestsListHeader } from "./requests-list-header";
import { RequestsTabs } from "./requests-tabs";
import { RequestsFilters } from "./requests-filters";
import { RequestsTableToolbar } from "./requests-table-toolbar";
import { RequestsTableView } from "./requests-table-view";
import { RequestsGridView } from "./requests-grid-view";
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
    rowsPerPage,
    setRowsPerPage,
    activeFilterItems,
    viewMode,
    setViewMode,
    
    // Handlers
    handleUpdateStatus,
    handleBulkUpdateStatus,
    resetFilters,
    toggleSelectRow,
    toggleSelectAll,
    removeFilter,
  } = useRequestsManagement();

  return (
    <div className="space-y-6">
      <RequestsListHeader 
        metrics={metrics} 
        onNewRequest={() => {}} 
      />

      <RequestsTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        metrics={metrics} 
      />

      <RequestsFilters 
        filters={filters} 
        setFilters={setFilters} 
        activeFilterCount={activeFilterItems.length}
        onReset={resetFilters} 
      />

      {/* Main Container */}
      <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-none transition-all">
        <RequestsTableToolbar 
          totalRecords={processedRequests.length}
          activeFilterItems={activeFilterItems}
          onRemoveFilter={removeFilter}
          onResetFilters={resetFilters}
          onExport={() => {}}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {viewMode === "table" ? (
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
        ) : (
          <RequestsGridView 
            requests={paginatedRequests}
            onView={setViewRequest}
          />
        )}

        <RequestsPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          safeCurrentPage={safeCurrentPage}
          rowsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      </section>

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
