import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalTable from "../../utils/GlobalTable";

const availableAssets = [
  { 
    id: 1,
    assetCode: "MA-001", 
    assetName: "Bulk Storage Compressor", 
    category: "Compressor", 
    zone: "Zone-A", 
    currentStatus: "Operational",
    manufacturer: "Atlas Copco",
  },
  { 
    id: 2,
    assetCode: "MA-002", 
    assetName: "Bulk Storage Compressor", 
    category: "Compressor", 
    zone: "Zone-B", 
    currentStatus: "Under Maintenance",
    manufacturer: "Atlas Copco",
  },
  { 
    id: 3,
    assetCode: "MA-003", 
    assetName: "Transfer Pump Unit", 
    category: "Pump", 
    zone: "Zone-C", 
    currentStatus: "Operational",
    manufacturer: "Grundfos",
  },
];

function LogMaintenance() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    maintenanceId: `MNT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    maintenanceDate: "",
    selectedAsset: null,
    maintenanceType: "",
    problemDescription: "",
    workPerformed: "",
    maintenanceCost: "",
    nextMaintenanceDate: "",
    performedBy: "",
    approvedBy: "",
  });

  const [showAssetTable, setShowAssetTable] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.selectedAsset) {
      alert("Please select an asset");
      return;
    }
    // Handle form submission - you can add API call here
    console.log("Form submitted:", formData);
    navigate("/maintenance-assets");
  };

  const handleSaveAndAddAnother = (e) => {
    e.preventDefault();
    if (!formData.selectedAsset) {
      alert("Please select an asset");
      return;
    }
    // Handle form submission - you can add API call here
    console.log("Form submitted:", formData);
    setFormData({
      maintenanceId: `MNT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      maintenanceDate: "",
      selectedAsset: null,
      maintenanceType: "",
      problemDescription: "",
      workPerformed: "",
      maintenanceCost: "",
      nextMaintenanceDate: "",
      performedBy: "",
      approvedBy: "",
    });
  };

  const handleAssetSelect = (asset) => {
    setFormData({ ...formData, selectedAsset: asset });
    setShowAssetTable(false);
  };

  const assetColumns = [
    {
      key: "assetCode",
      label: "Asset Code",
      isRowHeader: true,
      className: "bg-slate-50/80 px-4 py-3 text-[12px] font-bold text-slate-700",
      cellClassName: "px-4 py-2",
      renderCell: (item) => (
        <span className="font-bold text-slate-800 text-[12px]">{item.assetCode}</span>
      ),
    },
    {
      key: "assetName",
      label: "Asset Name",
      className: "bg-slate-50/80 px-4 py-3 text-[12px] font-bold text-slate-700",
      cellClassName: "px-4 py-2 text-slate-600 text-[12px]",
    },
    {
      key: "category",
      label: "Category",
      className: "bg-slate-50/80 px-4 py-3 text-[12px] font-bold text-slate-700",
      cellClassName: "px-4 py-2 text-slate-600 text-[12px]",
    },
    {
      key: "zone",
      label: "Zone",
      className: "bg-slate-50/80 px-4 py-3 text-[12px] font-bold text-slate-700",
      cellClassName: "px-4 py-2 text-slate-600 text-[12px]",
    },
    {
      key: "currentStatus",
      label: "Status",
      className: "bg-slate-50/80 px-4 py-3 text-[12px] font-bold text-slate-700",
      cellClassName: "px-4 py-2",
      renderCell: (item) => (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
          item.currentStatus === "Operational" 
            ? "bg-emerald-50 text-emerald-600" 
            : "bg-amber-50 text-amber-600"
        }`}>
          {item.currentStatus}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      className: "bg-slate-50/80 px-4 py-3 text-[12px] font-bold text-slate-700",
      cellClassName: "px-4 py-2",
      renderCell: (item) => (
        <button
          type="button"
          onClick={() => handleAssetSelect(item)}
          className="inline-flex items-center gap-1 rounded-full bg-[#008951] px-3 py-1 text-[11px] font-semibold text-white hover:bg-[#007545] transition-colors"
        >
          Select
        </button>
      ),
    },
  ];

  return (
    <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <section className="max-w-5xl mx-auto">
        {/* Header & Breadcrumbs */}
        <div className="mb-6">
          <div>
            <p className="text-xs">
              <span
                onClick={() => navigate("/dashboard")}
                className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
              >
                Dashboard
              </span>{" "}
              <span className="px-1 text-slate-400">/</span>{" "}
              <span
                onClick={() => navigate("/maintenance-assets")}
                className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
              >
                Maintenance Assets
              </span>{" "}
              <span className="px-1 text-slate-400">/</span>{" "}
              <span className="font-semibold text-slate-700">
                Log Maintenance Record
              </span>
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark mt-2">
              Log Maintenance Record
            </h1>
            <p className="text-sm text-tertiary">
              Record maintenance activity for an asset
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Maintenance ID */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Maintenance ID
                </label>
                <input
                  type="text"
                  value={formData.maintenanceId}
                  readOnly
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none"
                />
              </div>

              {/* Maintenance Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Maintenance Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.maintenanceDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maintenanceDate: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-1 focus:ring-[#008951]"
                />
              </div>

              {/* Selected Asset */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Selected Asset <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setShowAssetTable(!showAssetTable)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-left text-slate-700 outline-none focus:border-[#008951] focus:ring-1 focus:ring-[#008951] flex items-center justify-between"
                  >
                    {formData.selectedAsset
                      ? `${formData.selectedAsset.assetCode} - ${formData.selectedAsset.assetName}`
                      : "Click to select an asset..."}
                    <span className="text-xs text-slate-400">▼</span>
                  </button>

                  {formData.selectedAsset && (
                    <div className="flex flex-wrap gap-3 text-xs">
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-slate-600">
                        <span className="font-medium">CATEGORY:</span>{" "}
                        {formData.selectedAsset.category}
                      </span>
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-slate-600">
                        <span className="font-medium">ZONE:</span>{" "}
                        {formData.selectedAsset.zone}
                      </span>
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-slate-600">
                        <span className="font-medium">CURRENT STATUS:</span>{" "}
                        {formData.selectedAsset.currentStatus}
                      </span>
                    </div>
                  )}

                  {showAssetTable && (
                    <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                      <GlobalTable
                        columns={assetColumns}
                        data={availableAssets}
                        ariaLabel="Available Assets Table"
                        className=""
                        rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                        emptyContent="No assets available"
                        pagination={false}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Maintenance Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Maintenance Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.maintenanceType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maintenanceType: e.target.value,
                    })
                  }
                  required
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-1 focus:ring-[#008951]"
                >
                  <option value="">Select maintenance type...</option>
                  <option value="Preventive">Preventive</option>
                  <option value="Corrective">Corrective</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Predictive">Predictive</option>
                </select>
              </div>

              {/* Maintenance Cost */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Maintenance Cost (Rs.)
                </label>
                <input
                  type="number"
                  value={formData.maintenanceCost}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maintenanceCost: e.target.value,
                    })
                  }
                  placeholder="0.00"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-1 focus:ring-[#008951]"
                />
              </div>

              {/* Problem Description */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Problem Description
                </label>
                <textarea
                  value={formData.problemDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      problemDescription: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="Describe the problem or issue..."
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-1 focus:ring-[#008951] resize-none"
                />
              </div>

              {/* Work Performed */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Work Performed <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.workPerformed}
                  onChange={(e) =>
                    setFormData({ ...formData, workPerformed: e.target.value })
                  }
                  rows={3}
                  placeholder="Describe the work performed..."
                  required
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-1 focus:ring-[#008951] resize-none"
                />
              </div>

              {/* Next Maintenance Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Next Maintenance Date
                </label>
                <input
                  type="date"
                  value={formData.nextMaintenanceDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nextMaintenanceDate: e.target.value,
                    })
                  }
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-1 focus:ring-[#008951]"
                />
              </div>

              {/* Performed By */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Performed By <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.performedBy}
                  onChange={(e) =>
                    setFormData({ ...formData, performedBy: e.target.value })
                  }
                  placeholder="Enter technician name..."
                  required
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-1 focus:ring-[#008951]"
                />
              </div>

              {/* Approved By */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Approved By
                </label>
                <input
                  type="text"
                  value={formData.approvedBy}
                  onChange={(e) =>
                    setFormData({ ...formData, approvedBy: e.target.value })
                  }
                  placeholder="Enter supervisor name..."
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-1 focus:ring-[#008951]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={() => navigate("/maintenance-assets")}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAndAddAnother}
                className="rounded-lg border border-[#1a56db] bg-white px-4 py-2.5 text-sm font-medium text-[#1a56db] shadow-sm transition hover:bg-slate-50"
              >
                Save & Add Another
              </button>
              <button
                type="submit"
                className="rounded-lg bg-gradient-bg-blue px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#0f326e]"
              >
                Save Record
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default LogMaintenance;
