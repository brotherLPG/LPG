import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, ChevronDown } from "lucide-react";
import GlobalTable from "../../utils/GlobalTable";
import { accountRecords } from "./accountData";

function Accounting() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filteredAccounts = useMemo(() => {
    return accountRecords.filter((account) => {
      const matchesQuery = `${account.id} ${account.name} ${account.bank} ${account.branch}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesStatus = statusFilter === "All" || account.status === statusFilter;
      const matchesCategory = categoryFilter === "All" || account.category === categoryFilter;

      return matchesQuery && matchesStatus && matchesCategory;
    });
  }, [query, statusFilter, categoryFilter]);

  const columns = [
    {
      key: "id",
      label: "Account Code",
      isRowHeader: true,
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 border-x border-slate-100",
      cellClassName: "px-4 py-4",
      renderCell: (item) => <span className="font-semibold text-slate-800 text-[13px]">{item.id}</span>,
    },
    {
      key: "name",
      label: "Account Name",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 border-x border-slate-100",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <button className="font-semibold text-[#1a56db] hover:underline text-[13px]">
          {item.name}
        </button>
      ),
    },
    {
      key: "bank",
      label: "Bank",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 border-x border-slate-100",
      cellClassName: "px-4 py-4 text-slate-600 text-sm",
    },
    {
      key: "branch",
      label: "Branch",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 border-x border-slate-100",
      cellClassName: "px-4 py-4 text-slate-600 text-sm",
    },
    {
      key: "openingBalance",
      label: "Opening Balance",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 border-x border-slate-100",
      cellClassName: "px-4 py-4 text-slate-700 text-sm font-semibold",
      renderCell: (item) => `Rs. ${item.openingBalance.toLocaleString()}`,
    },
    {
      key: "currentBalance",
      label: "Current Balance",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 border-x border-slate-100",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <span className="text-[13px] font-bold text-emerald-600">Rs. {item.currentBalance.toLocaleString()}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 border-x border-slate-100",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            item.status === "Active"
              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
              : item.status === "Review"
                ? "bg-amber-100 text-amber-800 border border-amber-200"
                : "bg-slate-100 text-slate-600 border border-slate-200"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 border-x border-slate-100",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <button
          type="button"
          onClick={() => navigate(`/accounting/details/${item.id}`)}
          className="flex items-center gap-1.5 rounded-full bg-blue-50/70 border border-blue-200/60 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
        >
          <Eye className="h-3.5 w-3.5" /> Details
        </button>
      ),
    },
  ];

  return (
    <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs mb-2">
            <span
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
            >
              Dashboard
            </span>{" "}
            <span className="px-1 text-slate-400">/</span>{" "}
            <span className="font-semibold text-slate-700">Accounts</span>
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Accounts Management
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Track all company bank accounts and their live financial balances
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-xs font-semibold text-slate-600">Total Accounts</h3>
          <p className="mt-2 text-2xl font-bold text-slate-900">{accountRecords.length}</p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            Active financial records
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-xs font-semibold text-slate-600">Opening Balance</h3>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            Rs. {accountRecords.reduce((sum, item) => sum + item.openingBalance, 0).toLocaleString()}
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            Total starting funds
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-xs font-semibold text-slate-600">Current Balance</h3>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            Rs. {accountRecords.reduce((sum, item) => sum + item.currentBalance, 0).toLocaleString()}
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            Live account value
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-xs font-semibold text-slate-600">Needs Review</h3>
          <p className="mt-2 text-2xl font-bold text-amber-500">
            {accountRecords.filter((item) => item.status === "Review").length}
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-amber-500"></span>
            Accounts under review
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <label className="relative flex-1 w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-md border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-500 focus:border-[#008951] focus:ring-1 focus:ring-[#008951]"
            placeholder="Search account code, bank, or branch..."
          />
        </label>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-48"
            >
              <option value="All">Status: All</option>
              <option value="Active">Status: Active</option>
              <option value="Review">Status: Review</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-48"
            >
              <option value="All">Category: All</option>
              <option value="Main Account">Category: Main Account</option>
              <option value="Operating">Category: Operating</option>
              <option value="Operational">Category: Operational</option>
              <option value="Liability">Category: Liability</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <GlobalTable
          columns={columns}
          data={filteredAccounts}
          ariaLabel="Accounts Table"
          className=""
          rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
          emptyContent="No accounts match your search."
          pagination={true}
          rowsPerPage={5}
        />
      </div>
    </main>
  );
}

export default Accounting;
