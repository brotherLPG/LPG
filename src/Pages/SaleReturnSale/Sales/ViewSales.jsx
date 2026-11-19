import { useNavigate, useParams } from "react-router-dom";
import { Table, Button } from "@heroui/react";
import { ArrowLeft, Receipt, User, CalendarDays, Wallet, Package, FileText } from "lucide-react";
import { useSaleById } from "../../../queries/sales/sales.queries";

const paymentStatusStyles = {
  Paid: "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  Partial: "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  Unpaid: "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
  "Refund Due": "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
};

const saleStatusStyles = {
  Confirmed: "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  Draft: "bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 border-slate-200 dark:border-gray-700",
  "Partially Returned": "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  Returned: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  Cancelled: "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
};

const saleTypeStyles = {
  Cash: "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  Credit: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
};

function ViewSales() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: saleData, isLoading: isLoadingSale } = useSaleById(id);

  const sale = saleData?.data;

  const formatCurrency = (amount) => {
    return `PKR ${Number(amount || 0).toLocaleString()}`;
  };

  const formatDate = (value) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const outstandingAmount = Number(sale?.outstandingAmount) || 0;
  const invoiceCredit = outstandingAmount < 0 ? Math.abs(outstandingAmount) : 0;
  const amountStillDue = outstandingAmount > 0 ? outstandingAmount : 0;

  const summaryCards = [
    {
      label: "Total Amount",
      value: formatCurrency(sale?.totalAmount),
      icon: Receipt,
      iconWrap: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
      valueClass: "text-slate-900 dark:text-gray-100",
    },
    {
      label: "Paid Amount",
      value: formatCurrency(sale?.paidAmount),
      icon: Wallet,
      iconWrap: "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
      valueClass: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Returned Amount",
      value: formatCurrency(sale?.returnedAmount),
      icon: Package,
      iconWrap: "bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400",
      valueClass: "text-orange-600 dark:text-orange-400",
    },
    {
      label: "Amount Due",
      value: formatCurrency(amountStillDue),
      icon: FileText,
      iconWrap: "bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400",
      valueClass: "text-violet-600 dark:text-violet-400",
    },
  ];

  if (isLoadingSale) {
    return (
      <main className="min-h-full bg-[#F8FAFC] dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 dark:border-gray-700 border-t-[#1a56db]" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-[#F8FAFC] dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      {/* Header & Breadcrumbs */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs mb-2">
            <span
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
            >
              Dashboard
            </span>
            <span className="mx-2 text-slate-400 dark:text-gray-500">/</span>
            <span
              onClick={() => navigate("/sales")}
              className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
            >
              Sales
            </span>
            <span className="mx-2 text-slate-400 dark:text-gray-500">/</span>
            <span className="font-medium text-slate-600 dark:text-gray-400">View Sale</span>
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
            Sale {sale?.saleNumber}
          </h1>
          <p className="text-sm text-tertiary">
            Invoice details, items and payment summary
          </p>
        </div>
       
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article
            key={card.label}
            className="flex items-center gap-4 rounded-2xl border border-slate-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 px-5 py-4 shadow-sm"
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.iconWrap}`}
            >
              <card.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-slate-500 dark:text-gray-400">
                {card.label}
              </p>
              <p
                className={`mt-1 truncate text-lg font-semibold tracking-tight tabular-nums ${card.valueClass}`}
              >
                {card.value}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Invoice Card */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
            {/* Invoice header band */}
            <div className="flex flex-col gap-4 border-b border-slate-100 dark:border-gray-800 bg-gradient-to-r from-slate-50 to-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a56db]/10 text-[#1a56db] dark:text-blue-400">
                  <Receipt className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-BLUE-dark">
                    {sale?.invoiceNumber || sale?.saleNumber}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    Sale #{sale?.saleNumber} • {formatDate(sale?.invoiceDate)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {sale?.saleTypeLabel && (
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${saleTypeStyles[sale.saleTypeLabel] || "bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-400 border-slate-200 dark:border-gray-700"}`}
                  >
                    {sale.saleTypeLabel}
                  </span>
                )}
                {sale?.saleStatusLabel && (
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${saleStatusStyles[sale.saleStatusLabel] || "bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-400 border-slate-200 dark:border-gray-700"}`}
                  >
                    {sale.saleStatusLabel}
                  </span>
                )}
                {sale?.paymentStatusLabel && (
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${paymentStatusStyles[sale.paymentStatusLabel] || "bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-400 border-slate-200 dark:border-gray-700"}`}
                  >
                    {sale.paymentStatusLabel}
                  </span>
                )}
              </div>
            </div>

            {/* Customer & meta info */}
            <div className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 dark:text-gray-500" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-gray-500">
                    Customer
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-gray-100">
                    {sale?.customerName || "N/A"}
                  </p>
                  {sale?.customerCode && (
                    <p className="text-xs text-slate-500 dark:text-gray-400">
                      {sale.customerCode}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 dark:text-gray-500" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-gray-500">
                    Invoice Date
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-gray-100">
                    {formatDate(sale?.invoiceDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 dark:text-gray-500" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-gray-500">
                    Payment Terms
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-gray-100">
                    {sale?.paymentTermDays || 0} days
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 dark:text-gray-500" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-gray-500">
                    Items
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-gray-100">
                    {sale?.itemCount || sale?.lineItems?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="border-t border-slate-100 dark:border-gray-800 px-6 py-5">
              <h3 className="mb-4 text-sm font-bold text-BLUE-dark">
                Line Items
              </h3>
              <Table aria-label="Line items table">
                <Table.ScrollContainer>
                  <Table.Content>
                    <Table.Header>
                      <Table.Column>
                        <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                          Product
                        </span>
                      </Table.Column>
                      <Table.Column>
                        <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                          Qty
                        </span>
                      </Table.Column>
                      <Table.Column>
                        <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                          Unit Price
                        </span>
                      </Table.Column>
                      <Table.Column>
                        <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                          Discount
                        </span>
                      </Table.Column>
                      <Table.Column>
                        <span className="text-right text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                          Total
                        </span>
                      </Table.Column>
                    </Table.Header>
                    <Table.Body>
                      {sale?.lineItems?.length ? (
                        sale.lineItems.map((item, index) => (
                          <Table.Row key={index}>
                            <Table.Cell>
                              <div className="text-sm font-medium text-slate-900 dark:text-gray-100">
                                {item.itemName}
                              </div>
                              {item.itemCode && (
                                <div className="text-xs text-slate-500 dark:text-gray-400">
                                  {item.itemCode}
                                </div>
                              )}
                            </Table.Cell>
                            <Table.Cell>
                              <span className="text-sm text-slate-700 dark:text-gray-300 tabular-nums">
                                {item.quantity}
                              </span>
                            </Table.Cell>
                            <Table.Cell>
                              <span className="text-sm text-slate-700 dark:text-gray-300 tabular-nums">
                                {formatCurrency(item.unitPriceAmount)}
                              </span>
                            </Table.Cell>
                            <Table.Cell>
                              <span className="text-sm text-slate-700 dark:text-gray-300 tabular-nums">
                                {formatCurrency(item.discountAmount)}
                              </span>
                            </Table.Cell>
                            <Table.Cell>
                              <span className="block text-right text-sm font-semibold text-slate-900 dark:text-gray-100 tabular-nums">
                                {formatCurrency(item.totalAmount)}
                              </span>
                            </Table.Cell>
                          </Table.Row>
                        ))
                      ) : (
                        <Table.Row>
                          <Table.Cell colSpan={5}>
                            <p className="py-6 text-center text-sm text-slate-500 dark:text-gray-400">
                              No line items found
                            </p>
                          </Table.Cell>
                        </Table.Row>
                      )}
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
            </div>
          </section>

          {/* Remarks */}
          <section className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-BLUE-dark">
              <FileText className="h-4 w-4 text-slate-400 dark:text-gray-500" />
              Remarks
            </h3>
            <p className="whitespace-pre-wrap rounded-xl bg-slate-50 dark:bg-gray-800 px-4 py-3 text-sm text-slate-700 dark:text-gray-300">
              {sale?.remarks || "No remarks"}
            </p>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
            <div className="border-b border-slate-100 dark:border-gray-800 px-6 py-4">
              <h2 className="text-[15px] font-bold text-BLUE-dark">
                Financial Summary
              </h2>
            </div>
            <div className="space-y-3 px-6 py-5">
              {[
                { label: "Subtotal", value: sale?.subtotalAmount, className: "text-slate-700 dark:text-gray-300" },
                { label: "Trade Discount", value: sale?.tradeDiscountAmount, className: "text-slate-700 dark:text-gray-300" },
                { label: "Tax Amount", value: sale?.taxAmount, className: "text-slate-700 dark:text-gray-300" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-gray-400">{row.label}</span>
                  <span className={`text-sm font-medium tabular-nums ${row.className}`}>
                    {formatCurrency(row.value)}
                  </span>
                </div>
              ))}

              <div className="my-3 border-t border-dashed border-slate-200 dark:border-gray-700" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800 dark:text-gray-100">Total Amount</span>
                <span className="text-base font-bold text-slate-900 dark:text-gray-100 tabular-nums">
                  {formatCurrency(sale?.totalAmount)}
                </span>
              </div>

              <div className="my-3 border-t border-slate-100 dark:border-gray-800" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-gray-400">Paid Amount</span>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {formatCurrency(sale?.paidAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-gray-400">Returned Amount</span>
                <span className="text-sm font-semibold text-orange-600 dark:text-orange-400 tabular-nums">
                  {formatCurrency(sale?.returnedAmount)}
                </span>
              </div>
              {invoiceCredit > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-gray-400">Customer Credit</span>
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {formatCurrency(invoiceCredit)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-gray-400">Remaining Amount</span>
                <span className="text-sm font-semibold text-violet-600 dark:text-violet-400 tabular-nums">
                  {formatCurrency(amountStillDue)}
                </span>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 dark:bg-gray-800 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-gray-400">
                    Grand Total
                  </span>
                  <span className="text-lg font-extrabold text-[#1a56db] dark:text-blue-400 tabular-nums">
                    {formatCurrency(sale?.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default ViewSales;
