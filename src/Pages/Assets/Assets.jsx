import { CirclePlus, Eye, Edit3, Trash2, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalTable from "../../utils/GlobalTable";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useAssets, useDeleteAsset } from "../../queries/assets/assets.queries";
import { useToast } from "../../utils/GlobalToast";
import { usePermissions } from "../../contexts/PermissionContext";

const formatLabel = (str) => {
  if (!str) return "-";
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

function Assets() {
  const navigate = useNavigate();
  const toast = useToast();
  const { can } = usePermissions();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [status, setStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });

  const { data: assetsResponse, isLoading, error } = useAssets({
    search: query || undefined,
    assetCategory: category === "All" ? undefined : category,
    locationName: location === "All" ? undefined : location,
    assetStatus: status === "All" ? undefined : status,
    page: currentPage,
    limit: 10,
  });

  const deleteMutation = useDeleteAsset();

  const assets = assetsResponse?.data?.items || [];
  const pagination = assetsResponse?.data?.pagination || { total: 0, page: 1, totalPages: 1 };
  const meta = assetsResponse?.data?.meta || {};

  const categoryOptions = [
    { label: "All Categories", value: "All" },
    ...(meta.assetCategories || [
      "plant",
      "vehicle",
      "filling-machine",
      "compressor",
      "tank",
      "building",
      "furniture",
      "other",
    ]).map((cat) => ({
      label: formatLabel(cat),
      value: cat,
    })),
  ];

  const statusOptions = [
    { label: "All Statuses", value: "All" },
    ...(meta.assetStatuses || [
      "in-use",
      "idle",
      "under-maintenance",
      "disposed",
    ]).map((st) => ({
      label: formatLabel(st),
      value: st,
    })),
  ];

  const locations = useMemo(() => {
    const locSet = new Set(assets.map((a) => a.locationName).filter(Boolean));
    return Array.from(locSet);
  }, [assets]);

  const mappedAssets = useMemo(() => {
    return assets.map((asset) => {
      const pDate = asset.purchaseDate ? new Date(asset.purchaseDate) : null;
      const assignedEmpName =
        asset.assignedEmployeeId && typeof asset.assignedEmployeeId === "object"
          ? asset.assignedEmployeeId.fullName
          : "-";

      return {
        _id: asset._id,
        assetCode: asset.assetCode || "-",
        assetName: asset.assetName || "-",
        category: formatLabel(asset.assetCategory),
        rawCategory: asset.assetCategory,
        date: pDate
          ? `${pDate.getDate().toString().padStart(2, "0")}/${(pDate.getMonth() + 1)
              .toString()
              .padStart(2, "0")}/${pDate.getFullYear()}`
          : "-",
        purchaseCost: asset.purchaseCostAmount || 0,
        depreciationMethod: formatLabel(asset.depreciationMethod),
        bookValue: asset.currentBookValueAmount || 0,
        location: asset.locationName || "-",
        assignedEmployee: assignedEmpName,
        status: asset.assetStatus || "in-use",
      };
    });
  }, [assets]);

  const summaryStats = useMemo(() => {
    const totalAssetValue = mappedAssets.reduce((sum, asset) => sum + (asset.purchaseCost || 0), 0);
    const totalBookValue = mappedAssets.reduce((sum, asset) => sum + (asset.bookValue || 0), 0);
    const totalDepreciation = totalAssetValue - totalBookValue;

    return {
      totalAssetValue,
      totalDepreciation,
      netBookValue: totalBookValue,
    };
  }, [mappedAssets]);

  const handleDeleteConfirm = async () => {
    if (!deleteModal.item) return;

    try {
      await deleteMutation.mutateAsync(deleteModal.item._id);
      toast.success(`Asset ${deleteModal.item.assetCode} deleted successfully`);
      setDeleteModal({ isOpen: false, item: null });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete asset. Please try again.");
    }
  };

  const assetColumns = [
    {
      key: "assetCode",
      label: "Asset Code",
      isRowHeader: true,
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <div>
          <span className="font-bold text-slate-800 text-[13px]">{item.assetCode}</span>
          {item.assetName !== "-" && (
            <p className="text-xs text-slate-500 font-normal">{item.assetName}</p>
          )}
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
      renderCell: (item) => item.category,
    },
    {
      key: "location",
      label: "Location",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
      renderCell: (item) => item.location,
    },
    {
      key: "assignedEmployee",
      label: "Assigned To",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
      renderCell: (item) => item.assignedEmployee,
    },
    {
      key: "date",
      label: "Purchase Date",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
      renderCell: (item) => item.date,
    },
    {
      key: "purchaseCost",
      label: "Purchase Cost (Rs.)",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
      renderCell: (item) => item.purchaseCost.toLocaleString(),
    },
    {
      key: "bookValue",
      label: "Book Value (Rs.)",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <span className="text-slate-900 font-bold text-[13px]">
          Rs. {item.bookValue.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4",
      renderCell: (item) => {
        const statusStyles = {
          "in-use": "bg-emerald-50 text-emerald-600 border border-emerald-100",
          idle: "bg-blue-50 text-blue-600 border border-blue-100",
          "under-maintenance": "bg-amber-50 text-amber-600 border border-amber-100",
          disposed: "bg-rose-50 text-rose-600 border border-rose-100",
        };
        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              statusStyles[item.status] || "bg-slate-50 text-slate-600 border border-slate-200"
            }`}
          >
            {formatLabel(item.status)}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-center pr-6",
      cellClassName: "px-4 py-4 pr-6",
      renderCell: (item) => (
        <div className="flex items-center justify-end gap-2">
          {can("assets", "read") && (
          <button
            type="button"
            aria-label={`View ${item.assetCode}`}
            onClick={() => navigate(`/assets/view/${item._id}`)}
            className="flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" strokeWidth={2.5} /> View
          </button>
          )}
          {can("assets", "update") && (
          <button
            type="button"
            aria-label={`Edit ${item.assetCode}`}
            onClick={() => navigate(`/assets/edit/${item._id}`)}
            className="flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-100 transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" strokeWidth={2.5} /> Edit
          </button>
          )}
          {can("assets", "delete") && (
          <button
            type="button"
            aria-label={`Delete ${item.assetCode}`}
            onClick={() => setDeleteModal({ isOpen: true, item })}
            className="flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} /> Delete
          </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <main className="">
      <section>
        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">Total Asset Value</p>
                <p className="mt-2 text-2xl font-extrabold text-6th-color">
                  Rs. {summaryStats.totalAssetValue.toLocaleString()}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-tertiary">
                  <span className="h-2 w-2 rounded-full bg-[#2563EB]"></span>
                  Total purchase cost
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">Total Depreciation</p>
                <p className="mt-2 text-2xl font-extrabold text-5th-color">
                  Rs. {summaryStats.totalDepreciation.toLocaleString()}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-tertiary">
                  <span className="h-2 w-2 rounded-full bg-[#10B981]"></span>
                  Accumulated depreciation
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">Net Book Value</p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">
                  Rs. {summaryStats.netBookValue.toLocaleString()}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-tertiary">
                  <span className="h-2 w-2 rounded-full bg-[#4B5563]"></span>
                  Current asset value
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full border-2 border-slate-300"></div>
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-md border border-slate-200 bg-slate-50/50 py-2.5 pl-8 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-500 focus:border-[#008951] focus:ring-1 focus:ring-[#008951]"
                placeholder="Search by asset code or name..."
              />
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-44 lg:w-48"
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={location}
                  onChange={(event) => {
                    setLocation(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-40 lg:w-44"
                >
                  <option value="All">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-40 lg:w-44"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-slate-500">Loading assets...</div>
          ) : error ? (
            <div className="p-8 text-center text-sm text-red-500">
              Error loading assets. Please try again.
            </div>
          ) : (
            <GlobalTable
              columns={assetColumns}
              data={mappedAssets}
              ariaLabel="Fixed Assets Table"
              className=""
              rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
              emptyContent="No assets match your search."
              pagination={true}
              rowsPerPage={pagination.limit || 10}
              totalCount={pagination.total}
              page={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </section>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Asset"
        message="Are you sure you want to delete this asset? This action cannot be undone."
        itemName={deleteModal.item ? `${deleteModal.item.assetCode} - ${deleteModal.item.assetName}` : ""}
        isDeleting={deleteMutation.isPending}
      />
    </main>
  );
}

export default Assets;
