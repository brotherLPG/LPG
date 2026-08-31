import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddAccount() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    accountCode: "",
    accountName: "",
    accountType: "",
    AccountCategory: "PKR",
    ParentAccount:"",
    bankName: "",
    branchName: "",
    accountNumber: "",
    iban: "",
    openingBalance: "",
    dateOpened: "",
    description: "",
    status: true,
    Allowmanualentries: true,
    isPrimary: true,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Account data:", formData);
    navigate("/accounting");
  };

  return (
    <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
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
          <span className="font-semibold text-slate-600">Add Account</span>
        </p>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Add Account
        </h1>
        <p className="text-sm text-tertiary">
          Create a new ledger account for the Rawalpindi plant chart of accounts
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4 ">
            <h2 className="text-lg font-semibold text-slate-800">
              Account Details
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Account Code
                </label>
                <input
                  type="text"
                  // value={formData.accountCode}
                  // onChange={(e) => handleChange("accountCode", e.target.value)}
                  placeholder="Auto-generated on save"
                  disabled
                  className="w-full rounded-md border border-slate-200 bg-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Account Name
                </label>
                <input
                  type="text"
                  value={formData.accountName}
                  onChange={(e) => handleChange("accountName", e.target.value)}
                  placeholder="Enter account name"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Account Type
                </label>
                <select
                  value={formData.accountType}
                  onChange={(e) => handleChange("accountType", e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">Select account type</option>
                  <option value="Savings">Savings</option>
                  <option value="Current">Current</option>
                  <option value="Business">Business</option>
                  <option value="Operating">Operating</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Account Category
                </label>
                <select
                  value={formData.AccountCategory}
                  onChange={(e) =>
                    handleChange("AccountCategory", e.target.value)
                  }
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="PKR">PKR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Parent Account
                </label>
                <select
                  value={formData.ParentAccount}
                  onChange={(e) =>
                    handleChange("ParentAccount", e.target.value)
                  }
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="PKR">PKR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Add a short description for this account"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden my-2">
          <div className="border-b border-slate-200 px-6 py-4 ">
            <h2 className="text-lg font-semibold text-slate-800">
              Opening Balance
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => handleChange("bankName", e.target.value)}
                  placeholder="Enter bank name"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Branch Name
                </label>
                <input
                  type="text"
                  value={formData.branchName}
                  onChange={(e) => handleChange("branchName", e.target.value)}
                  placeholder="Enter branch name"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Account Number
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    handleChange("accountNumber", e.target.value)
                  }
                  placeholder="Enter account number"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  IBAN / Swift Code
                </label>
                <input
                  type="text"
                  value={formData.iban}
                  onChange={(e) => handleChange("iban", e.target.value)}
                  placeholder="Enter IBAN or Swift"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Opening Balance
                </label>
                <input
                  type="number"
                  value={formData.openingBalance}
                  onChange={(e) =>
                    handleChange("openingBalance", e.target.value)
                  }
                  placeholder="0.00"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Date Opened
                </label>
                <input
                  type="date"
                  value={formData.dateOpened}
                  onChange={(e) => handleChange("dateOpened", e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden my-2">
          <div className="rounded-xl border border-slate-200 p-4">
            <h2 className="mb-3 text-sm font-extrabold text-slate-700">
              Account Settings
            </h2>

            <div className="space-y-3">
              <label className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-3 py-2">
                <span className="text-sm text-slate-700">Active Account</span>
                <button
                  type="button"
                  onClick={() => handleChange("status", !formData.status)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.status ? "bg-[#008951]" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      formData.status ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </label>

              <label className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-3 py-2">
                <span className="text-sm text-slate-700">
                  Allow manual entries
                </span>
                <button
                  type="button"
                  onClick={() => handleChange("Allowmanualentries", !formData.Allowmanualentries)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.Allowmanualentries ? "bg-[#008951]" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      formData.Allowmanualentries ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </label>

              <label className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-3 py-2">
                <span className="text-sm text-slate-700">Primary Account</span>
                <button
                  type="button"
                  onClick={() => handleChange("isPrimary", !formData.isPrimary)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.isPrimary ? "bg-[#008951]" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      formData.isPrimary ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={() => navigate("/accounting")}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-[#008951] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#007545]"
          >
            Save Account
          </button>
        </div>
      </form>
    </main>
  );
}

export default AddAccount;
