import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAssets } from "../../queries/assets/assets.queries";
import { useEmployees } from "../../queries/employees/employees.queries";
import {
  useMaintenanceRecordById,
  useUpdateMaintenanceRecord,
} from "../../queries/maintenanceRecords/maintenanceRecords.queries";
import { useToast } from "../../utils/GlobalToast";

function UpdateMaintenanceRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { data: recordResponse, isLoading, error } = useMaintenanceRecordById(id);
  const updateMutation = useUpdateMaintenanceRecord();
  const { data: assetsData, isLoading: isLoadingAssets } = useAssets({ limit: 100 });
  const { data: employeesData, isLoading: isLoadingEmployees } = useEmployees({ limit: 100 });

  const record = recordResponse?.data;
  const assetList = assetsData?.data?.items || [];
  const employeeList = employeesData?.data?.items || [];

  const [maintenanceNumber, setMaintenanceNumber] = useState("");
  const [maintenanceAssetId, setMaintenanceAssetId] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("preventive");
  const [maintenanceDate, setMaintenanceDate] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [workPerformed, setWorkPerformed] = useState("");
  const [maintenanceCostAmount, setMaintenanceCostAmount] = useState("");
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState("");
  const [performedByEmployeeId, setPerformedByEmployeeId] = useState("");

  useEffect(() => {
    if (record) {
      setMaintenanceNumber(record.maintenanceNumber || "");

      const rawAsset = record.assetId || record.maintenanceAssetId;
      const assetIdVal =
        rawAsset && typeof rawAsset === "object"
          ? rawAsset._id
          : rawAsset;
      setMaintenanceAssetId(assetIdVal || "");

      setMaintenanceType(record.maintenanceType || "preventive");

      if (record.maintenanceDate) {
        const d = new Date(record.maintenanceDate);
        if (!isNaN(d.getTime())) {
          setMaintenanceDate(d.toISOString().split("T")[0]);
        }
      }

      setProblemDescription(record.problemDescription || "");
      setWorkPerformed(record.workPerformed || "");
      setMaintenanceCostAmount(
        record.maintenanceCostAmount !== undefined && record.maintenanceCostAmount !== null
          ? String(record.maintenanceCostAmount)
          : ""
      );

      if (record.nextMaintenanceDate) {
        const nd = new Date(record.nextMaintenanceDate);
        if (!isNaN(nd.getTime())) {
          setNextMaintenanceDate(nd.toISOString().split("T")[0]);
        }
      } else {
        setNextMaintenanceDate("");
      }

      const empId =
        record.performedByEmployeeId && typeof record.performedByEmployeeId === "object"
          ? record.performedByEmployeeId._id
          : record.performedByEmployeeId;
      setPerformedByEmployeeId(empId || "");
    }
  }, [record]);

  const selectedAsset = assetList.find((a) => a._id === maintenanceAssetId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!maintenanceAssetId) {
      toast.error("Please select an asset");
      return;
    }
    if (!maintenanceType) {
      toast.error("Please select maintenance type");
      return;
    }
    if (!maintenanceDate) {
      toast.error("Please select maintenance date");
      return;
    }
    if (!workPerformed.trim()) {
      toast.error("Please describe work performed");
      return;
    }
    if (!maintenanceCostAmount) {
      toast.error("Please enter maintenance cost");
      return;
    }
    if (!performedByEmployeeId) {
      toast.error("Please select performed by employee");
      return;
    }

    const payload = {
      assetId: maintenanceAssetId,
      maintenanceAssetId,
      maintenanceType,
      maintenanceDate: maintenanceDate || undefined,
      problemDescription: problemDescription.trim() || undefined,
      workPerformed: workPerformed.trim(),
      maintenanceCostAmount: Number(maintenanceCostAmount) || 0,
      nextMaintenanceDate: nextMaintenanceDate || null,
      performedByEmployeeId,
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
        {/* Header & Breadcrumbs */}
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
            Edit Maintenance Record ({maintenanceNumber})
          </h1>
          <p className="text-sm text-tertiary">
            Update maintenance details, costs, and service logs
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Asset Selection */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Select Asset <span className="text-rose-500">*</span>
                </label>
                <select
                  value={maintenanceAssetId}
                  onChange={(e) => setMaintenanceAssetId(e.target.value)}
                  required
                  disabled={isLoadingAssets}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
                >
                  <option value="">
                    {isLoadingAssets ? "Loading assets..." : "Select an asset..."}
                  </option>
                  {assetList.map((asset) => (
                    <option key={asset._id} value={asset._id}>
                      {asset.assetCode} — {asset.assetName} ({asset.locationName || asset.assetCategory || "Asset"})
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
                  </div>
                )}
              </div>

              {/* Maintenance Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Maintenance Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={maintenanceType}
                  onChange={(e) => setMaintenanceType(e.target.value)}
                  required
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="preventive">Preventive</option>
                  <option value="corrective">Corrective</option>
                  <option value="inspection">Inspection</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              {/* Maintenance Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Maintenance Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={maintenanceDate}
                  onChange={(e) => setMaintenanceDate(e.target.value)}
                  required
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Problem Description */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Problem Description
                </label>
                <textarea
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe the problem or reason for maintenance..."
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 resize-none"
                />
              </div>

              {/* Work Performed */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Work Performed <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={workPerformed}
                  onChange={(e) => setWorkPerformed(e.target.value)}
                  rows={3}
                  placeholder="Describe the service or repair work performed..."
                  required
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 resize-none"
                />
              </div>

              {/* Maintenance Cost Amount */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Maintenance Cost (Rs.) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={maintenanceCostAmount}
                  onChange={(e) => setMaintenanceCostAmount(e.target.value)}
                  placeholder="e.g. 18000"
                  required
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Next Maintenance Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Next Maintenance Date
                </label>
                <input
                  type="date"
                  value={nextMaintenanceDate}
                  onChange={(e) => setNextMaintenanceDate(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Performed By Employee */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Performed By Employee <span className="text-rose-500">*</span>
                </label>
                <select
                  value={performedByEmployeeId}
                  onChange={(e) => setPerformedByEmployeeId(e.target.value)}
                  required
                  disabled={isLoadingEmployees}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
                >
                  <option value="">
                    {isLoadingEmployees ? "Loading employees..." : "Select employee / technician..."}
                  </option>
                  {employeeList.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.employeeCode ? `${emp.employeeCode} — ` : ""}{emp.fullName} ({emp.jobTitle || "Staff"})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
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
                disabled={updateMutation.isPending}
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
