import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateMaintenanceRecord,
  useMaintenanceRecordFormOptions,
} from "../../queries/maintenanceRecords/maintenanceRecords.queries";
import { useToast } from "../../utils/GlobalToast";

function AddMaintenanceRecord() {
  const navigate = useNavigate();
  const toast = useToast();

  const { data: formOptionsResponse, isLoading: isLoadingOptions } =
    useMaintenanceRecordFormOptions();
  const createMutation = useCreateMaintenanceRecord();

  const formOptions = formOptionsResponse?.data || {};
  const nextMaintenanceNumber = formOptions.nextMaintenanceNumber || "";
  const maintenanceTypes = formOptions.maintenanceTypes || [];
  const paymentMethods = formOptions.paymentMethods || [];
  const assetList = formOptions.assets || [];
  const employeeList = formOptions.employees || [];
  const accounts = formOptions.accounts || [];

  const [assetId, setassetId] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("");
  const [maintenanceDate, setMaintenanceDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [problemDescription, setProblemDescription] = useState("");
  const [workPerformed, setWorkPerformed] = useState("");
  const [maintenanceCostAmount, setMaintenanceCostAmount] = useState("");
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState("");
  const [performedByEmployeeId, setPerformedByEmployeeId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [accountId, setAccountId] = useState("");

  const selectedAsset = assetList.find((a) => a._id === assetId);

  const resetForm = () => {
    setassetId("");
    setMaintenanceType("");
    setMaintenanceDate(new Date().toISOString().split("T")[0]);
    setProblemDescription("");
    setWorkPerformed("");
    setMaintenanceCostAmount("");
    setNextMaintenanceDate("");
    setPerformedByEmployeeId("");
    setPaymentMethod("");
    setAccountId("");
  };

  const buildPayload = () => {
    return {
      assetId,
      maintenanceAssetId: assetId,
      maintenanceType,
      maintenanceDate: maintenanceDate || undefined,
      problemDescription: problemDescription.trim() || undefined,
      workPerformed: workPerformed.trim(),
      maintenanceCostAmount: Number(maintenanceCostAmount) || 0,
      nextMaintenanceDate: nextMaintenanceDate || null,
      performedByEmployeeId,
      paymentMethod,
      accountId,
    };
  };

  const validate = () => {
    if (!assetId) {
      toast.error("Please select an asset");
      return false;
    }
    if (!maintenanceType) {
      toast.error("Please select maintenance type");
      return false;
    }
    if (!maintenanceDate) {
      toast.error("Please select maintenance date");
      return false;
    }
    if (!workPerformed.trim()) {
      toast.error("Please describe work performed");
      return false;
    }
    if (!maintenanceCostAmount) {
      toast.error("Please enter maintenance cost");
      return false;
    }
    if (!paymentMethod) {
      toast.error("Please select payment method");
      return false;
    }
    if (!accountId) {
      toast.error("Please select an account");
      return false;
    }
    if (!performedByEmployeeId) {
      toast.error("Please select performed by employee");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createMutation.mutateAsync(buildPayload());
      toast.success("Maintenance record logged successfully");
      navigate("/assets?tab=maintenance-records");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to log maintenance record. Please try again.");
    }
  };

  const handleSaveAndAddAnother = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createMutation.mutateAsync(buildPayload());
      toast.success("Maintenance record logged successfully");
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to log maintenance record. Please try again.");
    }
  };

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
            <span className="font-semibold text-slate-700">Add Record</span>
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
            Log Maintenance Record
          </h1>
          <p className="text-sm text-tertiary">
            Create a new entry for service or repair work on plant machinery
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Maintenance Number */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Maintenance Number
                </label>
                <input
                  type="text"
                  disabled
                  value={
                    isLoadingOptions
                      ? "Loading..."
                      : nextMaintenanceNumber
                        ? `${nextMaintenanceNumber} (Auto-generated)`
                        : "Auto-generated on save"
                  }
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500 outline-none cursor-not-allowed"
                />
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

              {
                /* Next Maintenance Date */
              }
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-1.5'>
                  Next Maintenance Date
                </label>
                <input
                  type='date'
                  value={nextMaintenanceDate}
                  onChange={e => setNextMaintenanceDate(e.target.value)}
                  className='w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100'
                />
              </div>


              {/* Asset Selection */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Select Asset <span className="text-rose-500">*</span>
                </label>
                <select
                  value={assetId}
                  onChange={(e) => setassetId(e.target.value)}
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

              {/* Maintenance Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Maintenance Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={maintenanceType}
                  onChange={(e) => setMaintenanceType(e.target.value)}
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

              {/* Performed By Employee */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Performed By Employee <span className="text-rose-500">*</span>
                </label>
                <select
                  value={performedByEmployeeId}
                  onChange={(e) => setPerformedByEmployeeId(e.target.value)}
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

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Payment Method <span className="text-rose-500">*</span>
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
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

              {/* Account */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Account <span className="text-rose-500">*</span>
                </label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
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

              {
                /* Problem Description */
              }
              <div className='lg:col-span-3'>
                <label className='block text-sm font-medium text-slate-700 mb-1.5'>
                  Problem Description
                </label>
                <textarea
                  value={problemDescription}
                  onChange={e => setProblemDescription(e.target.value)}
                  rows={3}
                  placeholder='Describe the problem or reason for maintenance...'
                  className='w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 resize-none'
                />
              </div>

              {
                /* Work Performed */
              }
              <div className='lg:col-span-3'>
                <label className='block text-sm font-medium text-slate-700 mb-1.5'>
                  Work Performed <span className='text-rose-500'>*</span>
                </label>
                <textarea
                  value={workPerformed}
                  onChange={e => setWorkPerformed(e.target.value)}
                  rows={3}
                  placeholder='Describe the service or repair work performed...'
                  required
                  className='w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 resize-none'
                />
              </div>


            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={() => navigate("/assets?tab=maintenance-records")}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={createMutation.isPending || isLoadingOptions}
                onClick={handleSaveAndAddAnother}
                className="rounded-lg border border-[#1a56db] bg-white px-4 py-2.5 text-sm font-medium text-[#1a56db] shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
              >
                Save & Add Another
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || isLoadingOptions}
                className="rounded-lg bg-gradient-bg-blue px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f326e] disabled:opacity-50"
              >
                {createMutation.isPending ? "Saving..." : "Save Record"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default AddMaintenanceRecord;
