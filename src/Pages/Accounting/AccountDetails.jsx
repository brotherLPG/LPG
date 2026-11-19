import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Wallet, Building2, Landmark, CalendarRange } from "lucide-react";
import { accountRecords, accountTransactions } from "./accountData";

function AccountDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const account = accountRecords.find((item) => item.id === id) || accountRecords[0];

  const accountLedger = useMemo(
    () =>
      accountTransactions
        .filter((txn) => txn.accountId === account.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [account.id]
  );

  const totalDebit = accountLedger.reduce((sum, item) => sum + (item.debit || 0), 0);
  const totalCredit = accountLedger.reduce((sum, item) => sum + (item.credit || 0), 0);

  return (
    <main className="min-h-full bg-[#F8FAFC] dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-6">
              <p className="text-xs mb-2">
                <span
                  onClick={() => navigate("/dashboard")}
                  className="cursor-pointer font-medium text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-400 transition-colors duration-200"
                >
                  Dashboard
                </span>{" "}
                <span className="px-1 text-slate-400 dark:text-gray-500">/</span>{" "}
                <span
                  onClick={() => navigate("/accounting")}
                  className="cursor-pointer font-medium text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-400 transition-colors duration-200"
                >
                  Accounts
                </span>{" "}
                <span className="px-1 text-slate-400 dark:text-gray-500">/</span>{" "}
                <span className="font-semibold text-slate-600 dark:text-gray-400">
                  Account Detail
                </span>
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-gray-100">
                {account.name}
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">{account.branch}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-slate-700 dark:text-gray-300">
              Export Ledger
            </button>
            <button className="rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-slate-700 dark:text-gray-300">
              Print Statement
            </button>
            <button className="rounded-lg bg-[#008951] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#007545]">
              Edit Account
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-100 dark:bg-gray-800 p-2">
              <Wallet className="h-5 w-5 text-slate-700 dark:text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600 dark:text-gray-400">
                Account Code
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-gray-100">{account.id}</p>
              <p className="mt-1 flex items-center gap-1.5 text-[12px] text-tertiary my-auto">
                Category: Bank Accounts
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 dark:bg-emerald-900 p-2">
              <Landmark className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600 dark:text-gray-400">
                Opening Balance
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-gray-100">
                Rs. {account.openingBalance.toLocaleString()}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-[12px] text-tertiary my-auto">
                As of July 1st, 2026
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 dark:bg-blue-900 p-2">
              <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600 dark:text-gray-400">
                Current Balance
              </p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                Rs. {account.currentBalance.toLocaleString()}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-[12px] text-tertiary my-auto">
                Active Status
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
        <div className="border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-800 dark:text-gray-100">
              Transaction History & Ledger
            </h2>
            <div className="text-sm text-slate-500 dark:text-gray-400">Filter: Last 30 Days</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50/80 dark:bg-gray-800/80">
              <tr>
                <th className="px-4 py-3 text-[13px] font-bold text-slate-700 dark:text-gray-300">
                  Date
                </th>
                <th className="px-4 py-3 text-[13px] font-bold text-slate-700 dark:text-gray-300">
                  Reference
                </th>
                <th className="px-4 py-3 text-[13px] font-bold text-slate-700 dark:text-gray-300">
                  Description
                </th>
                <th className="px-4 py-3 text-[13px] font-bold text-slate-700 dark:text-gray-300">
                  Debit (Rs.)
                </th>
                <th className="px-4 py-3 text-[13px] font-bold text-slate-700 dark:text-gray-300">
                  Credit (Rs.)
                </th>
                <th className="px-4 py-3 text-[13px] font-bold text-slate-700 dark:text-gray-300">
                  Running Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {accountLedger.map((txn, index) => (
                <tr
                  key={`${txn.reference}-${index}`}
                  className="border-t border-slate-100 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-gray-400">
                    {new Date(txn.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-gray-400">
                    {txn.reference}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-gray-400">
                    {txn.description}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400">
                    {txn.debit ? txn.debit.toLocaleString() : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {txn.credit ? txn.credit.toLocaleString() : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-800 dark:text-gray-100">
                    {txn.runningBalance.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 px-6 py-3 text-sm text-slate-600 dark:text-gray-400">
          <span>
            Showing 1 to {accountLedger.length} of {accountLedger.length} ledger
            items
          </span>
          <div className="flex items-center gap-2">
            <button className="rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-gray-400">
              Previous
            </button>
            <button className="rounded-md bg-[#008951] px-3 py-1.5 text-xs font-medium text-white">
              1
            </button>
            <button className="rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-gray-400">
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 dark:text-gray-100">Account Summary</h3>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-slate-50 dark:bg-gray-800 p-4">
            <p className="text-sm text-slate-500 dark:text-gray-400">Total Debits</p>
            <p className="mt-2 text-xl font-bold text-red-600 dark:text-red-400">
              Rs. {totalDebit.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-gray-800 p-4">
            <p className="text-sm text-slate-500 dark:text-gray-400">Total Credits</p>
            <p className="mt-2 text-xl font-bold text-emerald-600 dark:text-emerald-400">
              Rs. {totalCredit.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 dark:bg-gray-800 p-4">
            <p className="text-sm text-slate-500 dark:text-gray-400">Account Status</p>
            <p className="mt-2 text-xl font-bold text-slate-900 dark:text-gray-100">
              {account.status}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AccountDetails;
