import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, ChevronDown, Plus, Loader, Pencil, Printer, Wallet, Landmark, TrendingUp, ClipboardCheck } from "lucide-react";
import { Button, Tooltip } from "@heroui/react";
import GlobalTable from "../../utils/GlobalTable";
import { useGetAccounts, useAccountFormOptions } from "../../queries/accounts/accounts.queries";
import { usePermissions } from "../../contexts/PermissionContext";
import { usePrint } from "../../utils/usePrint";

function Accounting() {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const { printContent, getQRCodeImg } = usePrint();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const accountListParams = {
    page: currentPage,
    limit,
    ...(query && { search: query }),
    ...(categoryFilter !== "All" && { accountType: categoryFilter }),
    ...(statusFilter !== "All" && { status: statusFilter }),
  };

  const { data: accountsResponse, isLoading, isError, error } = useGetAccounts(accountListParams);
  const { data: formOptionsResponse, isLoading: optionsLoading } = useAccountFormOptions();
  const formOptions = formOptionsResponse?.data || {};
  const statuses = formOptions.statuses || [];
  const accountTypes = formOptions.accountTypes || [];

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

  const handlePrintAccount = (item) => {
    const qrData = [
      `Account: ${item.name} (${item.id})`,
      `Bank: ${item.bank}`,
      `Branch: ${item.branch}`,
      `Type: ${item.accountType}`,
      `Category: ${item.category}`,
      `Opening Balance:  ${item.openingBalance.toLocaleString()}`,
      `Current Balance:  ${item.currentBalance.toLocaleString()}`,
      `Status: ${item.status}`,
    ].join('\n');

    const statusClass = item.status === 'Active' ? 'active' : 'inactive';

    const content = `
      <!-- Top Row -->
      <div class="receipt-top">
        <div>
          <p style="font-size: 15px; font-weight: 700; color: #1e293b; margin: 0;">
            ${item.name}
          </p>
          <p style="font-size: 13px; color: #64748b; margin: 4px 0 0;">
            Account Code: <strong style="color: #1e293b;">${item.id}</strong>
            &nbsp;•&nbsp; ${item.bank}
          </p>
          <p style="margin: 8px 0 0;">
            <span class="status-badge ${statusClass}">${item.status}</span>
          </p>
        </div>
        ${getQRCodeImg(qrData)}
      </div>

      <!-- Account Details -->
      <div class="delivery-section">
        <h3 style="font-size: 14px; color: #1e293b; margin-bottom: 4px;">Account Details</h3>
        <table class="spec-table">
          <tr><th>Account Code</th><td>${item.id}</td></tr>
          <tr><th>Account Name</th><td>${item.name}</td></tr>
          <tr><th>Bank</th><td>${item.bank}</td></tr>
          <tr><th>Branch</th><td>${item.branch}</td></tr>
          <tr><th>Account Type</th><td>${item.accountType}</td></tr>
          <tr><th>Category</th><td>${item.category}</td></tr>
          <tr><th>Opening Balance</th><td> ${item.openingBalance.toLocaleString()}</td></tr>
          <tr><th>Current Balance</th><td><strong> ${item.currentBalance.toLocaleString()}</strong></td></tr>
          <tr><th>Status</th><td>${item.status}</td></tr>
        </table>
      </div>
    `;

    printContent({
      title: `Account - ${item.name}`,
      content,
    });
  };

  const columns = [
    {
      key: "id",
      label: "Account Code",
      isRowHeader: true,
      className:
        "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 border-x border-slate-100 dark:border-gray-800 text-nowrap",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <span className="font-semibold text-slate-800 dark:text-gray-100 text-[13px]">
          {item.id}
        </span>
      ),
    },
    {
      key: "name",
      label: "Account Name",
      className:
        "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 border-x border-slate-100 dark:border-gray-800 text-nowrap",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <button className="font-semibold text-[#1a56db] dark:text-blue-400 hover:underline text-[13px]">
          {item.name}
        </button>
      ),
    },
    {
      key: "bank",
      label: "Bank",
      className:
        "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 border-x border-slate-100 dark:border-gray-800",
      cellClassName: "px-4 py-4 text-slate-600 dark:text-gray-400 text-sm",
    },
    {
      key: "branch",
      label: "Branch",
      className:
        "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 border-x border-slate-100 dark:border-gray-800",
      cellClassName: "px-4 py-4 text-slate-600 dark:text-gray-400 text-sm",
    },
    {
      key: "accountType",
      label: "Account Type",
      className:
        "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 border-x border-slate-100 dark:border-gray-800 text-nowrap",
      cellClassName: "px-4 py-4 text-slate-600 dark:text-gray-400 text-sm",
    },
    {
      key: "openingBalance",
      label: "Opening Balance",
      className:
        "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 border-x border-slate-100 dark:border-gray-800 text-nowrap",
      cellClassName:
        "px-4 py-4 text-slate-700 dark:text-gray-300 text-sm font-semibold",
      renderCell: (item) => ` ${item.openingBalance.toLocaleString()}`,
    },
    {
      key: "currentBalance",
      label: "Current Balance",
      className:
        "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 border-x border-slate-100 dark:border-gray-800 text-nowrap",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <span className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400">
           {item.currentBalance.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      className:
        "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 border-x border-slate-100 dark:border-gray-800",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            item.status === "Active"
              ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900"
              : item.status === "Review"
                ? "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                : "bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className:
        "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 border-x border-slate-100 dark:border-gray-800",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <div className="flex items-center gap-2">
          {can("accounts", "update") && (
            <Tooltip delay={0}>
              <Button
                onClick={() => navigate(`/accounting/edit/${item.accountId}`)}
                aria-label={`Edit ${item.name}`}
                className="flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Tooltip.Content>
                <p>Update Account</p>
              </Tooltip.Content>
            </Tooltip>
          )}

          {can("accounts", "read") && (
            <Tooltip delay={0}>
              <Button
                onClick={() => navigate(`/accounting/view/${item.accountId}`)}
                aria-label={`View ${item.name}`}
                className="flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
              >
                <Eye className="h-3.5 w-3.5" />
              </Button>
              <Tooltip.Content>
                <p>View Account</p>
              </Tooltip.Content>
            </Tooltip>
          )}
          <Tooltip delay={0}>
            <Button
              aria-label={`Print ${item.name}`}
              onClick={() => handlePrintAccount(item)}
              className="flex items-center gap-1.5 rounded-full bg-slate-50/70 dark:bg-gray-800/70 border border-slate-200/60 dark:border-gray-700/60 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
            </Button>
            <Tooltip.Content>
              <p>Print Account</p>
            </Tooltip.Content>
          </Tooltip>
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <main className="min-h-full bg-[#F8FAFC] dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-gray-100">
              Accounts Management
            </h1>
          </div>
        </div>
        <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-6">
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-200">Error loading accounts</h2>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error?.message || "An error occurred while fetching accounts"}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-[#F8FAFC] dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs mb-2">
            <span
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer font-medium text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-400 transition-colors duration-200"
            >
              Dashboard
            </span>{" "}
            <span className="px-1 text-slate-400 dark:text-gray-500">/</span>{" "}
            <span className="font-semibold text-slate-700 dark:text-gray-300">Accounts</span>
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-gray-100">
            Accounts Management
          </h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-gray-400">
            Track all company bank accounts and their live financial balances
          </p>
        </div>

        {can("accounts", "create") && (
        <button
          type="button"
          onClick={() => navigate("/accounting/add")}
          className="inline-flex items-center gap-2 rounded-lg bg-[#008951] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#007545]"
        >
          <Plus className="h-4 w-4" />
          Add Account
        </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border border-slate-200 dark:border-gray-700 bg-linear-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-slate-200/70 dark:bg-gray-700 p-2">
              <Wallet className="h-5 w-5 text-slate-700 dark:text-gray-300" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-gray-400">
                Total Accounts
              </h3>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-gray-100">
                {summary.totalAccounts || 0}
              </p>
              <p className="mt-1 text-[11px] text-slate-400 dark:text-gray-500">
                Active financial records
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950/60 dark:to-blue-900/40 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-blue-200/70 dark:bg-blue-800/60 p-2">
              <Landmark className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-gray-400">
                Opening Balance
              </h3>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-gray-100">
                 {(summary.totalOpeningBalance || 0).toLocaleString()}
              </p>
              <p className="mt-1 text-[11px] text-slate-400 dark:text-gray-500">
                Total starting funds
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-linear-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/60 dark:to-emerald-900/40 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-emerald-200/70 dark:bg-emerald-800/60 p-2">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-gray-400">
                Current Balance
              </h3>
              <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {(summary.totalCurrentBalance || 0).toLocaleString()}
              </p>
              <p className="mt-1 text-[11px] text-slate-400 dark:text-gray-500">
                Live account value
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-linear-to-br from-amber-50 to-amber-100 dark:from-amber-950/60 dark:to-amber-900/40 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-amber-200/70 dark:bg-amber-800/60 p-2">
              <ClipboardCheck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-gray-400">Needs Review</h3>
              <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
                {summary.needsReviewCount || 0}
              </p>
              <p className="mt-1 text-[11px] text-slate-400 dark:text-gray-500">
                Accounts under review
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <label className="relative flex-1 w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-gray-500" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-md border border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800/50 py-2.5 pl-9 pr-3 text-sm text-slate-700 dark:text-gray-300 outline-none transition placeholder:text-slate-500 dark:placeholder:text-gray-400 focus:border-[#008951] focus:ring-1 focus:ring-[#008951]"
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
              disabled={optionsLoading}
              className="w-full appearance-none rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 dark:text-gray-400 outline-none focus:border-[#008951] sm:w-48 disabled:bg-slate-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
            >
              <option value="All">{optionsLoading ? "Loading..." : "Status: All"}</option>
              {statuses.map((status) => (
                <option key={String(status.value)} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 dark:text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(event) => {
                setCategoryFilter(event.target.value);
                setCurrentPage(1);
              }}
              disabled={optionsLoading}
              className="w-full appearance-none rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 dark:text-gray-400 outline-none focus:border-[#008951] sm:w-48 disabled:bg-slate-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
            >
              <option value="All">{optionsLoading ? "Loading..." : "Type: All"}</option>
              {accountTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 dark:text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center gap-3">
              <Loader className="h-8 w-8 animate-spin text-slate-400 dark:text-gray-500" />
              <p className="text-sm text-slate-500 dark:text-gray-400">Loading accounts...</p>
            </div>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                Error loading accounts
              </p>
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">{error?.message}</p>
            </div>
          </div>
        ): (
          <>
            <GlobalTable
              columns={columns}
              data={filteredAccounts}
              ariaLabel="Accounts Table"
              className=""
              rowClassName="border-b border-slate-100 dark:border-gray-800 last:border-0 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
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
