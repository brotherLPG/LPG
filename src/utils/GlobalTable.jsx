import React, { useEffect, useState } from "react";
import { Pagination, Table } from "@heroui/react";

const GlobalTable = ({
  columns = [],
  data = [],
  pagination = false,
  rowsPerPage = 5,
  ariaLabel = "Table",
  className = "",
  rowClassName = "border-b border-slate-100 last:border-b-0 hover:bg-slate-50",
  emptyContent = "No data available",
}) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  useEffect(() => {
    setPage(1);
  }, [data.length, rowsPerPage]);

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const startIndex = (page - 1) * rowsPerPage;

  const paginatedData = pagination
    ? data.slice(startIndex, startIndex + rowsPerPage)
    : data;

  const start = data.length === 0 ? 0 : startIndex + 1;

  const end =
    data.length === 0 ? 0 : Math.min(startIndex + rowsPerPage, data.length);

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <Table
      aria-label={ariaLabel}
      className={`px-3 pb-3 pt-2 bg-white ${className} w-full  h-[350px] max-h-[350px] overflow-auto `}
    >
      <Table.ScrollContainer className="overflow-x-auto">
        <Table.Content className="min-w-[1200px]">
          {/* Header */}
          <Table.Header className="bg-white">
            {columns.map((column) => (
              <Table.Column
                key={column.key}
                isRowHeader={column.isRowHeader || false}
                className={`
                  px-2
                  py-1.5
                  text-left
                  font-bold
                  text-tertiary
                  ${column.className || ""}
                `}
              >
                {column.label}
              </Table.Column>
            ))}
          </Table.Header>

          {/* Body */}
          <Table.Body items={paginatedData} emptyContent={emptyContent}>
            {(item) => (
              <Table.Row key={item.id || item.key} className={rowClassName}>
                {columns.map((column) => (
                  <Table.Cell
                    key={column.key}
                    className={`px-2 py-2 ${column.cellClassName || ""}`}
                  >
                    {column.renderCell ? (
                      column.renderCell(item)
                    ) : (
                      <span className="text-[12px] text-tertiary">
                        {item[column.key]}
                      </span>
                    )}
                  </Table.Cell>
                ))}
              </Table.Row>
            )}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>

      {/* Pagination OUTSIDE Table.Content */}
      {pagination && data.length > 0 && (
        <Table.Footer>
          <Pagination size="sm">
            <Pagination.Summary>
              {start} to {end} of {data.length} results
            </Pagination.Summary>

            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous
                  isDisabled={page === 1}
                  onPress={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <Pagination.PreviousIcon />
                  Prev
                </Pagination.Previous>
              </Pagination.Item>

              {pages.map((p) => (
                <Pagination.Item key={p}>
                  <Pagination.Link
                    isActive={p === page}
                    onPress={() => setPage(p)}
                    className={p === page ? "bg-[#0f4bb8] text-white" : ""}
                  >
                    {p}
                  </Pagination.Link>
                </Pagination.Item>
              ))}

              <Pagination.Item>
                <Pagination.Next
                  isDisabled={page === totalPages}
                  onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </Table.Footer>
      )}
    </Table>
  );
};

export default GlobalTable;
