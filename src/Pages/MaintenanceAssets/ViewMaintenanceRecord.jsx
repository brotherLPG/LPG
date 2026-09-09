import { ArrowLeft, Edit3, Wrench, Calendar, DollarSign, UserCheck, Tag, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMaintenanceRecordById } from "../../queries/maintenanceRecords/maintenanceRecords.queries";

function DetailItem({ label, value, icon: Icon }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
        {Icon && <Icon className="h-3.5 w-3.5 text-slate-400" />}
        {label}
      </dt>
      <dd className="text-sm text-slate-800 font-medium">{value || "-"}</dd>
    </div>
  );
}

const formatLabel = (str) => {
  if (!str) return "-";
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

function ViewMaintenanceRecord() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: recordResponse, isLoading, error } = useMaintenanceRecordById(id);
  const record = recordResponse?.data;

  if (isLoading) {
    return (
      <main className="flex min-h-full items-center justify-center bg-slate-50 p-8 text-sm text-slate-500">
        Loading maintenance record details...
      </main>
    );
  }

  if (error || !record) {
    return (
      <main className="flex min-h-full flex-col items-center justify-center gap-4 bg-slate-50 p-8 text-sm text-red-500">
        <p>Unable to load maintenance record details.</p>
        <button
          type="button"
          onClick={() => navigate("/assets?tab=maintenance-records")}
          className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 font-semibold text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Maintenance Records
        </button>
      </main>
    );
  }

  const mDate = record.maintenanceDate ? new Date(record.maintenanceDate) : null;
  const formattedMDate = mDate
    ? `${mDate.getDate().toString().padStart(2, "0")}/${(mDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${mDate.getFullYear()}`
    : "-";

  const nDate = record.nextMaintenanceDate ? new Date(record.nextMaintenanceDate) : null;
  const formattedNDate = nDate
    ? `${nDate.getDate().toString().padStart(2, "0")}/${(nDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${nDate.getFullYear()}`
    : "-";

  const cDate = record.createdAt ? new Date(record.createdAt) : null;
  const formattedCDate = cDate ? cDate.toLocaleString() : "-";

  const assetObj = record.assetId || record.maintenanceAssetId;
  const assetInfo =
    assetObj && typeof assetObj === "object"
      ? `${assetObj.assetName || assetObj.assetCode} (${assetObj.assetCode || "AST"})`
      : assetObj || "-";

  const performedBy =
    record.performedByEmployeeId && typeof record.performedByEmployeeId === "object"
      ? `${record.performedByEmployeeId.fullName} (${record.performedByEmployeeId.employeeCode || "EMP"}) — ${record.performedByEmployeeId.jobTitle || "Staff"}`
      : "-";

  const approvedBy =
    record.approvedByUserId && typeof record.approvedByUserId === "object"
      ? `${record.approvedByUserId.fullName} (${record.approvedByUserId.emailAddress || ""})`
      : "-";

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
                onClick={() => navigate("/assets?tab=maintenance-records")}
                className="font-medium text-slate-400 hover:text-slate-600 transition-colors"
              >
                Maintenance Records
              </button>
              <span className="px-1 text-slate-400">/</span>
              <span className="font-semibold text-slate-600">Record Details</span>
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Maintenance Record #{record.maintenanceNumber || record._id}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Complete service history, diagnostics, and cost breakdown
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(`/maintenance-records/edit/${record._id}`)}
              className="inline-flex items-center gap-2 rounded-md bg-[#008951] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <Edit3 className="h-4 w-4" /> Edit Record
            </button>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Card 1: Overview */}
          <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-[#008951]" /> Record Specifications
            </h2>
            <dl className="grid gap-5 p-5 sm:grid-cols-2">
              <DetailItem label="Maintenance Number" value={record.maintenanceNumber} icon={Tag} />
              <DetailItem label="Maintenance Type" value={formatLabel(record.maintenanceType)} icon={Tag} />
              <DetailItem label="Maintenance Date" value={formattedMDate} icon={Calendar} />
              <DetailItem label="Next Maintenance Date" value={formattedNDate} icon={Calendar} />
              <DetailItem
                label="Maintenance Cost"
                value={`Rs. ${(record.maintenanceCostAmount || 0).toLocaleString()}`}
                icon={DollarSign}
              />
              <DetailItem label="Created At" value={formattedCDate} icon={Calendar} />
            </dl>
          </section>

          {/* Card 2: Asset & Personnel */}
          <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-[#008951]" /> Asset & Personnel
            </h2>
            <dl className="grid gap-5 p-5">
              <DetailItem label="Associated Asset" value={assetInfo} icon={Wrench} />
              <DetailItem label="Performed By Employee" value={performedBy} icon={UserCheck} />
              <DetailItem label="Approved By User" value={approvedBy} icon={UserCheck} />
            </dl>
          </section>

          {/* Card 3: Problem & Work Performed (Full Width) */}
          <section className="lg:col-span-2 rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800 flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#008951]" /> Diagnostics & Work Performed
            </h2>
            <div className="p-5 space-y-5">
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Problem Description
                </h3>
                <p className="text-sm text-slate-700 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                  {record.problemDescription || "No problem description specified."}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Work Performed
                </h3>
                <p className="text-sm text-slate-700 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                  {record.workPerformed || "No details provided for work performed."}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default ViewMaintenanceRecord;
