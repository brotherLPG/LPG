import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAssetById, useUpdateAsset } from "../../queries/assets/assets.queries";
import { useToast } from "../../utils/GlobalToast";

const getId = (value) => {
  if (!value) return "";
  return typeof value === "object" ? value._id || "" : value;
};

const toOptionList = (items = []) =>
  items.map((item) => {
    if (typeof item === "string") return { label: item, value: item };
    const value = item.value || item.locationName || item.location || item.name || item.label || item._id || "";
    const label = item.label || item.locationName || item.location || item.name || item.accountName || item.fullName || value;
    return { label, value };
  }).filter((item) => item.value);

function UpdateAsset() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { data: assetResponse, isLoading, error } = useAssetById(id);
  const updateAssetMutation = useUpdateAsset();

  const asset = assetResponse?.data;
  const formOptions = asset?.form || {};
  const categoryOptions = formOptions.assetCategories || [];
  const statusOptions = formOptions.assetStatuses || [];
  const depreciationOptions = formOptions.depreciationMethods || [];
  const paymentMethods = formOptions.paymentMethods || [];
  const accounts = formOptions.accounts || [];
  const employeeList = formOptions.employees || [];
  const locationOptions = toOptionList(
    formOptions.locations || formOptions.locationNames || formOptions.assetLocations || []
  );
  const optionsLoading = isLoading;

  const [assetCode, setAssetCode] = useState("");
  const [assetName, setAssetName] = useState("");
  const [assetCategory, setAssetCategory] = useState("");
  const [manufacturerName, setManufacturerName] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [locationName, setLocationName] = useState("");
  const [assetStatus, setAssetStatus] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [purchaseCostAmount, setPurchaseCostAmount] = useState("");
  const [depreciationMethod, setDepreciationMethod] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [accountId, setAccountId] = useState("");
  const [assignedEmployeeId, setAssignedEmployeeId] = useState("");
  const [currentBookValueAmount, setCurrentBookValueAmount] = useState("");

  useEffect(() => {
    if (asset) {
      setAssetCode(asset.assetCode || "");
      setAssetName(asset.assetName || "");
      setAssetCategory(asset.assetCategory || "");
      setManufacturerName(asset.manufacturerName || "");
      setModelNumber(asset.modelNumber || "");
      setSerialNumber(asset.serialNumber || "");
      setLocationName(asset.locationName || "");
      setAssetStatus(asset.assetStatus || "");

      if (asset.purchaseDate) {
        const d = new Date(asset.purchaseDate);
        if (!isNaN(d.getTime())) {
          setPurchaseDate(d.toISOString().split("T")[0]);
        }
      }

      setPurchaseCostAmount(asset.purchaseCostAmount !== undefined && asset.purchaseCostAmount !== null ? String(asset.purchaseCostAmount) : "");
      setCurrentBookValueAmount(asset.currentBookValueAmount !== undefined && asset.currentBookValueAmount !== null ? String(asset.currentBookValueAmount) : "");
      setDepreciationMethod(asset.depreciationMethod || "");
      setPaymentMethod(asset.paymentMethod || "");
      setAccountId(getId(asset.accountId || asset.paidFromAccountId));
      setAssignedEmployeeId(getId(asset.assignedEmployeeId));
    }
  }, [asset]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!assetName.trim()) {
      toast.error("Please enter asset name");
      return;
    }

    if (!purchaseCostAmount) {
      toast.error("Please enter purchase cost");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select payment method");
      return;
    }

    if (!accountId) {
      toast.error("Please select an account");
      return;
    }

    const numericCost = Number(purchaseCostAmount) || 0;
    const numericBookValue = currentBookValueAmount !== "" ? Number(currentBookValueAmount) : numericCost;

    const payload = {
      assetName: assetName.trim(),
      assetCategory,
      purchaseDate: purchaseDate || null,
      purchaseCostAmount: numericCost,
      locationName: locationName.trim(),
      assignedEmployeeId: assignedEmployeeId || null,
      depreciationMethod,
      paymentMethod,
      accountId,
      currentBookValueAmount: numericBookValue,
      assetStatus,
      manufacturerName: manufacturerName.trim() || undefined,
      modelNumber: modelNumber.trim() || undefined,
      serialNumber: serialNumber.trim() || undefined,
    };

    try {
      await updateAssetMutation.mutateAsync({ id, data: payload });
      toast.success("Asset updated successfully");
      navigate("/assets");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update asset. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading asset details...</p>
      </main>
    );
  }

  if (error || !asset) {
    return (
      <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
        <p className="text-red-500 text-sm">Failed to load asset details.</p>
        <button
          onClick={() => navigate("/assets")}
          className="mt-4 rounded-lg bg-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-300"
        >
          Back to Assets
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
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
            onClick={() => navigate("/assets")}
            className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
          >
            Fixed Assets
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span className="font-semibold">Edit Asset</span>
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
          Edit Asset ({assetCode})
        </h1>
        <p className="text-sm text-tertiary">
          Update fixed asset information and assignment
        </p>
      </div>

      <form onSubmit={handleUpdate}>
        <div className="space-y-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Asset Information */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden col-span-2">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-[16px] font-bold text-BLUE-dark">
                Asset Information
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Asset Code
                  </label>
                  <input
                    type="text"
                    disabled
                    value={assetCode}
                    className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Asset Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    placeholder="e.g. Delivery truck"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Asset Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={assetCategory}
                    onChange={(e) => setAssetCategory(e.target.value)}
                    disabled={optionsLoading}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
                  >
                    <option value="">
                      {optionsLoading ? "Loading..." : "Select category"}
                    </option>
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Manufacturer Name
                  </label>
                  <input
                    type="text"
                    value={manufacturerName}
                    onChange={(e) => setManufacturerName(e.target.value)}
                    placeholder="e.g. Toyota"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Model Number
                  </label>
                  <input
                    type="text"
                    value={modelNumber}
                    onChange={(e) => setModelNumber(e.target.value)}
                    placeholder="e.g. TRK-2025"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="e.g. SN-99120"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Location Name <span className="text-rose-500">*</span>
                  </label>
                  {locationOptions.length ? (
                    <select
                      required
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      disabled={optionsLoading}
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
                    >
                      <option value="">
                        {optionsLoading ? "Loading..." : "Select location"}
                      </option>
                      {locationOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      placeholder="e.g. Yard"
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Asset Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={assetStatus}
                    onChange={(e) => setAssetStatus(e.target.value)}
                    disabled={optionsLoading}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
                  >
                    <option value="">
                      {optionsLoading ? "Loading..." : "Select status"}
                    </option>
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Financial & Assignment Details */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden col-span-1">
            <div className="border-b border-slate-200 p-4 bg-white">
              <h2 className="text-[16px] font-bold text-BLUE-dark">
                Financial & Assignment
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Purchase Cost (Rs.) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={purchaseCostAmount}
                  onChange={(e) => setPurchaseCostAmount(e.target.value)}
                  placeholder="e.g. 2500000"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Payment Method <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={optionsLoading}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
                >
                  <option value="">
                    {optionsLoading ? "Loading..." : "Select payment method"}
                  </option>
                  {paymentMethods.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Account <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  disabled={optionsLoading}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
                >
                  <option value="">
                    {optionsLoading ? "Loading..." : "Select account"}
                  </option>
                  {accounts.map((acc) => (
                    <option key={acc._id} value={acc._id}>
                      {acc.label || `${acc.accountCode} – ${acc.accountName}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Current Book Value (Rs.)
                </label>
                <input
                  type="number"
                  min="0"
                  value={currentBookValueAmount}
                  onChange={(e) => setCurrentBookValueAmount(e.target.value)}
                  placeholder="e.g. 2100000"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Depreciation Method <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={depreciationMethod}
                  onChange={(e) => setDepreciationMethod(e.target.value)}
                  disabled={optionsLoading}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
                >
                  <option value="">
                    {optionsLoading ? "Loading..." : "Select method"}
                  </option>
                  {depreciationOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Assigned Employee
                </label>
                <select
                  value={assignedEmployeeId}
                  onChange={(e) => setAssignedEmployeeId(e.target.value)}
                  disabled={optionsLoading}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
                >
                  <option value="">
                    {optionsLoading ? "Loading..." : "None / Unassigned"}
                  </option>
                  {employeeList.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.label || `${emp.employeeCode} – ${emp.fullName}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="mt-6 flex justify-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <button
            type="button"
            onClick={() => navigate("/assets")}
            className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateAssetMutation.isPending || optionsLoading}
            className="rounded-lg bg-gradient-bg-blue px-6 py-2 text-sm font-medium text-white transition hover:bg-[#007545] disabled:opacity-50"
          >
            {updateAssetMutation.isPending ? "Updating..." : "Update Asset"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default UpdateAsset;
