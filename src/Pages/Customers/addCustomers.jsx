import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@heroui/react";
import { ChevronDown } from "lucide-react";

function AddCustomers() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);

  return (
    <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header & Breadcrumbs */}
      <div className="mb-6">
        <p className="text-xs">
          <span
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            Dashboard
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span
            onClick={() => navigate("/customers")}
            className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            Customers
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span className="font-semibold text-slate-600">Add Customer</span>
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          Add Customer
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create a new customer profile and assign credit parameters
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Customer Information */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-800">
                Customer Information
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Customer Code
                </label>
                <input
                  type="text"
                  disabled
                  value="CUST-009 (Auto-generated)"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Customer Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue="Islamabad Gas"
                  className="w-full rounded-md border border-rose-400 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-rose-100"
                />
                <p className="mt-1.5 text-xs text-rose-500">
                  Please enter the full legal business entity name.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Contact Person <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue="Kamran Malik"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status Toggle
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isActive ? 'bg-[#10b981]' : 'bg-slate-200'}`}
                    role="switch"
                    aria-checked={isActive}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </button>
                  <span className={`text-sm font-semibold ${isActive ? "text-[#10b981]" : "text-slate-500"}`}>
                    Active Account
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Contact Details */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-800">
                Contact Details
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue="0300-1234567"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="contact@islamabadgas.pk"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Billing & Tax */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-800">
                Billing & Tax
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Billing Address
                </label>
                <textarea
                  rows="3"
                  defaultValue="Plot 45-B, Industrial Area, Sector I-9, Islamabad, Pakistan"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tax Registration Number (NTN/STRN)
                </label>
                <input
                  type="text"
                  defaultValue="1234567-8"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (lg:col-span-1) */}
        <div className="lg:col-span-1">
          {/* Card 4: Credit & Payment Terms */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-800">
                Credit & Payment Terms
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Credit Limit (Rs.)
                </label>
                <input
                  type="text"
                  defaultValue="500,000"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Payment Terms
                </label>
                <div className="relative">
                  <select
                    defaultValue="Net 30 Days"
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="Net 15 Days">Net 15 Days</option>
                    <option value="Net 30 Days">Net 30 Days</option>
                    <option value="Net 60 Days">Net 60 Days</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Opening Balance (Rs.)
                </label>
                <input
                  type="text"
                  defaultValue="0"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-6 flex justify-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <button
          onClick={() => navigate("/customers")}
          className="rounded-lg border border-slate-200 bg-white px-6 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          onClick={() => navigate("/customers")}
          className="rounded-lg bg-[#133E87] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#0f326e]"
        >
          Save Profile
        </button>
      </div>
    </main>
  );
}

export default AddCustomers;
