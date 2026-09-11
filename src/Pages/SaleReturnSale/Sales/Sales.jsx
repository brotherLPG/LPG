import React, { useState, useMemo } from "react";
import { DollarSign, CreditCard, Search, CirclePlus, TrendingUp, ArrowLeft, Eye, Edit3 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import GlobalTable from "../../../utils/GlobalTable";
import { useSales } from "../../../queries/sales/sales.queries";
import Returnsales from "../ReturnSales/Returnsales";
import { usePermissions } from "../../../contexts/PermissionContext";

function Sales() {
  const navigate = useNavigate();
  const { can } = usePermissions();
  // const [activeTab, setActiveTab] = useState("sales");
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "sales";
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("All");
  const [saleStatus, setSaleStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  const params = {
    page,
    limit: 20,
    ...(searchTerm && { search: searchTerm }),
    ...(saleStatus && { saleStatus }),
    ...(paymentStatus && { paymentStatus }),
    ...(customerId && { customerId }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };

  const { data: salesData, isLoading } = useSales(params);

  const sales = salesData?.data?.items || [];
  const pagination = salesData?.data?.pagination || { total: 0, totalPages: 0, page: 1, limit: 20 };
  const summary = salesData?.data?.summary || {
    todaySalesAmount: 0,
    todaySalesCount: 0,
    cashSalesAmount: 0,
    cashSalesCount: 0,
    creditSalesAmount: 0,
    creditSalesCount: 0,
    pendingCreditAmount: 0,
  };
  const meta = salesData?.data?.meta || {
    saleTypes: [],
    paymentStatuses: [],
    saleStatuses: [],
  };

  const summaryStats = {
    total: summary.todaySalesAmount,
    cash: summary.cashSalesAmount,
    credit: summary.creditSalesAmount,
    pendingCredit: summary.pendingCreditAmount,
    totalCount: summary.todaySalesCount,
    cashCount: summary.cashSalesCount,
    creditCount: summary.creditSalesCount,
  };

  // Column definitions for sales table
  const salesColumns = [
    {
      key: "saleNumber",
      label: "Sale Number",
      isRowHeader: true,
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap text-nowrap",
      cellClassName: "px-4 py-4 whitespace-nowrap text-nowrap",
      renderCell: (item) => (
        <span className="font-bold text-slate-800 text-[13px]">
          {item.saleNumber}
        </span>
      ),
    },
    {
      key: "invoiceNumber",
      label: "Invoice Number",
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
      key: "saleTypeLabel",
      label: "Type",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap text-nowrap",
      cellClassName: "px-4 py-4 whitespace-nowrap text-nowrap",
      renderCell: (item) => {
        const typeStyles = {
          Cash: "bg-emerald-50 text-emerald-600 border border-emerald-100",
          Credit: "bg-blue-50 text-blue-600 border border-blue-100",
        };
        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeStyles[item.saleTypeLabel] || "bg-slate-50 text-slate-600 border border-slate-100"}`}
          >
            {item.saleTypeLabel}
          </span>
        );
      },
    },
    {
      key: "totalAmount",
      label: "Amount",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap text-nowrap",
      cellClassName: "px-4 py-4 whitespace-nowrap text-nowrap",
      renderCell: (item) => (
        <span className="text-slate-900 font-bold text-[13px]">
          PKR {item.totalAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: "itemCount",
      label: "Items",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap text-nowrap",
      cellClassName:
        "px-4 py-4 text-slate-600 text-[13px] font-medium whitespace-nowrap text-nowrap",
    },
    {
      key: "paidAmount",
      label: "Paid Amount",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap text-nowrap",
      cellClassName: "px-4 py-4 whitespace-nowrap text-nowrap",
      renderCell: (item) => (
        <span className="text-emerald-600 font-bold text-[13px]">
          PKR {item.paidAmount?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      key: "returnedAmount",
      label: "Returned Amount",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap text-nowrap",
      cellClassName: "px-4 py-4 whitespace-nowrap text-nowrap",
      renderCell: (item) => (
        <span className="text-orange-600 font-bold text-[13px]">
          PKR {item.returnedAmount?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      key: "invoiceDate",
      label: "Date",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap text-nowrap",
      cellClassName:
        "px-4 py-4 text-slate-600 text-[13px] font-medium whitespace-nowrap text-nowrap",
      renderCell: (item) => {
        const date = new Date(item.invoiceDate);
        return date.toLocaleDateString();
      },
    },
    {
      key: "paymentStatusLabel",
      label: "Payment Status",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap text-nowrap",
      cellClassName: "px-4 py-4 whitespace-nowrap text-nowrap",
      renderCell: (item) => {
        const statusStyles = {
          Paid: "bg-emerald-50 text-emerald-600 border border-emerald-100",
          Partial: "bg-amber-50 text-amber-600 border border-amber-100",
          Unpaid: "bg-red-50 text-red-600 border border-red-100",
          "Refund Due": "bg-purple-50 text-purple-600 border border-purple-100",
        };
        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[item.paymentStatusLabel] || "bg-slate-50 text-slate-600 border border-slate-100"}`}
          >
            {item.paymentStatusLabel}
          </span>
        );
      },
    },
    {
      key: "saleStatusLabel",
      label: "Sale Status",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap text-nowrap",
      cellClassName: "px-4 py-4 whitespace-nowrap text-nowrap",
      renderCell: (item) => {
        const statusStyles = {
          Confirmed: "bg-emerald-50 text-emerald-600 border border-emerald-100",
          Draft: "bg-slate-50 text-slate-600 border border-slate-100",
          "Partially Returned":
            "bg-amber-50 text-amber-600 border border-amber-100",
          Returned: "bg-blue-50 text-blue-600 border border-blue-100",
          Cancelled: "bg-red-50 text-red-600 border border-red-100",
        };
        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[item.saleStatusLabel] || "bg-slate-50 text-slate-600 border border-slate-100"}`}
          >
            {item.saleStatusLabel}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-right pr-6",
      cellClassName: "px-4 py-4 pr-6",
      renderCell: (item) => (
        <div className="flex items-center justify-end gap-3">
          {can("sales", "read") && (
          <button
            type="button"
            onClick={() => navigate(`/sales/view/${item._id}`)}
            aria-label={`View ${item.saleNumber}`}
            className="text-[#1a56db] hover:text-blue-800 transition-colors"
          >
            <Eye className="h-4 w-4" strokeWidth={2.5} />
          </button>
          )}
          {can("sales", "update") && (
          <button
            type="button"
            onClick={() => navigate(`/sales/edit/${item._id}`)}
            aria-label={`Edit ${item.saleNumber}`}
            className="text-[#008951] hover:text-emerald-800 transition-colors"
          >
            <Edit3 className="h-4 w-4" strokeWidth={2.5} />
          </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <section>
        {/* Header & Breadcrumbs */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs">
              <span
                onClick={() => navigate("/dashboard")}
                className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
              >
                Dashboard
              </span>{" "}
              <span className="px-1 text-slate-400">/</span>{" "}
              <span className="font-semibold">{activeTab === "sales" ? "Sales" : "Return Sales"}</span>
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
              {activeTab === "sales" ? "Sales Management" : "Return Sales Management"}
            </h1>
            <p className="text-sm text-tertiary">
              {activeTab === "sales" ? "Track cash and credit sales for LPG and other gases" : "Track and manage customer returns and credit notes"}
            </p>
          </div>
          <div className="flex gap-3">
            {activeTab === "sales" && can("sales", "create") && (
              <button
                type="button"
                onClick={() => navigate("/sales/add")}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#008951] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#007545]"
              >
                <CirclePlus className="h-4 w-4" strokeWidth={3} /> Add Sales
              </button>
            )}
            {can("sales-returns", "create") && (
            <button
              type="button"
              onClick={() => navigate("/sales/return")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-bg-blue px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-orange-600"
            >
              <ArrowLeft className="h-4 w-4 rotate-180" /> Create Return
            </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4 flex border-b border-slate-200">
          <button
            type="button"
            // onClick={() => setActiveTab("sales")}
            onClick={() => setSearchParams({ tab: "sales" })}
            className={`border-b-2 px-4 py-2 text-sm font-semibold ${activeTab === "sales" ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            Sales
          </button>
          <button
            type="button"
            // onClick={() => setActiveTab("returns")}
            onClick={() => setSearchParams({ tab: "returns" })}
            className={`border-b-2 px-4 py-2 text-sm font-semibold ${activeTab === "returns" ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            Return Sales
          </button>
        </div>

        {activeTab === "sales" && (
          <>
        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-tertiary">
                  Today's Sales
                </p>
                <p className="mt-2 text-2xl font-extrabold text-accent-blue">
                  PKR {summaryStats.total.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-tertiary">
                  {summaryStats.totalCount} sales
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-tertiary">
                  Cash Sales
                </p>
                <p className="mt-2 text-2xl font-extrabold text-emerald-600">
                  PKR {summaryStats.cash.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-tertiary">
                  {summaryStats.cashCount} sales
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-tertiary">
                  Credit Sales
                </p>
                <p className="mt-2 text-2xl font-extrabold text-blue-600">
                  PKR {summaryStats.credit.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-tertiary">
                  {summaryStats.creditCount} sales
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-tertiary">
                  Pending Credit
                </p>
                <p className="mt-2 text-2xl font-extrabold text-purple-600">
                  PKR {summaryStats.pendingCredit.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-slate-400">Outstanding</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-center">
            <label className="relative flex-1 col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-500 focus:border-[#008951] focus:ring-1 focus:ring-[#008951]"
                placeholder="Search by customer or invoice ID..."
              />
            </label>
            <div className="relative">
              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-48 lg:w-56"
              >
                <option value="All">Type: All</option>
                {meta.saleTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <ArrowLeft className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 rotate-180 pointer-events-none" />
            </div>
            {/* <div className="relative">
              <select
                value={saleStatus}
                onChange={(event) => setSaleStatus(event.target.value)}
                className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-48 lg:w-56"
              >
                <option value="">Sale Status: All</option>
                {meta.saleStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <ArrowLeft className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 rotate-180 pointer-events-none" />
            </div> */}
            <div className="relative">
              <select
                value={paymentStatus}
                onChange={(event) => setPaymentStatus(event.target.value)}
                className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-48 lg:w-56"
              >
                <option value="">Payment Status: All</option>
                {meta.paymentStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <ArrowLeft className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 rotate-180 pointer-events-none" />
            </div>
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
            columns={salesColumns}
            data={sales}
            ariaLabel="Sales Table"
            className=""
            rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors whitespace-nowrap text-nowrap"
            emptyContent={
              isLoading ? "Loading sales..." : "No sales match your search."
            }
            pagination={true}
            rowsPerPage={pagination.limit || 10}
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
          </>
        )}

        {activeTab === "returns" && (
          <Returnsales />
        )}
      </section>
    </main>
  );
}

export default Sales;
