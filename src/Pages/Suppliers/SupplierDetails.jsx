import { useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { usePermissions } from "../../contexts/PermissionContext";
import { useToast } from "../../utils/GlobalToast";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import GlobalTable from "../../utils/GlobalTable";
import {
  useSupplierLedger,
  useSupplierPurchaseHistory,
  useSupplierPaymentHistory,
  useDeleteSupplier,
} from "../../queries/suppliers/suppliers.queries";

const formatRs = (value) => `${Number(value || 0).toLocaleString()}`;

const formatAmount = (value) => Number(value || 0).toLocaleString();

const formatAppliedInvoices = (payment) => {
  if (payment.appliedToInvoices?.length) {
    return payment.appliedToInvoices.join(", ");
  }
  if (payment.allocations?.length) {
    return payment.allocations
      .map((allocation) => allocation.invoiceNumber || allocation.receiptNumber)
      .filter(Boolean)
      .join(", ");
  }
  return payment.appliedToInvoice || payment.appliedToReceipt || "—";
};

const receiptStatusStyles = {
  confirmed: "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
  Confirmed: "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
  draft: "bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-400",
  Draft: "bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-400",
  pending: "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
  Pending: "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
  cancelled: "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400",
  Cancelled: "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400",
};

const paymentStatusStyles = {
  Recorded: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
  Cleared: "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
  Pending: "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
  Cancelled: "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400",
};

const formatStatusLabel = (value) => {
  if (!value) return "—";
  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
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

function SupplierDetails() {
  const navigate = useNavigate();
  const toast = useToast();
  const { can } = usePermissions();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("purchases");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [purchaseSearch, setPurchaseSearch] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [purchasesPage, setPurchasesPage] = useState(1);
  const purchasesLimit = 10;
  const [paymentsPage, setPaymentsPage] = useState(1);
  const paymentsLimit = 10;

  const { data, isLoading, error } = useSupplierLedger(id);
  const supplier = data?.data?.supplier;
  const summary = data?.data?.summary;
  const deleteMutation = useDeleteSupplier();

  const purchaseHistoryParams = {
    page: purchasesPage,
    limit: purchasesLimit,
    ...(purchaseSearch.trim() && { search: purchaseSearch.trim() }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };

  const {
    data: purchaseHistoryData,
    isLoading: isPurchaseHistoryLoading,
    error: purchaseHistoryError,
  } = useSupplierPurchaseHistory(id, purchaseHistoryParams);

  const purchasesPagination = purchaseHistoryData?.data?.pagination || {
    total: 0,
    page: 1,
    limit: purchasesLimit,
    totalPages: 1,
  };

  const purchaseRows = useMemo(
    () =>
      (purchaseHistoryData?.data?.items || []).map((purchase) => ({
        ...purchase,
        id: purchase._id,
      })),
    [purchaseHistoryData]
  );

  const purchaseColumns = useMemo(
    () => [
      {
        key: "receiptNumber",
        label: "Receipt #",
        isRowHeader: true,
        className:
          "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap text-nowrap",
        cellClassName: "px-4 py-4 whitespace-nowrap text-nowrap",
        renderCell: (purchase) => (
          <span className="font-semibold text-[#1a56db] dark:text-blue-400 text-[13px]">
            {purchase.receiptNumber || "—"}
          </span>
        ),
      },
      {
        key: "supplierInvoiceNumber",
        label: "Supplier Invoice",
        className:
          "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap",
        cellClassName: "px-4 py-4 text-slate-600 dark:text-gray-400 text-[13px] whitespace-nowrap",
        renderCell: (purchase) => purchase.supplierInvoiceNumber || "—",
      },
      {
        key: "receivedAt",
        label: "Received At",
        className:
          "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap text-nowrap",
        cellClassName:
          "px-4 py-4 text-slate-600 dark:text-gray-400 text-[13px] whitespace-nowrap text-nowrap",
        renderCell: (purchase) => formatReceivedDate(purchase.receivedAt) || "—",
      },
      {
        key: "truckRegistrationNumber",
        label: "Truck Reg #",
        className:
          "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap",
        cellClassName: "px-4 py-4 text-slate-600 dark:text-gray-400 text-[13px] whitespace-nowrap",
        renderCell: (purchase) => purchase.truckRegistrationNumber || "—",
      },
      {
        key: "receivedQuantityKg",
        label: "Qty (KG)",
        className:
          "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap text-right",
        cellClassName:
          "px-4 py-4 text-right text-[13px] text-slate-700 dark:text-gray-300 whitespace-nowrap",
        renderCell: (purchase) =>
          Number(purchase.receivedQuantityKg || 0).toLocaleString(),
      },
      {
        key: "purchaseRatePerKg",
        label: "Rate/KG",
        className:
          "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap text-right",
        cellClassName: "px-4 py-4 text-right whitespace-nowrap",
        renderCell: (purchase) => (
          <span className="text-[13px] text-slate-700 dark:text-gray-300">
            {formatAmount(purchase.purchaseRatePerKg)}
          </span>
        ),
      },
      {
        key: "totalPurchaseAmount",
        label: "Total Amount",
        className:
          "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap text-right",
        cellClassName: "px-4 py-4 text-right whitespace-nowrap",
        renderCell: (purchase) => (
          <span className="text-[13px] font-semibold text-slate-800 dark:text-gray-100">
            {formatAmount(purchase.totalPurchaseAmount)}
          </span>
        ),
      },
      {
        key: "tankName",
        label: "Storage Tank",
        className:
          "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap",
        cellClassName: "px-4 py-4 text-slate-600 dark:text-gray-400 text-[13px] whitespace-nowrap",
        renderCell: (purchase) =>
          purchase.tankName || purchase.tankCode
            ? `${purchase.tankCode || ""}${
                purchase.tankCode && purchase.tankName ? " — " : ""
              }${purchase.tankName || ""}`
            : "—",
      },
      {
        key: "remarks",
        label: "Remarks",
        className:
          "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap",
        cellClassName: "px-4 py-4 text-slate-600 dark:text-gray-400 text-[13px] whitespace-nowrap",
        renderCell: (purchase) => purchase.remarks || "—",
      },
      {
        key: "receiptStatus",
        label: "Status",
        className:
          "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap",
        cellClassName: "px-4 py-4 whitespace-nowrap",
        renderCell: (purchase) => (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              receiptStatusStyles[purchase.receiptStatus] ||
              "bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-400"
            }`}
          >
            {formatStatusLabel(purchase.receiptStatus)}
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
  } = useSupplierPaymentHistory(id, paymentHistoryParams);

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
          "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap",
        cellClassName: "px-4 py-4 whitespace-nowrap",
        renderCell: (payment) => (
          <span className="font-semibold text-slate-800 dark:text-gray-100 text-[13px]">
            {payment.receiptNumber || payment.paymentNumber || "—"}
          </span>
        ),
      },
      {
        key: "paymentDate",
        label: "Date",
        className:
          "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap",
        cellClassName: "px-4 py-4 text-slate-600 dark:text-gray-400 text-[13px] whitespace-nowrap",
        renderCell: (payment) =>
          formatReceivedDate(payment.paymentDate) || "—",
      },
      {
        key: "paymentAmount",
        label: "Amount ",
        className:
          "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap text-right",
        cellClassName: "px-4 py-4 text-right whitespace-nowrap",
        renderCell: (payment) => (
          <span className="text-[13px] font-semibold text-slate-800 dark:text-gray-100">
            {formatAmount(payment.paymentAmount)}
          </span>
        ),
      },
      {
        key: "paymentMethodLabel",
        label: "Payment Method",
        className:
          "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap",
        cellClassName: "px-4 py-4 text-slate-600 dark:text-gray-400 text-[13px] whitespace-nowrap",
        renderCell: (payment) =>
          payment.paymentMethodLabel || payment.paymentMethod || "—",
      },
      {
        key: "accountName",
        label: "Account Name",
        className:
          "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap",
        cellClassName: "px-4 py-4 text-slate-600 dark:text-gray-400 text-[13px] whitespace-nowrap",
        renderCell: (payment) => payment.accountName || "—",
      },
      {
        key: "referenceNumber",
        label: "Reference No",
        className:
          "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap",
        cellClassName: "px-4 py-4 text-slate-600 dark:text-gray-400 text-[13px] whitespace-nowrap",
        renderCell: (payment) => payment.referenceNumber || "—",
      },
      {
        key: "appliedToInvoice",
        label: "Applied to Invoice",
        className:
          "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap",
        cellClassName: "px-4 py-4 whitespace-nowrap",
        renderCell: (payment) => (
          <span className="text-[13px] font-semibold text-[#1a56db] dark:text-blue-400">
            {formatAppliedInvoices(payment)}
          </span>
        ),
      },
      {
        key: "balanceAfter",
        label: "Balance After",
        className:
          "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap text-right",
        cellClassName: "px-4 py-4 text-right whitespace-nowrap",
        renderCell: (payment) => (
          <span className="text-[13px] text-slate-600 dark:text-gray-400">
            {formatAmount(payment.balanceAfter)}
          </span>
        ),
      },
      {
        key: "directionLabel",
        label: "Direction",
        className:
          "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap",
        cellClassName: "px-4 py-4 whitespace-nowrap",
        renderCell: (payment) => (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              payment.direction === "receive"
                ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
                : "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400"
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
          "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap",
        cellClassName: "px-4 py-4 whitespace-nowrap",
        renderCell: (payment) => (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              paymentStatusStyles[payment.paymentStatusLabel] ||
              "bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-400"
            }`}
          >
            {payment.paymentStatusLabel || "—"}
          </span>
        ),
      },
    ],
    []
  );

  const supplierFile = supplier
    ? {
        name: supplier.supplierName || "—",
        initials: getInitials(supplier.supplierName),
        code: supplier.supplierCode || "—",
        contact: supplier.contactPersonName || "—",
        phone: supplier.phoneNumber || "—",
        isActive: supplier.isActive !== false,
        accountStatus:
          supplier.accountStatus ||
          (supplier.isActive !== false ? "Active Account" : "Inactive Account"),
        totalPurchases: summary?.totalPurchases ?? 0,
        purchaseCount: summary?.purchaseCount ?? 0,
        totalQuantityKg: summary?.totalQuantityKg ?? 0,
        outstandingBalance: summary?.outstandingBalance ?? 0,
        lastPaymentAmount: summary?.lastPaymentAmount ?? 0,
        lastPaymentDate: formatReceivedDate(summary?.lastPaymentDate),
        lastPaymentNumber: summary?.lastPaymentNumber,
        lastPaymentMethodLabel: summary?.lastPaymentMethodLabel,
        creditLimit:
          summary?.creditLimitAmount ?? supplier.creditLimitAmount ?? 0,
      }
    : null;

  const handleDeleteConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(
        `Supplier ${supplierFile?.name} has been deleted successfully`
      );
      setIsDeleteOpen(false);
      navigate("/suppliers");
    } catch (deleteError) {
      toast.error(
        deleteError.response?.data?.message ||
          "Failed to delete supplier. Please try again."
      );
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-full items-center justify-center bg-[#F8FAFC] dark:bg-gray-950 p-8 text-sm text-slate-500 dark:text-gray-400">
        Loading supplier...
      </main>
    );
  }

  if (error || !supplierFile) {
    return (
      <main className="flex min-h-full flex-col items-center justify-center gap-4 bg-[#F8FAFC] dark:bg-gray-950 p-8 text-sm text-red-500 dark:text-red-400">
        <p>Unable to load supplier.</p>
        <button
          type="button"
          onClick={() => navigate("/suppliers")}
          className="inline-flex items-center gap-2 rounded-md bg-white dark:bg-gray-900 px-3 py-2 font-semibold text-slate-600 dark:text-gray-400 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Suppliers
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-[#F8FAFC] dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <p className="text-xs text-slate-400 dark:text-gray-500">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="font-medium text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-400"
        >
          Dashboard
        </button>
        <span className="px-1">/</span>
        <button
          type="button"
          onClick={() => navigate("/suppliers")}
          className="font-medium text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-400"
        >
          Suppliers
        </button>
        <span className="px-1">/</span>
        <span className="font-semibold text-slate-600 dark:text-gray-400">{supplierFile.name}</span>
      </p>

      <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-gray-100">
        Account Ledger
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
        Detailed financial ledger and purchase records for {supplierFile.name}
      </p>

      <section className="mt-5 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-5 py-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-gray-800 text-base font-bold text-slate-600 dark:text-gray-400">
              {supplierFile.initials}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-gray-100">
                  {supplierFile.name}
                </h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    supplierFile.isActive
                      ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
                      : "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400"
                  }`}
                >
                  {supplierFile.accountStatus}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
                Code: {supplierFile.code}
                <span className="px-2 text-slate-300">|</span>
                Contact: {supplierFile.contact}
                <span className="px-2 text-slate-300">|</span>
                Phone: {supplierFile.phone}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {can("suppliers", "delete") && (
              <button
                type="button"
                onClick={() => setIsDeleteOpen(true)}
                className="rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-slate-700 dark:text-gray-300 transition hover:bg-slate-50 dark:hover:bg-gray-800"
              >
                Delete Profile
              </button>
            )}
            {can("suppliers", "update") && (
              <button
                type="button"
                onClick={() => navigate(`/suppliers/edit/${id}`)}
                className="rounded-lg bg-[#1E3A8A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1E40AF]"
              >
                Edit Supplier
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Total Purchases</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-gray-100">
            {formatRs(supplierFile.totalPurchases)}
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-gray-500">
            {supplierFile.purchaseCount}{" "}
            {supplierFile.purchaseCount === 1 ? "receipt" : "receipts"}
            {supplierFile.totalQuantityKg
              ? ` · ${Number(supplierFile.totalQuantityKg).toLocaleString()} KG`
              : ""}
          </p>
        </article>

        <article className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-4 shadow-sm">
          <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Remaining Payable</p>
          <p className="mt-2 text-2xl font-bold text-amber-500 dark:text-amber-400">
            {formatRs(supplierFile.outstandingBalance)}
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Last Payment</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatRs(supplierFile.lastPaymentAmount)}
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-gray-500">
            {supplierFile.lastPaymentDate
              ? [
                  `Paid on ${supplierFile.lastPaymentDate}`,
                  supplierFile.lastPaymentNumber,
                  supplierFile.lastPaymentMethodLabel,
                ]
                  .filter(Boolean)
                  .join(" · ")
              : "No payment made yet"}
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Credit Limit</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-gray-100">
            {formatRs(supplierFile.creditLimit)}
          </p>
        </article>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-6 border-b border-slate-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setActiveTab("purchases")}
            className={`-mb-px border-b-2 px-1 pb-3 text-sm font-semibold ${
              activeTab === "purchases"
                ? "border-[#2563EB] text-[#2563EB] dark:text-blue-400"
                : "border-transparent text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-400"
            }`}
          >
            Purchase History
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("payments")}
            className={`-mb-px border-b-2 px-1 pb-3 text-sm font-semibold ${
              activeTab === "payments"
                ? "border-[#2563EB] text-[#2563EB] dark:text-blue-400"
                : "border-transparent text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-400"
            }`}
          >
            Payment History
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
          {activeTab === "purchases" ? (
            <div>
              <div className="flex flex-col gap-3 border-b border-slate-100 dark:border-gray-800 p-3 sm:flex-row sm:items-center">
                <label className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-gray-500" />
                  <input
                    value={purchaseSearch}
                    onChange={(event) => {
                      setPurchaseSearch(event.target.value);
                      setPurchasesPage(1);
                    }}
                    className="w-full rounded-md border border-slate-200 dark:border-gray-700 py-2 pl-9 pr-3 text-sm text-slate-700 dark:text-gray-300 outline-none transition placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                    placeholder="Search by receipt or invoice number..."
                  />
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
                  <span className="whitespace-nowrap">From</span>
                  <input
                    type="date"
                    value={startDate || ""}
                    onChange={(event) => {
                      setStartDate(event.target.value || null);
                      setPurchasesPage(1);
                    }}
                    className="w-full rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-slate-600 dark:text-gray-400 outline-none focus:border-[#008951] sm:w-44"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
                  <span className="whitespace-nowrap">To</span>
                  <input
                    type="date"
                    value={endDate || ""}
                    onChange={(event) => {
                      setEndDate(event.target.value || null);
                      setPurchasesPage(1);
                    }}
                    className="w-full rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-slate-600 dark:text-gray-400 outline-none focus:border-[#008951] sm:w-44"
                  />
                </label>
              </div>
              <GlobalTable
                columns={purchaseColumns}
                data={purchaseRows}
                pagination
                rowsPerPage={purchasesPagination.limit || purchasesLimit}
                ariaLabel="Supplier purchase history"
                emptyContent={
                  isPurchaseHistoryLoading
                    ? "Loading purchase history..."
                    : purchaseHistoryError
                      ? "Unable to load purchase history."
                      : "No purchases found for this supplier."
                }
                totalCount={purchasesPagination.total}
                page={purchasesPage}
                onPageChange={setPurchasesPage}
              />
            </div>
          ) : (
            <GlobalTable
              columns={paymentColumns}
              data={paymentRows}
              pagination
              rowsPerPage={paymentsPagination.limit || paymentsLimit}
              ariaLabel="Supplier payment history"
              emptyContent={
                isPaymentHistoryLoading
                  ? "Loading payment history..."
                  : paymentHistoryError
                    ? "Unable to load payment history."
                    : "No payments found for this supplier."
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
        title="Delete Supplier"
        message="Are you sure you want to delete this supplier? This action cannot be undone and will permanently remove the supplier record from the system."
        itemName={`${supplierFile.code} - ${supplierFile.name}`}
        isDeleting={deleteMutation.isPending}
      />
    </main>
  );
}

export default SupplierDetails;
