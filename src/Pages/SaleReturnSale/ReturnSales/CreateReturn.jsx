import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateReturnSale,
  useReturnSaleFormOptions,
} from "../../../queries/returnsales/returnsales.queries";
import { useSaleById, useSales } from "../../../queries/sales/sales.queries";
import { useToast } from "../../../utils/GlobalToast";

function CreateReturn() {
  const navigate = useNavigate();
  const toast = useToast();
  const { data: formOptions } = useReturnSaleFormOptions();
  const createReturnMutation = useCreateReturnSale();

  const [returnQuantities, setReturnQuantities] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedSaleId, setSelectedSaleId] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [returnDate, setReturnDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [inspectionNotes, setInspectionNotes] = useState("");

  const customers = formOptions?.data?.customers || [];
  const returnReasons = formOptions?.data?.returnReasons || [];
  const actionType = formOptions?.data?.actionType;
  const nextReturnNumber = formOptions?.data?.nextReturnNumber;

  const { data: salesData, isLoading: isLoadingSales } = useSales(
    {
      page: 1,
      limit: 100,
      customerId: selectedCustomer,
    },
    { enabled: Boolean(selectedCustomer) }
  );

  const customerSales = salesData?.data?.items || [];

  const { data: saleResponse, isLoading: isLoadingSale } =
    useSaleById(selectedSaleId);
  const originalSale = saleResponse?.data;

  const returnedItems = (originalSale?.lineItems || []).map((item, index) => {
    const inventoryItemId = item.inventoryItemId;
    return {
      id: item._id || inventoryItemId || index + 1,
      inventoryItemId,
      itemName: item.itemName || item.itemCode || "Item",
      originalQty: Number(item.quantity) || 0,
      returnQty: returnQuantities[inventoryItemId] ?? "",
      unitPrice: Number(item.unitPriceAmount) || 0,
    };
  });

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount || 0).toLocaleString()}`;
  };

  const getReasonValue = (reason) =>
    typeof reason === "string" ? reason : reason?.value ?? "";

  const getReasonLabel = (reason) =>
    typeof reason === "string" ? reason : reason?.label ?? reason?.value ?? "";

  const updateReturnQty = (inventoryItemId, value) => {
    const item = returnedItems.find(
      (row) => row.inventoryItemId === inventoryItemId
    );
    const numericValue = value === "" ? "" : Number(value);
    const cappedQty =
      numericValue === ""
        ? ""
        : Math.min(Math.max(numericValue, 0), item?.originalQty || 0);

    setReturnQuantities((prev) => ({
      ...prev,
      [inventoryItemId]: cappedQty,
    }));
  };

  const returnValue = returnedItems.reduce((total, item) => {
    const qty = Number(item.returnQty) || 0;
    return total + qty * (Number(item.unitPrice) || 0);
  }, 0);

  const suppliedItemsSummary =
    originalSale?.lineItems
      ?.map((item) => `${item.itemName || item.itemCode} (${item.quantity})`)
      .join(", ") || "—";

  const handleCustomerChange = (customerId) => {
    setSelectedCustomer(customerId);
    setSelectedSaleId("");
    setReturnQuantities({});
  };

  const handleSaleChange = (saleId) => {
    setSelectedSaleId(saleId);
    setReturnQuantities({});
  };

  const handleSubmit = async () => {
    const returnItems = returnedItems
      .filter((item) => item.inventoryItemId && Number(item.returnQty) > 0)
      .map((item) => ({
        inventoryItemId: item.inventoryItemId,
        quantity: Number(item.returnQty),
      }));

    if (!selectedSaleId) {
      toast.error("Please select the original sale.");
      return;
    }

    if (!returnDate) {
      toast.error("Please select a return date.");
      return;
    }

    if (!selectedReason) {
      toast.error("Please select a reason for return.");
      return;
    }

    if (returnItems.length === 0) {
      toast.error("Please enter a return quantity for at least one item.");
      return;
    }

    const payload = {
      originalSaleId: selectedSaleId,
      returnDate,
      returnReason: selectedReason,
      returnItems,
    };

    try {
      await createReturnMutation.mutateAsync(payload);
      toast.success("Sales return processed successfully!");
      navigate("/sales?tab=returns");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to process return. Please try again."
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
            className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
          >
            Dashboard
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span
            onClick={() => navigate("/sales?tab=returns")}
            className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
          >
            Sales
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span className="font-semibold">Process Sales Return</span>
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
          Process Sales Return
        </h1>
        <p className="text-sm text-tertiary">
          Process customer returns and issue credit notes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Return Information */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-[16px] font-bold text-BLUE-dark">
                Return Information
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Return Reference No
                  </label>
                  <input
                    type="text"
                    disabled
                    value={nextReturnNumber || "(Loading...)"}
                    className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Return Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Customer entity <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedCustomer}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.label ||
                        `${customer.customerCode} - ${customer.customerName}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Original Sale / Invoice Reference */}
          <div className="rounded-xl border border-slate-200  shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4 bg-white">
              <h2 className="text-[16px] font-bold text-BLUE-dark">
                Original Sale / Invoice Reference
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Original Invoice Number{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedSaleId}
                  onChange={(e) => handleSaleChange(e.target.value)}
                  disabled={!selectedCustomer}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {!selectedCustomer
                      ? "Select a customer first"
                      : isLoadingSales
                        ? "Loading invoices..."
                        : "Select original invoice"}
                  </option>
                  {customerSales.map((sale) => (
                    <option key={sale._id} value={sale._id}>
                      {sale.invoiceNumber || sale.saleNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 gap-5">
                <div>
                  <label className="block text-sm font-medium text-4th-color">
                    Original customer
                  </label>
                  <p className="text-BLUE-dark text-[13px] font-semibold">
                    {originalSale?.customerName || "—"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-4th-color">
                    Original Date
                  </label>
                  <p className="text-BLUE-dark text-[13px] font-semibold">
                    {originalSale ? formatDate(originalSale.invoiceDate) : "—"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-4th-color">
                    Original Invoice Total
                  </label>
                  <p className="text-accent-blue text-[13px] font-semibold">
                    {originalSale
                      ? formatCurrency(originalSale.totalAmount)
                      : "—"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-4th-color">
                    Supplied Items Summary
                  </label>
                  <p className="text-BLUE-dark text-[13px] font-semibold">
                    {isLoadingSale ? "Loading..." : suppliedItemsSummary}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Returned Items Details */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4 flex justify-between items-center">
              <h2 className="text-[16px] font-bold text-BLUE-dark">
                Returned Items Details
              </h2>
            </div>
            <div className="p-5 overflow-x-auto">
              <table className="w-full min-w-180 border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600">
                      Item Name
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600">
                      Original Invoice Qty
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600">
                      Return Qty
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600">
                      Unit Price (Rs.)
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600">
                      Return Amount (Rs.)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {returnedItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-2 py-6 text-center text-sm text-slate-500"
                      >
                        {selectedSaleId
                          ? isLoadingSale
                            ? "Loading sale items..."
                            : "No items found on this sale."
                          : "Select an original invoice to load items."}
                      </td>
                    </tr>
                  ) : (
                    returnedItems.map((item) => {
                      const returnAmount =
                        (Number(item.returnQty) || 0) *
                        (Number(item.unitPrice) || 0);

                      return (
                        <tr
                          key={item.id}
                          className="border-b border-slate-100 last:border-b-0"
                        >
                          <td className="px-2 py-2 text-sm text-slate-900">
                            {item.itemName}
                          </td>
                          <td className="px-2 py-2 text-sm text-slate-900">
                            {item.originalQty}
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              min="0"
                              max={item.originalQty}
                              value={item.returnQty}
                              onChange={(e) =>
                                updateReturnQty(
                                  item.inventoryItemId,
                                  e.target.value
                                )
                              }
                              placeholder="0"
                              className="w-24 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 outline-none focus:border-[#008951]"
                            />
                          </td>
                          <td className="px-2 py-2 text-sm text-slate-900">
                            {Number(item.unitPrice).toLocaleString()}
                          </td>
                          <td className="px-2 py-2 text-sm font-medium text-slate-900">
                            {returnAmount.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (lg:col-span-1) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Card 4: Adjustment Summary */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-[16px] font-bold text-BLUE-dark">
                Adjustment Summary
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Reason for Return <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">Select Reason</option>
                  {returnReasons.map((reason) => {
                    const value = getReasonValue(reason);
                    return (
                      <option key={value} value={value}>
                        {getReasonLabel(reason)}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-4th-color">
                  Action Type
                </label>
                <p className="text-sm BLUE-dark font-medium">
                  {actionType?.label || "Credit to Customer Ledger Account"}
                </p>
              </div>
              <div className="flex flex-row justify-between my-auto items-center">
                <label className="block text-[14px] font-bold text-BLUE-dark">
                  Return Value
                </label>
                <p className="text-2xl text-error font-extrabold">
                  {formatCurrency(returnValue)}
                </p>
              </div>
            </div>
          </div>

          {/* Card 5: Quality Control Notes */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-[16px] font-bold text-BLUE-dark">
                Quality Control Notes
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Inspection Notes
                </label>
                <textarea
                  rows="4"
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  placeholder="Document quality control findings and inspection results..."
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 resize-none"
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
          onClick={() => navigate("/sales?tab=returns")}
          className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={createReturnMutation.isPending}
          className="rounded-lg bg-gradient-bg-blue px-6 py-2 text-sm font-medium text-white transition hover:bg-[#007545] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {createReturnMutation.isPending
            ? "Processing..."
            : "Process Return (Issue Credit)"}
        </button>
      </div>
    </main>
  );
}

export default CreateReturn;
