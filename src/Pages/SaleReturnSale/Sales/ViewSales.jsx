import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Table } from "@heroui/react";
import { useSaleById } from "../../../queries/sales/sales.queries";
import { useInventoryItems } from "../../../queries/inventory/inventory.queries";
import { useCustomers } from "../../../queries/customers/customers.queries";
import { useGetAccounts } from "../../../queries/accounts/accounts.queries";

function ViewSales() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: inventoryData } = useInventoryItems({ search: "", page: 1, limit: 100 });
  const inventoryItems = inventoryData?.data?.items || [];

  const { data: customersData } = useCustomers({ search: "", page: 1, limit: 100 });
  const customers = customersData?.data?.items || [];

  const { data: accountsData } = useGetAccounts({ search: "", page: 1, limit: 100 });
  const accounts = accountsData?.data?.items || [];

  const { data: saleData, isLoading: isLoadingSale } = useSaleById(id);

  const sale = saleData?.data;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return `PKR ${Number(amount || 0).toLocaleString()}`;
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
          </span>
          <span className="mx-2 text-slate-400">/</span>
          <span
            onClick={() => navigate("/sales")}
            className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
          >
            Sales
          </span>
          <span className="mx-2 text-slate-400">/</span>
          <span className="font-medium text-slate-600">View Sale</span>
        </p>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-BLUE-dark">View Sale - {sale?.saleNumber}</h1>
         
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Basic Information */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-[16px] font-bold text-BLUE-dark">
                Basic Information
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Sale Number
                  </label>
                  <div className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900">
                    {sale?.saleNumber || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Invoice Number
                  </label>
                  <div className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900">
                    {sale?.invoiceNumber || "N/A"}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Customer
                  </label>
                  <div className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900">
                    {sale?.customerCode} - {sale?.customerName}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Invoice Date
                  </label>
                  <div className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900">
                    {sale?.invoiceDate?.split('T')[0] || "N/A"}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Payment Terms
                  </label>
                  <div className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900">
                    {sale?.paymentTermDays || 0} days
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Sale Type
                  </label>
                  <div className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 capitalize">
                    {sale?.saleTypeLabel || "N/A"}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Sale Status
                  </label>
                  <div className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900">
                    {sale?.saleStatusLabel || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Payment Status
                  </label>
                  <div className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900">
                    {sale?.paymentStatusLabel || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Line Items */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-[16px] font-bold text-BLUE-dark">
                Line Items
              </h2>
            </div>
            <div className="p-5">
              <Table aria-label="Line items table">
                <Table.ScrollContainer>
                  <Table.Content>
                    <Table.Header>
                      <Table.Column>Product</Table.Column>
                      <Table.Column>Quantity</Table.Column>
                      <Table.Column>Unit Price</Table.Column>
                      <Table.Column>Discount</Table.Column>
                      <Table.Column>Total</Table.Column>
                    </Table.Header>
                    <Table.Body>
                      {sale?.lineItems?.map((item, index) => (
                        <Table.Row key={index}>
                          <Table.Cell>
                            <div className="text-sm text-slate-900">
                              {item.itemCode} - {item.itemName}
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            <div className="text-sm text-slate-900">
                              {item.quantity}
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            <div className="text-sm text-slate-900">
                              {formatCurrency(item.unitPriceAmount)}
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            <div className="text-sm text-slate-900">
                              {formatCurrency(item.discountAmount)}
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            <div className="text-sm text-slate-900">
                              {formatCurrency(item.totalAmount)}
                            </div>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
            </div>
          </div>
        </div>

        {/* Right Column (lg:col-span-1) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Card 3: Financial Summary */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-[16px] font-bold text-BLUE-dark">
                Financial Summary
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Subtotal</span>
                <span className="text-sm font-medium text-slate-900">
                  {formatCurrency(sale?.subtotalAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Trade Discount</span>
                <span className="text-sm font-medium text-slate-900">
                  {formatCurrency(sale?.tradeDiscountAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Tax Amount</span>
                <span className="text-sm font-medium text-slate-900">
                  {formatCurrency(sale?.taxAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Total Amount</span>
                <span className="text-sm font-medium text-slate-900">
                  {formatCurrency(sale?.totalAmount)}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                <span className="text-sm font-bold text-BLUE-dark">
                  Grand Total
                </span>
                <span className="text-lg font-extrabold text-accent-blue">
                  {formatCurrency(sale?.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Paid Amount</span>
                <span className="text-sm font-medium text-emerald-600">
                  {formatCurrency(sale?.paidAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Returned Amount</span>
                <span className="text-sm font-medium text-orange">
                  {formatCurrency(sale?.returnedAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Outstanding</span>
                <span className="text-sm font-medium text-orange">
                  {formatCurrency(sale?.outstandingAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Item Count</span>
                <span className="text-sm font-medium text-slate-900">
                  {sale?.itemCount || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Timestamps */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-[16px] font-bold text-BLUE-dark">
                Timestamps
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Created At
                </label>
                <div className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900">
                  {formatDate(sale?.createdAt)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Updated At
                </label>
                <div className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900">
                  {formatDate(sale?.updatedAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Remarks */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-[16px] font-bold text-BLUE-dark">
                Remarks
              </h2>
            </div>
            <div className="p-5">
              <div className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 min-h-20">
                {sale?.remarks || "No remarks"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ViewSales;
