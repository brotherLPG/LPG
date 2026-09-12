import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useSaleById, useUpdateSale, useGetSaleFormOptions } from "../../../queries/sales/sales.queries";
import { useToast } from "../../../utils/GlobalToast";
import { useGetAccounts } from "../../../queries/accounts/accounts.queries";

function UpdateSales() {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const [lineItems, setLineItems] = useState([
    { id: 1, product: "", cylinderType: "", quantity: "", unitPrice: "", discount: "", total: "" }
  ]);
  const [amountPaid, setAmountPaid] = useState(0);
  const [customerId, setCustomerId] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [paymentTermDays, setPaymentTermDays] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [saleType, setSaleType] = useState("");
  const [paymentAccountId, setPaymentAccountId] = useState("");
  // const [paymentMethod, setPaymentMethod] = useState("cash");
  const [referenceNumber, setReferenceNumber] = useState("");

  const { data: formOptionsResponse } = useGetSaleFormOptions();
  const formOptions = formOptionsResponse?.data || {};
  const customers = formOptions.customers || [];
  const inventoryItems = formOptions.inventoryItems || [];
  const accounts = formOptions.accounts || []


  // const { data: accountsData } = useGetAccounts({ search: "", page: 1, limit: 100 });
  // const accounts = accountsData?.data?.items || [];

  const { data: saleData, isLoading: isLoadingSale } = useSaleById(id);
  const updateSaleMutation = useUpdateSale();

  const paymentTermsOptions = saleData?.data?.form?.paymentTerms || [];
  
  const saleTypesOptions = saleData?.data?.form?.saleTypes || [];

  useEffect(() => {
    if (saleData?.data) {
      const sale = saleData.data;
      setCustomerId(sale.customerId);
      setInvoiceDate(sale.invoiceDate?.split('T')[0] || "");
      setPaymentTermDays(sale.paymentTermDays || 0);
      setRemarks(sale.remarks || "");
      setSaleType(sale.saleType || "");
      setAmountPaid(sale.paidAmount || 0);

      if (sale.lineItems && sale.lineItems.length > 0) {
        const mappedLineItems = sale.lineItems.map((item, index) => ({
          id: index + 1,
          product: item.inventoryItemId,
          cylinderType: "",
          quantity: item.quantity,
          unitPrice: item.unitPriceAmount,
          discount: item.discountAmount,
          total: item.lineTotalAmount,
        }));
        setLineItems(mappedLineItems);
      }
    }
  }, [saleData]);

  const calculateRow = (item) => {
    const qty = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    const discount = Number(item.discount) || 0;

    const subtotal = qty * unitPrice;
    const total = subtotal - discount;

    return {
      subtotal,
      discount,
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
        };
      })
    );
  };

  const addLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      { id: prev.length + 1, product: "", cylinderType: "", quantity: "", unitPrice: "", discount: "", total: "" }
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
      acc.grandTotal += row.total;
      return acc;
    },
    { subtotal: 0, discount: 0, grandTotal: 0 }
  );

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

  const handleSubmit = async () => {
    const saleData = {
      customerId,
      invoiceDate: invoiceDate || new Date().toISOString().split('T')[0],
      // saleType,
      remarks,
      lineItems: lineItems
        .filter(item => item.product && item.quantity)
        .map(item => ({
          inventoryItemId: item.product,
          itemDescription: inventoryItems.find(inv => inv._id === item.product)?.itemName || "",
          quantity: Number(item.quantity),
          unitPriceAmount: Number(item.unitPrice),
          discountAmount: Number(item.discount) || 0,
        })),
      payment:  {
        accountId: paymentAccountId,
        paymentAmount: amountPaid,
        paymentMethod: saleType,
        referenceNumber: referenceNumber || "",
      } ,
    };

    try {
      await updateSaleMutation.mutateAsync({ id, data: saleData });
      toast.success("Sale updated successfully!");
      navigate("/sales");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update sale. Please try again.");
    }
  };

  if (isLoadingSale) {
    return (
      <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
        <div className="text-center py-20">
          <p className="text-slate-600">Loading sale details...</p>
        </div>
      </main>
    );
  }

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
          <span className="font-semibold">Update Sales Invoice</span>
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
          Update Sales Invoice
        </h1>
        <p className="text-sm text-tertiary">
          Update sales invoice and modify inventory allocation
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
                    value={saleData?.data?.invoiceNumber || ""}
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
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Payment Terms <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={paymentTermDays}
                      disabled
                      onChange={(e) => setPaymentTermDays(Number(e.target.value))}
                      className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="">Select payment terms</option>
                      {paymentTermsOptions.map((term) => (
                        <option key={term.value} value={term.value}>
                          {term.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Customer <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={customerId}
                      // disabled
                      onChange={(e) => setCustomerId(e.target.value)}
                      className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="">Select customer</option>
                      {customers.map((customer) => (
                        <option key={customer._id} value={customer._id}>
                          {customer.label ||
                            `${customer.customerCode} - ${customer.customerName}`}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Sale Type
                  </label>
                  <div className="relative">
                    <select
                      value={saleType}
                      onChange={(e) => setSaleType(e.target.value)}
                      className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="">Select sale type</option>
                      {saleTypesOptions.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>



              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 ">
                <div className='flex flex-col gap-2'>
                  <label className='block text-sm font-medium text-slate-700'>
                    Payment Account
                  </label>
                  <select
                    value={paymentAccountId}
                    onChange={e => setPaymentAccountId(e.target.value)}
                    className='w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#008951]'
                  >
                    <option value=''>Select account</option>
                    {accounts.map(account => (
                      <option key={account._id} value={account._id}>
                        {account.accountCode} - {account.accountName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='flex flex-col gap-2'>
                  <label className='block text-sm font-medium text-slate-700'>
                    Reference Number
                  </label>
                  <input
                    type='text'
                    value={referenceNumber}
                    onChange={e => setReferenceNumber(e.target.value)}
                    placeholder='Enter reference number'
                    className='w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951]'
                  />
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
            <div className="p-5 overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600">Item Name</th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600">Qty</th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600">Unit Price (Rs.)</th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600">Discount (Rs.)</th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-slate-600">Total (Rs.)</th>
                    <th className="px-2 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item) => {
                    const row = calculateRow(item);

                    return (
                      <tr key={item.id} className="border-b border-slate-100 last:border-b-0">
                        <td className="px-2 py-2">
                          <select
                            value={item.product}
                            onChange={(e) => {
                              const selectedItem = inventoryItems.find(
                                (inv) => String(inv._id || inv.id) === e.target.value
                              );
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
                                  };
                                })
                              );
                            }}
                            className="w-56 max-w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 outline-none focus:border-[#008951]"
                          >
                            <option value="">Select</option>
                            {inventoryItems.map((inv) => {
                              const itemId = String(inv._id || inv.id);
                              return (
                                <option key={itemId} value={itemId}>
                                  {inv.label || `${inv.itemCode} - ${inv.itemName}`} (Stock: {inv.currentQuantity})
                                </option>
                              );
                            })}
                          </select>
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, "quantity", e.target.value)}
                            placeholder="0"
                            className="w-24 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 outline-none focus:border-[#008951]"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateLineItem(item.id, "unitPrice", e.target.value)}
                            placeholder="0"
                            className="w-24 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 outline-none focus:border-[#008951]"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            value={item.discount}
                            onChange={(e) => updateLineItem(item.id, "discount", e.target.value)}
                            placeholder="0"
                            className="w-24 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900 outline-none focus:border-[#008951]"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="text"
                            value={row.total ? row.total.toFixed(2) : "0.00"}
                            disabled
                            className="w-28 rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-sm text-slate-500 outline-none cursor-not-allowed"
                          />
                        </td>
                        <td className="px-2 py-2">
                          {lineItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeLineItem(item.id)}
                              className="text-rose-500 hover:text-rose-700 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
          onClick={handleSubmit}
          disabled={updateSaleMutation.isPending}
          className="rounded-lg bg-gradient-bg-blue  px-6 py-2 text-sm font-medium text-white transition hover:bg-[#007545] disabled:opacity-50"
        >
          {updateSaleMutation.isPending ? "Updating..." : "Update Invoice"}
        </button>
      </div>
    </main>
  );
}

export default UpdateSales;
