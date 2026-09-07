import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddAsset() {
  const navigate = useNavigate();
  
  const [assetCode] = useState("FA-008");
  const [assetName, setAssetName] = useState("");
  const [assetCategory, setAssetCategory] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [location, setLocation] = useState("");
  const [operationalStatus, setOperationalStatus] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [purchaseCost, setPurchaseCost] = useState("");
  const [depreciationMethod, setDepreciationMethod] = useState("");
  const [assignedEmployee, setAssignedEmployee] = useState("");
  const [currentBookValue, setCurrentBookValue] = useState("");
  const [assetStatus, setAssetStatus] = useState("");

  const categoryOptions = [
    { label: "Select Category", value: "" },
    { label: "Plant Equipment", value: "Plant Equipment" },
    { label: "Vehicles", value: "Vehicles" },
    { label: "Office Equipment", value: "Office Equipment" },
    { label: "Furniture", value: "Furniture" },
  ];

  const locationOptions = [
    { label: "Select Location", value: "" },
    { label: "Zone-A", value: "Zone-A" },
    { label: "Zone-B", value: "Zone-B" },
    { label: "Zone-C", value: "Zone-C" },
  ];

  const statusOptions = [
    { label: "Select Status", value: "" },
    { label: "Active", value: "Active" },
    { label: "Under Maintenance", value: "Under Maintenance" },
    { label: "Retired", value: "Retired" },
  ];

  const depreciationOptions = [
    { label: "Select Method", value: "" },
    { label: "Straight Line", value: "Straight Line" },
    { label: "Reducing Balance", value: "Reducing Balance" },
    { label: "Units of Production", value: "Units of Production" },
  ];

  const employeeOptions = [
    { label: "Select Employee", value: "" },
    { label: "Usman Ali", value: "Usman Ali" },
    { label: "Ahmed Khan", value: "Ahmed Khan" },
    { label: "Sara Ahmed", value: "Sara Ahmed" },
  ];

  const handleSave = () => {
    // Handle save logic here
    navigate("/assets");
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
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Asset Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  placeholder="e.g. LPG Filling Machine - Unit 3"
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
                  value={assetCategory}
                  onChange={(e) => setAssetCategory(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Manufacturer
                </label>
                <input
                  type="text"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  placeholder="e.g. Karachi Engineering Works"
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
                  placeholder="e.g. KEW-FM-2024"
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
                  placeholder="e.g. SN-2024-08-0342"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Location <span className="text-rose-500">*</span>
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                >
                  {locationOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Operational Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={operationalStatus}
                  onChange={(e) => setOperationalStatus(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Financial Details */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden col-span-1">
          <div className="border-b border-slate-200 p-4 bg-white">
            <h2 className="text-[16px] font-bold text-BLUE-dark">
              Financial Details
            </h2>
          </div>
          <div className="p-5 space-y-5">
            <div className="gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Purchase Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Purchase Cost (Rs.) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={purchaseCost}
                  onChange={(e) => setPurchaseCost(e.target.value)}
                  placeholder="e.g. 2,500,000"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div className="gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Depreciation Method <span className="text-rose-500">*</span>
                </label>
                <select
                  value={depreciationMethod}
                  onChange={(e) => setDepreciationMethod(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                >
                  {depreciationOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Assigned Employee
                </label>
                <select
                  value={assignedEmployee}
                  onChange={(e) => setAssignedEmployee(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                >
                  {employeeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Current Book Value (Rs.)
                </label>
                <input
                  type="text"
                  disabled
                  value={purchaseCost || ""}
                  placeholder="Auto-calculated"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
                />
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Asset Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={assetStatus}
                  onChange={(e) => setAssetStatus(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-6 flex justify-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <button
          onClick={() => navigate("/assets")}
          className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="rounded-lg bg-gradient-bg-blue px-6 py-2 text-sm font-medium text-white transition hover:bg-[#007545]"
        >
          Save Asset
        </button>
      </div>
    </main>
  );
}

export default AddAsset;
