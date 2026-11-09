import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { useToast } from "../../utils/GlobalToast";
import {
  useCreateFillingBatch,
  useFillingBatchFormOptions,
  useFillingBatchById,
  useUpdateFillingBatch,
} from "../../queries/fillingBatches/fillingBatches.queries";

const roundKg = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

const parseKg = (value) => {
  if (value === "" || value == null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const emptyLine = (key) => ({
  key,
  cylinderTypeId: "",
  cylinderCount: "",
  targetFillWeightKg: "",
  residualRecoveredKg: "",
  actualLpgUsedKg: "",
  usageInputMode: "",
});

function CreateBatch({ mode = "create" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isUpdateMode = mode === "update";

  const storageTankIdRef = useRef(null);
  const operatorEmployeeIdRef = useRef(null);
  const lineKeyRef = useRef(1);

  const [storageTankIdError, setStorageTankIdError] = useState("");
  const [operatorEmployeeIdError, setOperatorEmployeeIdError] = useState("");
  const [lineErrors, setLineErrors] = useState({});

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
    lines: [emptyLine("line-1")],
    operatorEmployeeId: "",
    fillingDate: new Date().toISOString().slice(0, 10),
    batchStatus: "completed",
    remarks: "",
  });

  const nextLineKey = () => {
    lineKeyRef.current += 1;
    return `line-${lineKeyRef.current}`;
  };

  useEffect(() => {
    if (isUpdateMode && batchData?.data) {
      const record = batchData.data;
      const sourceLines = Array.isArray(record.lines) && record.lines.length
        ? record.lines
        : [{
            cylinderTypeId: record.cylinderType?._id || record.cylinderTypeId || "",
            cylinderCount: record.cylinderCount,
            targetFillWeightKg: record.targetFillWeightKg,
            residualRecoveredKg: record.residualRecoveredKg,
            actualLpgUsedKg: record.actualLpgUsedKg,
          }];

      setFormData({
        storageTankId: record.tank?._id || record.storageTankId?._id || record.storageTankId || "",
        lines: sourceLines.map((line) => {
          const residualValue = line.residualRecoveredKg;
          const actualValue = line.actualLpgUsedKg;
          const typeId = line.cylinderType?._id || line.cylinderTypeId?._id || line.cylinderTypeId || "";
          return {
            key: nextLineKey(),
            cylinderTypeId: typeId ? String(typeId) : "",
            cylinderCount: line.cylinderCount != null ? String(line.cylinderCount) : "",
            targetFillWeightKg: line.targetFillWeightKg != null ? String(line.targetFillWeightKg) : "",
            residualRecoveredKg: residualValue != null && residualValue !== "" ? String(residualValue) : "",
            actualLpgUsedKg: actualValue != null && actualValue !== "" ? String(actualValue) : "",
            usageInputMode: residualValue != null && Number(residualValue) > 0
              ? "residual"
              : actualValue != null
                ? "actual"
                : "",
          };
        }),
        operatorEmployeeId: record.operator?._id || record.operatorEmployeeId?._id || record.operatorEmployeeId || "",
        fillingDate: record.fillingDate ? new Date(record.fillingDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        batchStatus: record.batchStatus?.toLowerCase() || statuses[0]?.value || "pending",
        remarks: record.remarks || "",
      });
    }
  }, [batchData, isUpdateMode, statuses]);

  const defaultsAppliedRef = useRef(false);

  useEffect(() => {
    if (isUpdateMode || defaultsAppliedRef.current || !tankOption?._id) return;
    const defaultOperator = operatorOptions.find((employee) => {
      const fullName = String(employee.fullName || "").trim().toLowerCase();
      const displayName = String(employee.displayName || "").trim().toLowerCase();
      return fullName === "wahab noor" || displayName.startsWith("wahab noor");
    });
    defaultsAppliedRef.current = true;
    setFormData((prev) => ({
      ...prev,
      storageTankId: prev.storageTankId || tankOption._id,
      batchStatus: "completed",
      operatorEmployeeId: prev.operatorEmployeeId || defaultOperator?._id || "",
    }));
  }, [isUpdateMode, operatorOptions, tankOption]);

  const lineCalcs = useMemo(
    () =>
      formData.lines.map((line) => {
        const count = Number(line.cylinderCount) || 0;
        const weight = Number(line.targetFillWeightKg) || 0;
        const expected = roundKg(count * weight);
        const residual = parseKg(line.residualRecoveredKg);
        const actual = parseKg(line.actualLpgUsedKg);
        const deducted = actual != null
          ? actual
          : residual != null
            ? roundKg(Math.max(0, expected - residual))
            : expected;
        const recovered = residual != null ? residual : roundKg(Math.max(0, expected - deducted));
        const mismatch = residual != null && actual != null && roundKg(residual + actual) !== expected;
        const type = cylinderTypes.find((item) => String(item._id) === String(line.cylinderTypeId));
        return {
          expected,
          deducted,
          recovered,
          mismatch,
          residual,
          actual,
          typeName: type?.typeName || type?.name || "Cylinder",
          count,
          weight,
        };
      }),
    [cylinderTypes, formData.lines]
  );

  const expectedConsumption = roundKg(lineCalcs.reduce((sum, line) => sum + line.expected, 0));
  const deductedFromTank = roundKg(lineCalcs.reduce((sum, line) => sum + line.deducted, 0));
  const recoveredResidual = roundKg(lineCalcs.reduce((sum, line) => sum + line.recovered, 0));
  const currentTankLevel = Number(formOptions.tank?.currentQuantityKg) || 0;
  const tankCapacity = Number(formOptions.tank?.capacityKg) || 0;
  const levelAfterFilling = roundKg(currentTankLevel - deductedFromTank);
  const remainingCapacity = roundKg(tankCapacity - levelAfterFilling);
  const usageMismatch = lineCalcs.some((line) => line.mismatch);
  const canAddLine = cylinderTypes.length === 0 || formData.lines.length < cylinderTypes.length;

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLineChange = (key, field, value) => {
    setFormData((prev) => ({
      ...prev,
      lines: prev.lines.map((line) => {
        if (line.key !== key) return line;
        const next = { ...line, [field]: value };

        if (field === "cylinderTypeId") {
          const type = cylinderTypes.find((item) => String(item._id) === String(value));
          const weight = type?.capacityKg;
          next.targetFillWeightKg = weight != null && weight !== "" ? String(weight) : "";
        }

        const expected = roundKg((Number(next.cylinderCount) || 0) * (Number(next.targetFillWeightKg) || 0));

        if (field === "residualRecoveredKg") {
          next.usageInputMode = value === "" ? "" : "residual";
          if (value === "") next.actualLpgUsedKg = "";
        }
        if (field === "actualLpgUsedKg") {
          next.usageInputMode = value === "" ? "" : "actual";
          if (value === "") next.residualRecoveredKg = "";
        }

        if (next.usageInputMode === "residual" && next.residualRecoveredKg !== "") {
          const residualNum = Number(next.residualRecoveredKg);
          if (Number.isFinite(residualNum)) {
            next.actualLpgUsedKg = String(roundKg(Math.max(0, expected - residualNum)));
          }
        } else if (next.usageInputMode === "actual" && next.actualLpgUsedKg !== "") {
          const actualNum = Number(next.actualLpgUsedKg);
          if (Number.isFinite(actualNum)) {
            next.residualRecoveredKg = String(roundKg(Math.max(0, expected - actualNum)));
          }
        }

        return next;
      }),
    }));
  };

  const addLine = () => {
    if (!canAddLine) {
      toast.error("Every cylinder type is already on this batch.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      lines: [...prev.lines, emptyLine(nextLineKey())],
    }));
  };

  const removeLine = (key) => {
    setFormData((prev) => {
      if (prev.lines.length === 1) return prev;
      return { ...prev, lines: prev.lines.filter((line) => line.key !== key) };
    });
    setLineErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateForm = () => {
    let hasError = false;

    if (!formData.storageTankId) {
      setStorageTankIdError("Storage Tank is required");
      storageTankIdRef.current?.focus();
      hasError = true;
    } else {
      setStorageTankIdError("");
    }

    const nextLineErrors = {};
    const seenTypes = new Set();
    formData.lines.forEach((line) => {
      const errors = {};
      if (!line.cylinderTypeId) {
        errors.cylinderTypeId = "Cylinder type is required";
      } else if (seenTypes.has(String(line.cylinderTypeId))) {
        errors.cylinderTypeId = "This cylinder type is already added";
      } else {
        seenTypes.add(String(line.cylinderTypeId));
      }
      if (!line.cylinderCount || Number(line.cylinderCount) < 1) {
        errors.cylinderCount = "Cylinder count must be at least 1";
      }
      if (!line.targetFillWeightKg || Number(line.targetFillWeightKg) <= 0) {
        errors.targetFillWeightKg = "Target fill weight must be greater than 0";
      }
      if (Object.keys(errors).length) {
        nextLineErrors[line.key] = errors;
        hasError = true;
      }
    });
    setLineErrors(nextLineErrors);

    if (!formData.operatorEmployeeId) {
      setOperatorEmployeeIdError("Operator is required");
      if (!hasError) operatorEmployeeIdRef.current?.focus();
      hasError = true;
    } else {
      setOperatorEmployeeIdError("");
    }

    return !hasError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    for (const calc of lineCalcs) {
      if (calc.residual != null && calc.residual < 0) {
        toast.error(`${calc.typeName}: residual recovered cannot be negative.`);
        return;
      }
      if (calc.actual != null && calc.actual < 0) {
        toast.error(`${calc.typeName}: actual LPG used cannot be negative.`);
        return;
      }
      if (calc.residual != null && calc.residual > calc.expected) {
        toast.error(`${calc.typeName}: residual recovered cannot exceed expected fill.`);
        return;
      }
      if (calc.actual != null && calc.actual > calc.expected) {
        toast.error(`${calc.typeName}: actual LPG used cannot exceed expected fill.`);
        return;
      }
      if (calc.mismatch) {
        toast.error(`${calc.typeName}: residual + tank usage must equal ${calc.expected} KG.`);
        return;
      }
    }

    const payload = {
      fillingDate: formData.fillingDate || new Date().toISOString(),
      storageTankId: formData.storageTankId,
      operatorEmployeeId: formData.operatorEmployeeId,
      batchStatus: formData.batchStatus,
      remarks: formData.remarks,
      lines: formData.lines.map((line) => {
        const residualKg = parseKg(line.residualRecoveredKg);
        const actualLpgUsedKg = parseKg(line.actualLpgUsedKg);
        const item = {
          cylinderTypeId: line.cylinderTypeId,
          cylinderCount: Number(line.cylinderCount) || 0,
          targetFillWeightKg: Number(line.targetFillWeightKg) || 0,
        };

        if (line.usageInputMode === "residual" && residualKg != null && residualKg > 0) {
          item.residualRecoveredKg = residualKg;
        } else if (line.usageInputMode === "actual" && actualLpgUsedKg != null) {
          item.actualLpgUsedKg = actualLpgUsedKg;
        } else if (residualKg != null && residualKg > 0) {
          item.residualRecoveredKg = residualKg;
        }

        return item;
      }),
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
      const firstError = error?.response?.data?.errors?.[0];
      const mainMessage = error?.response?.data?.message;
      const errorMessage = firstError
        ? `${firstError.path}: ${firstError.message}`
        : mainMessage || "Failed to save filling batch. Please try again.";
      toast.error(errorMessage);
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
          {isUpdateMode
            ? "Update the batch. One run can include several cylinder types, such as 11.8 KG and 15 KG."
            : "One filling run can include several cylinder types, such as 11.8 KG and 15 KG."}
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
                    ref={storageTankIdRef}
                    value={formData.storageTankId}
                    onChange={(e) => {
                      handleFieldChange("storageTankId", e.target.value);
                      setStorageTankIdError("");
                    }}
                    className={`w-full appearance-none rounded-md border bg-white pl-3 pr-10 py-2.5 text-sm text-slate-700 outline-none focus:ring-1 ${
                      storageTankIdError
                        ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                        : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    }`}
                  >
                    <option value="">Select Storage Tank</option>
                    {tankOptions.map((tank) => (
                      <option key={tank._id} value={tank._id}>{tank.displayName}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                {storageTankIdError && (
                  <p className="mt-1.5 text-xs text-rose-500">{storageTankIdError}</p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="bg-slate-100 font-bold text-slate-800 text-sm px-3 py-1.5 rounded-md inline-block">
                Cylinder Configuration
              </div>
              <button
                type="button"
                onClick={addLine}
                disabled={!canAddLine}
                className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Add cylinder type
              </button>
            </div>

            <div className="space-y-4">
              {formData.lines.map((line, index) => {
                const errors = lineErrors[line.key] || {};
                const takenIds = new Set(
                  formData.lines
                    .filter((item) => item.key !== line.key && item.cylinderTypeId)
                    .map((item) => String(item.cylinderTypeId))
                );
                const calc = lineCalcs[index];
                return (
                  <div key={line.key} className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-800">
                        Cylinder type {index + 1}
                        {calc?.typeName && calc.typeName !== "Cylinder" ? ` — ${calc.typeName}` : ""}
                      </p>
                      {formData.lines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLine(line.key)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Target Cylinder Type <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={line.cylinderTypeId}
                            onChange={(e) => {
                              handleLineChange(line.key, "cylinderTypeId", e.target.value);
                              setLineErrors((prev) => ({
                                ...prev,
                                [line.key]: { ...prev[line.key], cylinderTypeId: "", targetFillWeightKg: "" },
                              }));
                            }}
                            className={`w-full appearance-none rounded-md border bg-white pl-3 pr-10 py-2.5 text-sm text-slate-700 outline-none focus:ring-1 ${
                              errors.cylinderTypeId
                                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                                : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                            }`}
                          >
                            <option value="">Select Cylinder Type</option>
                            {cylinderTypes.map((type) => (
                              <option
                                key={type._id}
                                value={type._id}
                                disabled={takenIds.has(String(type._id))}
                              >
                                {type.typeName || type.name}
                                {type.capacityKg != null ? ` (${type.capacityKg} KG)` : ""}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        {errors.cylinderTypeId && (
                          <p className="mt-1.5 text-xs text-rose-500">{errors.cylinderTypeId}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Cylinder Target Run Count <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={line.cylinderCount}
                          onChange={(e) => {
                            handleLineChange(line.key, "cylinderCount", e.target.value);
                            setLineErrors((prev) => ({
                              ...prev,
                              [line.key]: { ...prev[line.key], cylinderCount: "" },
                            }));
                          }}
                          className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:ring-1 ${
                            errors.cylinderCount
                              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                              : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                          }`}
                        />
                        {errors.cylinderCount && (
                          <p className="mt-1.5 text-xs text-rose-500">{errors.cylinderCount}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Target Fill Weight per Cylinder <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={line.targetFillWeightKg}
                          onChange={(e) => {
                            handleLineChange(line.key, "targetFillWeightKg", e.target.value);
                            setLineErrors((prev) => ({
                              ...prev,
                              [line.key]: { ...prev[line.key], targetFillWeightKg: "" },
                            }));
                          }}
                          className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:ring-1 ${
                            errors.targetFillWeightKg
                              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                              : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                          }`}
                        />
                        {errors.targetFillWeightKg && (
                          <p className="mt-1.5 text-xs text-rose-500">{errors.targetFillWeightKg}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Residual Recovered (leftover)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={line.residualRecoveredKg}
                          onChange={(e) => handleLineChange(line.key, "residualRecoveredKg", e.target.value)}
                          placeholder="Leave empty for first fill"
                          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Actual LPG Used from Tank
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={line.actualLpgUsedKg}
                          onChange={(e) => handleLineChange(line.key, "actualLpgUsedKg", e.target.value)}
                          placeholder="Auto from residual, or enter tank usage"
                          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-500">
                      Expected for this type: {calc?.count?.toLocaleString() || 0} × {calc?.weight?.toLocaleString() || 0} KG = {calc?.expected?.toLocaleString() || 0} KG.
                      Tank usage for this type: {calc?.deducted?.toLocaleString() || 0} KG.
                    </p>
                  </div>
                );
              })}
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Add another row for a different size, for example 11.8 KG and 15 KG in the same batch. Each type is filled and stocked separately. The tank is reduced by the total LPG used.
            </p>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Assigned Batch Operator (Employee) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    ref={operatorEmployeeIdRef}
                    value={formData.operatorEmployeeId}
                    onChange={(e) => {
                      handleFieldChange("operatorEmployeeId", e.target.value);
                      setOperatorEmployeeIdError("");
                    }}
                    className={`w-full appearance-none rounded-md border bg-white pl-3 pr-10 py-2.5 text-sm text-slate-700 outline-none focus:ring-1 ${
                      operatorEmployeeIdError
                        ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                        : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                    }`}
                  >
                    <option value="">Select Employee</option>
                    {operatorOptions.map((operator) => (
                      <option key={operator._id} value={operator._id}>{operator.displayName}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                {operatorEmployeeIdError && (
                  <p className="mt-1.5 text-xs text-rose-500">{operatorEmployeeIdError}</p>
                )}
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
                <span className="text-slate-500 font-medium">Expected Fill</span>
                <span className="font-bold text-slate-900">{expectedConsumption.toLocaleString()} KG</span>
              </div>
              <div className="-mt-1 space-y-1">
                {lineCalcs.map((calc, index) => (
                  <p key={formData.lines[index].key} className="text-[11px] text-slate-400">
                    {calc.typeName}: {calc.count.toLocaleString()} × {calc.weight.toLocaleString()} KG
                  </p>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Residual Recovered</span>
                <span className="font-bold text-slate-900">{recoveredResidual.toLocaleString()} KG</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Deducted from Tank</span>
                <span className="font-bold text-slate-900">{deductedFromTank.toLocaleString()} KG</span>
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

            {usageMismatch ? (
              <div className="mt-5 rounded-lg border border-rose-100 bg-rose-50 p-3">
                <p className="text-xs leading-relaxed text-rose-700">
                  For each cylinder type, residual + tank usage must equal that type&apos;s expected fill.
                </p>
              </div>
            ) : (
              <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-emerald-100 bg-emerald-50/60 p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <p className="text-xs leading-relaxed text-slate-700">
                  {recoveredResidual > 0
                    ? `Tank will be deducted ${deductedFromTank.toLocaleString()} KG across ${formData.lines.length} cylinder type${formData.lines.length > 1 ? "s" : ""}.`
                    : "First fill: no leftover. Tank decreases by the full expected fill of every cylinder type."}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <button
              type="submit"
              className="w-full rounded-lg bg-[#059669] py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
              disabled={createMutation.isPending || updateMutation.isPending || usageMismatch}
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
