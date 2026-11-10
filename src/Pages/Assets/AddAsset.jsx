import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateAsset, useAssetFormOptions } from "../../queries/assets/assets.queries";
import { useToast } from "../../utils/GlobalToast";
import SearchableCustomerSelect from "../../components/SearchableCustomerSelect";

function AddAsset() {
  const navigate = useNavigate();
  const toast = useToast();

  const createAssetMutation = useCreateAsset();
  const { data: formOptionsResponse, isLoading: optionsLoading } = useAssetFormOptions();
  const formOptions = formOptionsResponse?.data || {};

  const nextAssetCode = formOptions.nextAssetCode || "";
  const categoryOptions = formOptions.assetCategories || [];
  const statusOptions = formOptions.assetStatuses || [];
  const depreciationOptions = formOptions.depreciationMethods || [];
  const paymentMethods = formOptions.paymentMethods || [];
  const accounts = formOptions.accounts || [];
  const employeeList = formOptions.employees || [];

  const toValueOptions = (items) =>
    (items || []).map((item) => ({ _id: item.value, label: item.label }));
  const assetCategoryOptions = toValueOptions(categoryOptions);
  const assetStatusOptions = toValueOptions(statusOptions);
  const depreciationMethodOptions = toValueOptions(depreciationOptions);
  const paymentMethodOptions = toValueOptions(paymentMethods);
  const accountSelectOptions = (accounts || []).map((acc) => ({
    _id: acc._id,
    label: `${acc.label || `${acc.accountCode} – ${acc.accountName}`} (Rs. ${Number(acc.currentBalanceAmount || 0).toLocaleString()})`,
    searchText: `${acc.label || ""} ${acc.accountCode || ""} ${acc.accountName || ""}`.toLowerCase(),
  }));
  const employeeSelectOptions = (employeeList || []).map((emp) => ({
    _id: emp._id,
    label: emp.label || `${emp.employeeCode} – ${emp.fullName}`,
    searchText: `${emp.label || ""} ${emp.employeeCode || ""} ${emp.fullName || ""}`.toLowerCase(),
  }));

  const [assetName, setAssetName] = useState("");
  const [assetCategory, setAssetCategory] = useState("");
  const [manufacturerName, setManufacturerName] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [locationName, setLocationName] = useState("");
  const [assetStatus, setAssetStatus] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [purchaseCostAmount, setPurchaseCostAmount] = useState("");
  const [depreciationMethod, setDepreciationMethod] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [accountId, setAccountId] = useState("");
  const [assignedEmployeeId, setAssignedEmployeeId] = useState("");
  const [currentBookValueAmount, setCurrentBookValueAmount] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();

    if (!assetName.trim()) {
      toast.error("Please enter asset name");
      return;
    }

    if (!assetCategory) {
      toast.error("Please select asset category");
      return;
    }

    if (!assetStatus) {
      toast.error("Please select asset status");
      return;
    }

    if (!depreciationMethod) {
      toast.error("Please select depreciation method");
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
      await createAssetMutation.mutateAsync(payload);
      toast.success("Asset created successfully");
      navigate("/assets");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create asset. Please try again.");
    }
  };

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
          <span className="font-semibold">Add Asset</span>
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
          Add Asset
        </h1>
        <p className="text-sm text-tertiary">
          Register a new fixed asset to the company inventory
        </p>
      </div>

      <form onSubmit={handleSave}>
        <div className="space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Asset Information */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden col-span-1">
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
                    value={
                      optionsLoading
                        ? "Loading..."
                        : nextAssetCode
                          ? `${nextAssetCode} (Auto-generated)`
                          : "Auto-generated on save"
                    }
                    className="w-full rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
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

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Asset Category <span className="text-rose-500">*</span>
                  </label>
                  <SearchableCustomerSelect
                    customers={assetCategoryOptions}
                    value={assetCategory}
                    onChange={(option) => setAssetCategory(option?._id || "")}
                    disabled={optionsLoading}
                    placeholder={optionsLoading ? "Loading..." : "Select category"}
                    getLabel={(option) => option.label}
                    getSearchText={(option) => option.label.toLowerCase()}
                    emptyText="No category found"
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-1.5'>
                    Asset Status <span className='text-rose-500'>*</span>
                  </label>
                  <SearchableCustomerSelect
                    customers={assetStatusOptions}
                    value={assetStatus}
                    onChange={(option) => setAssetStatus(option?._id || "")}
                    disabled={optionsLoading}
                    placeholder={optionsLoading ? "Loading..." : "Select status"}
                    getLabel={(option) => option.label}
                    getSearchText={(option) => option.label.toLowerCase()}
                    emptyText="No status found"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-1.5'>
                    Location Name <span className='text-rose-500'>*</span>
                  </label>
                  <input
                    type='text'
                    required
                    value={locationName}
                    onChange={e => setLocationName(e.target.value)}
                    placeholder='e.g. Yard'
                    className='w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100'
                  />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

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
                  <SearchableCustomerSelect
                    customers={paymentMethodOptions}
                    value={paymentMethod}
                    onChange={(option) => setPaymentMethod(option?._id || "")}
                    disabled={optionsLoading}
                    placeholder={optionsLoading ? "Loading..." : "Select payment method"}
                    getLabel={(option) => option.label}
                    getSearchText={(option) => option.label.toLowerCase()}
                    emptyText="No payment method found"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Account <span className="text-rose-500">*</span>
                  </label>
                  <SearchableCustomerSelect
                    customers={accountSelectOptions}
                    value={accountId}
                    onChange={(option) => setAccountId(option?._id || "")}
                    disabled={optionsLoading}
                    placeholder={optionsLoading ? "Loading..." : "Select account"}
                    getLabel={(option) => option.label}
                    getSearchText={(option) => option.searchText || option.label.toLowerCase()}
                    emptyText="No account found"
                  />
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
                    placeholder={purchaseCostAmount ? `Default: ${purchaseCostAmount}` : "e.g. 2100000"}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Depreciation Method <span className="text-rose-500">*</span>
                  </label>
                  <SearchableCustomerSelect
                    customers={depreciationMethodOptions}
                    value={depreciationMethod}
                    onChange={(option) => setDepreciationMethod(option?._id || "")}
                    disabled={optionsLoading}
                    placeholder={optionsLoading ? "Loading..." : "Select method"}
                    getLabel={(option) => option.label}
                    getSearchText={(option) => option.label.toLowerCase()}
                    emptyText="No method found"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Assigned Employee
                  </label>
                  <SearchableCustomerSelect
                    customers={employeeSelectOptions}
                    value={assignedEmployeeId}
                    onChange={(option) => setAssignedEmployeeId(option?._id || "")}
                    disabled={optionsLoading}
                    placeholder={optionsLoading ? "Loading..." : "None / Unassigned"}
                    getLabel={(option) => option.label}
                    getSearchText={(option) => option.searchText || option.label.toLowerCase()}
                    emptyText="No employee found"
                  />
                </div>
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
            disabled={createAssetMutation.isPending || optionsLoading}
            className="rounded-lg bg-gradient-bg-blue px-6 py-2 text-sm font-medium text-white transition hover:bg-[#007545] disabled:opacity-50"
          >
            {createAssetMutation.isPending ? "Saving..." : "Save Asset"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AddAsset;
