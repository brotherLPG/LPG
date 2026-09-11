import { Eye, Edit3, Trash2, ChevronDown } from "lucide-react";
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
        return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      case "corrective":
        return "bg-amber-50 text-amber-600 border border-amber-100";
      case "inspection":
        return "bg-purple-50 text-purple-600 border border-purple-100";
      case "emergency":
        return "bg-rose-50 text-rose-600 border border-rose-100";
      default:
        return "bg-slate-50 text-slate-600 border border-slate-200";
    }
  };

  const recordColumns = [
    {
      key: "maintenanceNumber",
      label: "Maint. #",
      isRowHeader: true,
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-nowrap whitespace-nowrap",
      cellClassName: "px-4 py-4 text-nowrap whitespace-nowrap",
      renderCell: (item) => (
        <span className="font-bold text-slate-800 text-[13px]">{item.maintenanceNumber}</span>
      ),
    },
    {
      key: "assetId",
      label: "Asset Name",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-nowrap whitespace-nowrap",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium text-nowrap whitespace-nowrap",
      renderCell: (item) => item.assetName,
    },
    {
      key: "type",
      label: "Type",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-nowrap whitespace-nowrap",
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
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-nowrap whitespace-nowrap",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium text-nowrap whitespace-nowrap",
      renderCell: (item) => item.date,
    },
    {
      key: "problemDescription",
      label: "Problem Description",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-nowrap whitespace-nowrap",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium text-nowrap whitespace-nowrap",
      renderCell: (item) => (
        <span className="truncate max-w-48 block" title={item.problemDescription}>
          {item.problemDescription}
        </span>
      ),
    },
    {
      key: "workPerformed",
      label: "Work Performed",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-nowrap whitespace-nowrap",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium text-nowrap whitespace-nowrap",
      renderCell: (item) => (
        <span className="truncate max-w-48 block" title={item.workPerformed}>
          {item.workPerformed}
        </span>
      ),
    },
    {
      key: "cost",
      label: "Cost (Rs.)",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-nowrap whitespace-nowrap",
      cellClassName: "px-4 py-4 text-nowrap whitespace-nowrap",
      renderCell: (item) => (
        <span className="text-slate-900 font-bold text-[13px]">Rs. {item.cost.toLocaleString()}</span>
      ),
    },
    {
      key: "nextMaintenance",
      label: "Next Maint.",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-nowrap whitespace-nowrap",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium text-nowrap whitespace-nowrap",
      renderCell: (item) => item.nextMaintenance,
    },
    {
      key: "performedBy",
      label: "Performed By",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-nowrap whitespace-nowrap",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium text-nowrap whitespace-nowrap",
      renderCell: (item) => item.performedBy,
    },
    {
      key: "actions",
      label: "Actions",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-nowrap whitespace-nowrap pr-6",
      cellClassName: "px-4 py-4 pr-6 text-nowrap whitespace-nowrap",
      renderCell: (item) => (
        <div className="flex items-center gap-2">
          {can("maintenance-records", "read") && (
          <button
            type="button"
            aria-label={`View ${item.maintenanceNumber}`}
            onClick={() => navigate(`/maintenance-records/view/${item._id}`)}
            className="flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" strokeWidth={2.5} /> View
          </button>
          )}
          {can("maintenance-records", "update") && (
          <button
            type="button"
            aria-label={`Edit ${item.maintenanceNumber}`}
            onClick={() => navigate(`/maintenance-records/edit/${item._id}`)}
            className="flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-100 transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" strokeWidth={2.5} /> Edit
          </button>
          )}
          {/* <button
            type="button"
            aria-label={`Delete ${item.maintenanceNumber}`}
            onClick={() => setDeleteModal({ isOpen: true, item })}
            className="flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} /> Delete
          </button> */}
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
                <p className="text-sm font-semibold text-slate-600">Total Records</p>
                <p className="mt-2 text-2xl font-extrabold text-6th-color">
                  {summaryStats.totalRecords}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-tertiary">
                  <span className="h-2 w-2 rounded-full bg-[#2563EB]"></span>
                  All logged maintenance entries
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">Preventive / Corrective</p>
                <p className="mt-2 text-2xl font-extrabold text-5th-color">
                  {summaryStats.preventiveCount} / {summaryStats.correctiveCount}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-tertiary">
                  <span className="h-2 w-2 rounded-full bg-[#10B981]"></span>
                  Scheduled & corrective tasks
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">Total Maintenance Cost</p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">
                  Rs. {summaryStats.totalCost.toLocaleString()}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-tertiary">
                  <span className="h-2 w-2 rounded-full bg-[#4B5563]"></span>
                  Aggregated service expenditures
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
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-44 lg:w-48"
                >
                  {typeOptions.map((opt) => (
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
            <div className="p-8 text-center text-sm text-slate-500">Loading maintenance records...</div>
          ) : error ? (
            <div className="p-8 text-center text-sm text-red-500">
              Error loading maintenance records. Please try again.
            </div>
          ) : (
            <GlobalTable
              columns={recordColumns}
              data={mappedRecords}
              ariaLabel="Maintenance Records Table"
              className=""
              rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
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
