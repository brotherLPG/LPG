import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { Table } from "@heroui/react";
import { useCreateSale, useGetSaleFormOptions } from "../../../queries/sales/sales.queries";
import { useToast } from "../../../utils/GlobalToast";
import { useGetAccounts } from "../../../queries/accounts/accounts.queries";

function AddSales() {
  const navigate = useNavigate();
  const toast = useToast();
  const [lineItems, setLineItems] = useState([
    { id: 1, product: "", cylinderType: "", quantity: "", unitPrice: "", discount: "", taxRate: 0, total: "" }
  ]);
  const [amountPaid, setAmountPaid] = useState(0);
  const [customerId, setCustomerId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [paymentTermDays, setPaymentTermDays] = useState(0);
  const [remarks, setRemarks] = useState("");
  // const [saveAsDraft, setSaveAsDraft] = useState(false);

  const { data: accountsData } = useGetAccounts({ search: "", page: 1, limit: 100 });
  const accounts = accountsData?.data?.items || [];

  useEffect(() => {
    if (accountId || accounts.length === 0) return;

    const cashAccount = accounts.find((account) => {
      const code = String(account.accountCode || "").toUpperCase();
      const name = String(account.accountName || "").toLowerCase();
      const label = String(account.label || "").toLowerCase();
      return (
        code === "CASH" ||
        name.includes("cash on hand") ||
        label.includes("cash on hand")
      );
    });

    if (cashAccount?._id) {
      setAccountId(cashAccount._id);
    }
  }, [accounts, accountId]);

  const { data: formOptionsResponse, isLoading: optionsLoading } = useGetSaleFormOptions();
  const formOptions = formOptionsResponse?.data || {};
  const customers = formOptions.customers || [];
  const inventoryItems = formOptions.inventoryItems || [];
  // const accounts = formOptions.accounts || [];
  const paymentTerms = formOptions.paymentTerms || [];
  const defaultTaxRate = Number(formOptions.taxRatePercent ?? formOptions.taxRate ?? 0);

  const createSaleMutation = useCreateSale();

  const calculateRow = (item) => {
    const qty = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    const discount = Number(item.discount) || 0;
    const taxRate = Number(item.taxRate) || 0;

    const subtotal = qty * unitPrice;
    const taxAmount = (subtotal - discount) * (taxRate / 100);
    const total = subtotal - discount + taxAmount;

    return {
      subtotal,
      discount,
      taxAmount,
      total,
    };
  };

  const updateLineItem = (id, field, value) => {
    setLineItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updatedItem = { ...item, [field]: value };
        const computed = calculateRow(updatedItem);

        return {
          ...updatedItem,
          total: computed.total,
          rowSubtotal: computed.subtotal,
          rowTax: computed.taxAmount,
        };
      })
    );
  };

  const addLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      { id: prev.length + 1, product: "", cylinderType: "", quantity: "", unitPrice: "", discount: "", taxRate: defaultTaxRate, total: "" }
    ]);
  };

  const removeLineItem = (id) => {
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totals = lineItems.reduce(
    (acc, item) => {
      const row = calculateRow(item);
      acc.subtotal += row.subtotal;
      acc.discount += row.discount;
      acc.tax += row.taxAmount;
      acc.grandTotal += row.total;
      return acc;
    },
    { subtotal: 0, discount: 0, tax: 0, grandTotal: 0 }
  );

  const uniqueTaxRates = [...new Set(lineItems.map((item) => Number(item.taxRate) || 0))];
  const taxRateLabel = uniqueTaxRates.map((rate) => `${rate}%`).join(", ");

  const outstanding = totals.grandTotal - amountPaid;

  const getPaymentStatus = () => {
    if (totals.grandTotal === outstanding) {
      return "Unpaid";
    }

    if (outstanding === 0) {
      return "Paid";
    }

    return "Partially Paid";
  };

  const paymentStatus = getPaymentStatus();

  const handleSubmit = async (isDraft = false) => {
    const saleData = {
      customerId,
      invoiceDate: invoiceDate || new Date().toISOString().split('T')[0],
      paymentTermDays,
      lineItems: lineItems
        .filter(item => item.product && item.quantity)
        .map(item => ({
          inventoryItemId: item.product,
          quantity: Number(item.quantity),
          unitPriceAmount: Number(item.unitPrice),
          discountAmount: Number(item.discount) || 0,
        })),
      tradeDiscountAmount: 0,
      amountPaid: amountPaid,
      accountId,
      remarks,
      saveAsDraft: isDraft,
    };

    try {
      await createSaleMutation.mutateAsync(saleData);
      toast.success(isDraft ? "Sale saved as draft successfully!" : "Sale created successfully!");
      navigate("/sales");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create sale. Please try again.");
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
            onClick={() => navigate("/sales")}
            className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
          >
            Sales
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span className="font-semibold">Create Sales Invoice</span>
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
          Create Sales Invoice
        </h1>
        <p className="text-sm text-tertiary">
          Generate a new sales invoice and allocate inventory
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Invoice General Information */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-[16px] font-bold text-BLUE-dark">
                Invoice General Information
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    disabled
                    value={
                      formOptions.nextInvoiceNumber
                        ? `${formOptions.nextInvoiceNumber} (Auto-generated)`
                        : "Loading..."
                    }
                    className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Invoice Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-1.5'>
                    Customer <span className='text-rose-500'>*</span>
                  </label>
                  <div className='relative'>
                    <select
                      value={customerId}
                      onChange={e => {
                        const selectedId = e.target.value
                        setCustomerId(selectedId)
                        const selectedCustomer = customers.find(
                          customer => customer._id === selectedId
                        )
                        if (selectedCustomer?.paymentTermDays != null) {
                          setPaymentTermDays(Number(selectedCustomer.paymentTermDays))
                        }
                      }}
                      disabled={optionsLoading}
                      className='w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100'
                    >
                      <option value=''>Select customer</option>
                      {customers.map(customer => (
                        <option key={customer._id} value={customer._id}>
                          {customer.label ||
                            `${customer.customerCode} - ${customer.customerName}`}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none' />
                  </div>
                </div>


                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Payment Terms (Days) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={paymentTermDays}
                      onChange={(e) => setPaymentTermDays(Number(e.target.value))}
                      disabled={optionsLoading}
                      className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="">Select payment terms</option>
                      {paymentTerms.map((term) => (
                        <option key={term.value} value={term.value}>
                          {term.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Payment Account <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    disabled={optionsLoading}
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">Select Account</option>
                    {accounts.map((account) => (
                      <option key={account._id} value={account._id}>
                        {account.label || `${account.accountCode} - ${account.accountName}`}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Line Items & Inventory Allocation */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4 flex justify-between items-center">
              <h2 className="text-[16px] font-bold text-BLUE-dark">
                Line Items & Inventory Allocation
              </h2>
              <button
                onClick={addLineItem}
                className="flex items-center gap-2 px-3 py-1.5 border border-[#1E40AF] text-accent-blue rounded-lg text-sm font-medium transition"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>
            <div className="p-5">
              <Table aria-label="Line items table">
                <Table.ScrollContainer>
                  <Table.Content>
                    <Table.Header>
                      <Table.Column className="text-xs font-semibold text-slate-600">Item Name</Table.Column>
                      <Table.Column className="text-xs font-semibold text-slate-600">Qty</Table.Column>
                      <Table.Column className="text-xs font-semibold text-slate-600">Unit Price (Rs.)</Table.Column>
                      <Table.Column className="text-xs font-semibold text-slate-600">Discount (Rs.)</Table.Column>
                      <Table.Column className="text-xs font-semibold text-slate-600">Tax ({taxRateLabel})</Table.Column>
                      <Table.Column className="text-xs font-semibold text-slate-600">Total (Rs.)</Table.Column>
                      <Table.Column className="text-xs font-semibold text-slate-600"></Table.Column>
                    </Table.Header>
                    <Table.Body items={lineItems}>
                      {(item) => {
                        const row = calculateRow(item);

                        return (
                          <Table.Row key={item.id}>
                            <Table.Cell>
                              <select
                                value={item.product}
                                onChange={(e) => {
                                  const selectedItem = inventoryItems.find(inv => inv._id === e.target.value);
                                  const unitPrice = selectedItem?.unitPriceAmount || 0;
                                  setLineItems((prev) =>
                                    prev.map((lineItem) => {
                                      if (lineItem.id !== item.id) return lineItem;
                                      const updatedItem = { ...lineItem, product: e.target.value, unitPrice };
                                      const computed = calculateRow(updatedItem);
                                      return {
                                        ...updatedItem,
                                        total: computed.total,
                                        rowSubtotal: computed.subtotal,
                                        rowTax: computed.taxAmount,
                                      };
                                    })
                                  );
                                }}
                                className="w-40 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 outline-none focus:border-[#008951]"
                              >
                                <option value="">Select</option>
                                {inventoryItems.map((inv) => (
                                  <option key={inv._id} value={inv._id}>
                                    {inv.label || `${inv.itemCode} - ${inv.itemName}`} (Stock: {inv.currentQuantity})
                                  </option>
                                ))}
                              </select>
                            </Table.Cell>
                            <Table.Cell>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateLineItem(item.id, "quantity", e.target.value)}
                                placeholder="0"
                                className="w-24 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 outline-none focus:border-[#008951]"
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <input
                                type="number"
                                value={item.unitPrice}
                                onChange={(e) => updateLineItem(item.id, "unitPrice", e.target.value)}
                                placeholder="0"
                                className="w-24 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 outline-none focus:border-[#008951]"
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <input
                                type="number"
                                value={item.discount}
                                onChange={(e) => updateLineItem(item.id, "discount", e.target.value)}
                                placeholder="0"
                                className="w-24 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 outline-none focus:border-[#008951]"
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <input
                                type="number"
                                value={item.taxRate}
                                onChange={(e) => updateLineItem(item.id, "taxRate", e.target.value)}
                                placeholder="0.00"
                                className="w-28 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 outline-none focus:border-[#008951]"
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <input
                                type="text"
                                value={row.total ? row.total.toFixed(2) : "0.00"}
                                disabled
                                className="w-28 rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-sm text-slate-500 outline-none cursor-not-allowed"
                              />
                            </Table.Cell>
                            <Table.Cell>
                              {lineItems.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeLineItem(item.id)}
                                  className="text-rose-500 hover:text-rose-700 transition"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </Table.Cell>
                          </Table.Row>
                        );
                      }}
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
            </div>
          </div>
        </div>

        {/* Right Column (lg:col-span-1) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Card 3: Invoice Financial Summary */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-[16px] font-bold text-BLUE-dark">
                Invoice Financial Summary
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Subtotal</span>
                <span className="text-sm font-medium text-slate-900">
                  Rs. {totals.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Trade Discount</span>
                <span className="text-sm font-medium text-slate-900">
                  Rs. {totals.discount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Tax ({taxRateLabel} GST)</span>
                <span className="text-sm font-medium text-slate-900">
                  Rs. {totals.tax.toFixed(2)}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                <span className="text-sm font-bold text-BLUE-dark">
                  Grand Total
                </span>
                <span className="text-lg font-extrabold text-accent-blue">
                  Rs. {totals.grandTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Amount Paid</span>
                <input
                  type="number"
                  min="0"
                  max={totals.grandTotal}
                  value={amountPaid}
                  onChange={(e) => {
                    const value = Number(e.target.value) || 0;
                    setAmountPaid(Math.min(Math.max(0, value), totals.grandTotal));
                  }}
                  placeholder="0"
                  className="w-24 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 outline-none focus:border-[#008951] text-right"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Outstanding</span>
                <span className="text-sm font-medium text-orange">
                  Rs. {outstanding.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Payment Status</span>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${paymentStatus === "Paid"
                      ? "bg-green-100 text-green-700"
                      : paymentStatus === "Partially Paid"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                >
                  {paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Terms & Internal Remarks */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-[16px] font-bold text-BLUE-dark">
                Terms & Internal Remarks
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Internal Remarks
                </label>
                <textarea
                  rows="3"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add internal notes for reference..."
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
          onClick={() => navigate("/sales")}
          className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          onClick={() => handleSubmit(true)}
          disabled={createSaleMutation.isPending}
          className="rounded-lg border border-[#1E40AF] bg-white px-5 py-2 text-sm font-medium text-accent-blue transition hover:bg-slate-50 disabled:opacity-50"
        >
          {createSaleMutation.isPending ? "Saving..." : "Save as Draft"}
        </button>
        <button
          onClick={() => handleSubmit(false)}
          disabled={createSaleMutation.isPending}
          className="rounded-lg bg-gradient-bg-blue  px-6 py-2 text-sm font-medium text-white transition hover:bg-[#007545] disabled:opacity-50"
        >
          {createSaleMutation.isPending ? "Creating..." : "Create Invoice"}
        </button>
      </div>
    </main>
  );
}

export default AddSales;
