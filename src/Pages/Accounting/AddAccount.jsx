import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateAccount,
  useAccountFormOptions,
} from "../../queries/accounts/accounts.queries";
import { useToast } from "../../utils/GlobalToast";
import { AlertCircle, Loader } from "lucide-react";

function AddAccount() {
  const navigate = useNavigate();
  const createMutation = useCreateAccount();
  const toast = useToast();

  const { data: formOptionsResponse, isLoading: optionsLoading } =
    useAccountFormOptions();
  const formOptions = formOptionsResponse?.data || {};
  const nextAccountCode = formOptions.nextAccountCode || "";
  const accountTypes = formOptions.accountTypes || [];
  const accountCategories = formOptions.accountCategories || [];
  const parentAccounts = formOptions.parentAccounts || [];
  const statuses = formOptions.statuses || [];

  const [formData, setFormData] = useState({
    accountName: "",
    accountType: "",
    accountCategory: "",
    parentAccountId: null,
    bankName: "",
    branchName: "",
    accountNumber: "",
    ibanOrSwift: "",
    openingBalanceAmount: "",
    openedAt: "",
    description: "",
    isActive: "active",
    allowManualEntries: true,
    isPrimary: false,
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.accountName.trim()) errors.accountName = "Account name is required";
    if (!formData.accountType) errors.accountType = "Account type is required";
    if (!formData.accountCategory) errors.accountCategory = "Account category is required";
    if (formData.openingBalanceAmount && isNaN(formData.openingBalanceAmount)) {
      errors.openingBalanceAmount = "Opening balance must be a number";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    // Prepare data for API
    const submitData = {
      accountName: formData.accountName,
      accountType: formData.accountType,
      accountCategory: formData.accountCategory,
      parentAccountId: formData.parentAccountId || null,
      description: formData.description,
      bankName: formData.bankName,
      branchName: formData.branchName,
      accountNumber: formData.accountNumber,
      ibanOrSwift: formData.ibanOrSwift,
      openingBalanceAmount: formData.openingBalanceAmount ? parseFloat(formData.openingBalanceAmount) : 0,
      openedAt: formData.openedAt || null,
      isActive: formData.isActive === "active",
      allowManualEntries: formData.allowManualEntries,
      isPrimary: formData.isPrimary,
    };

    createMutation.mutate(submitData, {
      onSuccess: (response) => {
        toast.success(response.message || "Account created successfully");
        setTimeout(() => {
          navigate("/accounting");
        }, 1500);
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || error?.message || "Failed to create account");
      },
    });
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
                  value={
                    optionsLoading
                      ? "Loading..."
                      : nextAccountCode
                        ? `${nextAccountCode} (Auto-generated)`
                        : "Auto-generated on save"
                  }
                  disabled
                  className="w-full rounded-md border border-slate-200 bg-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Account Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.accountName}
                  onChange={(e) => handleChange("accountName", e.target.value)}
                  placeholder="Enter account name"
                  className={`w-full rounded-md border ${
                    formErrors.accountName ? "border-red-500" : "border-slate-200"
                  } bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100`}
                />
                {formErrors.accountName && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {formErrors.accountName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Account Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.accountType}
                  onChange={(e) => handleChange("accountType", e.target.value)}
                  disabled={optionsLoading}
                  className={`w-full rounded-md border ${
                    formErrors.accountType ? "border-red-500" : "border-slate-200"
                  } bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100 disabled:cursor-not-allowed`}
                >
                  <option value="">
                    {optionsLoading ? "Loading..." : "Select account type"}
                  </option>
                  {accountTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {formErrors.accountType && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {formErrors.accountType}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Account Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.accountCategory}
                  onChange={(e) =>
                    handleChange("accountCategory", e.target.value)
                  }
                  disabled={optionsLoading}
                  className={`w-full rounded-md border ${
                    formErrors.accountCategory ? "border-red-500" : "border-slate-200"
                  } bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100 disabled:cursor-not-allowed`}
                >
                  <option value="">
                    {optionsLoading ? "Loading..." : "Select category"}
                  </option>
                  {accountCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {formErrors.accountCategory && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {formErrors.accountCategory}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Parent Account
                </label>
                <select
                  value={formData.parentAccountId || ""}
                  onChange={(e) =>
                    handleChange("parentAccountId", e.target.value ? e.target.value : null)
                  }
                  disabled={optionsLoading}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {optionsLoading ? "Loading..." : "Select parent account"}
                  </option>
                  {parentAccounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.label}
                    </option>
                  ))}
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
                  value={formData.ibanOrSwift}
                  onChange={(e) => handleChange("ibanOrSwift", e.target.value)}
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
                  value={formData.openingBalanceAmount}
                  onChange={(e) =>
                    handleChange("openingBalanceAmount", e.target.value)
                  }
                  placeholder="0.00"
                  step="0.01"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
                {formErrors.openingBalanceAmount && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {formErrors.openingBalanceAmount}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Date Opened
                </label>
                <input
                  type="date"
                  value={formData.openedAt}
                  onChange={(e) => handleChange("openedAt", e.target.value)}
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
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Status
                </label>
                <select
                  value={formData.isActive}
                  onChange={(e) => handleChange("isActive", e.target.value)}
                  disabled={optionsLoading}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  {optionsLoading && <option value="">Loading...</option>}
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-3 py-2">
                <span className="text-sm text-slate-700">
                  Allow manual entries
                </span>
                <button
                  type="button"
                  onClick={() => handleChange("allowManualEntries", !formData.allowManualEntries)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.allowManualEntries ? "bg-[#008951]" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      formData.allowManualEntries ? "translate-x-5" : "translate-x-1"
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
            disabled={createMutation.isPending}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending || optionsLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-[#008951] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#007545] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending && <Loader className="h-4 w-4 animate-spin" />}
            {createMutation.isPending ? "Saving..." : "Save Account"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AddAccount;
