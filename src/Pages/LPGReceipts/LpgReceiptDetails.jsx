import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useLpgReceiptById } from "../../queries/lpgReceipts/lpgReceipts.queries";

function DetailItem({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-slate-400">{label}</dt>
      <dd className="mt-1 wrap-break-word text-sm text-slate-700">{value || "-"}</dd>
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
  const { id } = useParams();
  const { data, isLoading, error } = useLpgReceiptById(id);
  const receipt = data?.data;

  const supplier = receipt?.supplierId;
  const employee = receipt?.receivedByEmployeeId || receipt?.receivedBy;
  const tank = receipt?.storageTankId;

  if (isLoading) {
    return <main className="flex min-h-full items-center justify-center bg-slate-50 p-8 text-sm text-slate-500">Loading LPG receipt...</main>;
  }

  if (error || !receipt) {
    return (
      <main className="flex min-h-full flex-col items-center justify-center gap-4 bg-slate-50 p-8 text-sm text-red-500">
        <p>Unable to load LPG receipt.</p>
        <button type="button" onClick={() => navigate("/lpg-receipts")} className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 font-semibold text-slate-600 shadow-sm">
          <ArrowLeft className="h-4 w-4" /> Back to LPG Receipts
        </button>
      </main>
    );
  }

  const supplierName = receipt.supplierName || supplier?.supplierName || supplier?.name;
  const employeeName = receipt.receivedByEmployeeName || employee?.fullName || employee?.employeeCode;
  const tankName = receipt.storageTankName || tank?.tankName || tank?.tankCode;

  return (
    <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs">
            <button type="button" onClick={() => navigate("/dashboard")} className="font-medium text-slate-400 hover:text-slate-600">Dashboard</button>
            <span className="px-1 text-slate-400">/</span>
            <button type="button" onClick={() => navigate("/lpg-receipts")} className="font-medium text-slate-400 hover:text-slate-600">LPG Receipts</button>
            <span className="px-1 text-slate-400">/</span>
            <span className="font-semibold text-slate-600">Receipt Details</span>
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{receipt.receiptNumber || "LPG Receipt"}</h1>
          <p className="mt-1 text-sm text-slate-500">Shipment, receiving, supplier, and transaction details</p>
        </div>
        <div className="flex gap-2">
         
          <button type="button" onClick={() => navigate(`/lpg-receipts/edit/${receipt._id}`)} className="inline-flex items-center gap-2 rounded-md bg-[#008951] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
            <Pencil className="h-4 w-4" /> Edit Receipt
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Receipt Information</h2>
          <dl className="grid gap-5 p-5 sm:grid-cols-2">
            <DetailItem label="Receipt Number" value={receipt.receiptNumber} />
            <DetailItem label="Status" value={receipt.status || "Confirmed"} />
            <DetailItem label="Supplier" value={supplierName} />
            <DetailItem label="Supplier Invoice Number" value={receipt.supplierInvoiceNumber} />
            <DetailItem label="Received By" value={employeeName} />
            <DetailItem label="Received At" value={formatDate(receipt.receivedAt)} />
          </dl>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Receiving Details</h2>
          <dl className="grid gap-5 p-5 sm:grid-cols-2">
            {/* <DetailItem label="Storage Tank" value={tankName} /> */}
            <DetailItem label="Truck Registration Number" value={receipt.truckRegistrationNumber} />
            <DetailItem label="Received Quantity" value={receipt.receivedQuantityKg ? `${receipt.receivedQuantityKg.toLocaleString()} KG` : undefined} />
            <DetailItem label="Purchase Rate" value={receipt.purchaseRatePerKg ? `Rs. ${receipt.purchaseRatePerKg.toLocaleString()}` : undefined} />
            <DetailItem label="Total Purchase Amount" value={receipt.totalPurchaseAmount ? `Rs. ${receipt.totalPurchaseAmount.toLocaleString()}` : undefined} />
          </dl>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Remarks</h2>
          <p className="p-5 text-sm text-slate-700">{receipt.remarks || "-"}</p>
        </section>
      </div>
    </main>
  );
}

export default LpgReceiptDetails;