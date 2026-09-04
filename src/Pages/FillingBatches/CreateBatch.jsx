import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import { useToast } from "../../utils/GlobalToast";
import {
  useCreateFillingBatch,
  useFillingBatchFormOptions,
  useFillingBatchById,
  useUpdateFillingBatch,
} from "../../queries/fillingBatches/fillingBatches.queries";

function CreateBatch({ mode = "create" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isUpdateMode = mode === "update";

  const createMutation = useCreateFillingBatch();
  const updateMutation = useUpdateFillingBatch();
  const { data: formOptionsData, isLoading: isLoadingOptions } = useFillingBatchFormOptions();
  const formOptions = formOptionsData?.data || {};
  const tankOption = formOptions.tank;
  const tankOptions = tankOption ? [tankOption] : [];
  const cylinderTypes = formOptions.cylinderTypes || [];
  const operatorOptions = formOptions.employees || [];
  const statuses = formOptions.statuses || [];
  const { data: batchData, isLoading: isFetching } = useFillingBatchById(id);

  const [formData, setFormData] = useState({
    storageTankId: "",
    cylinderTypeId: "",
    cylinderCount: "250",
    targetFillWeightKg: "11.0",
    operatorEmployeeId: "",
    fillingDate: new Date().toISOString().slice(0, 10),
    batchStatus: "pending",
    remarks: "Ensure manifold pressure does not exceed 15 bar. Recalibrate digital filling scales before initiation.",
  });

  useEffect(() => {
    if (isUpdateMode && batchData?.data) {
      const record = batchData.data;
      setFormData({
        storageTankId: record.storageTankId?._id || record.storageTankId || tankOption?._id || "",
        cylinderTypeId: record.cylinderType?._id || record.cylinderTypeId || cylinderTypes[0]?._id || "",
        cylinderCount: String(record.cylinderCount || record.targetCylinderCount || "0"),
        targetFillWeightKg: String(record.targetFillWeightKg || "0"),
        operatorEmployeeId: record.operatorEmployeeId?._id || record.operatorEmployeeId || operatorOptions[0]?._id || "",
        fillingDate: record.fillingDate ? new Date(record.fillingDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        batchStatus: record.batchStatus?.toLowerCase() || statuses[0]?.value || "pending",
        remarks: record.remarks || "",
      });
    }
  }, [batchData, cylinderTypes, isUpdateMode, operatorOptions, statuses, tankOption]);

  useEffect(() => {
       if (!formData.cylinderTypeId && cylinderTypes[0]?._id) {
         setFormData((prev) => ({
           ...prev,
           cylinderTypeId: cylinderTypes[0]._id,
           storageTankId: prev.storageTankId || tankOption?._id || "",
           operatorEmployeeId:
             prev.operatorEmployeeId || operatorOptions[0]?._id || "",
           batchStatus: prev.batchStatus || statuses[0]?.value || "pending",
           targetFillWeightKg:
             prev.targetFillWeightKg ||
             String(cylinderTypes[0].capacityKg || ""),
         }));
       }
  }, [cylinderTypes, formData.cylinderTypeId, operatorOptions, statuses, tankOption]);

  const currentTankLevel = Number(formOptions.tank?.currentQuantityKg) || 0;
  const tankCapacity = Number(formOptions.tank?.capacityKg) || 0;
  const parsedRunCount = Number(formData.cylinderCount) || 0;
  const parsedFillWeight = Number(formData.targetFillWeightKg) || 0;
  const expectedConsumption = parsedRunCount * parsedFillWeight;
  const levelAfterFilling = currentTankLevel - expectedConsumption;
  const remainingCapacity = tankCapacity - levelAfterFilling;

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      fillingDate: formData.fillingDate || new Date().toISOString(),
      storageTankId: formData.storageTankId,
      cylinderTypeId: formData.cylinderTypeId,
      cylinderCount: Number(formData.cylinderCount) || 0,
      targetFillWeightKg: Number(formData.targetFillWeightKg) || 0,
      operatorEmployeeId: formData.operatorEmployeeId,
      // storageTankId: formData.storageTankId,
      batchStatus: formData.batchStatus,
      // actualLpgUsedKg: expectedConsumption,
      remarks: formData.remarks,
    };

    try {
      if (isUpdateMode) {
        await updateMutation.mutateAsync({ id, data: payload });
        toast.success("Filling batch updated successfully.");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Filling batch created successfully.");
      }
      navigate("/filling-batches");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save filling batch. Please try again.");
    }
  };

  if ((isUpdateMode && isFetching) || isLoadingOptions) {
    return (
      <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center py-12 text-slate-500">Loading filling batch data...</div>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <p className="text-xs mb-2">
          <span
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            Dashboard
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span
            onClick={() => navigate("/filling-batches")}
            className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            Filling Batches
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span className="font-semibold text-slate-600">{isUpdateMode ? "Edit Batch" : "Create Batch"}</span>
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {isUpdateMode ? "Edit Filling Batch" : "Create Filling Batch"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {isUpdateMode ? "Update the batch details for this filling run." : "Initialize a new automated LPG gas cylinder refilling process batch run"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
            <div className="bg-slate-100 font-bold text-slate-800 text-sm px-3 py-1.5 rounded-md inline-block mb-4">
              Batch Identification & Tank Sourcing
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Batch Number (Auto)
                </label>
                <input
                  type="text"
                  disabled
                  value={isUpdateMode ? batchData?.data?.batchNumber || "-" : "Auto generated on save"}
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500 outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Filling Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.fillingDate}
                  onChange={(e) => handleFieldChange("fillingDate", e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Source Storage Tank <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.storageTankId}
                    onChange={(e) => handleFieldChange("storageTankId", e.target.value)}
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="">Select Storage Tank</option>
                    {tankOptions.map((tank) => (
                      <option key={tank._id} value={tank._id}>{tank.displayName}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
            <div className="bg-slate-100 font-bold text-slate-800 text-sm px-3 py-1.5 rounded-md inline-block mb-4">
              Cylinder Configuration
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Target Cylinder Type <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.cylinderTypeId}
                    onChange={(e) => handleFieldChange("cylinderTypeId", e.target.value)}
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="">Select Cylinder Type</option>
                    {cylinderTypes.map((type) => (
                      <option key={type._id} value={type._id}>{type.typeName || type.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Cylinder Target Run Count <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.cylinderCount}
                  onChange={(e) => handleFieldChange("cylinderCount", e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Target Fill Weight per Cylinder <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.targetFillWeightKg}
                  onChange={(e) => handleFieldChange("targetFillWeightKg", e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Assigned Batch Operator (Employee) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.operatorEmployeeId}
                    onChange={(e) => handleFieldChange("operatorEmployeeId", e.target.value)}
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="">Select Employee</option>
                    {operatorOptions.map((operator) => (
                      <option key={operator._id} value={operator._id}>{operator.displayName}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Batch Status
                </label>
                <div className="relative">
                  <select
                    value={formData.batchStatus}
                    onChange={(e) => handleFieldChange("batchStatus", e.target.value)}
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  >
                    {statuses.map((status) => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Batch Execution Notes / Safety Checks
                </label>
                <textarea
                  rows="2"
                  value={formData.remarks}
                  onChange={(e) => handleFieldChange("remarks", e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-emerald-400 bg-white shadow-sm p-6">
            <h2 className="text-base font-bold text-emerald-600 mb-5">
              Filling Batch Calculations
            </h2>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Expected LPG Consumption</span>
                <span className="font-bold text-slate-900">{expectedConsumption.toLocaleString()} KG</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Current Sourced Tank Level</span>
                <span className="font-bold text-slate-900">{currentTankLevel.toLocaleString()} KG</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Tank Level After Filling</span>
                <span className="font-bold text-slate-900">{levelAfterFilling.toLocaleString()} KG</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Remaining Tank Capacity</span>
                <span className="font-bold text-slate-900">{remainingCapacity.toLocaleString()} KG</span>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-emerald-100 bg-emerald-50/60 p-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <p className="text-xs leading-relaxed text-slate-700">
                Calculations validated. Tank level is well above the safety minimum threshold limits.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <button
              type="submit"
              className="w-full rounded-lg bg-[#059669] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {isUpdateMode ? (updateMutation.isPending ? "Updating..." : "Update Filling Batch") : (createMutation.isPending ? "Creating..." : "Create Filling Batch")}
            </button>
            <button
              type="button"
              onClick={() => navigate("/filling-batches")}
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

export default CreateBatch;
