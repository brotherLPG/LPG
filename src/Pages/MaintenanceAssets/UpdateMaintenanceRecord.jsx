import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useMaintenanceRecordById,
  useMaintenanceRecordFormOptions,
  useUpdateMaintenanceRecord,
} from "../../queries/maintenanceRecords/maintenanceRecords.queries";
import { useToast } from "../../utils/GlobalToast";

const getId = (value) => {
  if (!value) return "";
  return typeof value === "object" ? value._id || "" : value;
};

const toDateInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

const emptyForm = {
  maintenanceNumber: "",
  maintenanceAssetId: "",
  maintenanceType: "",
  maintenanceDate: "",
  problemDescription: "",
  workPerformed: "",
  maintenanceCostAmount: "",
  nextMaintenanceDate: "",
  performedByEmployeeId: "",
  paymentMethod: "",
  accountId: "",
};

const mapRecordToForm = (record) => ({
  maintenanceNumber: record.maintenanceNumber || "",
  maintenanceAssetId: getId(record.assetId || record.maintenanceAssetId),
  maintenanceType: record.maintenanceType || "",
  maintenanceDate: toDateInput(record.maintenanceDate),
  problemDescription: record.problemDescription || "",
  workPerformed: record.workPerformed || "",
  maintenanceCostAmount:
    record.maintenanceCostAmount !== undefined && record.maintenanceCostAmount !== null
      ? String(record.maintenanceCostAmount)
      : "",
  nextMaintenanceDate: toDateInput(record.nextMaintenanceDate),
  performedByEmployeeId: getId(record.performedByEmployeeId),
  paymentMethod: record.paymentMethod || "",
  accountId: getId(record.accountId),
});

function UpdateMaintenanceRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { data: recordResponse, isLoading, error } = useMaintenanceRecordById(id);
  const { data: formOptionsResponse, isLoading: isLoadingOptions } =
    useMaintenanceRecordFormOptions();
  const updateMutation = useUpdateMaintenanceRecord();

  const record = recordResponse?.data;
  const formOptions = formOptionsResponse?.data || {};
  const maintenanceTypes = formOptions.maintenanceTypes || [];
  const paymentMethods = formOptions.paymentMethods || [];
  const assetList = formOptions.assets || [];
  const employeeList = formOptions.employees || [];
  const accounts = formOptions.accounts || [];

  const [form, setForm] = useState(emptyForm);
  const [hydratedId, setHydratedId] = useState(null);

  if (record?._id && hydratedId !== record._id) {
    setHydratedId(record._id);
    setForm(mapRecordToForm(record));
  }

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const selectedAsset = assetList.find((a) => a._id === form.maintenanceAssetId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.maintenanceAssetId) {
      toast.error("Please select an asset");
      return;
    }
    if (!form.maintenanceType) {
      toast.error("Please select maintenance type");
      return;
    }
    if (!form.maintenanceDate) {
      toast.error("Please select maintenance date");
      return;
    }
    if (!form.workPerformed.trim()) {
      toast.error("Please describe work performed");
      return;
    }
    if (!form.maintenanceCostAmount) {
      toast.error("Please enter maintenance cost");
      return;
    }
    if (!form.paymentMethod) {
      toast.error("Please select payment method");
      return;
    }
    if (!form.accountId) {
      toast.error("Please select an account");
      return;
    }
    if (!form.performedByEmployeeId) {
      toast.error("Please select performed by employee");
      return;
    }

    const payload = {
      assetId: form.maintenanceAssetId,
      maintenanceAssetId: form.maintenanceAssetId,
      maintenanceType: form.maintenanceType,
      maintenanceDate: form.maintenanceDate || undefined,
      problemDescription: form.problemDescription.trim() || undefined,
      workPerformed: form.workPerformed.trim(),
      maintenanceCostAmount: Number(form.maintenanceCostAmount) || 0,
      nextMaintenanceDate: form.nextMaintenanceDate || null,
      performedByEmployeeId: form.performedByEmployeeId,
      paymentMethod: form.paymentMethod,
      accountId: form.accountId,
    };

    try {
      await updateMutation.mutateAsync({ id, data: payload });
      toast.success("Maintenance record updated successfully");
      navigate("/assets?tab=maintenance-records");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update maintenance record. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading maintenance record details...</p>
      </main>
    );
  }

  if (error || !record) {
    return (
      <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
        <p className="text-red-500 text-sm">Failed to load maintenance record details.</p>
        <button
          onClick={() => navigate("/assets?tab=maintenance-records")}
          className="mt-4 rounded-lg bg-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-300"
        >
          Back to Maintenance Records
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <section className="max-w-5xl mx-auto">
        <div className="mb-6">
          <p className="text-xs mb-2">
            <span
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
            >
              Dashboard
            </span>{" "}
            <span className="px-1 text-slate-400">/</span>{" "}
            <span
              onClick={() => navigate("/assets?tab=maintenance-records")}
              className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
            >
              Maintenance Records
            </span>{" "}
            <span className="px-1 text-slate-400">/</span>{" "}
            <span className="font-semibold text-slate-700">Edit Record</span>
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
            Edit Maintenance Record ({form.maintenanceNumber})
          </h1>
          <p className="text-sm text-tertiary">
            Update maintenance details, costs, and service logs
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Maintenance Number
                </label>
                <input
                  type="text"
                  disabled
                  value={form.maintenanceNumber || "—"}
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500 outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Maintenance Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.maintenanceDate}
                  onChange={updateField("maintenanceDate")}
                  required
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Select Asset <span className="text-rose-500">*</span>
                </label>
                <select
                  value={form.maintenanceAssetId}
                  onChange={updateField("maintenanceAssetId")}
                  required
                  disabled={isLoadingOptions}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
                >
                  <option value="">
                    {isLoadingOptions ? "Loading assets..." : "Select an asset..."}
                  </option>
                  {assetList.map((asset) => (
                    <option key={asset._id} value={asset._id}>
                      {asset.label || `${asset.assetCode} – ${asset.assetName}`}
                    </option>
                  ))}
                </select>

                {selectedAsset && (
                  <div className="mt-2 rounded-md bg-blue-50 border border-blue-100 p-3 text-xs flex flex-wrap gap-4 text-slate-700">
                    <span>
                      <strong className="font-semibold">Code:</strong> {selectedAsset.assetCode}
                    </span>
                    <span>
                      <strong className="font-semibold">Category:</strong> {selectedAsset.assetCategory}
                    </span>
                    <span>
                      <strong className="font-semibold">Location:</strong> {selectedAsset.locationName || "-"}
                    </span>
                    <span>
                      <strong className="font-semibold">Status:</strong> {selectedAsset.assetStatus || "-"}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Maintenance Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={form.maintenanceType}
                  onChange={updateField("maintenanceType")}
                  required
                  disabled={isLoadingOptions}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
                >
                  <option value="">
                    {isLoadingOptions ? "Loading types..." : "Select maintenance type..."}
                  </option>
                  {maintenanceTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Performed By Employee <span className="text-rose-500">*</span>
                </label>
                <select
                  value={form.performedByEmployeeId}
                  onChange={updateField("performedByEmployeeId")}
                  required
                  disabled={isLoadingOptions}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
                >
                  <option value="">
                    {isLoadingOptions ? "Loading employees..." : "Select employee / technician..."}
                  </option>
                  {employeeList.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.label || `${emp.employeeCode} – ${emp.fullName}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Maintenance Cost (Rs.) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.maintenanceCostAmount}
                  onChange={updateField("maintenanceCostAmount")}
                  placeholder="e.g. 18000"
                  required
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Next Maintenance Date
                </label>
                <input
                  type="date"
                  value={form.nextMaintenanceDate}
                  onChange={updateField("nextMaintenanceDate")}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Payment Method <span className="text-rose-500">*</span>
                </label>
                <select
                  value={form.paymentMethod}
                  onChange={updateField("paymentMethod")}
                  required
                  disabled={isLoadingOptions}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
                >
                  <option value="">
                    {isLoadingOptions ? "Loading..." : "Select payment method"}
                  </option>
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Account <span className="text-rose-500">*</span>
                </label>
                <select
                  value={form.accountId}
                  onChange={updateField("accountId")}
                  required
                  disabled={isLoadingOptions}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
                >
                  <option value="">
                    {isLoadingOptions ? "Loading..." : "Select account"}
                  </option>
                  {accounts.map((acc) => (
                    <option key={acc._id} value={acc._id}>
                      {acc.label || `${acc.accountCode} – ${acc.accountName}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Problem Description
                </label>
                <textarea
                  value={form.problemDescription}
                  onChange={updateField("problemDescription")}
                  rows={3}
                  placeholder="Describe the problem or reason for maintenance..."
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 resize-none"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Work Performed <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={form.workPerformed}
                  onChange={updateField("workPerformed")}
                  rows={3}
                  placeholder="Describe the service or repair work performed..."
                  required
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 resize-none"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/assets?tab=maintenance-records")}
                className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending || isLoadingOptions}
                className="rounded-lg bg-gradient-bg-blue px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f326e] disabled:opacity-50"
              >
                {updateMutation.isPending ? "Updating..." : "Update Record"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default UpdateMaintenanceRecord;
