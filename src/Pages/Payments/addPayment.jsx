import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useGetPaymentFormOptions, useCreatePayment } from "../../queries/payments/payments.queries";
import { useToast } from "../../utils/GlobalToast";

function AddPayment() {
  const navigate = useNavigate();
  const toast = useToast();
  const [paymentDirection, setPaymentDirection] = useState("receive");
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [formData, setFormData] = useState({
    paymentDate: "",
    customerId: "",
    paymentMethod: "",
    accountId: "",
    referenceNumber: "",
  });
  const { data: formOptions, isLoading: optionsLoading } = useGetPaymentFormOptions();
  const createMutation = useCreatePayment();

  const invoices = formOptions?.data?.outstandingInvoices || [];

  const handleInputChange = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const handleInvoiceToggle = (invoiceId) => {
    setSelectedInvoices((prev) =>
      prev.includes(invoiceId)
        ? prev.filter((id) => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const allocations = selectedInvoices.map((invoiceId) => {
        const invoice = invoices.find((inv) => (inv._id || inv.saleId) === invoiceId);
        return {
          saleId: invoice?._id || invoiceId,
          amountApplied: Number(paymentAmount) || 0,
        };
      });

      await createMutation.mutateAsync({
        direction: paymentDirection,
        paymentDate: formData.paymentDate || null,
        customerId: formData.customerId,
        paymentAmount: Number(paymentAmount) || 0,
        paymentMethod: formData.paymentMethod,
        accountId: formData.accountId,
        referenceNumber: formData.referenceNumber,
        allocations,
      });
      toast.success("Payment recorded successfully!");
      navigate("/payments");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to record payment. Please try again.");
    }
  };

  const getAllocationRemarks = () => {
    if (selectedInvoices.length === 0) return "";
    const amount = parseInt(paymentAmount) || 0;
    const selectedInvoice = invoices.find((inv) => (inv._id || inv.saleId) === selectedInvoices[0]);
    if (selectedInvoice) {
      const outstanding = selectedInvoice.outstandingAmount || selectedInvoice.outstanding;
      const newBalance = outstanding - amount;
      const invoiceNumber = selectedInvoice.saleNumber || selectedInvoice.saleId || selectedInvoice._id;
      return `Rs. ${amount.toLocaleString()} applied to ${invoiceNumber} (New Bal: Rs. ${newBalance.toLocaleString()})`;
    }
    return "";
  };

  return (
    <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <form onSubmit={handleSubmit}>
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
                      value={
                        formOptions?.data?.nextPaymentNumber || "Loading..."
                      }
                      className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-BLUE-dark mb-1.5">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      value={formData.paymentDate}
                      onChange={(event) =>
                        handleInputChange("paymentDate", event.target.value)
                      }
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-BLUE-dark mb-1.5">
                    Payment Direction
                  </label>
                  <div className="grid grid-cols-2 gap-3 w-full bg-[#F9FAFB] rounded-md py-3">
                    {formOptions?.data?.directions?.map((direction) => (
                      <button
                        key={direction.value}
                        type="button"
                        onClick={() => setPaymentDirection(direction.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          paymentDirection === direction.value
                            ? "bg-white text-accent-blue border border-[#1E40AF] rounded"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {direction.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-semibold text-BLUE-dark mb-1.5">
                      {paymentDirection === "receive"
                        ? "Select Customer"
                        : "Select Supplier"}{" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.customerId}
                        onChange={(event) =>
                          handleInputChange("customerId", event.target.value)
                        }
                        disabled={optionsLoading}
                        className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                      >
                        <option value="" disabled>
                          {paymentDirection === "receive"
                            ? "Select customer"
                            : "Select supplier"}
                        </option>
                        {paymentDirection === "receive"
                          ? formOptions?.data?.customers?.map((customer) => (
                              <option key={customer._id} value={customer._id}>
                                {customer.label}
                              </option>
                            ))
                          : formOptions?.data?.suppliers?.map((supplier) => (
                              <option key={supplier._id} value={supplier._id}>
                                {supplier.label}
                              </option>
                            ))}
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
                      value={formOptions?.data?.ledgerBalanceLabel || "Rs. 0"}
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
                        value={formData.paymentMethod}
                        onChange={(event) =>
                          handleInputChange("paymentMethod", event.target.value)
                        }
                        disabled={optionsLoading}
                        className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                      >
                        <option value="" disabled>
                          Select payment method
                        </option>
                        {formOptions?.data?.paymentMethods?.map((method) => (
                          <option key={method.value} value={method.value}>
                            {method.label}
                          </option>
                        ))}
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
                        value={formData.accountId}
                        onChange={(event) =>
                          handleInputChange("accountId", event.target.value)
                        }
                        disabled={optionsLoading}
                        className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                      >
                        <option value="" disabled>
                          Select account
                        </option>
                        {formOptions?.data?.accounts?.map((account) => (
                          <option key={account._id} value={account._id}>
                            {account.label}
                          </option>
                        ))}
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
                      value={formData.referenceNumber}
                      onChange={(event) =>
                        handleInputChange("referenceNumber", event.target.value)
                      }
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
                    key={invoice._id || invoice.saleId}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                      selectedInvoices.includes(invoice._id || invoice.saleId)
                        ? "border-[#1E40AF] bg-emerald-50"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={invoice._id || invoice.saleId}
                      checked={selectedInvoices.includes(
                        invoice._id || invoice.saleId,
                      )}
                      onChange={() =>
                        handleInvoiceToggle(invoice._id || invoice.saleId)
                      }
                      className="h-4 w-4 rounded border-slate-300 text-[#008951] focus:ring-[#008951]"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={invoice._id || invoice.saleId}
                        className={`text-sm font-bold cursor-pointer ${
                          selectedInvoices.includes(
                            invoice._id || invoice.saleId,
                          )
                            ? "text-accent-blue"
                            : "text-BLUE-dark"
                        }`}
                      >
                        Invoice {invoice.saleNumber || invoice.saleId}
                      </label>
                      <div>
                        <p className="gap-6 mt-1 text-[11px] text-tertiary">
                          Invoice Total: Rs.{" "}
                          {(
                            invoice.totalAmount || invoice.total
                          ).toLocaleString()}
                        </p>
                        <p
                          className={`gap-6 mt-1 text-[12px] font-semibold ${
                            selectedInvoices.includes(
                              invoice._id || invoice.saleId,
                            )
                              ? "text-error"
                              : "text-tertiary"
                          }`}
                        >
                          Outstanding: Rs.{" "}
                          {(
                            invoice.outstandingAmount || invoice.outstanding
                          ).toLocaleString()}
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
            type="button"
            onClick={() => navigate("/payments")}
            className="rounded-lg border border-slate-200 bg-white px-6 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-lg bg-gradient-bg-blue px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#0f326e] disabled:opacity-60"
          >
            {createMutation.isPending
              ? "Recording..."
              : "Record Voucher Payment"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AddPayment;
