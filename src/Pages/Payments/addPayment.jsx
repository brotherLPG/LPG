import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useGetPaymentFormOptions, useCreatePayment } from "../../queries/payments/payments.queries";
import { useToast } from "../../utils/GlobalToast";

const formatInvoiceDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const parseAmount = (value) =>
  Number(String(value || "").replace(/,/g, "").trim()) || 0;

function AddPayment() {
  const navigate = useNavigate();
  const toast = useToast();
  const [paymentDirection, setPaymentDirection] = useState("receive");
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [allocationAmounts, setAllocationAmounts] = useState({});
  const [paymentAmount, setPaymentAmount] = useState("");
  const [formData, setFormData] = useState({
    paymentDate:  new Date().toLocaleDateString("en-CA"),
    customerId: "",
    paymentMethod: "",
    accountId: "",
    referenceNumber: "",
  });
  const { data: formOptions, isLoading: optionsLoading } = useGetPaymentFormOptions();

  const isCustomerReceipt = paymentDirection === "receive";
  const partyParams = formData.customerId
    ? isCustomerReceipt
      ? { customerId: formData.customerId }
      : { supplierId: formData.customerId }
    : undefined;

  const {
    data: partyFormOptions,
    isFetching: isPartyOptionsLoading,
  } = useGetPaymentFormOptions(partyParams, {
    enabled: Boolean(partyParams),
  });

  const createMutation = useCreatePayment();
  const outstandingInvoices = Array.isArray(
    partyFormOptions?.data?.outstandingInvoices
  )
    ? partyFormOptions.data.outstandingInvoices
    : [];
  const invoices = outstandingInvoices;
  const ledgerBalanceLabel =
    partyFormOptions?.data?.ledgerBalanceLabel ||
    (formData.customerId ? "Loading..." : "Rs. 0");

  const handleInputChange = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const handleDirectionChange = (value) => {
    setPaymentDirection(value);
    handleInputChange("customerId", "");
    setSelectedInvoices([]);
    setAllocationAmounts({});
  };

  const handlePartyChange = (value) => {
    handleInputChange("customerId", value);
    setSelectedInvoices([]);
    setAllocationAmounts({});
  };

  const getInvoiceId = (invoice) => invoice._id;

  const getInvoiceLabel = (invoice) =>
    invoice.invoiceNumber || invoice.saleNumber || invoice._id;

  const handleInvoiceToggle = (invoice) => {
    const invoiceId = getInvoiceId(invoice);
    const isSelected = selectedInvoices.includes(invoiceId);

    if (isSelected) {
      setSelectedInvoices((prev) => prev.filter((id) => id !== invoiceId));
      setAllocationAmounts((prev) => {
        const next = { ...prev };
        delete next[invoiceId];
        return next;
      });
      return;
    }

    setSelectedInvoices((prev) => [...prev, invoiceId]);
    setAllocationAmounts((prev) => ({
      ...prev,
      [invoiceId]: String(invoice.outstandingAmount ?? 0),
    }));
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === invoices.length) {
      setSelectedInvoices([]);
      setAllocationAmounts({});
      return;
    }

    setSelectedInvoices(invoices.map((invoice) => getInvoiceId(invoice)));
    setAllocationAmounts(
      Object.fromEntries(
        invoices.map((invoice) => [
          getInvoiceId(invoice),
          String(invoice.outstandingAmount ?? 0),
        ])
      )
    );
  };

  const handleAllocationAmountChange = (invoiceId, value) => {
    setAllocationAmounts((prev) => ({
      ...prev,
      [invoiceId]: value,
    }));
  };

  const buildAllocations = () =>
    selectedInvoices
      .map((invoiceId) => {
        const invoice = outstandingInvoices.find((item) => item._id === invoiceId);
        if (!invoice) return null;

        const outstanding = parseAmount(invoice.outstandingAmount);
        const typedAmount = parseAmount(allocationAmounts[invoiceId]);
        const amountApplied = Math.min(typedAmount || outstanding, outstanding);

        if (amountApplied <= 0) return null;

        if (isCustomerReceipt) {
          return {
            saleId: invoice.saleId || invoice._id,
            amountApplied,
          };
        }

        return {
          lpgReceiptId: invoice.lpgReceiptId || invoice._id,
          amountApplied,
        };
      })
      .filter(Boolean);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const allocations = buildAllocations();
      const allocatedTotal = allocations.reduce(
        (sum, allocation) => sum + allocation.amountApplied,
        0
      );

      const payload = {
        direction: paymentDirection,
        paymentDate: formData.paymentDate || null,
        paymentAmount: parseAmount(paymentAmount) || allocatedTotal,
        paymentMethod: formData.paymentMethod,
        accountId: formData.accountId,
        referenceNumber: formData.referenceNumber,
        allocations,
      };

      if (isCustomerReceipt) {
        payload.customerId = formData.customerId;
      } else {
        payload.supplierId = formData.customerId;
      }

      await createMutation.mutateAsync(payload);
      toast.success("Payment recorded successfully!");
      navigate("/payments");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to record payment. Please try again.");
    }
  };

  const appliedAmountsTotal = selectedInvoices.reduce(
    (total, invoiceId) => total + parseAmount(allocationAmounts[invoiceId]),
    0
  );
  const appliedAmountsLabel = appliedAmountsTotal
    ? `Rs. ${appliedAmountsTotal.toLocaleString()}`
    : "";

  const invoiceEmptyMessage = !formData.customerId
    ? isCustomerReceipt
      ? "Select a customer to load outstanding invoices."
      : "Select a supplier to load outstanding invoices."
    : isPartyOptionsLoading
      ? "Loading outstanding invoices..."
      : "No outstanding invoices found.";

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

        <div className="space-y-6">
          <div className="gap-6">
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
                        onClick={() => handleDirectionChange(direction.value)}
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
                      {isCustomerReceipt
                        ? "Select Customer"
                        : "Select Supplier"}{" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.customerId}
                        onChange={(event) =>
                          handlePartyChange(event.target.value)
                        }
                        disabled={optionsLoading}
                        className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                      >
                        <option value="" disabled>
                          {isCustomerReceipt
                            ? "Select customer"
                            : "Select supplier"}
                        </option>
                        {isCustomerReceipt
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
                      Remaining Amount
                    </label>
                    <input
                      type="text"
                      disabled
                      value={ledgerBalanceLabel}
                      className="w-full rounded-md border font-bold border-slate-200 bg-[#FEF2F2] px-3 py-2 text-sm text-error outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Card 3: Financial Execution Details */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden mt-3">
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

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-[16px] font-bold text-BLUE-dark">
                Invoice Auto-Allocation
              </h2>
              <p className="mt-1 text-sm text-tertiary">
                Select invoices and enter the amount to apply to each.
              </p>
            </div>
            <div className="overflow-x-auto">
              {invoices.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-slate-500">
                  {invoiceEmptyMessage}
                </p>
              ) : (
                <table className="w-full min-w-180 text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={
                            invoices.length > 0 &&
                            selectedInvoices.length === invoices.length
                          }
                          onChange={handleSelectAll}
                          className="h-4 w-4 rounded border-slate-300 text-[#008951] focus:ring-[#008951]"
                        />
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">
                        Invoice #
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">
                        Sale #
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">
                        Date
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-700">
                        Total (Rs.)
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-700">
                        Outstanding (Rs.)
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-slate-700">
                        Amount to apply (Rs.)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => {
                      const invoiceId = getInvoiceId(invoice);
                      const isSelected = selectedInvoices.includes(invoiceId);

                      return (
                        <tr
                          key={invoiceId}
                          className={`border-b border-slate-100 last:border-0 ${
                            isSelected ? "bg-emerald-50/70" : "hover:bg-slate-50"
                          }`}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleInvoiceToggle(invoice)}
                              className="h-4 w-4 rounded border-slate-300 text-[#008951] focus:ring-[#008951]"
                            />
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#1a56db]">
                            {invoice.invoiceNumber || getInvoiceLabel(invoice)}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {invoice.saleNumber || "—"}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {formatInvoiceDate(invoice.invoiceDate) || "—"}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-700">
                            {Number(invoice.totalAmount || 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-slate-800">
                            {Number(invoice.outstandingAmount || 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {isSelected ? (
                              <input
                                type="text"
                                value={allocationAmounts[invoiceId] ?? ""}
                                onChange={(event) =>
                                  handleAllocationAmountChange(
                                    invoiceId,
                                    event.target.value
                                  )
                                }
                                className="w-32 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-right text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                              />
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
            <div className="border-t border-slate-100 p-4">
              <label className="block text-sm font-normal text-tertiary mb-1.5">
                Allocation Remarks
              </label>
              <p className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                {appliedAmountsLabel || "—"}
              </p>
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
