import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { Table } from "@heroui/react";

function AddSales() {
  const navigate = useNavigate();
  const [lineItems, setLineItems] = useState([
    { id: 1, product: "", cylinderType: "", quantity: "", unitPrice: "", discount: "", taxRate: 17, total: "" }
  ]);
  const [amountPaid, setAmountPaid] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");

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
      { id: prev.length + 1, product: "", cylinderType: "", quantity: "", unitPrice: "", discount: "", taxRate: 17, total: "" }
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

  const outstanding = totals.grandTotal - amountPaid;

  useEffect(() => {
    if (amountPaid <= 0) {
      setPaymentStatus("Unpaid");
      return;
    }

    if (outstanding > 0) {
      setPaymentStatus("Partially Paid");
      return;
    }

    setPaymentStatus("Paid");
  }, [amountPaid, outstanding]);

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
                    value="INV-2026-0459 (Auto-generated)"
                    className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Invoice Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Payment Terms <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                    placeholder="Net 30 Days"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Customer <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      defaultValue=""
                      className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="" disabled>
                        Select customer
                      </option>
                      <option value="Ahmed Khan">Ahmed Khan</option>
                      <option value="Fatima Ali">Fatima Ali</option>
                      <option value="Usman Ahmed">Usman Ahmed</option>
                      <option value="Bilal Khan">Bilal Khan</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
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
                      <Table.Column className="text-xs font-semibold text-slate-600">Tax (17%)</Table.Column>
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
                                onChange={(e) => updateLineItem(item.id, "product", e.target.value)}
                                className="w-40 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 outline-none focus:border-[#008951]"
                              >
                                <option value="">Select</option>
                                <option value="LPG">LPG</option>
                                <option value="Natural Gas">Natural Gas</option>
                                <option value="Propane">Propane</option>
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
                <span className="text-sm text-slate-600">Tax (17% GST)</span>
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
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value) || 0)}
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
                <div className="relative">
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-32 appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-8 py-1.5 text-sm text-slate-700 outline-none focus:border-[#008951]"
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Paid">Paid</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
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
          onClick={() => navigate("/sales")}
          className="rounded-lg border border-[#1E40AF] bg-white px-5 py-2 text-sm font-medium text-accent-blue transition hover:bg-slate-50"
        >
          Save as Draft
        </button>
        <button
          onClick={() => navigate("/sales")}
          className="rounded-lg bg-gradient-bg-blue  px-6 py-2 text-sm font-medium text-white transition hover:bg-[#007545]"
        >
          Create Invoice
        </button>
      </div>
    </main>
  );
}

export default AddSales;
