import { ArrowLeft, Edit, Building2, Landmark, Wallet, Calendar, FileText, CheckCircle, XCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAccountById } from "../../queries/accounts/accounts.queries";

function ViewAccount() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: accountData, isLoading, isError } = useGetAccountById(id);

  const account = accountData?.data;

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
            <p className="mt-1 text-sm text-slate-500">{account.accountCode}</p>
          </div>
          <div className="flex gap-2">
           
            <button
              onClick={() => navigate(`/accounting/edit/${id}`)}
              className="rounded-lg bg-[#008951] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#007545] transition-colors"
            >
              <Edit className="h-4 w-4 inline mr-2" />
              Edit Account
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-100 p-2">
              <Wallet className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600">Account Code</p>
              <p className="text-xl font-bold text-slate-900">{account.accountCode}</p>
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
                Rs. {account.openingBalanceAmount?.toLocaleString() || 0}
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
                Rs. {account.currentBalanceAmount?.toLocaleString() || 0}
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
                {account.statusLabel || account.status || (account.isActive ? 'Active' : 'Inactive')}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Account Name</label>
              <p className="text-sm font-semibold text-slate-900">{account.accountName || "—"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Account Type</label>
              <p className="text-sm font-semibold text-slate-900">{account.accountTypeLabel || account.accountType || "—"}</p>
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

      <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">Timestamps</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-500">Created At</p>
                <p className="text-sm font-semibold text-slate-900">
                  {account.createdAt ? new Date(account.createdAt).toLocaleString() : "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-500">Last Updated</p>
                <p className="text-sm font-semibold text-slate-900">
                  {account.updatedAt ? new Date(account.updatedAt).toLocaleString() : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ViewAccount;
