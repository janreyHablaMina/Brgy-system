"use client";

import { ResidentsFilters } from "./residents-filters";
import { useResidentsManagement } from "../hooks/use-residents-management";
import { ResidentsListHeader } from "./residents-list-header";
import { ResidentsTableToolbar } from "./residents-table-toolbar";
import { ResidentsTableView } from "./residents-table-view";
import { ResidentsGridView } from "./residents-grid-view";
import { ResidentsPagination } from "./residents-pagination";
import { ResidentFormModal } from "./resident-form-modal";
import { ResidentDetailsModal } from "./resident-details-modal";
import { EmptyState } from "./shared-ui";

export function ResidentsManagementPage() {
  const {
    role,
    residents,
    processedResidents,
    paginatedResidents,
    metrics,
    searchInput,
    setSearchInput,
    filters,
    setFilters,
    showAdvancedFilters,
    setShowAdvancedFilters,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,
    safeCurrentPage,
    selectedIds,
    allVisibleSelected,
    viewMode,
    setViewMode,
    viewResident,
    setViewResident,
    isFormOpen,
    formMode,
    formInput,
    setFormInput,
    formErrors,
    serverError,
    activeFilterItems,
    fetchError,
    setFetchError,
    
    // Handlers
    removeFilter,
    resetFilters,
    toggleSelectRow,
    toggleSelectVisibleRows,
    softDeleteByIds,
    exportResidents,
    openEditModal,
    closeFormModal,
    saveResident,
  } = useResidentsManagement();

  if (fetchError) {
    return (
      <section className="rounded-2xl border border-rose-300 bg-rose-50 p-6 text-rose-700">
        <h2 className="text-lg font-semibold">Unable to load residents</h2>
        <p className="mt-1 text-sm">{fetchError}</p>
        <button
          type="button"
          className="mt-3 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white"
          onClick={() => {
            setFetchError(null);
            // In a real app, this would trigger a re-fetch
          }}
        >
          Retry
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <ResidentsListHeader metrics={metrics} />

      <ResidentsFilters
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        filters={filters}
        setFilters={setFilters}
        showAdvancedFilters={showAdvancedFilters}
        setShowAdvancedFilters={setShowAdvancedFilters}
        resetFilters={resetFilters}
        activeFilterItems={activeFilterItems}
        removeFilter={removeFilter}
      />

      <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <ResidentsTableToolbar
          totalRecords={processedResidents.length}
          activeFilterItems={activeFilterItems}
          onRemoveFilter={removeFilter}
          onResetFilters={resetFilters}
          onExport={exportResidents}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {residents.length === 0 ? (
          <EmptyState
            title="No resident data yet"
            description="Add your first resident profile to start building the registry."
          />
        ) : processedResidents.length === 0 ? (
          <EmptyState title="No results found" description="Try a different search term or reset filters." />
        ) : (
          <>
            {viewMode === "table" ? (
              <ResidentsTableView
                residents={paginatedResidents}
                selectedIds={selectedIds}
                allVisibleSelected={allVisibleSelected}
                onToggleSelectAll={toggleSelectVisibleRows}
                onToggleSelectRow={toggleSelectRow}
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={(field) => {
                  if (sortBy === field) {
                    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
                  } else {
                    setSortBy(field);
                    setSortDirection("asc");
                  }
                }}
                onView={setViewResident}
                onEdit={openEditModal}
                onDelete={softDeleteByIds}
                role={role}
              />
            ) : (
              <ResidentsGridView
                residents={paginatedResidents}
                onView={setViewResident}
                onEdit={openEditModal}
                onDelete={softDeleteByIds}
                role={role}
              />
            )}

            <ResidentsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              safeCurrentPage={safeCurrentPage}
              rowsPerPage={rowsPerPage}
              onPageChange={setCurrentPage}
              onRowsPerPageChange={(rows) => {
                setRowsPerPage(rows);
                setCurrentPage(1);
              }}
            />
          </>
        )}
      </section>

      {isFormOpen && (
        <ResidentFormModal
          mode={formMode}
          input={formInput}
          setInput={setFormInput}
          errors={formErrors}
          serverError={serverError}
          onClose={closeFormModal}
          onSave={saveResident}
        />
      )}

      {viewResident && (
        <ResidentDetailsModal
          resident={viewResident}
          onClose={() => setViewResident(null)}
        />
      )}
    </section>
  );
}
