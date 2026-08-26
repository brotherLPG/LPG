import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@heroui/react";
import { ChevronDown, Upload } from "lucide-react";

function AddExpenses() {
  const navigate = useNavigate();
  const [isApproved, setIsApproved] = useState(true);

  return (
    <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      {/* Header & Breadcrumbs */}
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
            onClick={() => navigate("/expenses")}
            className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            Expenses
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span className="font-semibold text-slate-600">Add Expense</span>
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Add Expense
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Record a new expense and categorize for accounting
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Expense Details */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-800">
                Expense Details
              </h2>
            </div>
            <div className="p-5 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Expense Number
                </label>
                <input
                  type="text"
                  disabled
                  value="EXP-0992 (Auto-generated)"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 mt-4">
                  Category <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    defaultValue="Utilities"
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    <option value="Fuel">Fuel</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Rent">Rent</option>
                    <option value="Salaries">Salaries</option>
                    <option value="Supplies">Supplies</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 mt-4">
                  Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 mt-4">
                  Vendor/Payee Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. WAPDA Power Corporation"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5 mt-4">
                  Description
                </label>
                <textarea
                  rows="2"
                  placeholder="Electricity bill for Rawalpindi plant facility for the month of August 2008"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <div className="flex items-center gap-3">
                  <Switch
                    isSelected={isApproved}
                    onValueChange={setIsApproved}
                    classNames={{
                      wrapper: isApproved ? "bg-[#008951]" : "bg-slate-200",
                    }}
                    size="sm"
                  />
                  <button
                    type="button"
                    onClick={() => setIsApproved(!isApproved)}
                    className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isApproved ? "bg-[#10b981]" : "bg-slate-200"}`}
                    role="switch"
                    aria-checked={isApproved}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isApproved ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                  <span
                    className={`text-sm font-semibold ${isApproved ? "text-[#008951]" : "text-slate-500"}`}
                  >
                    Approved
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (lg:col-span-1) */}
        <div className="lg:col-span-1">
          {/* Card 2: Payment Information */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-full">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-800">
                Payment Information
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Amount (Rs.) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 65,000"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Payment Method <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    defaultValue="Bank Transfer"
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="" disabled>
                      Select payment method
                    </option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Online Payment">Online Payment</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Source Account <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    defaultValue=""
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="" disabled>
                      Select source account
                    </option>
                    <option value="Bank Main Account">Bank Main Account</option>
                    <option value="Cash Account">Cash Account</option>
                    <option value="Petty Cash">Petty Cash</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Reference / Receipt Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. TXN-98230040"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Payment Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Attachments & Notes */}
        <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-800">
              Attachments & Notes
            </h2>
          </div>
          <div className="p-5 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Upload Receipt
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-slate-300 transition-colors cursor-pointer">
                <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                <p className="text-sm text-slate-600">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  PDF, PNG, JPG up to 10MB
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Additional Notes
              </label>
              <textarea
                rows="3"
                placeholder="Include any specific remarks or internal transfer notes here..."
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-6 flex justify-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <button
          onClick={() => navigate("/expenses")}
          className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          onClick={() => navigate("/expenses")}
          className="rounded-lg bg-[#008951] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#007545]"
        >
          Save Expense
        </button>
      </div>
    </main>
  );
}

export default AddExpenses;
