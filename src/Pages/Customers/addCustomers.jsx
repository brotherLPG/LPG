import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useCustomers, useCreateCustomer } from "../../queries/customers/customers.queries";
import { useToast } from "../../utils/GlobalToast";

function AddCustomers() {
  const navigate = useNavigate();
  const toast = useToast();
  const [isActive, setIsActive] = useState(true);
  const createCustomerMutation = useCreateCustomer();
  const { data: customersData, isLoading: isCustomersLoading } = useCustomers({
    page: 1,
    limit: 1,
  });
  const customerCode = customersData?.data?.items?.[0]?.customerCode;
  const nextCustomerCode = customerCode
    ? customerCode.replace(/(\D*)(\d+)$/, (_, prefix, number) => {
        const nextNumber = Number(number) + 1;
        return `${prefix}${String(nextNumber).padStart(number.length, "0")}`;
      })
    : undefined;

  const [formData, setFormData] = useState({
    customerName: "",
    contactPersonName: "",
    phoneNumber: "",
    emailAddress: "",
    billingAddress: "",
    taxRegistrationNumber: "",
    creditLimitAmount: "",
    paymentTermDays: 30,
    openingBalanceAmount: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        customerName: formData.customerName,
        contactPersonName: formData.contactPersonName,
        phoneNumber: formData.phoneNumber,
        emailAddress: formData.emailAddress,
        billingAddress: formData.billingAddress,
        taxRegistrationNumber: formData.taxRegistrationNumber,
        creditLimitAmount: Number(formData.creditLimitAmount) || 0,
        paymentTermDays: Number(formData.paymentTermDays) || 30,
        openingBalanceAmount: Number(formData.openingBalanceAmount) || 0,
        isActive: isActive,
      };

      await createCustomerMutation.mutateAsync(payload);
      toast.success("Customer created successfully!");
      navigate("/customers");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create customer. Please try again.");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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

      <form onSubmit={handleSubmit}>
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
                  value={nextCustomerCode || (isCustomersLoading ? "Loading..." : "Auto-generated")}
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Customer Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  placeholder="Enter customer name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Contact Person <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contactPersonName}
                  onChange={(e) => handleInputChange("contactPersonName", e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  placeholder="Enter contact person name"
                  required
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
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.emailAddress}
                  onChange={(e) => handleInputChange("emailAddress", e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  placeholder="Enter email address"
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
                  value={formData.billingAddress}
                  onChange={(e) => handleInputChange("billingAddress", e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 resize-none"
                  placeholder="Enter billing address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tax Registration Number (NTN/STRN)
                </label>
                <input
                  type="text"
                  value={formData.taxRegistrationNumber}
                  onChange={(e) => handleInputChange("taxRegistrationNumber", e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  placeholder="Enter tax registration number"
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
                  type="number"
                  value={formData.creditLimitAmount}
                  onChange={(e) => handleInputChange("creditLimitAmount", e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  placeholder="Enter credit limit"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Payment Terms
                </label>
                <div className="relative">
                  <select
                    value={formData.paymentTermDays}
                    onChange={(e) => handleInputChange("paymentTermDays", e.target.value)}
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="15">Net 15 Days</option>
                    <option value="30">Net 30 Days</option>
                    <option value="60">Net 60 Days</option>
                    <option value="0">Cash on Delivery</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Opening Balance (Rs.)
                </label>
                <input
                  type="number"
                  value={formData.openingBalanceAmount}
                  onChange={(e) => handleInputChange("openingBalanceAmount", e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  placeholder="Enter opening balance"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-6 flex justify-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <button
          type="button"
          onClick={() => navigate("/customers")}
          className="rounded-lg border border-slate-200 bg-white px-6 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={createCustomerMutation.isPending}
          className="rounded-lg bg-[#133E87] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#0f326e] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createCustomerMutation.isPending ? "Saving..." : "Save Profile"}
        </button>
      </div>
      </form>
    </main>
  );
}

export default AddCustomers;
