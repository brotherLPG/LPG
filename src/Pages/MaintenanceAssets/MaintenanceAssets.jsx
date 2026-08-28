import { PlusCircle, Eye, Edit3, Trash2, ChevronDown, Wrench, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalTable from "../../utils/GlobalTable";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useToast } from "../../utils/GlobalToast";

const initialAssets = [
  { 
    id: 1,
    assetCode: "AST-2026-001", 
    assetName: "Compressor Unit A1", 
    category: "Equipment", 
    manufacturer: "Atlas Copco", 
    location: "Main Plant - Zone A", 
    operationalStatus: "Operational", 
    nextMaintenance: "15 Sep 2026" 
  },
  { 
    id: 2,
    assetCode: "AST-2026-002", 
    assetName: "Storage Tank T-101", 
    category: "Storage", 
    manufacturer: "McDermott", 
    location: "Storage Yard - Zone B", 
    operationalStatus: "Maintenance Required", 
    nextMaintenance: "28 Aug 2026" 
  },
  { 
    id: 3,
    assetCode: "AST-2026-003", 
    assetName: "Pump Station P-05", 
    category: "Equipment", 
    manufacturer: "Grundfos", 
    location: "Pumping Station - Zone C", 
    operationalStatus: "Operational", 
    nextMaintenance: "10 Oct 2026" 
  },
  { 
    id: 4,
    assetCode: "AST-2026-004", 
    assetName: "Safety Valve SV-201", 
    category: "Safety", 
    manufacturer: "Emerson", 
    location: "Main Plant - Zone A", 
    operationalStatus: "Under Maintenance", 
    nextMaintenance: "05 Sep 2026" 
  },
  { 
    id: 5,
    assetCode: "AST-2026-005", 
    assetName: "Control Panel CP-03", 
    category: "Electrical", 
    manufacturer: "Siemens", 
    location: "Control Room - Zone D", 
    operationalStatus: "Operational", 
    nextMaintenance: "20 Nov 2026" 
  },
  { 
    id: 6,
    assetCode: "AST-2026-006", 
    assetName: "Filling Machine FM-02", 
    category: "Equipment", 
    manufacturer: "Cryostar", 
    location: "Filling Station - Zone E", 
    operationalStatus: "Operational", 
    nextMaintenance: "12 Dec 2026" 
  },
];

function MaintenanceAssets() {
  const navigate = useNavigate();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [assets, setAssets] = useState(initialAssets);

  const filteredAssets = useMemo(() => assets.filter((asset) => {
    const matchesQuery = `${asset.assetCode} ${asset.assetName} ${asset.manufacturer} ${asset.location}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All" || asset.category === category;
    const matchesStatus = status === "All" || asset.operationalStatus === status;
    return matchesQuery && matchesCategory && matchesStatus;
  }), [query, category, status, assets]);

  const handleDeleteClick = (item) => {
    setDeleteModal({ isOpen: true, item });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.item) {
      setAssets(assets.filter(a => a.id !== deleteModal.item.id));
      toast.success(`Asset ${deleteModal.item.assetCode} has been deleted successfully`);
      setDeleteModal({ isOpen: false, item: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, item: null });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Operational":
        return "bg-emerald-50 text-emerald-600";
      case "Maintenance Required":
        return "bg-amber-50 text-amber-600";
      case "Under Maintenance":
        return "bg-blue-50 text-blue-600";
      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  const assetColumns = [
    {
      key: "assetCode",
      label: "Asset Code",
      isRowHeader: true,
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <span className="font-bold text-slate-800 text-[13px]">{item.assetCode}</span>
      ),
    },
    {
      key: "assetName",
      label: "Asset Name",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3 text-slate-600 text-[13px]",
    },
    {
      key: "category",
      label: "Category",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3 text-slate-600 text-[13px]",
    },
    {
      key: "manufacturer",
      label: "Manufacturer",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3 text-slate-600 text-[13px]",
    },
    {
      key: "location",
      label: "Location",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3 text-slate-600 text-[13px]",
    },
    {
      key: "operationalStatus",
      label: "Operational Status",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(item.operationalStatus)}`}>
          {item.operationalStatus}
        </span>
      ),
    },
    {
      key: "nextMaintenance",
      label: "Next Maintenance",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3 text-slate-600 text-[13px]",
    },
    {
      key: "actions",
      label: "Actions",
      className: "bg-slate-50/80 px-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`View ${item.assetCode}`}
            className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" /> View
          </button>
          <button
            type="button"
            aria-label={`Edit ${item.assetCode}`}
            className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-100 transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" /> Edit
          </button>
          <button
            type="button"
            onClick={() => handleDeleteClick(item)}
            aria-label={`Delete ${item.assetCode}`}
            className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      ),
    },
  ];

  const stats = [
    {
      label: "Total Assets Listed",
      value: assets.length,
      subLabel: "Across 4 physical zones",
      color: "text-[#9CA3AF]",
    },
    {
      label: "Operational",
      value: assets.filter((a) => a.operationalStatus === "Operational").length,
      subLabel: "Fully functioning",
      color: "text-emerald-500",
    },
    {
      label: "Maintenance Required",
      value: assets.filter(
        (a) => a.operationalStatus === "Maintenance Required",
      ).length,
      subLabel: "Active schedule logs",
      color: "text-amber-500",
    },
    {
      label: "Out of Service",
      value: assets.filter((a) => a.operationalStatus === "Out of Service")
        .length,
      subLabel: "Requires immediate replacement",
      color: "text-red-500",
    },
  ];

  return (
    <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <section>
        {/* Header & Breadcrumbs */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs">
              <span
                onClick={() => navigate("/dashboard")}
                className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
              >
                Dashboard
              </span>{" "}
              <span className="px-1 text-slate-400">/</span>{" "}
              <span className="font-semibold text-slate-700">
                Maintenance Assets
              </span>
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark mt-2">
              Maintenance Assets
            </h1>
            <p className="text-sm text-tertiary">
              Manage and track maintenance assets across all facilities
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/maintenance-assets/log")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#008951] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#007545]"
          >
            <PlusCircle className="h-4 w-4" /> Add Asset
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-tertiary">
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-tertiary">{stat.subLabel}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-slate-300"></div>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50/50 py-2.5 pl-8 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-500 focus:border-[#008951] focus:ring-1 focus:ring-[#008951]"
                placeholder="Search by asset code, name, manufacturer, or location..."
              />
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-40 lg:w-44"
                >
                  <option value="All">Category: All</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Storage">Storage</option>
                  <option value="Safety">Safety</option>
                  <option value="Electrical">Electrical</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-48 lg:w-56"
                >
                  <option value="All">Status: All</option>
                  <option value="Operational">Operational</option>
                  <option value="Maintenance Required">
                    Maintenance Required
                  </option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <GlobalTable
            columns={assetColumns}
            data={filteredAssets}
            ariaLabel="Maintenance Assets Table"
            className=""
            rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
            emptyContent="No assets match your search."
            pagination={true}
            rowsPerPage={5}
          />
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Asset"
        message="Are you sure you want to delete this asset? This action cannot be undone and will permanently remove the record from the system."
        itemName={
          deleteModal.item
            ? `${deleteModal.item.assetCode} - ${deleteModal.item.assetName}`
            : ""
        }
      />
    </main>
  );
}

export default MaintenanceAssets;
