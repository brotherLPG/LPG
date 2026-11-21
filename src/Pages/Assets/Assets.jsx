import { Eye, Edit3, Trash2, ChevronDown, Building2, TrendingDown, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Tooltip } from "@heroui/react";
import GlobalTable from "../../utils/GlobalTable";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useAssets, useDeleteAsset, useAssetFormOptions } from "../../queries/assets/assets.queries";
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
  // const [location, setLocation] = useState("All");
  const [status, setStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });

  const { data: formOptionsResponse, isLoading: optionsLoading } = useAssetFormOptions();
  const formOptions = formOptionsResponse?.data || {};

  const { data: assetsResponse, isLoading, error } = useAssets({
    search: query || undefined,
    assetCategory: category === "All" ? undefined : category,
    // locationName: location === "All" ? undefined : location,
    assetStatus: status === "All" ? undefined : status,
    page: currentPage,
    limit: 10,
  });

  const deleteMutation = useDeleteAsset();

  const assets = assetsResponse?.data?.items || [];
  const pagination = assetsResponse?.data?.pagination || { total: 0, page: 1, totalPages: 1 };

  const categoryOptions = [
    { label: "All Categories", value: "All" },
    ...(formOptions.assetCategories || []),
  ];

  const statusOptions = [
    { label: "All Statuses", value: "All" },
    ...(formOptions.assetStatuses || []),
  ];

  const mappedAssets = useMemo(() => {
    return assets.map((asset) => {
      const pDate = asset.purchaseDate ? new Date(asset.purchaseDate) : null;
      const assignedEmpName =
        asset.assignedEmployeeId && typeof asset.assignedEmployeeId === "object"
          ? asset.assignedEmployeeId.fullName
          : "-";

      const accountName =
        asset.accountId && typeof asset.accountId === "object"
          ? asset.accountId.accountName || asset.accountId.label || "-"
          : "-";

      return {
        _id: asset._id,
        assetCode: asset.assetCode || "-",
        assetName: asset.assetName || "-",
        category: formatLabel(asset.assetCategory),
        accountName,
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
      className: "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap",
      cellClassName: "px-4 py-4 whitespace-nowrap",
      renderCell: (item) => (
        <div>
          <span className="font-bold text-slate-800 dark:text-gray-100 text-[13px]">{item.assetCode}</span>
          {item.assetName !== "-" && (
            <p className="text-xs text-slate-500 dark:text-gray-400 font-normal">{item.assetName}</p>
          )}
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      className: "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap",
      cellClassName: "px-4 py-4 text-slate-600 dark:text-gray-400 text-[13px] font-medium whitespace-nowrap",
      renderCell: (item) => item.category,
    },
    {
      key: "location",
      label: "Location",
      className: "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap",
      cellClassName: "px-4 py-4 text-slate-600 dark:text-gray-400 text-[13px] font-medium whitespace-nowrap",
      renderCell: (item) => item.location,
    },
    {
      key: "accountName",
      label: "Account",
      className: "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap",
      cellClassName: "px-4 py-4 text-slate-600 dark:text-gray-400 text-[13px] font-medium whitespace-nowrap",
      renderCell: (item) => item.accountName,
    },
    {
      key: "assignedEmployee",
      label: "Assigned To",
      className: "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap",
      cellClassName: "px-4 py-4 text-slate-600 dark:text-gray-400 text-[13px] font-medium whitespace-nowrap",
      renderCell: (item) => item.assignedEmployee,
    },
    {
      key: "date",
      label: "Purchase Date",
      className: "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap",
      cellClassName: "px-4 py-4 text-slate-600 dark:text-gray-400 text-[13px] font-medium whitespace-nowrap",
      renderCell: (item) => item.date,
    },
    {
      key: "purchaseCost",
      label: "Purchase Cost ",
      className: "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap",
      cellClassName: "px-4 py-4 text-slate-600 dark:text-gray-400 text-[13px] font-medium whitespace-nowrap",
      renderCell: (item) => item.purchaseCost.toLocaleString(),
    },
    {
      key: "bookValue",
      label: "Book Value ",
      className: "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap",
      cellClassName: "px-4 py-4 whitespace-nowrap",
      renderCell: (item) => (
        <span className="text-slate-900 dark:text-gray-100 font-bold text-[13px]">
           {item.bookValue.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap",
      cellClassName: "px-4 py-4 whitespace-nowrap",
      renderCell: (item) => {
        const statusStyles = {
          "in-use": "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900",
          idle: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900",
          "under-maintenance": "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900",
          disposed: "bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900",
        };
        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              statusStyles[item.status] || "bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700"
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
      className: "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 text-center pr-6",
      cellClassName: "px-4 py-4 pr-6",
      renderCell: (item) => (
        <div className="flex items-center justify-end gap-2">
          {can("assets", "read") && (
            <Tooltip delay={0}>
              <Button
                aria-label={`View ${item.assetCode}`}
                onClick={() => navigate(`/assets/view/${item._id}`)}
                className="flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-950 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
              >
                <Eye className="h-3.5 w-3.5" strokeWidth={2.5} />
              </Button>
              <Tooltip.Content>
                <p>View Asset</p>
              </Tooltip.Content>
            </Tooltip>
          )}
          {can("assets", "update") && (
            <Tooltip delay={0}>
              <Button
                aria-label={`Edit ${item.assetCode}`}
                onClick={() => navigate(`/assets/edit/${item._id}`)}
                className="flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5" strokeWidth={2.5} />
              </Button>
              <Tooltip.Content>
                <p>Update Asset</p>
              </Tooltip.Content>
            </Tooltip>
          )}
          {can("assets", "delete") && (
            <Tooltip delay={0}>
              <Button
                aria-label={`Delete ${item.assetCode}`}
                onClick={() => setDeleteModal({ isOpen: true, item })}
                className="flex items-center gap-1 rounded-md bg-red-50 dark:bg-red-950 px-2.5 py-1 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} />
              </Button>
              <Tooltip.Content>
                <p>Delete Asset</p>
              </Tooltip.Content>
            </Tooltip>
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
          <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950/60 dark:to-blue-900/40 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-200/70 dark:bg-blue-800/60 p-2">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-600 dark:text-gray-400">Total Asset Value</p>
                <p className="mt-1 text-2xl font-extrabold text-blue-700 dark:text-blue-300">
                  {summaryStats.totalAssetValue.toLocaleString()}
                </p>
                <p className="mt-1 text-[11px] text-slate-400 dark:text-gray-500">Total purchase cost</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-linear-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/60 dark:to-emerald-900/40 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-emerald-200/70 dark:bg-emerald-800/60 p-2">
                <TrendingDown className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-600 dark:text-gray-400">Total Depreciation</p>
                <p className="mt-1 text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">
                  {summaryStats.totalDepreciation.toLocaleString()}
                </p>
                <p className="mt-1 text-[11px] text-slate-400 dark:text-gray-500">Accumulated depreciation</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-gray-700 bg-linear-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-slate-200/70 dark:bg-gray-700 p-2">
                <Wallet className="h-5 w-5 text-slate-700 dark:text-gray-300" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-600 dark:text-gray-400">Net Book Value</p>
                <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-gray-100">
                  {summaryStats.netBookValue.toLocaleString()}
                </p>
                <p className="mt-1 text-[11px] text-slate-400 dark:text-gray-500">Current asset value</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full border-2 border-slate-300 dark:border-gray-600"></div>
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-md border border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-gray-800/50 py-2.5 pl-8 pr-3 text-sm text-slate-700 dark:text-gray-300 outline-none transition placeholder:text-slate-500 dark:placeholder:text-gray-400 focus:border-[#008951] focus:ring-1 focus:ring-[#008951]"
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
                  disabled={optionsLoading}
                  className="w-full appearance-none rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 dark:text-gray-400 outline-none focus:border-[#008951] sm:w-44 lg:w-48 disabled:opacity-50"
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 dark:text-gray-400 pointer-events-none" />
              </div>
             
              <div className="relative">
                <select
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value);
                    setCurrentPage(1);
                  }}
                  disabled={optionsLoading}
                  className="w-full appearance-none rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 dark:text-gray-400 outline-none focus:border-[#008951] sm:w-40 lg:w-44 disabled:opacity-50"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 dark:text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-slate-500 dark:text-gray-400">Loading assets...</div>
          ) : error ? (
            <div className="p-8 text-center text-sm text-red-500 dark:text-red-400">
              Error loading assets. Please try again.
            </div>
          ) : (
            <GlobalTable
              columns={assetColumns}
              data={mappedAssets}
              ariaLabel="Fixed Assets Table"
              className=""
              rowClassName="border-b border-slate-100 dark:border-gray-800 last:border-0 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
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
