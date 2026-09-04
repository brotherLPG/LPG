import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useFillingBatchById } from "../../queries/fillingBatches/fillingBatches.queries";

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

function FillingBatchDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, isLoading, error } = useFillingBatchById(id);
    const batch = data?.data;

    if (isLoading) {
        return <main className="flex min-h-full items-center justify-center bg-slate-50 p-8 text-sm text-slate-500">Loading filling batch...</main>;
    }

    if (error || !batch) {
        return (
            <main className="flex min-h-full flex-col items-center justify-center gap-4 bg-slate-50 p-8 text-sm text-red-500">
                <p>Unable to load filling batch.</p>
                <button type="button" onClick={() => navigate("/filling-batches")} className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 font-semibold text-slate-600 shadow-sm">
                    <ArrowLeft className="h-4 w-4" /> Back to Filling Batches
                </button>
            </main>
        );
    }

    const tank = batch.storageTankId;
    const cylinderType = batch.cylinderTypeId || batch.cylinderType;
    const operator = batch.operatorEmployeeId || batch.operator;
    const createdBy = batch.createdByUserId;
    const statusLabel = batch.batchStatusLabel || batch.batchStatus || "Pending";
    const status = String(batch.batchStatus || "pending").toLowerCase();
    const statusStyles = {
        completed: "bg-emerald-50 text-emerald-600 border border-emerald-100",
        "in-progress": "bg-blue-50 text-blue-600 border border-blue-100",
        pending: "bg-amber-50 text-amber-600 border border-amber-100",
    };

    return (
        <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-xs">
                        <button type="button" onClick={() => navigate("/dashboard")} className="font-medium text-slate-400 hover:text-slate-600">Dashboard</button>
                        <span className="px-1 text-slate-400">/</span>
                        <button type="button" onClick={() => navigate("/filling-batches")} className="font-medium text-slate-400 hover:text-slate-600">Filling Batches</button>
                        <span className="px-1 text-slate-400">/</span>
                        <span className="font-semibold text-slate-600">Batch Details</span>
                    </p>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{batch.batchNumber || "Filling Batch"}</h1>
                    <p className="mt-1 text-sm text-slate-500">Details of this LPG cylinder filling run</p>
                </div>
                <button type="button" onClick={() => navigate(`/filling-batches/edit/${batch._id}`)} className="inline-flex items-center gap-2 rounded-md bg-[#008951] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
                    <Pencil className="h-4 w-4" /> Edit Batch
                </button>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
                    <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Batch Information</h2>
                    <dl className="grid gap-5 p-5 sm:grid-cols-2">
                        <DetailItem label="Batch Number" value={batch.batchNumber} />
                        <div>
                            <dt className="text-xs font-semibold text-slate-400">Status</dt>
                            <dd className="mt-1"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[status] || "border border-slate-200 bg-slate-50 text-slate-600"}`}>{statusLabel}</span></dd>
                        </div>
                        <DetailItem label="Filling Date" value={formatDate(batch.fillingDate)} />
                        <DetailItem label="Source Tank" value={batch.sourceTankName || tank?.displayName || tank?.tankName} />
                        <DetailItem label="Operator" value={batch.operatorName || operator?.fullName || operator?.employeeCode} />
                        <DetailItem label="Created By" value={createdBy?.fullName || createdBy?.name || createdBy?.username || createdBy?.email || createdBy?._id || createdBy} />
                    </dl>
                </section>

                <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
                    <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Filling Details</h2>
                    <dl className="grid gap-5 p-5 sm:grid-cols-2">
                        <DetailItem label="Cylinder Type" value={batch.cylinderTypeName || cylinderType?.typeName} />
                        <DetailItem label="Cylinder Quantity" value={batch.cylinderCount ? `${Number(batch.cylinderCount).toLocaleString()} Cylinders` : undefined} />
                        <DetailItem label="Target Fill Weight" value={batch.targetFillWeightKg ? `${Number(batch.targetFillWeightKg).toLocaleString()} KG` : undefined} />
                        <DetailItem label="Actual LPG Used" value={batch.actualLpgUsedKg ? `${Number(batch.actualLpgUsedKg).toLocaleString()} KG` : undefined} />
                    </dl>
                </section>

                <section className="rounded-lg border border-slate-200 bg-white shadow-sm lg:col-span-2">
                    <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Remarks</h2>
                    <p className="p-5 text-sm text-slate-700">{batch.remarks || "-"}</p>
                </section>
            </div>
        </main>
    );
}

export default FillingBatchDetails;
