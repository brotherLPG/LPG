import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CirclePlus, Eye, Edit3, ChevronDown } from "lucide-react";
import GlobalTable from "../../utils/GlobalTable";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useToast } from "../../utils/GlobalToast";
import {
  useDeleteFillingBatch,
  useFillingBatches,
} from "../../queries/fillingBatches/fillingBatches.queries";

function FillingBatches() {
  const navigate = useNavigate();
  const toast = useToast();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });

  const { data: batchesData, isLoading, error } = useFillingBatches({
    search: query,
    startDate: selectedDate || undefined,
    endDate: selectedDate || undefined,
    page: currentPage,
    limit: 10,
  });

  const deleteMutation = useDeleteFillingBatch();

  const apiBatches = batchesData?.data?.items || [];
  const responseSummary = batchesData?.data?.summary;
  const responseStatuses = batchesData?.data?.meta?.statuses || [];
  const pagination = batchesData?.data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const mappedBatches = useMemo(
    () =>
      apiBatches.map((batch) => {
        const parsedDate = batch.fillingDate ? new Date(batch.fillingDate) : null;

        return {
          _id: batch._id,
          id: batch._id,
          batchNo: batch.batchNumber,
          tank: batch.sourceTankName || batch.tank?.displayName || "-",
          cylinderType: batch.cylinderTypeName || batch.cylinderType?.typeName || "-",
          quantity: Number(batch.cylinderCount) || 0,
          actualLpgUsedKg: batch.actualLpgUsedKg,
          targetFillWeightKg: batch.targetFillWeightKg,
          operator: batch.operatorName || batch.operator?.fullName || "-",
          date: parsedDate
            ? `${parsedDate.getDate().toString().padStart(2, "0")}/${(parsedDate.getMonth() + 1)
                .toString()
                .padStart(2, "0")}/${parsedDate.getFullYear()}`
            : "",
          receivedDate: parsedDate ? parsedDate.toISOString().slice(0, 10) : "",
          status: batch.batchStatus || "pending",
          statusLabel: batch.batchStatusLabel || batch.batchStatus || "Pending",
        };
      }),
    [apiBatches]
  );

  const filteredBatches = useMemo(() => {
    return mappedBatches.filter((batch) => {
      const matchesQuery = `${batch.batchNo} ${batch.tank} ${batch.cylinderType} ${batch.operator}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesStatus = status === "All" || batch.status === status;
      const matchesDate = !selectedDate || batch.receivedDate === selectedDate;
      return matchesQuery && matchesStatus && matchesDate;
    });
  }, [mappedBatches, query, status, selectedDate]);

  const summaryStats = useMemo(() => {
    const totalQuantity = responseSummary?.totalQuantityKg ?? mappedBatches.reduce((sum, item) => sum + (Number(item.actualLpgUsedKg) || 0), 0);
    const completedCount = responseSummary?.completed ?? mappedBatches.filter((item) => item.status === "completed").length;
    const pendingCount = responseSummary?.pending ?? mappedBatches.filter((item) => item.status === "pending").length;

    return {
      totalBatches: responseSummary?.totalBatches ?? (pagination.total || mappedBatches.length),
      totalQuantity,
      completedCount,
      pendingCount,
    };
  }, [mappedBatches, pagination.total, responseSummary]);

  const batchColumns = [
    {
      key: "batchNo",
      label: "Batch #",
      isRowHeader: true,
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <span className="font-bold text-slate-800 text-[13px]">{item.batchNo}</span>
      ),
    },
    {
      key: "tank",
      label: "Source Tank",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4",
    },
    {
      key: "cylinderType",
      label: "Cylinder Type",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
    },
    {
      key: "quantity",
      label: "Qty",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
      renderCell: (item) => `${item.quantity.toLocaleString()} Cyl`,
    },
    {
      key: "actualLpgUsedKg",
      label: "LPG Used",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
      renderCell: (item) => `${item.actualLpgUsedKg?.toLocaleString() || 0} KG`,
    },
    {
      key: "operator",
      label: "Operator",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
    },
    {
      key: "date",
      label: "Date",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
      renderCell: (item) => item.date || "-",
    },
    {
      key: "status",
      label: "Status",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4",
      renderCell: (item) => {
        const statusStyles = {
          completed: "bg-emerald-50 text-emerald-600 border border-emerald-100",
          "in-progress": "bg-blue-50 text-blue-600 border border-blue-100",
          pending: "bg-amber-50 text-amber-600 border border-amber-100",
        };

        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[item.status] || "bg-slate-50 text-slate-600 border border-slate-200"}`}
          >
            {item.statusLabel}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-right pr-6",
      cellClassName: "px-4 py-4 pr-6",
      renderCell: (item) => (
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            aria-label={`View ${item.batchNo}`}
            onClick={() => navigate(`/filling-batches/view/${item._id}`)}
            className="text-[#1a56db] hover:text-blue-800 transition-colors"
          >
            <Eye className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label={`Edit ${item.batchNo}`}
            onClick={() => navigate(`/filling-batches/edit/${item._id}`)}
            className="text-[#008951] hover:text-emerald-800 transition-colors"
          >
            <Edit3 className="h-4 w-4" strokeWidth={2.5} />
          </button>
          {/* <button
            type="button"
            aria-label={`Delete ${item.batchNo}`}
            onClick={() => setDeleteModal({ isOpen: true, item })}
            className="text-rose-600 hover:text-rose-800 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button> */}
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <section>
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
              <span className="font-semibold ">Filling Batches</span>
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
              Filling Batches
            </h1>
            <p className="text-sm text-tertiary">
              Manage automated LPG gas cylinder refilling process batch runs
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/filling-batches/create")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-bg-blue px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#007545]"
          >
            <CirclePlus className="h-4 w-4" strokeWidth={3} /> Create Batch
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-600">Total Batches</p>
            <p className="mt-2 text-2xl font-extrabold text-6th-color">{summaryStats.totalBatches}</p>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-tertiary">
              <span className="h-2 w-2 rounded-full bg-[#2563EB]"></span>
              All batch runs
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-600">Total Quantity</p>
            <p className="mt-2 text-2xl font-extrabold text-5th-color">{summaryStats.totalQuantity.toLocaleString()} KG</p>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-tertiary">
              <span className="h-2 w-2 rounded-full bg-[#10B981]"></span>
              Gas filled this cycle
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-600">Completed</p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900">{summaryStats.completedCount}</p>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-tertiary">
              <span className="h-2 w-2 rounded-full bg-[#4B5563]"></span>
              Finished batches
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-600">Pending</p>
            <p className="mt-2 text-2xl font-extrabold text-orange">{summaryStats.pendingCount}</p>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-tertiary">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              Awaiting action
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full border-2 border-slate-300"></div>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50/50 py-2.5 pl-8 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-500 focus:border-[#008951] focus:ring-1 focus:ring-[#008951]"
                placeholder="Search by batch number, tank, cylinder, or operator..."
              />
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-600 outline-none transition focus:border-[#008951] focus:ring-1 focus:ring-[#008951] sm:w-40 lg:w-44"
                />
              </div>
              <div className="relative">
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-40 lg:w-44"
                >
                  <option value="All">Status: All</option>
                  {responseStatuses.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <svg className="animate-spin h-6 w-6 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-sm text-red-500">Error loading filling batches. Please try again.</div>
            </div>
          ) : (
            <GlobalTable
              columns={batchColumns}
              data={filteredBatches}
              ariaLabel="Filling Batches Table"
              className=""
              rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
              emptyContent="No batches match your search."
              pagination={true}
              rowsPerPage={pagination.limit || 10}
              totalCount={pagination.total}
              page={currentPage}
              onPageChange={(p) => setCurrentPage(p)}
            />
          )}
        </div>

        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, item: null })}
          onConfirm={async () => {
            if (deleteModal.item) {
              try {
                await deleteMutation.mutateAsync(deleteModal.item._id);
                toast.success(`${deleteModal.item.batchNo} deleted successfully`);
                setDeleteModal({ isOpen: false, item: null });
              } catch (err) {
                toast.error("Failed to delete batch. Please try again.");
              }
            }
          }}
          title="Delete Filling Batch"
          message="Are you sure you want to delete this batch? This action cannot be undone."
          itemName={deleteModal.item ? `${deleteModal.item.batchNo} - ${deleteModal.item.tank}` : ""}
          isDeleting={deleteMutation.isPending}
        />
      </section>
    </main>
  );
}

export default FillingBatches;
