import { ArrowLeft, Pencil, Truck, Weight, Banknote, FileText, Package, Hash, CheckCircle2, Building2, User, CalendarDays, Database } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useLpgReceiptById } from "../../queries/lpgReceipts/lpgReceipts.queries";
import { usePermissions } from "../../contexts/PermissionContext";

function DetailItem({ label, value, icon: Icon }) {
  return (
    <div>
      <div className="flex items-start gap-3 rounded-xl border border-slate-100 dark:border-gray-800 bg-linear-to-br from-slate-50 to-white dark:from-gray-800/60 dark:to-gray-900/40 px-4 py-3 transition hover:border-blue-200 dark:hover:border-blue-800">
        {Icon && (
          <div className="mt-0.5 shrink-0 rounded-lg bg-blue-100/80 dark:bg-blue-900/50 p-1.5">
            <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        )}
        <div className="min-w-0">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">{label}</dt>
          <dd className="mt-0.5 wrap-break-word text-sm font-semibold text-slate-800 dark:text-gray-200">{value || "-"}</dd>
        </div>
      </div>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function LpgReceiptDetails() {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const { id } = useParams();
  const { data, isLoading, error } = useLpgReceiptById(id);
  const receipt = data?.data;

  const supplier = receipt?.supplierId;
  const employee = receipt?.receivedByEmployeeId || receipt?.receivedBy;
  const tank = receipt?.storageTankId;

  if (isLoading) {
    return <main className="flex min-h-full items-center justify-center bg-slate-50 dark:bg-gray-800 p-8 text-sm text-slate-500 dark:text-gray-400">Loading LPG receipt...</main>;
  }

  if (error || !receipt) {
    return (
      <main className="flex min-h-full flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-gray-800 p-8 text-sm text-red-500 dark:text-red-400">
        <p>Unable to load LPG receipt.</p>
        <button type="button" onClick={() => navigate("/lpg-receipts")} className="inline-flex items-center gap-2 rounded-md bg-white dark:bg-gray-900 px-3 py-2 font-semibold text-slate-600 dark:text-gray-400 shadow-sm">
          <ArrowLeft className="h-4 w-4" /> Back to LPG Receipts
        </button>
      </main>
    );
  }

  const supplierName = receipt.supplierName || supplier?.supplierName || supplier?.name;
  const employeeName = receipt.receivedByEmployeeName || employee?.fullName || employee?.employeeCode;
  const tankName = receipt.storageTankName || tank?.tankName || tank?.tankCode;
  const statusValue = receipt.status || "Confirmed";
  const isPending = statusValue.toLowerCase() === "pending";
  const isDraft = statusValue.toLowerCase() === "draft";

  return (
    <main className="min-h-full bg-slate-50 dark:bg-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs">
            <button type="button" onClick={() => navigate("/dashboard")} className="font-medium text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-400">Dashboard</button>
            <span className="px-1 text-slate-400 dark:text-gray-500">/</span>
            <button type="button" onClick={() => navigate("/lpg-receipts")} className="font-medium text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-400">LPG Receipts</button>
            <span className="px-1 text-slate-400 dark:text-gray-500">/</span>
            <span className="font-semibold text-slate-600 dark:text-gray-400">Receipt Details</span>
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-gray-100">{receipt.receiptNumber || "LPG Receipt"}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">Shipment, receiving, supplier, and transaction details</p>
        </div>
        <div className="flex gap-2">
         
          {can("lpg-receipts", "update") && (
          <button type="button" onClick={() => navigate(`/lpg-receipts/edit/${receipt._id}`)} className="inline-flex items-center gap-2 rounded-md bg-[#008951] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
            <Pencil className="h-4 w-4" /> Edit Receipt
          </button>
          )}
        </div>
      </div>

      {/* Hero card */}
      <div className="mb-6 rounded-2xl border border-blue-200 dark:border-blue-800 bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950/60 dark:to-blue-900/40 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-blue-200/70 dark:bg-blue-800/60 p-3">
              <Truck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">LPG Shipment Receipt</p>
              <p className="text-xl font-extrabold text-blue-800 dark:text-blue-200">{receipt.receiptNumber || "—"}</p>
              <p className="mt-0.5 text-sm text-slate-600 dark:text-gray-400">{supplierName || "Unknown supplier"}</p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold ${isPending ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300' : isDraft ? 'bg-slate-200 dark:bg-gray-700 text-slate-700 dark:text-gray-300' : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'}`}>
            {statusValue}
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-linear-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/60 dark:to-emerald-900/40 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-emerald-200/70 dark:bg-emerald-800/60 p-2">
              <Weight className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-600 dark:text-gray-400">Received Quantity</p>
              <p className="mt-1 text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">{receipt.receivedQuantityKg ? `${receipt.receivedQuantityKg.toLocaleString()} KG` : "—"}</p>
              <p className="mt-1 text-[11px] text-slate-400 dark:text-gray-500">Net gas received</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950/60 dark:to-blue-900/40 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-blue-200/70 dark:bg-blue-800/60 p-2">
              <Banknote className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-600 dark:text-gray-400">Purchase Rate</p>
              <p className="mt-1 text-2xl font-extrabold text-blue-700 dark:text-blue-300">{receipt.purchaseRatePerKg ? `Rs. ${receipt.purchaseRatePerKg.toLocaleString()}` : "—"}</p>
              <p className="mt-1 text-[11px] text-slate-400 dark:text-gray-500">Per KG rate</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-gray-700 bg-linear-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-slate-200/70 dark:bg-gray-700 p-2">
              <FileText className="h-5 w-5 text-slate-700 dark:text-gray-300" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-600 dark:text-gray-400">Total Purchase Amount</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-gray-100">{receipt.totalPurchaseAmount ? `Rs. ${receipt.totalPurchaseAmount.toLocaleString()}` : "—"}</p>
              <p className="mt-1 text-[11px] text-slate-400 dark:text-gray-500">Invoice total</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-linear-to-br from-amber-50 to-amber-100 dark:from-amber-950/60 dark:to-amber-900/40 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-amber-200/70 dark:bg-amber-800/60 p-2">
              <Truck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-600 dark:text-gray-400">Truck Number</p>
              <p className="mt-1 text-2xl font-extrabold text-amber-700 dark:text-amber-300">{receipt.truckRegistrationNumber || "—"}</p>
              <p className="mt-1 text-[11px] text-slate-400 dark:text-gray-500">Vehicle registration</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-gray-800 px-4 py-3"><FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" /><h2 className="text-base font-bold text-slate-800 dark:text-gray-100">Receipt Information</h2></div>
          <dl className="grid gap-5 p-5 sm:grid-cols-2">
            <DetailItem label="Receipt Number" value={receipt.receiptNumber} icon={Hash} />
            <DetailItem label="Status" value={receipt.status || "Confirmed"} icon={CheckCircle2} />
            <DetailItem label="Supplier" value={supplierName} icon={Building2} />
            <DetailItem label="Supplier Invoice Number" value={receipt.supplierInvoiceNumber} icon={FileText} />
            <DetailItem label="Received By" value={employeeName} icon={User} />
            <DetailItem label="Received At" value={formatDate(receipt.receivedAt)} icon={CalendarDays} />
          </dl>
        </section>

        <section className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-gray-800 px-4 py-3"><Truck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /><h2 className="text-base font-bold text-slate-800 dark:text-gray-100">Receiving Details</h2></div>
          <dl className="grid gap-5 p-5 sm:grid-cols-2">
            <DetailItem label="Storage Tank" value={tankName} icon={Database} />
            
            
            
            
          </dl>
        </section>

        <section className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-gray-800 px-4 py-3"><Package className="h-4 w-4 text-amber-600 dark:text-amber-400" /><h2 className="text-base font-bold text-slate-800 dark:text-gray-100">Remarks</h2></div>
          <p className="p-5 text-sm text-slate-700 dark:text-gray-300">{receipt.remarks || "-"}</p>
        </section>
      </div>
    </main>
  );
}

export default LpgReceiptDetails;