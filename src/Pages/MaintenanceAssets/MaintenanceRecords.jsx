import { Eye, Edit3, ChevronDown, ClipboardList, ShieldCheck, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalTable from "../../utils/GlobalTable";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import {
  useMaintenanceRecords,
  useDeleteMaintenanceRecord,
} from "../../queries/maintenanceRecords/maintenanceRecords.queries";
import { useToast } from "../../utils/GlobalToast";
import { usePermissions } from "../../contexts/PermissionContext";

const formatLabel = (str) => {
  if (!str) return "-";
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

function MaintenanceRecords() {
  const navigate = useNavigate();
  const toast = useToast();
  const { can } = usePermissions();

  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });

  const { data: recordsResponse, isLoading, error } = useMaintenanceRecords({
    search: query || undefined,
    maintenanceType: type === "All" ? undefined : type,
    page: currentPage,
    limit: 10,
  });

  const deleteMutation = useDeleteMaintenanceRecord();

  const records = recordsResponse?.data?.items || [];
  const pagination = recordsResponse?.data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };
  const meta = recordsResponse?.data?.meta || {};

  const typeOptions = [
    { label: "All Types", value: "All" },
    ...(meta.maintenanceTypes || [
      "preventive",
      "corrective",
      "inspection",
      "emergency",
    ]).map((t) => ({
      label: formatLabel(t),
      value: t,
    })),
  ];

  const mappedRecords = useMemo(() => {
    return records.map((record) => {
      const mDate = record.maintenanceDate ? new Date(record.maintenanceDate) : null;
      const nDate = record.nextMaintenanceDate ? new Date(record.nextMaintenanceDate) : null;

      const assetObj = record.assetId || record.maintenanceAssetId;
      const assetName =
        assetObj && typeof assetObj === "object"
          ? `${assetObj.assetName || assetObj.assetCode || "Asset"}`
          : typeof assetObj === "string"
            ? "Asset #" + assetObj.slice(-6)
            : "-";

      const performedBy =
        record.performedByEmployeeId && typeof record.performedByEmployeeId === "object"
          ? record.performedByEmployeeId.fullName
          : "-";

      return {
        _id: record._id,
        maintenanceNumber: record.maintenanceNumber || "-",
        assetName: assetName,
        type: record.maintenanceType || "-",
        rawType: record.maintenanceType,
        date: mDate
          ? `${mDate.getDate().toString().padStart(2, "0")}/${(mDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${mDate.getFullYear()}`
          : "-",
        problemDescription: record.problemDescription || "-",
        workPerformed: record.workPerformed || "-",
        cost: record.maintenanceCostAmount || 0,
        nextMaintenance: nDate
          ? `${nDate.getDate().toString().padStart(2, "0")}/${(nDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${nDate.getFullYear()}`
          : "-",
        performedBy: performedBy,
      };
    });
  }, [records]);

  const summaryStats = useMemo(() => {
    const totalRecords = pagination.total || mappedRecords.length;
    const totalCost = mappedRecords.reduce((sum, record) => sum + (record.cost || 0), 0);
    const preventiveCount = mappedRecords.filter((r) => r.rawType === "preventive").length;
    const correctiveCount = mappedRecords.filter((r) => r.rawType === "corrective").length;

    return {
      totalRecords,
      totalCost,
      preventiveCount,
      correctiveCount,
    };
  }, [pagination.total, mappedRecords]);

  const handleDeleteConfirm = async () => {
    if (!deleteModal.item) return;

    try {
      await deleteMutation.mutateAsync(deleteModal.item._id);
      toast.success(`Maintenance record ${deleteModal.item.maintenanceNumber} deleted successfully`);
      setDeleteModal({ isOpen: false, item: null });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete maintenance record. Please try again.");
    }
  };

  const getBadgeStyle = (rawType) => {
    switch (rawType) {
      case "preventive":
        return "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900";
      case "corrective":
        return "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900";
      case "inspection":
        return "bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900";
      case "emergency":
        return "bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900";
      default:
        return "bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700";
    }
  };

  const recordColumns = [
    {
      key: "maintenanceNumber",
      label: "Maint. #",
      isRowHeader: true,
      className: "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 text-nowrap whitespace-nowrap",
      cellClassName: "px-4 py-4 text-nowrap whitespace-nowrap",
      renderCell: (item) => (
        <span className="font-bold text-slate-800 dark:text-gray-100 text-[13px]">{item.maintenanceNumber}</span>
      ),
    },
    {
      key: "assetId",
      label: "Asset Name",
      className: "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 text-nowrap whitespace-nowrap",
      cellClassName: "px-4 py-4 text-slate-600 dark:text-gray-400 text-[13px] font-medium text-nowrap whitespace-nowrap",
      renderCell: (item) => item.assetName,
    },
    {
      key: "type",
      label: "Type",
      className: "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 text-nowrap whitespace-nowrap",
      cellClassName: "px-4 py-4 text-nowrap whitespace-nowrap",
      renderCell: (item) => (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getBadgeStyle(item.rawType)}`}>
          {formatLabel(item.type)}
        </span>
      ),
    },
    {
      key: "date",
      label: "Date",
      className: "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 text-nowrap whitespace-nowrap",
      cellClassName: "px-4 py-4 text-slate-600 dark:text-gray-400 text-[13px] font-medium text-nowrap whitespace-nowrap",
      renderCell: (item) => item.date,
    },
    {
      key: "problemDescription",
      label: "Problem Description",
      className: "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 text-nowrap whitespace-nowrap",
      cellClassName: "px-4 py-4 text-slate-600 dark:text-gray-400 text-[13px] font-medium text-nowrap whitespace-nowrap",
      renderCell: (item) => (
        <span className="truncate max-w-48 block" title={item.problemDescription}>
          {item.problemDescription}
        </span>
      ),
    },
    {
      key: "workPerformed",
      label: "Work Performed",
      className: "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 text-nowrap whitespace-nowrap",
      cellClassName: "px-4 py-4 text-slate-600 dark:text-gray-400 text-[13px] font-medium text-nowrap whitespace-nowrap",
      renderCell: (item) => (
        <span className="truncate max-w-48 block" title={item.workPerformed}>
          {item.workPerformed}
        </span>
      ),
    },
    {
      key: "cost",
      label: "Cost (Rs.)",
      className: "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 text-nowrap whitespace-nowrap",
      cellClassName: "px-4 py-4 text-nowrap whitespace-nowrap",
      renderCell: (item) => (
        <span className="text-slate-900 dark:text-gray-100 font-bold text-[13px]">Rs. {item.cost.toLocaleString()}</span>
      ),
    },
    {
      key: "nextMaintenance",
      label: "Next Maint.",
      className: "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 text-nowrap whitespace-nowrap",
      cellClassName: "px-4 py-4 text-slate-600 dark:text-gray-400 text-[13px] font-medium text-nowrap whitespace-nowrap",
      renderCell: (item) => item.nextMaintenance,
    },
    {
      key: "performedBy",
      label: "Performed By",
      className: "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 text-nowrap whitespace-nowrap",
      cellClassName: "px-4 py-4 text-slate-600 dark:text-gray-400 text-[13px] font-medium text-nowrap whitespace-nowrap",
      renderCell: (item) => item.performedBy,
    },
    {
      key: "actions",
      label: "Actions",
      className: "bg-slate-50/80 dark:bg-gray-800/80 px-4 py-4 text-[13px] font-bold text-slate-700 dark:text-gray-300 text-nowrap whitespace-nowrap pr-6",
      cellClassName: "px-4 py-4 pr-6 text-nowrap whitespace-nowrap",
      renderCell: (item) => (
        <div className="flex items-center gap-2">
          {can("maintenance-records", "read") && (
          <button
            type="button"
            aria-label={`View ${item.maintenanceNumber}`}
            onClick={() => navigate(`/maintenance-records/view/${item._id}`)}
            className="flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-950 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" strokeWidth={2.5} /> View
          </button>
          )}
          {can("maintenance-records", "update") && (
          <button
            type="button"
            aria-label={`Edit ${item.maintenanceNumber}`}
            onClick={() => navigate(`/maintenance-records/edit/${item._id}`)}
            className="flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" strokeWidth={2.5} /> Edit
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
          <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950/60 dark:to-blue-900/40 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-200/70 dark:bg-blue-800/60 p-2">
                <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-600 dark:text-gray-400">Total Records</p>
                <p className="mt-1 text-2xl font-extrabold text-blue-700 dark:text-blue-300">
                  {summaryStats.totalRecords}
                </p>
                <p className="mt-1 text-[11px] text-slate-400 dark:text-gray-500">All logged maintenance entries</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-linear-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/60 dark:to-emerald-900/40 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-emerald-200/70 dark:bg-emerald-800/60 p-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-600 dark:text-gray-400">Preventive / Corrective</p>
                <p className="mt-1 text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">
                  {summaryStats.preventiveCount} / {summaryStats.correctiveCount}
                </p>
                <p className="mt-1 text-[11px] text-slate-400 dark:text-gray-500">Scheduled & corrective tasks</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-gray-700 bg-linear-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-slate-200/70 dark:bg-gray-700 p-2">
                <Wallet className="h-5 w-5 text-slate-700 dark:text-gray-300" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-600 dark:text-gray-400">Total Maintenance Cost</p>
                <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-gray-100">
                  Rs. {summaryStats.totalCost.toLocaleString()}
                </p>
                <p className="mt-1 text-[11px] text-slate-400 dark:text-gray-500">Aggregated service expenditures</p>
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
                placeholder="Search maintenance number, asset, or technician..."
              />
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  value={type}
                  onChange={(event) => {
                    setType(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 dark:text-gray-400 outline-none focus:border-[#008951] sm:w-44 lg:w-48"
                >
                  {typeOptions.map((opt) => (
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
            <div className="p-8 text-center text-sm text-slate-500 dark:text-gray-400">Loading maintenance records...</div>
          ) : error ? (
            <div className="p-8 text-center text-sm text-red-500 dark:text-red-400">
              Error loading maintenance records. Please try again.
            </div>
          ) : (
            <GlobalTable
              columns={recordColumns}
              data={mappedRecords}
              ariaLabel="Maintenance Records Table"
              className=""
              rowClassName="border-b border-slate-100 dark:border-gray-800 last:border-0 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
              emptyContent="No maintenance records match your search."
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
        title="Delete Maintenance Record"
        message="Are you sure you want to delete this maintenance record? This action cannot be undone."
        itemName={deleteModal.item ? `${deleteModal.item.maintenanceNumber} (${deleteModal.item.assetName})` : ""}
        isDeleting={deleteMutation.isPending}
      />
    </main>
  );
}

export default MaintenanceRecords;
