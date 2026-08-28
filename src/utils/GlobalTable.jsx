import React, { useState, useMemo, useEffect } from "react";
import { Table } from "@heroui/react";

export default function GlobalTable({
  columns = [],
  data = [],
  ariaLabel = "Data Table",
  className = "",
  rowClassName = "border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors",
  emptyContent = "No records found.",
  pagination = false,
  rowsPerPage = 5,
  page: controlledPage,
  onPageChange,
}) {
  const [internalPage, setInternalPage] = useState(1);
  const isControlled = controlledPage !== undefined;
  const currentPage = isControlled ? controlledPage : internalPage;

  const handlePageChange = (newPage) => {
    if (!isControlled) {
      setInternalPage(newPage);
    }
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  // Reset to page 1 when data changes (unless controlled)
  useEffect(() => {
    if (!isControlled) {
      setInternalPage(1);
    }
  }, [data, isControlled]);

  // Ensure each item has a unique id for React Aria Components
  const processedData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((item, index) => {
      const id =
        item.id !== undefined && item.id !== null
          ? String(item.id)
          : item.code
          ? String(item.code)
          : item.key
          ? String(item.key)
          : item.invoice
          ? String(item.invoice)
          : `row-${index}`;
      return {
        ...item,
        id,
      };
    });
  }, [data]);

  const totalItems = processedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  // Auto-clamp current page if it exceeds totalPages
  const activePage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (activePage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalItems);

  const displayData = useMemo(() => {
    if (!pagination) return processedData;
    return processedData.slice(startIndex, startIndex + rowsPerPage);
  }, [processedData, pagination, startIndex, rowsPerPage]);

  const renderCellContent = (item, col) => {
    if (typeof col.renderCell === "function") {
      return col.renderCell(item, col);
    }
    if (typeof col.render === "function") {
      return col.render(item, col);
    }
    const val = item[col.key];
    return val !== undefined && val !== null ? val : null;
  };

  // Generate visible pagination numbers
  const pageNumbers = useMemo(() => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (activePage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (activePage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", activePage - 1, activePage, activePage + 1, "...", totalPages);
      }
    }
    return pages;
  }, [totalPages, activePage]);

  return (
    <div className={`w-full ${className}`}>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label={ariaLabel}>
            <Table.Header>
              {columns.map((col) => (
                <Table.Column
                  key={col.key}
                  id={col.key}
                  isRowHeader={col.isRowHeader}
                  className={
                    col.headerClassName ||
                    col.className ||
                    "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700"
                  }
                >
                  {col.label}
                </Table.Column>
              ))}
            </Table.Header>
            <Table.Body
              items={displayData}
              emptyContent={emptyContent}
              renderEmptyState={() => (
                <div className="py-12 text-center text-sm text-slate-500">
                  {emptyContent}
                </div>
              )}
            >
              {(item) => (
                <Table.Row
                  key={item.id}
                  id={item.id}
                  className={
                    rowClassName ||
                    "border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                  }
                >
                  {columns.map((col) => (
                    <Table.Cell
                      key={col.key}
                      id={`${item.id}-${col.key}`}
                      className={col.cellClassName || "px-4 py-3"}
                    >
                      {renderCellContent(item, col)}
                    </Table.Cell>
                  ))}
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      {/* Pagination Footer */}
      {pagination && (
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3.5 sm:px-6">
          <div className="text-xs sm:text-sm text-slate-500 font-normal">
            {totalItems > 0 ? (
              <span>
                {startIndex + 1} to {endIndex} of {totalItems} results
              </span>
            ) : (
              <span>0 of 0 results</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(Math.max(activePage - 1, 1))}
              disabled={activePage <= 1}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 disabled:opacity-40 disabled:hover:text-slate-500 disabled:cursor-not-allowed transition-colors"
            >
              <span className="text-sm font-normal">‹</span> Prev
            </button>

            {pageNumbers.map((p, idx) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-1 text-xs text-slate-400 select-none"
                >
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePageChange(p)}
                  className={`h-7 w-7 rounded-full text-xs font-semibold flex items-center justify-center transition-colors ${
                    activePage === p
                      ? "bg-[#0f4bb8] text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => handlePageChange(Math.min(activePage + 1, totalPages))}
              disabled={activePage >= totalPages}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 disabled:opacity-40 disabled:hover:text-slate-700 disabled:cursor-not-allowed transition-colors"
            >
              Next <span className="text-sm font-normal">›</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
