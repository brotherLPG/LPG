import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

function AddPayment() {
  const navigate = useNavigate();
  const [paymentDirection, setPaymentDirection] = useState("inward");
  const [selectedInvoices, setSelectedInvoices] = useState(["INV-9982"]);
  const [paymentAmount, setPaymentAmount] = useState("50000");

  const invoices = [
    { id: "INV-9982", total: 220000, outstanding: 175000 },
    { id: "INV-9854", total: 185000, outstanding: 45000 },
  ];

  const handleInvoiceToggle = (invoiceId) => {
    setSelectedInvoices((prev) =>
      prev.includes(invoiceId)
        ? prev.filter((id) => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const getAllocationRemarks = () => {
    if (selectedInvoices.length === 0) return "";
    const amount = parseInt(paymentAmount) || 0;
    const selectedInvoice = invoices.find((inv) => inv.id === selectedInvoices[0]);
    if (selectedInvoice) {
      const newBalance = selectedInvoice.outstanding - amount;
      return `Rs. ${amount.toLocaleString()} applied to ${selectedInvoice.id} (New Bal: Rs. ${newBalance.toLocaleString()})`;
    }
    return "";
  };

  return (
    <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header & Breadcrumbs */}
      <div className="mb-6">
        <p className="text-xs">
          <span
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
          >
            Dashboard
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span
            onClick={() => navigate("/payments")}
            className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
          >
            Payments
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span className="font-semibold text-slate-600">Add Payment</span>
        </p>
        <h1 className=" text-2xl font-bold tracking-tight text-BLUE-dark mt-2">
          Record Payment Voucher
        </h1>
        <p className="text-sm text-tertiary">
          Book financial collections from distributors or clear bulk supplier
          ledger invoices
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left Column (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Voucher & Party Configuration */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="border-b border-slate-100 text-[16px] font-bold text-BLUE-dark">
                Voucher & Party Configuration
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-semibold text-BLUE-dark mb-1.5">
                    Payment Voucher No
                  </label>
                  <input
                    type="text"
                    disabled
                    value="PAY-2026-0312"
                    className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-BLUE-dark mb-1.5">
                    Posting Date
                  </label>
                  <input
                    type="date"
                    defaultValue="2026-08-21"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-BLUE-dark mb-1.5">
                  Payment Direction
                </label>
                <div className="grid grid-cols-2 gap-3 w-full bg-[#F9FAFB] rounded-md py-3">
                  <button
                    type="button"
                    onClick={() => setPaymentDirection("inward")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      paymentDirection === "inward"
                        ? "bg-white text-accent-blue border border-[#1E40AF] rounded"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Customer Receipt (Inward)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentDirection("outward")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      paymentDirection === "outward"
                        ? "bg-white text-accent-blue border border-[#1E40AF] rounded"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Supplier Payment (Outward)
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-semibold text-BLUE-dark mb-1.5">
                    Select Customer / Party{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      defaultValue="Islamabad Gas Agency"
                      className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="" disabled>
                        Select party
                      </option>
                      <option value="Islamabad Gas Agency">
                        Islamabad Gas Agency
                      </option>
                      <option value="Pakistan Petroleum Ltd.">
                        Pakistan Petroleum Ltd.
                      </option>
                      <option value="Sui Northern Gas Pipelines">
                        Sui Northern Gas Pipelines
                      </option>
                      <option value="Attock Refinery Ltd.">
                        Attock Refinery Ltd.
                      </option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-BLUE-dark mb-1.5">
                    Current Ledger Balance
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Rs. 175,000 Outstanding"
                    className="w-full rounded-md border font-bold border-slate-200 bg-[#FEF2F2] px-3 py-2 text-sm text-error outline-none cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Card 3: Financial Execution Details */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="border-b border-slate-100 text-[16px] font-bold text-BLUE-dark">
                Financial Execution Details
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-BLUE-dark mb-1.5">
                    Payment Amount Received (Rs.){" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="50,000"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-BLUE-dark mb-1.5">
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
                      <option value="Online Payment">Online Payment</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-BLUE-dark mb-1.5">
                    Target Plant Account{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      defaultValue="Bank Account - ACC-002"
                      className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="" disabled>
                        Select account
                      </option>
                      <option value="Bank Account - ACC-002">
                        Bank Account - ACC-002
                      </option>
                      <option value="Bank Account - ACC-001">
                        Bank Account - ACC-001
                      </option>
                      <option value="Cash Account">Cash Account</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-BLUE-dark mb-1.5">
                    Transaction / Cheque Reference No
                  </label>
                  <input
                    type="text"
                    defaultValue="TRF-88421"
                    placeholder="e.g. TRF-88421"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (lg:col-span-1) */}
        <div className=" w-full">
          {/* Card 2: Invoice Auto-Allocation */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="border-b border-slate-100 text-[16px] font-bold text-BLUE-dark">
                Invoice Auto-Allocation
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-tertiary">
                Select outstanding invoices to apply Rs.
                {parseInt(paymentAmount || 0).toLocaleString()} credit
              </p>

              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                    selectedInvoices.includes(invoice.id)
                      ? "border-[#1E40AF] bg-emerald-50"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    id={invoice.id}
                    checked={selectedInvoices.includes(invoice.id)}
                    onChange={() => handleInvoiceToggle(invoice.id)}
                    className="h-4 w-4 rounded border-slate-300 text-[#008951] focus:ring-[#008951]"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={invoice.id}
                      className={`text-sm font-bold cursor-pointer ${
                        selectedInvoices.includes(invoice.id)
                          ? "text-accent-blue"
                          : "text-BLUE-dark"
                      }`}
                    >
                      Invoice {invoice.id}
                    </label>
                    <div>
                      <p className="gap-6 mt-1 text-[11px] text-tertiary">
                        Invoice Total: Rs. {invoice.total.toLocaleString()}
                      </p>
                      <p
                        className={`gap-6 mt-1 text-[12px] font-semibold ${
                          selectedInvoices.includes(invoice.id)
                            ? "text-error"
                            : "text-tertiary"
                        }`}
                      >
                        Outstanding: Rs. {invoice.outstanding.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <div>
                <label className="block text-sm font-normal text-tertiary mb-1.5">
                  Allocation Remarks
                </label>
                <input
                  type="text"
                  disabled
                  value={getAllocationRemarks()}
                  className="w-full rounded-md border border-none bg-white px-3 py-2 text-sm text-text-BLUE-dark outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-6 flex justify-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <button
          onClick={() => navigate("/payments")}
          className="rounded-lg border border-slate-200 bg-white px-6 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          onClick={() => navigate("/payments")}
          className="rounded-lg bg-gradient-bg-blue px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#0f326e]"
        >
          Record Voucher Payment
        </button>
      </div>
    </main>
  );
}

export default AddPayment;
