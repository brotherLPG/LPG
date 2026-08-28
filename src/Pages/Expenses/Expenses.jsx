import { Plus, Eye, Edit3, ChevronDown, DollarSign, Clock, XCircle, CheckCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalTable from "../../utils/GlobalTable";

const initialExpenses = [
  { id: "EXP-001", date: "2024-01-15", category: "Utilities", description: "Electricity Bill", amount: "Rs. 25,000", status: "Paid", approvedBy: "Ahmad Hassan" },
  { id: "EXP-002", date: "2024-01-18", category: "Maintenance", description: "Tank Repair", amount: "Rs. 15,500", status: "Pending", approvedBy: "—" },
  { id: "EXP-003", date: "2024-01-20", category: "Fuel", description: "Generator Fuel", amount: "Rs. 8,200", status: "Paid", approvedBy: "Fatima Zahra" },
  { id: "EXP-004", date: "2024-01-22", category: "Office Supplies", description: "Stationery", amount: "Rs. 3,500", status: "Paid", approvedBy: "Ayesha Siddiqui" },
  { id: "EXP-005", date: "2024-01-25", category: "Security", description: "Security Services", amount: "Rs. 12,000", status: "Pending", approvedBy: "—" },
  { id: "EXP-006", date: "2024-01-28", category: "Transportation", description: "Vehicle Maintenance", amount: "Rs. 18,750", status: "Paid", approvedBy: "Usman Ali" },
  { id: "EXP-007", date: "2024-01-30", category: "Utilities", description: "Water Bill", amount: "Rs. 4,200", status: "Paid", approvedBy: "Ahmad Hassan" },
  { id: "EXP-008", date: "2024-02-02", category: "Equipment", description: "Safety Gear", amount: "Rs. 22,000", status: "Rejected", approvedBy: "Tariq Mehmood" },
];

function Expenses() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const filteredExpenses = useMemo(() => initialExpenses.filter((exp) => {
    const matchesQuery = `${exp.id} ${exp.description}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All" || exp.category === category;
    const matchesStatus = status === "All" || exp.status === status;
    return matchesQuery && matchesCategory && matchesStatus;
  }), [query, category, status]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalAmount = initialExpenses.reduce((sum, exp) => {
      const amount = parseInt(exp.amount.replace(/[^0-9]/g, '')) || 0;
      return sum + amount;
    }, 0);

    const paidAmount = initialExpenses
      .filter(exp => exp.status === "Paid")
      .reduce((sum, exp) => {
        const amount = parseInt(exp.amount.replace(/[^0-9]/g, '')) || 0;
        return sum + amount;
      }, 0);

    const pendingAmount = initialExpenses
      .filter(exp => exp.status === "Pending")
      .reduce((sum, exp) => {
        const amount = parseInt(exp.amount.replace(/[^0-9]/g, '')) || 0;
        return sum + amount;
      }, 0);

    const rejectedAmount = initialExpenses
      .filter(exp => exp.status === "Rejected")
      .reduce((sum, exp) => {
        const amount = parseInt(exp.amount.replace(/[^0-9]/g, '')) || 0;
        return sum + amount;
      }, 0);

    return {
      total: totalAmount,
      paid: paidAmount,
      pending: pendingAmount,
      rejected: rejectedAmount,
      totalCount: initialExpenses.length,
      paidCount: initialExpenses.filter(exp => exp.status === "Paid").length,
      pendingCount: initialExpenses.filter(exp => exp.status === "Pending").length,
      rejectedCount: initialExpenses.filter(exp => exp.status === "Rejected").length,
    };
  }, []);

  // Column definitions for expenses table
  const expenseColumns = [
    {
      key: "id",
      label: "Expense ID",
      isRowHeader: true,
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <span className="font-bold text-slate-800 text-[13px]">{item.id}</span>
      ),
    },
    {
      key: "date",
      label: "Date",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
    },
    {
      key: "category",
      label: "Category",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
    },
    {
      key: "description",
      label: "Description",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
    },
    {
      key: "amount",
      label: "Amount",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <span className="text-slate-900 font-bold text-[13px]">{item.amount}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4",
      renderCell: (item) => {
        const statusStyles = {
          Paid: "bg-emerald-50 text-emerald-600 border border-emerald-100",
          Pending: "bg-amber-50 text-amber-600 border border-amber-100",
          Rejected: "bg-red-50 text-red-600 border border-red-100",
        };
        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[item.status] || statusStyles.Pending}`}
          >
            {item.status}
          </span>
        );
      },
    },
    {
      key: "approvedBy",
      label: "Approved By",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
      renderCell: (item) => (
        <span className={item.approvedBy === "—" ? "text-slate-400 italic" : ""}>{item.approvedBy}</span>
      ),
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
                className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
              >
                Dashboard
              </span>{" "}
              <span className="px-1 text-slate-400">/</span>{" "}
              <span className="font-semibold text-slate-700">Expenses</span>
            </p>
            <h1 className="mt-2 text-[28px] font-bold tracking-tight text-slate-900">
              Expenses
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track and manage plant operational expenses and payments
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/expenses/add")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#008951] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#007545]"
          >
            <Plus className="h-4 w-4" strokeWidth={3} /> Add Expense
          </button>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-tertiary">
                  This Month Total
                </p>
                <p className="mt-2 text-2xl font-extrabold text-accent-blue ">
                  Rs. {summaryStats.total.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-tertiary ">
                  {summaryStats.totalCount} expenses
                </p>
              </div>
            
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-tertiary">
                  Plant Utilities
                </p>
                <p className="mt-2 text-2xl font-extrabold text-orange">
                  Rs. {summaryStats.paid.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-tertiary ">
                  {summaryStats.paidCount} expenses
                </p>
              </div>
             
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-tertiary">
                  Compressor Maintenance
                </p>
                <p className="mt-2 text-2xl font-extrabold text-error">
                  Rs. {summaryStats.pending.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-tertiary ">
                  {summaryStats.pendingCount} expenses
                </p>
              </div>
             
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-tertiary">
                  Other / Petty Expenses
                </p>
                <p className="mt-2 text-2xl font-extrabold ">
                  Rs. {summaryStats.rejected.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {summaryStats.rejectedCount} expenses
                </p>
              </div>
             
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full border-2 border-slate-300"></div>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50/50 py-2.5 pl-8 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-500 focus:border-[#008951] focus:ring-1 focus:ring-[#008951]"
                placeholder="Search by ID or description..."
              />
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-48 lg:w-56"
                >
                  <option value="All">Category: All</option>
                  <option value="Utilities"> Utilities</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Fuel">Fuel</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Security">Security</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Equipment">Equipment</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-40 lg:w-44"
                >
                  <option value="All">Status: All</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <GlobalTable
            columns={expenseColumns}
            data={filteredExpenses}
            ariaLabel="Expenses Table"
            className=""
            rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
            emptyContent="No expenses match your search."
            pagination={true}
            rowsPerPage={5}
          />
        </div>
      </section>
    </main>
  );
}

export default Expenses;
