import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { usePermissions } from "../../contexts/PermissionContext";
import { useToast } from "../../utils/GlobalToast";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useCustomerById, useDeleteCustomer } from "../../queries/customers/customers.queries";

const salesHistory = [
  {
    invoiceId: "INV-9982",
    date: "14 Aug 2026",
    itemDetails: "Domestic Cylinder filling (11.8 KG x 100 units)",
    qtyKg: 1180,
    amount: 220000,
    status: "Completed",
  },
  {
    invoiceId: "INV-9854",
    date: "02 Aug 2026",
    itemDetails: "Commercial Cylinder filling (45.4 KG x 20 units)",
    qtyKg: 908,
    amount: 185000,
    status: "Completed",
  },
  {
    invoiceId: "INV-9741",
    date: "24 Jul 2026",
    itemDetails: "Bulk LPG Supply contract direct filling",
    qtyKg: 4500,
    amount: 740000,
    status: "Completed",
  },
  {
    invoiceId: "INV-9610",
    date: "10 Jul 2026",
    itemDetails: "Domestic Cylinder filling (11.8 KG x 50 units)",
    qtyKg: 590,
    amount: 105000,
    status: "Completed",
  },
];

const paymentHistory = [
  {
    receiptNo: "PAY-1121",
    date: "14 Aug 2026",
    amount: 220000,
    method: "Bank Transfer",
    referenceNo: "TRF-88421",
    invoiceId: "INV-9982",
    balanceAfter: 0,
    status: "Cleared",
  },
  {
    receiptNo: "PAY-1098",
    date: "02 Aug 2026",
    amount: 185000,
    method: "Cheque",
    referenceNo: "CHQ-44521",
    invoiceId: "INV-9854",
    balanceAfter: 0,
    status: "Cleared",
  },
  {
    receiptNo: "PAY-1067",
    date: "25 Jul 2026",
    amount: 500000,
    method: "Bank Transfer",
    referenceNo: "TRF-77120",
    invoiceId: "INV-9741",
    balanceAfter: 240000,
    status: "Cleared",
  },
  {
    receiptNo: "PAY-1045",
    date: "12 Jul 2026",
    amount: 105000,
    method: "Cash",
    referenceNo: "CASH-0712",
    invoiceId: "INV-9610",
    balanceAfter: 0,
    status: "Cleared",
  },
];

const formatRs = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;
const formatQty = (value) => Number(value).toLocaleString();

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const formatReceivedDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function CustomerDetails() {
  const navigate = useNavigate();
  const toast = useToast();
  const { can } = usePermissions();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("sales");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data, isLoading, error } = useCustomerById(id);
  const customer = data?.data;
  const deleteMutation = useDeleteCustomer();

  const customerFile = customer
    ? {
        name: customer.customerName || "—",
        initials: getInitials(customer.customerName),
        code: customer.customerCode || "—",
        contact: customer.contactPersonName || "—",
        phone: customer.phoneNumber || "—",
        isActive: customer.isActive !== false,
        totalPurchases:
          customer.totalPurchasesAmount ?? customer.totalPurchases ?? 0,
        outstandingBalance:
          customer.outstandingBalanceAmount ??
          customer.outstandingAmount ??
          customer.openingBalanceAmount ??
          0,
        lastPaymentAmount:
          customer.lastPaymentAmount ?? customer.lastPayment?.amount ?? 0,
        lastPaymentDate: formatReceivedDate(
          customer.lastPaymentDate || customer.lastPayment?.date
        ),
        creditLimit: customer.creditLimitAmount ?? 0,
      }
    : null;

  const handleDeleteConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(`Customer ${customerFile?.name} has been deleted successfully`);
      setIsDeleteOpen(false);
      navigate("/customers");
    } catch (deleteError) {
      toast.error(
        deleteError.response?.data?.message ||
          "Failed to delete customer. Please try again."
      );
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-full items-center justify-center bg-[#F8FAFC] p-8 text-sm text-slate-500">
        Loading customer...
      </main>
    );
  }

  if (error || !customerFile) {
    return (
      <main className="flex min-h-full flex-col items-center justify-center gap-4 bg-[#F8FAFC] p-8 text-sm text-red-500">
        <p>Unable to load customer.</p>
        <button
          type="button"
          onClick={() => navigate("/customers")}
          className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 font-semibold text-slate-600 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Customers
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <p className="text-xs text-slate-400">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="font-medium text-slate-400 hover:text-slate-600"
        >
          Dashboard
        </button>
        <span className="px-1">/</span>
        <button
          type="button"
          onClick={() => navigate("/customers")}
          className="font-medium text-slate-400 hover:text-slate-600"
        >
          Customers
        </button>
        <span className="px-1">/</span>
        <span className="font-semibold text-slate-600">{customerFile.name}</span>
      </p>

      <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
        Account Ledger
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Detailed financial ledger and purchase records for {customerFile.name}
      </p>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 text-base font-bold text-slate-600">
              {customerFile.initials}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  {customerFile.name}
                </h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    customerFile.isActive
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {customerFile.isActive ? "Active Account" : "Inactive Account"}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Code: {customerFile.code}
                <span className="px-2 text-slate-300">|</span>
                Contact: {customerFile.contact}
                <span className="px-2 text-slate-300">|</span>
                Phone: {customerFile.phone}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {can("customers", "delete") && (
              <button
                type="button"
                onClick={() => setIsDeleteOpen(true)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Delete Profile
              </button>
            )}
            {can("customers", "update") && (
              <button
                type="button"
                onClick={() => navigate(`/customers/edit/${id}`)}
                className="rounded-lg bg-[#1E3A8A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1E40AF]"
              >
                Edit Customer
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Purchases</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatRs(customerFile.totalPurchases)}
          </p>
        </article>

        <article className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <p className="text-sm font-medium text-amber-700">Outstanding Balance</p>
          <p className="mt-2 text-2xl font-bold text-amber-500">
            {formatRs(customerFile.outstandingBalance)}
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Last Payment</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {formatRs(customerFile.lastPaymentAmount)}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {customerFile.lastPaymentDate
              ? `Received on ${customerFile.lastPaymentDate}`
              : "No payment received yet"}
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Credit Limit</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatRs(customerFile.creditLimit)}
          </p>
        </article>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-6 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab("sales")}
            className={`-mb-px border-b-2 px-1 pb-3 text-sm font-semibold ${
              activeTab === "sales"
                ? "border-[#2563EB] text-[#2563EB]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Sales History
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("payments")}
            className={`-mb-px border-b-2 px-1 pb-3 text-sm font-semibold ${
              activeTab === "payments"
                ? "border-[#2563EB] text-[#2563EB]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Payment History
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {activeTab === "sales" ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[13px] font-semibold text-slate-500">
                    <th className="px-5 py-3.5">Invoice ID</th>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Item Details</th>
                    <th className="px-5 py-3.5 text-right">Qty (KG)</th>
                    <th className="px-5 py-3.5 text-right">Amount (Rs.)</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {salesHistory.map((sale) => (
                    <tr
                      key={sale.invoiceId}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-5 py-4 text-[13px] font-semibold text-[#1a56db]">
                        {sale.invoiceId}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-slate-600">
                        {sale.date}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-slate-600">
                        {sale.itemDetails}
                      </td>
                      <td className="px-5 py-4 text-right text-[13px] text-slate-700">
                        {formatQty(sale.qtyKg)}
                      </td>
                      <td className="px-5 py-4 text-right text-[13px] font-semibold text-slate-800">
                        {formatQty(sale.amount)}
                      </td>
                      <td className="px-5 py-4 text-[13px] font-semibold text-emerald-500">
                        {sale.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[13px] font-semibold text-slate-500">
                    <th className="px-5 py-3.5">Receipt #</th>
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Amount (Rs.)</th>
                    <th className="px-5 py-3.5">Payment Method</th>
                    <th className="px-5 py-3.5">Reference No</th>
                    <th className="px-5 py-3.5">Applied to Invoice</th>
                    <th className="px-5 py-3.5 text-right">Balance After</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment) => (
                    <tr
                      key={payment.receiptNo}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-5 py-4 text-[13px] font-semibold text-slate-800">
                        {payment.receiptNo}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-slate-600">
                        {payment.date}
                      </td>
                      <td className="px-5 py-4 text-[13px] font-semibold text-slate-800">
                        {formatRs(payment.amount)}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-slate-600">
                        {payment.method}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-slate-600">
                        {payment.referenceNo}
                      </td>
                      <td className="px-5 py-4 text-[13px] font-semibold text-[#1a56db]">
                        {payment.invoiceId}
                      </td>
                      <td className="px-5 py-4 text-right text-[13px] text-slate-600">
                        {formatRs(payment.balanceAfter)}
                      </td>
                      <td className="px-5 py-4 text-[13px] font-semibold text-emerald-500">
                        {payment.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone and will permanently remove the customer record from the system."
        itemName={`${customerFile.code} - ${customerFile.name}`}
        isDeleting={deleteMutation.isPending}
      />
    </main>
  );
}

export default CustomerDetails;
