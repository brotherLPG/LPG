import { ArrowLeft, Edit3 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAssetById } from "../../queries/assets/assets.queries";
import { usePermissions } from "../../contexts/PermissionContext";

function DetailItem({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm text-slate-700 font-medium">{value || "-"}</dd>
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

function ViewAsset() {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const { id } = useParams();
  const { data, isLoading, error } = useAssetById(id);
  const asset = data?.data;

  if (isLoading) {
    return (
      <main className="flex min-h-full items-center justify-center bg-slate-50 p-8 text-sm text-slate-500">
        Loading asset details...
      </main>
    );
  }

  if (error || !asset) {
    return (
      <main className="flex min-h-full flex-col items-center justify-center gap-4 bg-slate-50 p-8 text-sm text-red-500">
        <p>Unable to load asset details.</p>
        <button
          type="button"
          onClick={() => navigate("/assets")}
          className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 font-semibold text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Assets
        </button>
      </main>
    );
  }

  const pDate = asset.purchaseDate ? new Date(asset.purchaseDate) : null;
  const formattedDate = pDate
    ? `${pDate.getDate().toString().padStart(2, "0")}/${(pDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${pDate.getFullYear()}`
    : "-";

  const assignedEmp =
    asset.assignedEmployeeId && typeof asset.assignedEmployeeId === "object"
      ? `${asset.assignedEmployeeId.fullName} (${asset.assignedEmployeeId.employeeCode || "EMP"})`
      : "-";

  return (
    <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
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
              onClick={() => navigate("/assets")}
              className="font-medium text-slate-400 hover:text-slate-600 transition-colors"
            >
              Fixed Assets
            </button>
            <span className="px-1 text-slate-400">/</span>
            <span className="font-semibold text-slate-600">Asset Details</span>
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {asset.assetName} ({asset.assetCode})
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Fixed asset specifications, valuation, and current assignment status
          </p>
        </div>
        <div className="flex gap-2">
          {can("assets", "update") && (
          <button
            type="button"
            onClick={() => navigate(`/assets/edit/${asset._id}`)}
            className="inline-flex items-center gap-2 rounded-md bg-[#008951] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
          >
            <Edit3 className="h-4 w-4" /> Edit Asset
          </button>
          )}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">
            Asset Information
          </h2>
          <dl className="grid gap-5 p-5 sm:grid-cols-2">
            <DetailItem label="Asset Code" value={asset.assetCode} />
            <DetailItem label="Asset Name" value={asset.assetName} />
            <DetailItem label="Category" value={formatLabel(asset.assetCategory)} />
            <DetailItem label="Location" value={asset.locationName} />
            <DetailItem label="Manufacturer" value={asset.manufacturerName || "N/A"} />
            <DetailItem label="Model Number" value={asset.modelNumber || "N/A"} />
            <DetailItem label="Serial Number" value={asset.serialNumber || "N/A"} />
            <DetailItem label="Status" value={formatLabel(asset.assetStatus)} />
          </dl>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">
            Financial & Assignment Details
          </h2>
          <dl className="grid gap-5 p-5 sm:grid-cols-2">
            <DetailItem label="Purchase Date" value={formattedDate} />
            <DetailItem
              label="Purchase Cost"
              value={asset.purchaseCostAmount ? `Rs. ${asset.purchaseCostAmount.toLocaleString()}` : "Rs. 0"}
            />
            <DetailItem
              label="Current Book Value"
              value={asset.currentBookValueAmount ? `Rs. ${asset.currentBookValueAmount.toLocaleString()}` : "Rs. 0"}
            />
            <DetailItem label="Depreciation Method" value={formatLabel(asset.depreciationMethod)} />
            <DetailItem label="Assigned Employee" value={assignedEmp} />
          </dl>
        </section>
      </div>
    </main>
  );
}

export default ViewAsset;
