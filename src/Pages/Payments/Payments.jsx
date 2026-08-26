import { PlusCircle, Eye, Edit3, Trash2, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalTable from "../../utils/GlobalTable";

const initialPayments = [
  { voucherNo: "PAY-2026-0312", date: "21 Aug 2026", party: "Islamabad Gas Agency", amount: "Rs. 50,000", method: "Bank Transfer", direction: "Inward", status: "Recorded" },
  { voucherNo: "PAY-2026-0311", date: "20 Aug 2026", party: "Pakistan Petroleum Ltd.", amount: "Rs. 125,000", method: "Cheque", direction: "Outward", status: "Recorded" },
  { voucherNo: "PAY-2026-0310", date: "19 Aug 2026", party: "Sui Northern Gas", amount: "Rs. 75,000", method: "Bank Transfer", direction: "Outward", status: "Pending" },
  { voucherNo: "PAY-2026-0309", date: "18 Aug 2026", party: "Attock Refinery Ltd.", amount: "Rs. 200,000", method: "Cash", direction: "Outward", status: "Recorded" },
  { voucherNo: "PAY-2026-0308", date: "17 Aug 2026", party: "Rawalpindi Gas Station", amount: "Rs. 45,000", method: "Bank Transfer", direction: "Inward", status: "Recorded" },
];

function Payments() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [direction, setDirection] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPayments = useMemo(() => initialPayments.filter((payment) => {
    const matchesQuery = `${payment.voucherNo} ${payment.party}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "All" || payment.status === status;
    const matchesDirection = direction === "All" || payment.direction === direction;
    return matchesQuery && matchesStatus && matchesDirection;
  }), [query, status, direction]);

  const paymentColumns = [
    {
      key: "voucherNo",
      label: "Voucher No",
      isRowHeader: true,
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <span className="font-bold text-slate-800 text-[13px]">{item.voucherNo}</span>
      ),
    },
    {
      key: "date",
      label: "Date",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3 text-slate-600 text-[13px]",
    },
    {
      key: "party",
      label: "Party Name",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <button className="font-semibold text-[#1a56db] hover:underline text-[13px]">
          {item.party}
        </button>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <span className="text-slate-900 font-bold text-[13px]">{item.amount}</span>
      ),
    },
    {
      key: "method",
      label: "Payment Method",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3 text-slate-600 text-[13px]",
    },
    {
      key: "direction",
      label: "Direction",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            item.direction === "Inward"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          {item.direction === "Inward" ? "Customer Receipt" : "Supplier Payment"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            item.status === "Recorded"
              ? "bg-blue-50 text-blue-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`View ${item.voucherNo}`}
            className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" /> View
          </button>
          <button
            type="button"
            aria-label={`Edit ${item.voucherNo}`}
            className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-100 transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" /> Edit
          </button>
          <button
            type="button"
            aria-label={`Delete ${item.voucherNo}`}
            className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
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
              <span className="font-semibold text-slate-700">Payments</span>
            </p>
            <h1 className=" text-2xl font-bold tracking-tight text-BLUE-dark mt-2">
              Payments
            </h1>
            <p className="text-sm text-tertiary">
              Manage payment vouchers and financial transactions
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/payments/add")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#008951] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#007545]"
          >
            <PlusCircle className="h-4 w-4" /> Add Payment
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-slate-300"></div>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50/50 py-2.5 pl-8 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-500 focus:border-[#008951] focus:ring-1 focus:ring-[#008951]"
                placeholder="Search by voucher number or party name..."
              />
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-40 lg:w-44"
                >
                  <option value="All">Status: All</option>
                  <option value="Recorded">Status: Recorded</option>
                  <option value="Pending">Status: Pending</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={direction}
                  onChange={(event) => setDirection(event.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-48 lg:w-56"
                >
                  <option value="All">Direction: All</option>
                  <option value="Inward">Direction: Inward</option>
                  <option value="Outward">Direction: Outward</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <GlobalTable
            columns={paymentColumns}
            data={filteredPayments}
            ariaLabel="Payments Table"
            className=""
            rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
            emptyContent="No payments match your search."
            pagination={true}
            rowsPerPage={5}
          />
        </div>
      </section>
    </main>
  );
}

export default Payments;
