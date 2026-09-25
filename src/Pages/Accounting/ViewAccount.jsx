import { useMemo, useState } from "react";
import {
  Edit,
  Building2,
  Landmark,
  Wallet,
  CheckCircle,
  XCircle,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Receipt,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAccountLedger,
  useAccountTransactions,
} from "../../queries/accounts/accounts.queries";
import { usePermissions } from "../../contexts/PermissionContext";
import GlobalTable from "../../utils/GlobalTable";

const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime()) || date.getFullYear() < 2000) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatAmount = (value) => {
  const amount = Number(value || 0);
  if (!amount) return "—";
  return amount.toLocaleString();
};

const formatRs = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

function ViewAccount() {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const { id } = useParams();
  const [txnPage, setTxnPage] = useState(1);
  const txnLimit = 20;

  const { data: ledgerData, isLoading, isError } = useAccountLedger(id);
  const {
    data: transactionsResponse,
    isLoading: isTransactionsLoading,
    isError: isTransactionsError,
  } = useAccountTransactions(id, { page: txnPage, limit: txnLimit });

  const account = ledgerData?.data?.account;
  const summary = ledgerData?.data?.summary || {};
  const transactions = (transactionsResponse?.data?.items || []).map((item) => ({
    ...item,
    id: item._id,
  }));
  const txnPagination = transactionsResponse?.data?.pagination || {};

  const transactionColumns = useMemo(
    () => [
      {
        key: "transactionDate",
        label: "Date",
        isRowHeader: true,
        className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap",
        cellClassName: "px-4 py-4 text-slate-600 text-[13px] whitespace-nowrap",
        renderCell: (item) => formatDate(item.transactionDate),
      },
      {
        key: "transactionNumber",
        label: "Transaction #",
        className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap",
        cellClassName: "px-4 py-4 whitespace-nowrap",
        renderCell: (item) => (
          <span className="font-semibold text-slate-800 text-[13px]">
            {item.transactionNumber || "—"}
          </span>
        ),
      },
      {
        key: "partyName",
        label: "Party",
        className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap",
        cellClassName: "px-4 py-4 text-slate-600 text-[13px]",
        renderCell: (item) => (
          <div className="flex flex-col">
            <span className="font-semibold text-slate-800">{item.partyName || "—"}</span>
            {item.partyCode && (
              <span className="text-[11px] text-slate-400">{item.partyCode}</span>
            )}
          </div>
        ),
      },
      {
        key: "directionLabel",
        label: "Type",
        className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap",
        cellClassName: "px-4 py-4 whitespace-nowrap",
        renderCell: (item) => (
          <span className="text-[13px] text-slate-600">
            {item.directionLabel || item.paymentTypeLabel || "—"}
          </span>
        ),
      },
      {
        key: "inwardAmount",
        label: "Inward (Rs.)",
        className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap ",
        cellClassName: "px-4 py-4 text-center whitespace-nowrap",
        renderCell: (item) => (
          <span className="text-[13px] font-medium text-emerald-600">
            {formatAmount(item.inwardAmount)}
          </span>
        ),
      },
      {
        key: "outwardAmount",
        label: "Outward (Rs.)",
        className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap ",
        cellClassName: "px-4 py-4 text-center whitespace-nowrap",
        renderCell: (item) => (
          <span className="text-[13px] font-medium text-red-600">
            {formatAmount(item.outwardAmount)}
          </span>
        ),
      },
      {
        key: "remainingBalance",
        label: "Remaining Balance (Rs.)",
        className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap",
        cellClassName: "px-4 py-4 text-center whitespace-nowrap",
        renderCell: (item) => {
          const remaining = Number(
            item.remainingBalance ?? item.balanceAfter ?? item.afterBalance ?? 0
          );
          return (
            <span
              className={`text-[13px] font-semibold ${
                remaining < 0 ? "text-red-600" : "text-slate-800"
              }`}
            >
              {remaining.toLocaleString()}
            </span>
          );
        },
      },
      {
        key: "statusLabel",
        label: "Status",
        className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap",
        cellClassName: "px-4 py-4 whitespace-nowrap",
        renderCell: (item) => (
          <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600">
            {item.statusLabel || item.status || "—"}
          </span>
        ),
      },
    ],
    []
  );

  if (isLoading) {
    return (
      <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-slate-500">Loading account details...</div>
        </div>
      </main>
    );
  }

  if (isError || !account) {
    return (
      <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-red-500">Error loading account details</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs mb-2">
              <span
                onClick={() => navigate("/dashboard")}
                className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
              >
                Dashboard
              </span>{" "}
              <span className="px-1 text-slate-400">/</span>{" "}
              <span
                onClick={() => navigate("/accounting")}
                className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
              >
                Accounts
              </span>{" "}
              <span className="px-1 text-slate-400">/</span>{" "}
              <span className="font-semibold text-slate-600">View Account</span>
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {account.accountName}
            </h1>
          </div>
          <div className="flex gap-2">
           
            {can("accounts", "update") && (
            <button
              onClick={() => navigate(`/accounting/edit/${id}`)}
              className="rounded-lg bg-[#008951] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#007545] transition-colors"
            >
              <Edit className="h-4 w-4 inline mr-2" />
              Edit Account
            </button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-slate-100 p-2">
              <Wallet className="h-5 w-5 text-slate-700" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-600">Account Code</p>
              <p className="text-xl font-bold tracking-tight text-slate-900">
                {account.accountCode || "—"}
              </p>
              <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-slate-400">Account Type</span>
                <span className="inline-flex max-w-full truncate rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                  {account.accountTypeLabel || account.accountType || "—"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2">
              <Landmark className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600">Opening Balance</p>
              <p className="text-xl font-bold text-slate-900">
                {formatRs(summary.openingBalanceAmount ?? account.openingBalanceAmount)}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                {summary.transactionCount || 0}{" "}
                {summary.transactionCount === 1 ? "transaction" : "transactions"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600">Current Balance</p>
              <p className="text-xl font-bold text-emerald-600">
                {formatRs(summary.currentBalanceAmount ?? account.currentBalanceAmount)}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Net {formatRs(summary.netMovement)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2 ${account.isActive ? 'bg-emerald-100' : 'bg-red-100'}`}>
              {account.isActive ? (
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600">Status</p>
              <p className="text-xl font-bold text-slate-900">
                {account.accountStatus || account.statusLabel || account.status || (account.isActive ? 'Active' : 'Inactive')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-emerald-100 p-2">
              <ArrowDownLeft className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-600">Total Inward</p>
              <p className="text-xl font-bold text-emerald-600">{formatRs(summary.totalInward)}</p>
              <p className="mt-1 text-[11px] text-slate-400">
                {summary.inwardCount || 0}{" "}
                {summary.inwardCount === 1 ? "inward entry" : "inward entries"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-red-100 p-2">
              <ArrowUpRight className="h-5 w-5 text-red-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-600">Total Outward</p>
              <p className="text-xl font-bold text-red-600">{formatRs(summary.totalOutward)}</p>
              <p className="mt-1 text-[11px] text-slate-400">
                {summary.outwardCount || 0}{" "}
                {summary.outwardCount === 1 ? "outward entry" : "outward entries"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-600">Net Movement</p>
              <p className="text-xl font-bold text-slate-900">{formatRs(summary.netMovement)}</p>
              <p className="mt-1 text-[11px] text-slate-400">
                {summary.transactionCount || 0}{" "}
                {summary.transactionCount === 1 ? "transaction" : "transactions"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-slate-100 p-2">
              <Receipt className="h-5 w-5 text-slate-700" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-600">Last Transaction</p>
              <p className="text-xl font-bold text-slate-900">
                {summary.lastTransactionNumber
                  ? formatRs(summary.lastTransactionAmount)
                  : "—"}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                {summary.lastTransactionNumber
                  ? [
                      summary.lastTransactionNumber,
                      formatDate(summary.lastTransactionDate),
                      summary.lastTransactionDirectionLabel,
                    ]
                      .filter((value) => value && value !== "—")
                      .join(" · ")
                  : "No transactions yet"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">Account Information</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Account Name</label>
              <p className="text-sm font-semibold text-slate-900">{account.accountName || "—"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Account Category</label>
              <p className="text-sm font-semibold text-slate-900">{account.accountCategoryLabel || account.accountCategory || "—"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Parent Account</label>
              <p className="text-sm font-semibold text-slate-900">{account.parentAccountName || "—"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Bank Name</label>
              <p className="text-sm font-semibold text-slate-900">{account.bankName || "—"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Branch Name</label>
              <p className="text-sm font-semibold text-slate-900">{account.branchName || "—"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Account Number</label>
              <p className="text-sm font-semibold text-slate-900">{account.accountNumber || "—"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">IBAN / Swift Code</label>
              <p className="text-sm font-semibold text-slate-900">{account.ibanOrSwift || "—"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Date Opened</label>
              <p className="text-sm font-semibold text-slate-900">
                {account.openedAt ? new Date(account.openedAt).toLocaleDateString() : "—"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Allow Manual Entries</label>
              <p className="text-sm font-semibold text-slate-900">
                {account.allowManualEntries ? "Yes" : "No"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Primary Account</label>
              <p className="text-sm font-semibold text-slate-900">
                {account.isPrimary ? "Yes" : "No"}
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-500 mb-1">Description</label>
              <p className="text-sm font-semibold text-slate-900">{account.description || "—"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">Account Transactions</h2>
        </div>
        <GlobalTable
          columns={transactionColumns}
          data={transactions}
          pagination
          rowsPerPage={txnPagination.limit || txnLimit}
          ariaLabel="Account transactions"
          emptyContent={
            isTransactionsLoading
              ? "Loading transactions..."
              : isTransactionsError
                ? "Unable to load transactions."
                : "No transactions found for this account."
          }
          totalCount={txnPagination.total}
          page={txnPage}
          onPageChange={setTxnPage}
        />
      </div>

    </main>
  );
}

export default ViewAccount;
