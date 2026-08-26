import React, { useState, useMemo } from "react";
import { DollarSign, CreditCard, Search, CirclePlus, TrendingUp, ArrowLeft, Eye, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GlobalTable from "../../utils/GlobalTable";

const initialSales = [
  { id: "SAL-001", invoiceId: "INV-2026-0456", customer: "Ahmed Khan", type: "Cash", amount: 12500, date: "2026-01-15", items: 5 },
  { id: "SAL-002", invoiceId: "INV-2026-0457", customer: "Fatima Ali", type: "Credit", amount: 25000, date: "2026-01-15", items: 10 },
  { id: "SAL-003", invoiceId: "INV-2026-0458", customer: "Usman Ahmed", type: "Cash", amount: 7500, date: "2026-01-14", items: 3 },
  { id: "SAL-004", invoiceId: "INV-2026-0459", customer: "Bilal Khan", type: "Credit", amount: 50000, date: "2026-01-14", items: 20 },
];

function Sales() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("All");

  const filteredSales = useMemo(() => initialSales.filter(sale => {
    const matchesSearch = sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = type === "All" || sale.type === type;
    return matchesSearch && matchesType;
  }), [searchTerm, type]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalAmount = initialSales.reduce((sum, sale) => sum + sale.amount, 0);
    const cashAmount = initialSales.filter(sale => sale.type === "Cash").reduce((sum, sale) => sum + sale.amount, 0);
    const creditAmount = initialSales.filter(sale => sale.type === "Credit").reduce((sum, sale) => sum + sale.amount, 0);
    const pendingCredit = initialSales.filter(sale => sale.type === "Credit").reduce((sum, sale) => sum + sale.amount, 0);

    return {
      total: totalAmount,
      cash: cashAmount,
      credit: creditAmount,
      pendingCredit: pendingCredit,
      totalCount: initialSales.length,
      cashCount: initialSales.filter(sale => sale.type === "Cash").length,
      creditCount: initialSales.filter(sale => sale.type === "Credit").length,
    };
  }, []);

  // Column definitions for sales table
  const salesColumns = [
    {
      key: "id",
      label: "Sale ID",
      isRowHeader: true,
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <span className="font-bold text-slate-800 text-[13px]">{item.id}</span>
      ),
    },
    {
      key: "invoiceId",
      label: "Invoice ID",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
    },
    {
      key: "customer",
      label: "Customer",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
    },
    {
      key: "type",
      label: "Type",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4",
      renderCell: (item) => {
        const typeStyles = {
          Cash: "bg-emerald-50 text-emerald-600 border border-emerald-100",
          Credit: "bg-blue-50 text-blue-600 border border-blue-100",
        };
        return (
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeStyles[item.type]}`}>
            {item.type}
          </span>
        );
      },
    },
    {
      key: "amount",
      label: "Amount",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <span className="text-slate-900 font-bold text-[13px]">PKR {item.amount.toLocaleString()}</span>
      ),
    },
    {
      key: "items",
      label: "Items",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
    },
    {
      key: "date",
      label: "Date",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
    },
    {
      key: "actions",
      label: "Actions",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-right pr-6",
      cellClassName: "px-4 py-4 pr-6",
      renderCell: (item) => (
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            aria-label={`View ${item.id}`}
            className="text-[#1a56db] hover:text-blue-800 transition-colors"
          >
            <Eye className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label={`Edit ${item.id}`}
            className="text-[#008951] hover:text-emerald-800 transition-colors"
          >
            <Edit3 className="h-4 w-4" strokeWidth={2.5} />
          </button>
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
              <span className="font-semibold">Sales</span>
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
              Sales Management
            </h1>
            <p className="text-sm text-tertiary">
              Track cash and credit sales for LPG and other gases
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/sales/add")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#008951] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#007545]"
            >
              <CirclePlus className="h-4 w-4" strokeWidth={3} /> Add Sales
            </button>
            <button
              type="button"
              onClick={() => navigate("/sales/return")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-bg-blue px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-orange-600"
            >
              <ArrowLeft className="h-4 w-4 rotate-180" /> Create Return
            </button>
          </div>
        </div>

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
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <label className="relative flex-1">
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
                <option value="Cash">Cash</option>
                <option value="Credit">Credit</option>
              </select>
              <ArrowLeft className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 rotate-180 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <GlobalTable
            columns={salesColumns}
            data={filteredSales}
            ariaLabel="Sales Table"
            className=""
            rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
            emptyContent="No sales match your search."
            pagination={true}
            rowsPerPage={5}
          />
        </div>
      </section>
    </main>
  );
}

export default Sales;
