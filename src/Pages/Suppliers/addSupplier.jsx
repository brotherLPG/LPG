import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { useToast } from "../../utils/GlobalToast";
import { useCreateSupplier } from "../../queries/suppliers/suppliers.queries";

function AddSupplier() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);
  const toast = useToast();

  const [supplierName, setSupplierName] = useState("");
  const [contactPersonName, setContactPersonName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [taxRegistrationNumber, setTaxRegistrationNumber] = useState("");
  const [paymentTermDays, setPaymentTermDays] = useState("30");
  const [creditLimitAmount, setCreditLimitAmount] = useState("");
  const [openingBalanceAmount, setOpeningBalanceAmount] = useState(0);
  const [bankName, setBankName] = useState("");
    const [bankAccountTitle, setBankAccountTitle] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [iban, setIban] = useState("");

  const createMutation = useCreateSupplier();


    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
      
         const payload = {
           supplierName,
           contactPersonName,
           phoneNumber,
           emailAddress,
           isActive,
           paymentTermDays:
             paymentTermDays === "COD" ? 0 : parseInt(paymentTermDays, 10),
           creditLimitAmount: Number(creditLimitAmount) || 0,
           openingBalanceAmount: Number(openingBalanceAmount) || 0,
           businessAddress,
           city,
           stateProvince,
           taxRegistrationNumber,
           bankName,
           bankAccountTitle,
           bankAccountNumber,
           iban,
         };

        await createMutation.mutateAsync(payload);
        toast.success("supplier created successfully!");
        navigate("/suppliers");
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to create supplier. Please try again.",
        );
      }
    };

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
            onClick={() => navigate("/suppliers")}
            className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            Suppliers
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span className="font-semibold text-slate-600">Add Supplier</span>
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Add Supplier
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Register a new LPG supplier and set up purchase account
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Supplier Information */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-800">
                Supplier Information
              </h2>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Supplier Code
                </label>
                <input
                  type="text"
                  disabled
                  value="SUP-008"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Supplier / Company Name{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Attock Gas Ltd."
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-emerald-100 focus:border-[#008951]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Contact Person <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Full name of contact representative"
                  value={contactPersonName}
                  onChange={(e) => setContactPersonName(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. +92 300 1234567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. supplier@domain.com"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status Toggle
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isActive ? "bg-[#10b981]" : "bg-slate-200"}`}
                    role="switch"
                    aria-checked={isActive}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                  <span
                    className={`text-sm font-semibold ${isActive ? "text-[#008951]" : "text-[error]"}`}
                  >
                    {isActive ? "Active Supplier" : "Inactive Supplier"}
                    {/* Active Supplier */}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (lg:col-span-1) */}
        <div className="lg:col-span-1">
          {/* Card 2: Payment & Credit Terms */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-full">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-800">
                Payment & Credit Terms
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Payment Terms <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={paymentTermDays}
                    onChange={(e) => setPaymentTermDays(e.target.value)}
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="15">Net 15 Days</option>
                    <option value="30">Net 30 Days</option>
                    <option value="45">Net 45 Days</option>
                    <option value="60">Net 60 Days</option>
                    <option value="COD">Cash On Delivery</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Credit Limit (Rs.)
                </label>
                  <input
                    type="text"
                    placeholder="e.g. 1,500,000"
                    value={creditLimitAmount}
                    onChange={(e) => setCreditLimitAmount(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Opening Balance (Rs.)
                </label>
                <input
                  type="text"
                  value={openingBalanceAmount}
                  onChange={(e) => setOpeningBalanceAmount(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Address & Tax Details */}
        <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-800">
              Address & Tax Details
            </h2>
          </div>
          <div className="p-5 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Business Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows="2"
                placeholder="Plot, Street, Area, Sector, Industrial Area..."
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 resize-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  City
                </label>
                  <input
                    type="text"
                    placeholder="e.g. Islamabad"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  State/Province
                </label>
                  <input
                    type="text"
                    placeholder="e.g. Punjab"
                    value={stateProvince}
                    onChange={(e) => setStateProvince(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tax Registration Number (NTN/STRN)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1234567-8"
                  value={taxRegistrationNumber}
                  onChange={(e) => setTaxRegistrationNumber(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Bank Details */}
        <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-800">
              Bank Details
            </h2>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Bank Name
              </label>
                  <input
                    type="text"
                    placeholder="e.g. Habib Bank Limited"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Account Title
              </label>
                  <input
                    type="text"
                    placeholder="e.g. Attock Gas Accounts"
                    value={bankAccountTitle}
                    onChange={(e) => setBankAccountTitle(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Account Number
              </label>
                  <input
                    type="text"
                    placeholder="e.g. 12345678901234"
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                IBAN
              </label>
                  <input
                    type="text"
                    placeholder="e.g. PK00 HABB 0000 0012 3456 78"
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-6 flex justify-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <button
          onClick={() => navigate("/suppliers")}
          className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          // onClick={() => {
          //   const payload = {
          //     supplierName,
          //     contactPersonName,
          //     phoneNumber,
          //     emailAddress,
          //     businessAddress,
          //     taxRegistrationNumber,
          //     paymentTermDays: paymentTermDays === 'COD' ? 0 : parseInt(paymentTermDays, 10),
          //     openingBalanceAmount: Number(openingBalanceAmount) || 0,
          //     isActive,
          //   };

          //   createMutation.mutate(payload, {
          //     onSuccess: () => {
          //       toast.success('Supplier created successfully');
          //       navigate('/suppliers');
          //     },
          //     onError: () => {
          //       toast.error('Failed to create supplier. Please try again.');
          //     }
          //   });
          // }}
          onClick={handleSubmit}
          disabled={createMutation.isPending}
          className="rounded-lg bg-[#008951] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#007545] disabled:opacity-60"
        >
          {createMutation.isPending ? "Saving..." : "Save Supplier"}
        </button>
      </div>
    </main>
  );
}

export default AddSupplier;
