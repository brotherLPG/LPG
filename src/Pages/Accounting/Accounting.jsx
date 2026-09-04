import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, ChevronDown, Plus, Loader, Pencil } from "lucide-react";
import GlobalTable from "../../utils/GlobalTable";
import { useGetAccounts } from "../../queries/accounts/accounts.queries";

function Accounting() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  // Fetch accounts from API (without filters to get meta data)
  const { data: accountsResponse, isLoading, isError, error } = useGetAccounts({
    search: query,
    accountType: categoryFilter !== "All" ? categoryFilter : undefined,
    status: statusFilter !== "All" ? statusFilter : undefined,
    page: currentPage,
    limit,
  });

  const accountRecords = accountsResponse?.data?.items || [];
  const pagination = accountsResponse?.data?.pagination || {};
  const summary = accountsResponse?.data?.summary || {};

  const filteredAccounts = useMemo(() => {
    return accountRecords.map((account) => ({
      id: account.accountCode,
      name: account.accountName,
      bank: account.bankName || "—",
      branch: account.branchName || "—",
      accountType: account.accountType || "—",
      openingBalance: account.openingBalanceAmount || 0,
      currentBalance: account.currentBalanceAmount || 0,
      status: account.statusLabel || account.status || "Active",
      category: account.accountCategoryLabel || account.accountCategory || "—",
      accountId: account._id,
    }));
  }, [accountRecords]);

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
      key: "accountType",
      label: "Account Type",
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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(`/accounting/edit/${item.accountId}`)}
            className="flex items-center gap-1.5 rounded-full bg-emerald-50/70 border border-emerald-200/60 px-3 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-100 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
          <button
            type="button"
            onClick={() => navigate(`/accounting/view/${item.accountId}`)}
            className="flex items-center gap-1.5 rounded-full bg-blue-50/70 border border-blue-200/60 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" /> View
          </button>
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Accounts Management
            </h1>
          </div>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-900">Error loading accounts</h2>
          <p className="mt-2 text-sm text-red-700">{error?.message || "An error occurred while fetching accounts"}</p>
        </div>
      </main>
    );
  }

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

        <button
          type="button"
          onClick={() => navigate("/accounting/add")}
          className="inline-flex items-center gap-2 rounded-lg bg-[#008951] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#007545]"
        >
          <Plus className="h-4 w-4" />
          Add Account
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-xs font-semibold text-slate-600">
            Total Accounts
          </h3>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {summary.totalAccounts || 0}
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            Active financial records
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-xs font-semibold text-slate-600">
            Opening Balance
          </h3>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            Rs. {(summary.totalOpeningBalance || 0).toLocaleString()}
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            Total starting funds
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-xs font-semibold text-slate-600">
            Current Balance
          </h3>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            Rs. {(summary.totalCurrentBalance || 0).toLocaleString()}
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            Live account value
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-xs font-semibold text-slate-600">Needs Review</h3>
          <p className="mt-2 text-2xl font-bold text-amber-500">
            {summary.needsReviewCount || 0}
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
            onChange={(event) => {
              setQuery(event.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-md border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-500 focus:border-[#008951] focus:ring-1 focus:ring-[#008951]"
            placeholder="Search account code, bank, or branch..."
          />
        </label>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setCurrentPage(1);
              }}
              className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-48"
            >
              <option value="All">Status: All</option>
              {accountsResponse?.data?.meta?.statuses?.map((status) => (
                <option key={status.value} value={status.value}>
                  Status: {status.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(event) => {
                setCategoryFilter(event.target.value);
                setCurrentPage(1);
              }}
              className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-48"
            >
              <option value="All">Type: All</option>
              {accountsResponse?.data?.meta?.accountTypes?.map((type) => (
                <option key={type.value} value={type.value}>
                  Type: {type.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center gap-3">
              <Loader className="h-8 w-8 animate-spin text-slate-400" />
              <p className="text-sm text-slate-500">Loading accounts...</p>
            </div>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-sm text-red-600 font-medium">
                Error loading accounts
              </p>
              <p className="text-xs text-red-500 mt-1">{error?.message}</p>
            </div>
          </div>
        ): (
          <>
            <GlobalTable
              columns={columns}
              data={filteredAccounts}
              ariaLabel="Accounts Table"
              className=""
              rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
              emptyContent="No accounts match your search."
              pagination={true}
              rowsPerPage={pagination.limit || 10}
              totalCount={pagination.total}
              onPageChange={(p) => setCurrentPage(p)}
            />
          </>
        )}
      </div>
    </main>
  );
}

export default Accounting;
