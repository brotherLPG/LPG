import React, { useState } from "react";
import { Search, Eye, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GlobalTable from "../../../utils/GlobalTable";
import { useReturnSales } from "../../../queries/returnsales/returnsales.queries";

function Returnsales() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  const params = {
    page,
    limit: 20,
    ...(searchTerm && { search: searchTerm }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };

  const { data: returnSalesData, isLoading } = useReturnSales(params);

  const returnSales = returnSalesData?.data?.items || [];
  const pagination = returnSalesData?.data?.pagination || { total: 0, totalPages: 0, page: 1, limit: 20 };

  const returnSalesColumns = [
    {
      key: "returnNumber",
      label: "Return Number",
      isRowHeader: true,
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap text-nowrap",
      cellClassName: "px-4 py-4 whitespace-nowrap text-nowrap",
      renderCell: (item) => (
        <span className="font-bold text-slate-800 text-[13px]">
          {item.returnNumber}
        </span>
      ),
    },
    {
      key: "originalInvoiceNumber",
      label: "Original Invoice",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap text-nowrap",
      cellClassName:
        "px-4 py-4 text-slate-600 text-[13px] font-medium whitespace-nowrap text-nowrap",
    },
    {
      key: "customerName",
      label: "Customer",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap text-nowrap",
      cellClassName:
        "px-4 py-4 text-slate-600 text-[13px] font-medium whitespace-nowrap text-nowrap",
    },
    {
      key: "totalReturnAmount",
      label: "Return Amount",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap text-nowrap",
      cellClassName: "px-4 py-4 whitespace-nowrap text-nowrap",
      renderCell: (item) => (
        <span className="text-orange-600 font-bold text-[13px]">
          PKR {item.totalReturnAmount?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      key: "itemCount",
      label: "Items Returned",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap text-nowrap",
      cellClassName:
        "px-4 py-4 text-slate-600 text-[13px] font-medium whitespace-nowrap text-nowrap",
    },
    {
      key: "returnReasonLabel",
      label: "Reason",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap text-nowrap",
      cellClassName:
        "px-4 py-4 text-slate-600 text-[13px] font-medium whitespace-nowrap text-nowrap",
    },
    {
      key: "returnDate",
      label: "Return Date",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap text-nowrap",
      cellClassName:
        "px-4 py-4 text-slate-600 text-[13px] font-medium whitespace-nowrap text-nowrap",
      renderCell: (item) => {
        const date = new Date(item.returnDate);
        return date.toLocaleDateString();
      },
    },
    {
      key: "adjustmentTypeLabel",
      label: "Adjustment Type",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap text-nowrap",
      cellClassName:
        "px-4 py-4 text-slate-600 text-[13px] font-medium whitespace-nowrap text-nowrap",
    },
    {
      key: "actions",
      label: "Actions",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-right pr-6",
      cellClassName: "px-4 py-4 pr-6",
      renderCell: (item) => (
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(`/sales/return/view/${item._id}`)}
            aria-label={`View ${item.returnNumber}`}
            className="text-[#1a56db] hover:text-blue-800 transition-colors"
          >
            <Eye className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => navigate(`/sales/return/edit/${item._id}`)}
            aria-label={`Edit ${item.returnNumber}`}
            className="text-[#008951] hover:text-emerald-800 transition-colors"
          >
            <Edit3 className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Filters */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-center">
          <label className="relative flex-1 col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-500 focus:border-[#008951] focus:ring-1 focus:ring-[#008951]"
              placeholder="Search by customer or return number..."
            />
          </label>
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-48 lg:w-56"
            />
          </div>
          <div>
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-48 lg:w-56"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <GlobalTable
          columns={returnSalesColumns}
          data={returnSales}
          ariaLabel="Return Sales Table"
          className=""
          rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors whitespace-nowrap text-nowrap"
          emptyContent={
            isLoading ? "Loading return sales..." : "No return sales match your search."
          }
          pagination={true}
          rowsPerPage={pagination.limit || 10}
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>
    </>
  );
}

export default Returnsales;