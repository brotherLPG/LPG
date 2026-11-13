import {
  ArrowLeft,
  Receipt,
  Calendar,
  CreditCard,
  Landmark,
  FileText,
  User,
  CheckCircle,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCcw,
  Wallet,
  Hash,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPaymentById } from "../../queries/payments/payments.queries";

function DetailItem({ label, value, icon: Icon }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
        {Icon && <Icon className="h-3.5 w-3.5 text-slate-400" />}
        {label}
      </dt>
      <dd className="text-sm text-slate-800 font-medium wrap-break-word">
        {value || "-"}
      </dd>
    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateTime(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function paymentTypeLabel(payment) {
  if (payment.paymentType === "refund") return "Customer Refund (Outward)";
  if (payment.paymentType === "pay") return "Supplier Payment (Outward)";
  if (payment.paymentType === "receive") return "Customer Receipt (Inward)";
  return payment.directionLabel || "-";
}

function directionIcon(payment) {
  if (payment.paymentType === "receive") return ArrowDownLeft;
  if (payment.paymentType === "refund" || payment.paymentType === "pay")
    return ArrowUpRight;
  return RefreshCcw;
}

function directionBadgeStyle(payment) {
  if (payment.paymentType === "receive")
    return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  if (payment.paymentType === "refund")
    return "bg-purple-50 text-purple-700 border border-purple-200";
  if (payment.paymentType === "pay")
    return "bg-blue-50 text-blue-700 border border-blue-200";
  return "bg-slate-50 text-slate-600 border border-slate-200";
}

function statusBadgeStyle(status) {
  const value = String(status || "").toLowerCase();
  if (value.includes("paid") || value.includes("completed"))
    return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  if (value.includes("pending") || value.includes("partial"))
    return "bg-amber-50 text-amber-700 border border-amber-200";
  if (value.includes("cancel") || value.includes("fail"))
    return "bg-red-50 text-red-700 border border-red-200";
  return "bg-slate-50 text-slate-600 border border-slate-200";
}

function isPaidStatus(status) {
  const value = String(status || "").toLowerCase();
  return value.includes("paid") || value.includes("completed");
}

function PaymentDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading, error } = useGetPaymentById(id);
  const payment = data?.data;

  if (isLoading) {
    return (
      <main className="flex min-h-full items-center justify-center bg-slate-50 p-8 text-sm text-slate-500">
        Loading payment...
      </main>
    );
  }

  if (error || !payment) {
    return (
      <main className="flex min-h-full flex-col items-center justify-center gap-4 bg-slate-50 p-8 text-sm text-red-500">
        <p>Unable to load payment.</p>
        <button
          type="button"
          onClick={() => navigate("/payments")}
          className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 font-semibold text-slate-600 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Payments
        </button>
      </main>
    );
  }

  const DirectionIcon = directionIcon(payment);
  const allocations = Array.isArray(payment.allocations) ? payment.allocations : [];
  const allocatedTotal = allocations.reduce(
    (total, allocation) => total + (Number(allocation?.amountApplied) || 0),
    0
  );

  return (
    <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header & Breadcrumbs */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs mb-2">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="font-medium text-slate-400 hover:text-slate-600 transition-colors"
              >
                Dashboard
              </button>
              <span className="px-1 text-slate-400">/</span>
              <button
                type="button"
                onClick={() => navigate("/payments")}
                className="font-medium text-slate-400 hover:text-slate-600 transition-colors"
              >
                Payments
              </button>
              <span className="px-1 text-slate-400">/</span>
              <span className="font-semibold text-slate-600">Payment Details</span>
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
              {payment.paymentNumber || "Payment Voucher"}
            </h1>
            <p className="mt-1 text-sm text-tertiary">
              Payment voucher details and invoice allocation information
            </p>
          </div>
         
        </div>

        {/* Status & Amount Banner */}
        <div className="mb-5 rounded-xl border border-slate-200 bg-white shadow-sm p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                Direction
              </p>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${directionBadgeStyle(payment)}`}
              >
                <DirectionIcon className="h-4 w-4" />
                {paymentTypeLabel(payment)}
              </span>
            </div>
            <div className="h-10 w-px bg-slate-200 hidden sm:block" />
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                Status
              </p>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${statusBadgeStyle(payment.paymentStatusLabel)}`}
              >
                {isPaidStatus(payment.paymentStatusLabel) ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
                {payment.paymentStatusLabel || "-"}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
              Payment Amount
            </p>
            <p className="text-3xl font-extrabold text-slate-900">
              Rs. {(payment.paymentAmount || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Card 1: Payment Information */}
          <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800 flex items-center gap-2">
              <Receipt className="h-4 w-4 text-[#008951]" /> Payment Information
            </h2>
            <dl className="grid gap-5 p-5 sm:grid-cols-2">
              <DetailItem
                label="Payment Number"
                value={payment.paymentNumber}
                icon={Hash}
              />
              <DetailItem
                label="Payment Date"
                value={formatDate(payment.paymentDate)}
                icon={Calendar}
              />
              <DetailItem
                label="Payment Method"
                value={payment.paymentMethodLabel || payment.paymentMethod}
                icon={CreditCard}
              />
              <DetailItem
                label="Account"
                value={payment.accountName}
                icon={Landmark}
              />
              <DetailItem
                label="Reference Number"
                value={payment.referenceNumber}
                icon={Hash}
              />
              <DetailItem
                label="Allocated Total"
                value={`Rs. ${allocatedTotal.toLocaleString()}`}
                icon={Wallet}
              />
            </dl>
          </section>

          {/* Card 2: Party Information */}
          <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800 flex items-center gap-2">
              <User className="h-4 w-4 text-[#008951]" /> Party Information
            </h2>
            <dl className="grid gap-5 p-5 sm:grid-cols-2">
              <DetailItem
                label="Party Type"
                value={
                  payment.partyType === "customer" ? "Customer" : "Supplier"
                }
                icon={User}
              />
              <DetailItem
                label="Party Code"
                value={payment.partyCode}
                icon={Hash}
              />
              <div className="sm:col-span-2">
                <DetailItem
                  label="Party Name"
                  value={payment.partyName}
                  icon={User}
                />
              </div>
            </dl>
          </section>

          {/* Card 3: Transaction Details */}
          <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800 flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#008951]" /> Transaction Details
            </h2>
            <dl className="grid gap-5 p-5 sm:grid-cols-2">
              <DetailItem
                label="Created At"
                value={formatDateTime(payment.createdAt)}
                icon={Calendar}
              />
              <DetailItem
                label="Last Updated"
                value={formatDateTime(payment.updatedAt)}
                icon={Calendar}
              />
              {payment.remarks && (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                    <FileText className="h-3.5 w-3.5 text-slate-400" />
                    Remarks
                  </dt>
                  <dd className="text-sm text-slate-800 font-medium bg-slate-50 rounded-md p-3 border border-slate-100">
                    {payment.remarks}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {/* Card 4: Invoice Allocations */}
          <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800 flex items-center gap-2">
              <Wallet className="h-4 w-4 text-[#008951]" /> Invoice Allocations
            </h2>
            {allocations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-4 py-3 text-left text-[13px] font-bold text-slate-700">
                        Invoice #
                      </th>
                      <th className="px-4 py-3 text-right text-[13px] font-bold text-slate-700">
                        Amount Applied
                      </th>
                      <th className="px-4 py-3 text-right text-[13px] font-bold text-slate-700">
                        Remaining
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocations.map((allocation, index) => (
                      <tr
                        key={allocation?._id || index}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-semibold text-[#1a56db]">
                          {allocation?.invoiceNumber ||
                            allocation?.receiptNumber ||
                            allocation?.saleNumber ||
                            "-"}
                        </td>
                        <td className="px-4 py-3 text-right text-emerald-600 font-semibold tabular-nums">
                          Rs. {(allocation?.amountApplied || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600 tabular-nums">
                          Rs. {(allocation?.outstandingAmount || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-slate-200 bg-slate-50/60">
                      <td className="px-4 py-3 text-sm font-bold text-slate-700">
                        Total
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-bold text-emerald-600 tabular-nums">
                        Rs. {allocatedTotal.toLocaleString()}
                      </td>
                      <td className="px-4 py-3" />
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="p-5 text-sm text-slate-500">
                No allocations found for this payment.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default PaymentDetails;
