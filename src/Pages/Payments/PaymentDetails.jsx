import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPaymentById } from "../../queries/payments/payments.queries";

function DetailItem({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-slate-400">{label}</dt>
      <dd className="mt-1 wrap-break-word text-sm text-slate-700">{value || "-"}</dd>
    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
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

  return (
    <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs">
            <button type="button" onClick={() => navigate("/dashboard")} className="font-medium text-slate-400 hover:text-slate-600">
              Dashboard
            </button>
            <span className="px-1 text-slate-400">/</span>
            <button type="button" onClick={() => navigate("/payments")} className="font-medium text-slate-400 hover:text-slate-600">
              Payments
            </button>
            <span className="px-1 text-slate-400">/</span>
            <span className="font-semibold text-slate-600">Payment Details</span>
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{payment.paymentNumber}</h1>
          <p className="mt-1 text-sm text-slate-500">Payment voucher details and allocation information</p>
        </div>
        {/* <div className="flex gap-2">
          <button type="button" onClick={() => navigate(`/payments/edit/${payment._id}`)} className="inline-flex items-center gap-2 rounded-md bg-[#008951] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
            <Pencil className="h-4 w-4" /> Edit Payment
          </button>
        </div> */}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Payment Information</h2>
          <dl className="grid gap-5 p-5 sm:grid-cols-2">
            <DetailItem label="Payment Number" value={payment.paymentNumber} />
            <DetailItem label="Payment Date" value={formatDate(payment.paymentDate)} />
            <DetailItem label="Direction" value={payment.directionLabel} />
            <DetailItem label="Status" value={payment.paymentStatusLabel} />
            <DetailItem label="Payment Amount" value={`Rs. ${payment.paymentAmount?.toLocaleString()}`} />
            <DetailItem label="Payment Method" value={payment.paymentMethodLabel} />
          </dl>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Party Information</h2>
          <dl className="grid gap-5 p-5 sm:grid-cols-2">
            <DetailItem label="Party Type" value={payment.partyType === "customer" ? "Customer" : "Supplier"} />
            <DetailItem label="Party Code" value={payment.partyCode} />
            <DetailItem label="Party Name" value={payment.partyName} />
            <DetailItem label="Account" value={payment.accountName} />
          </dl>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Transaction Details</h2>
          <dl className="grid gap-5 p-5 sm:grid-cols-2">
            <DetailItem label="Reference Number" value={payment.referenceNumber} />
            <DetailItem label="Remarks" value={payment.remarks} />
            <DetailItem label="Created At" value={formatDate(payment.createdAt)} />
            <DetailItem label="Updated At" value={formatDate(payment.updatedAt)} />
          </dl>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Invoice Allocations</h2>
          {payment.allocations && payment.allocations.length > 0 ? (
            <div className="p-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Invoice Number</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Amount Applied</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Outstanding Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payment.allocations.map((allocation, index) => (
                    <tr key={index} className="border-b border-slate-100">
                      <td className="px-4 py-3 text-slate-700">{allocation.invoiceNumber}</td>
                      <td className="px-4 py-3 text-slate-700">Rs. {allocation.amountApplied?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-slate-700">Rs. {allocation.outstandingAmount?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-5 text-sm text-slate-500">No allocations found</div>
          )}
        </section>
      </div>
    </main>
  );
}

export default PaymentDetails;
