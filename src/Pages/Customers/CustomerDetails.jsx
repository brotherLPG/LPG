import { useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { usePermissions } from "../../contexts/PermissionContext";
import { useToast } from "../../utils/GlobalToast";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import GlobalTable from "../../utils/GlobalTable";
import {
  useCustomerLedger,
  useCustomerSalesHistory,
  useCustomerPaymentHistory,
  useDeleteCustomer,
} from "../../queries/customers/customers.queries";

const formatRs = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

const formatItemDetails = (sale) => {
  if (!sale.lineItems?.length) return "—";
  return sale.lineItems
    .map((item) => `${item.itemName} (x${item.quantity})`)
    .join(", ");
};

const getSaleDueDate = (sale) => {
  if (sale.dueDate) return sale.dueDate;
  if (sale.paymentDueDate) return sale.paymentDueDate;
  if (!sale.invoiceDate) return null;

  const invoiceDate = new Date(sale.invoiceDate);
  if (Number.isNaN(invoiceDate.getTime())) return null;

  const termDays = Number(sale.paymentTermDays) || 0;
  invoiceDate.setDate(invoiceDate.getDate() + termDays);
  return invoiceDate;
};

const paymentStatusStyles = {
  Paid: "bg-emerald-50 text-emerald-600",
  Partial: "bg-amber-50 text-amber-600",
  Unpaid: "bg-red-50 text-red-600",
  "Refund Due": "bg-purple-50 text-purple-600",
};

const saleStatusStyles = {
  Confirmed: "bg-emerald-50 text-emerald-600",
  Draft: "bg-slate-50 text-slate-600",
  "Partially Returned": "bg-amber-50 text-amber-600",
  Returned: "bg-blue-50 text-blue-600",
  Cancelled: "bg-red-50 text-red-600",
};

const formatAmount = (value) => Number(value || 0).toLocaleString();

const formatAppliedInvoices = (payment) => {
  if (payment.appliedToInvoices?.length) {
    return payment.appliedToInvoices.join(", ");
  }
  return payment.appliedToInvoice || "—";
};

const receiptStatusStyles = {
  Recorded: "bg-blue-50 text-blue-600",
  Cleared: "bg-emerald-50 text-emerald-600",
  Pending: "bg-amber-50 text-amber-600",
  Cancelled: "bg-red-50 text-red-600",
};

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
  const [salesSearch, setSalesSearch] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [salesPage, setSalesPage] = useState(1);
  const salesLimit = 10;
  const [paymentsPage, setPaymentsPage] = useState(1);
  const paymentsLimit = 10;

  const { data, isLoading, error } = useCustomerLedger(id);
  const customer = data?.data?.customer;
  const summary = data?.data?.summary;
  const deleteMutation = useDeleteCustomer();

  const salesHistoryParams = {
    page: salesPage,
    limit: salesLimit,
    ...(salesSearch.trim() && { search: salesSearch.trim() }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };

  const {
    data: salesHistoryData,
    isLoading: isSalesHistoryLoading,
    error: salesHistoryError,
  } = useCustomerSalesHistory(id, salesHistoryParams);

  const salesPagination = salesHistoryData?.data?.pagination || {
    total: 0,
    page: 1,
    limit: salesLimit,
    totalPages: 1,
  };

  const salesRows = useMemo(
    () =>
      (salesHistoryData?.data?.items || []).map((sale) => ({
        ...sale,
        id: sale._id,
      })),
    [salesHistoryData]
  );

  const salesColumns = useMemo(
    () => [
      {
        key: "invoiceNumber",
        label: "Invoice ID",
        isRowHeader: true,
        className:
          "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap text-nowrap",
        cellClassName: "px-4 py-4 whitespace-nowrap text-nowrap",
        renderCell: (sale) => (
          <span className="font-semibold text-[#1a56db] text-[13px]">
            {sale.invoiceNumber}
          </span>
        ),
      },
      {
        key: "invoiceDate",
        label: "Invoice Date",
        className:
          "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap",
        cellClassName: "px-4 py-4 text-slate-600 text-[13px] whitespace-nowrap",
        renderCell: (sale) => formatReceivedDate(sale.invoiceDate) || "—",
      },
      {
        key: "dueDate",
        label: "Due Date",
        className:
          "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap text-nowrap ",
        cellClassName: "px-4 py-4 text-slate-600 text-[13px] whitespace-nowrap text-nowrap ",
        renderCell: (sale) => formatReceivedDate(getSaleDueDate(sale)) || "—",
      },
      {
        key: "itemDetails",
        label: "Item Details",
        className:
          "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-nowrap ",
        cellClassName: "px-4 py-4 text-slate-600 text-[13px] text-nowrap ",
        renderCell: (sale) => formatItemDetails(sale),
      },
      {
        key: "itemQuantity",
        label: "Qty",
        className:
          "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap text-right",
        cellClassName:
          "px-4 py-4 text-right text-[13px] text-slate-700 whitespace-nowrap",
        renderCell: (sale) => Number(sale.itemQuantity || sale.items || 0).toLocaleString(),
      },
      {
        key: "totalAmount",
        label: "Total Amount",
        className:
          "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap text-right",
        cellClassName: "px-4 py-4 text-right whitespace-nowrap",
        renderCell: (sale) => (
          <span className="text-[13px] font-semibold text-slate-800">
            {formatAmount(sale.totalAmount ?? sale.amount)}
          </span>
        ),
      },
      {
        key: "discountAmount",
        label: "Discount",
        className:
          "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap text-nowrap ",
        cellClassName: "px-4 py-4 whitespace-nowrap text-nowrap ",
        renderCell: (sale) => (
          <span className="text-[13px] text-slate-700">
            {formatAmount(sale.discountAmount)}
          </span>
        ),
      },
      {
        key: "paidAmount",
        label: "Paid Amount",
        className:
          "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap text-right",
        cellClassName: "px-4 py-4 text-right whitespace-nowrap",
        renderCell: (sale) => (
          <span className="text-[13px] font-semibold text-emerald-600">
            {formatAmount(sale.paidAmount)}
          </span>
        ),
      },
      {
        key: "returnedAmount",
        label: "Returned Amount",
        className:
          "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap text-right",
        cellClassName: "px-4 py-4 text-right whitespace-nowrap",
        renderCell: (sale) => (
          <span className="text-[13px] font-semibold text-orange-600">
            {formatAmount(sale.returnedAmount)}
          </span>
        ),
      },
      {
        key: "accountName",
        label: "Account Name",
        className:
          "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap",
        cellClassName: "px-4 py-4 text-slate-600 text-[13px] whitespace-nowrap",
        renderCell: (sale) => sale.accountName || "—",
      },
      // {
      //   key: "accountType",
      //   label: "Account Type",
      //   className:
      //     "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap",
      //   cellClassName: "px-4 py-4 whitespace-nowrap",
      //   renderCell: (sale) =>
      //     sale.accountType ? (
      //       <span className="capitalize text-[13px] text-slate-700">
      //         {sale.accountType}
      //       </span>
      //     ) : (
      //       "—"
      //     ),
      // },
      {
        key: "saleTypeLabel",
        label: "Type",
        className:
          "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap",
        cellClassName: "px-4 py-4 whitespace-nowrap",
        renderCell: (sale) => (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              sale.saleTypeLabel === "Cash"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-blue-50 text-blue-600"
            }`}
          >
            {sale.saleTypeLabel || "—"}
          </span>
        ),
      },
      {
        key: "paymentStatusLabel",
        label: "Payment Status",
        className:
          "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap",
        cellClassName: "px-4 py-4 whitespace-nowrap",
        renderCell: (sale) => (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              paymentStatusStyles[sale.paymentStatusLabel] ||
              "bg-slate-50 text-slate-600"
            }`}
          >
            {sale.paymentStatusLabel || "—"}
          </span>
        ),
      },
      {
        key: "saleStatusLabel",
        label: "Sale Status",
        className:
          "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap",
        cellClassName: "px-4 py-4 whitespace-nowrap",
        renderCell: (sale) => (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              saleStatusStyles[sale.saleStatusLabel] ||
              "bg-slate-50 text-slate-600"
            }`}
          >
            {sale.saleStatusLabel || "—"}
          </span>
        ),
      },
    ],
    []
  );

  const paymentHistoryParams = {
    page: paymentsPage,
    limit: paymentsLimit,
  };

  const {
    data: paymentHistoryData,
    isLoading: isPaymentHistoryLoading,
    error: paymentHistoryError,
  } = useCustomerPaymentHistory(id, paymentHistoryParams);

  const paymentsPagination = paymentHistoryData?.data?.pagination || {
    total: 0,
    page: 1,
    limit: paymentsLimit,
    totalPages: 1,
  };

  const paymentRows = useMemo(
    () =>
      (paymentHistoryData?.data?.items || []).map((payment) => ({
        ...payment,
        id: payment._id,
      })),
    [paymentHistoryData]
  );

  const paymentColumns = useMemo(
    () => [
      {
        key: "receiptNumber",
        label: "Receipt #",
        isRowHeader: true,
        className:
          "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap",
        cellClassName: "px-4 py-4 whitespace-nowrap",
        renderCell: (payment) => (
          <span className="font-semibold text-slate-800 text-[13px]">
            {payment.receiptNumber || payment.paymentNumber || "—"}
          </span>
        ),
      },
      {
        key: "paymentDate",
        label: "Date",
        className:
          "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap",
        cellClassName: "px-4 py-4 text-slate-600 text-[13px] whitespace-nowrap",
        renderCell: (payment) => formatReceivedDate(payment.paymentDate) || "—",
      },
      {
        key: "paymentAmount",
        label: "Amount (Rs.)",
        className:
          "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap text-right",
        cellClassName: "px-4 py-4 text-right whitespace-nowrap",
        renderCell: (payment) => (
          <span className="text-[13px] font-semibold text-slate-800">
            {formatAmount(payment.paymentAmount)}
          </span>
        ),
      },
      {
        key: "paymentMethodLabel",
        label: "Payment Method",
        className:
          "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap",
        cellClassName: "px-4 py-4 text-slate-600 text-[13px] whitespace-nowrap",
        renderCell: (payment) => payment.paymentMethodLabel || payment.paymentMethod || "—",
      },
      {
        key: "accountName",
        label: "Account Name",
        className:
          "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap",
        cellClassName: "px-4 py-4 text-slate-600 text-[13px] whitespace-nowrap",
        renderCell: (payment) => payment.accountName || "—",
      },
      {
        key: "referenceNumber",
        label: "Reference No",
        className:
          "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap",
        cellClassName: "px-4 py-4 text-slate-600 text-[13px] whitespace-nowrap",
        renderCell: (payment) => payment.referenceNumber || "—",
      },
      {
        key: "appliedToInvoice",
        label: "Applied to Invoice",
        className:
          "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap",
        cellClassName: "px-4 py-4 whitespace-nowrap",
        renderCell: (payment) => (
          <span className="text-[13px] font-semibold text-[#1a56db]">
            {formatAppliedInvoices(payment)}
          </span>
        ),
      },
      {
        key: "balanceAfter",
        label: "Balance After",
        className:
          "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap text-right",
        cellClassName: "px-4 py-4 text-right whitespace-nowrap",
        renderCell: (payment) => (
          <span className="text-[13px] text-slate-600">
            {formatAmount(payment.balanceAfter)}
          </span>
        ),
      },
      {
        key: "directionLabel",
        label: "Direction",
        className:
          "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap",
        cellClassName: "px-4 py-4 whitespace-nowrap",
        renderCell: (payment) => (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              payment.direction === "receive"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-amber-50 text-amber-600"
            }`}
          >
            {payment.directionLabel || "—"}
          </span>
        ),
      },
      {
        key: "paymentStatusLabel",
        label: "Status",
        className:
          "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 whitespace-nowrap",
        cellClassName: "px-4 py-4 whitespace-nowrap",
        renderCell: (payment) => (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              receiptStatusStyles[payment.paymentStatusLabel] ||
              "bg-slate-50 text-slate-600"
            }`}
          >
            {payment.paymentStatusLabel || "—"}
          </span>
        ),
      },
    ],
    []
  );

  const customerFile = customer
    ? {
        name: customer.customerName || "—",
        initials: getInitials(customer.customerName),
        code: customer.customerCode || "—",
        contact: customer.contactPersonName || "—",
        phone: customer.phoneNumber || "—",
        isActive: customer.isActive !== false,
        accountStatus:
          customer.accountStatus ||
          (customer.isActive !== false ? "Active Account" : "Inactive Account"),
        totalPurchases: summary?.totalPurchases ?? 0,
        salesCount: summary?.salesCount ?? 0,
        outstandingBalance: summary?.outstandingBalance ?? 0,
        lastPaymentAmount: summary?.lastPaymentAmount ?? 0,
        lastPaymentDate: formatReceivedDate(summary?.lastPaymentDate),
        lastPaymentNumber: summary?.lastPaymentNumber,
        lastPaymentMethodLabel: summary?.lastPaymentMethodLabel,
        creditLimit:
          summary?.creditLimitAmount ?? customer.creditLimitAmount ?? 0,
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
                  {customerFile.accountStatus}
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
          <p className="mt-1 text-xs text-slate-400">
            {customerFile.salesCount}{" "}
            {customerFile.salesCount === 1 ? "sale" : "sales"}
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
              ? [
                  `Received on ${customerFile.lastPaymentDate}`,
                  customerFile.lastPaymentNumber,
                  customerFile.lastPaymentMethodLabel,
                ]
                  .filter(Boolean)
                  .join(" · ")
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
            <div>
              <div className="flex flex-col gap-3 border-b border-slate-100 p-3 sm:flex-row sm:items-center">
                <label className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={salesSearch}
                    onChange={(event) => {
                      setSalesSearch(event.target.value);
                      setSalesPage(1);
                    }}
                    className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                    placeholder="Search by invoice or sale number..."
                  />
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="whitespace-nowrap">From</span>
                  <input
                    type="date"
                    value={startDate || ""}
                    onChange={(event) => {
                      setStartDate(event.target.value || null);
                      setSalesPage(1);
                    }}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-[#008951] sm:w-44"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="whitespace-nowrap">To</span>
                  <input
                    type="date"
                    value={endDate || ""}
                    onChange={(event) => {
                      setEndDate(event.target.value || null);
                      setSalesPage(1);
                    }}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-[#008951] sm:w-44"
                  />
                </label>
              </div>
              <GlobalTable
                columns={salesColumns}
                data={salesRows}
                pagination
                rowsPerPage={salesPagination.limit || salesLimit}
                ariaLabel="Customer sales history"
                emptyContent={
                  isSalesHistoryLoading
                    ? "Loading sales history..."
                    : salesHistoryError
                      ? "Unable to load sales history."
                      : "No sales found for this customer."
                }
                totalCount={salesPagination.total}
                page={salesPage}
                onPageChange={setSalesPage}
              />
            </div>
          ) : (
            <GlobalTable
              columns={paymentColumns}
              data={paymentRows}
              pagination
              rowsPerPage={paymentsPagination.limit || paymentsLimit}
              ariaLabel="Customer payment history"
              emptyContent={
                isPaymentHistoryLoading
                  ? "Loading payment history..."
                  : paymentHistoryError
                    ? "Unable to load payment history."
                    : "No payments found for this customer."
              }
              totalCount={paymentsPagination.total}
              page={paymentsPage}
              onPageChange={setPaymentsPage}
            />
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
