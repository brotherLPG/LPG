import { CirclePlus, Eye, Edit3, ChevronDown } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlobalTable from "../../utils/GlobalTable";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useToast } from "../../utils/GlobalToast";
import { useLpgReceipts, useDeleteLpgReceipt } from "../../queries/lpgReceipts/lpgReceipts.queries";
import { useSuppliers } from "../../queries/suppliers/suppliers.queries";


const initialReceipts = [];

function LpgReceipts() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [supplier, setSupplier] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });

  const toast = useToast();

  const { data: receiptsData, isLoading, error } = useLpgReceipts({
    search: query,
    page: currentPage,
    limit: 10,
  });

  const deleteMutation = useDeleteLpgReceipt();

  const apiReceipts = receiptsData?.data?.items || [];
  const pagination = receiptsData?.data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };
  const { data: suppliersData } = useSuppliers({ search: "", isActive: undefined, page: 1, limit: 100 });
  const suppliersList = suppliersData?.data?.items || [];

  useEffect(() => {
    setSupplierOptions([
      { label: 'All', value: 'All' },
      ...suppliersList.map((s) => ({ label: s.supplierName || s.supplierCode || s.name, value: s.supplierName || s.supplierCode || s.name }))
    ]);
  }, [suppliersList]);

  const mappedReceipts = useMemo(() => apiReceipts.map((r) => {
    const receivedDate = r.receivedAt ? new Date(r.receivedAt) : null;

    return {
      _id: r._id,
      receiptNo: r.receiptNumber,
      supplier: r.supplierId?.supplierName || "",
      date: receivedDate
        ? `${receivedDate.getDate().toString().padStart(2, '0')}/${(receivedDate.getMonth() + 1).toString().padStart(2, '0')}/${receivedDate.getFullYear()}`
        : "",
      receivedDate: receivedDate ? receivedDate.toISOString().slice(0, 10) : "",
      truckReg: r.truckRegistrationNumber,
      quantity: r.receivedQuantityKg,
      rate: r.purchaseRatePerKg,
      totalCost: r.totalPurchaseAmount,
      status: r.status || 'Confirmed',
    };
  }), [apiReceipts]);

  const filteredReceipts = useMemo(() => mappedReceipts.filter((receipt) => {
    const matchesQuery = `${receipt.receiptNo} ${receipt.supplier} ${receipt.truckReg}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "All" || receipt.status === status;
    const matchesSupplier = supplier === "All" || receipt.supplier === supplier;
    const matchesDate = !selectedDate || receipt.receivedDate === selectedDate;
    return matchesQuery && matchesStatus && matchesSupplier && matchesDate;
  }), [query, status, supplier, selectedDate, mappedReceipts]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const source = mappedReceipts.length ? mappedReceipts : initialReceipts;
    const totalQuantity = source.reduce((sum, receipt) => sum + (receipt.quantity || 0), 0);
    const totalCost = source.reduce((sum, receipt) => sum + (receipt.totalCost || 0), 0);
    const confirmedCount = source.filter(r => r.status === "Confirmed").length;
    const pendingCount = source.filter(r => r.status === "Pending").length;
    const draftCount = source.filter(r => r.status === "Draft").length;

    return {
      thisMonthReceipts: source.length,
      totalQuantity,
      totalCost,
      pendingReceipts: pendingCount + draftCount,
    };
  }, []);

  const receiptColumns = [
    {
      key: "receiptNo",
      label: "Receipt #",
      isRowHeader: true,
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <span className="font-bold text-slate-800 text-[13px]">{item.receiptNo}</span>
      ),
    },
    {
      key: "supplier",
      label: "Supplier Name",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <button
          type="button"
          onClick={() => navigate(`/lpg-receipts/view/${item._id}`)}
          className="font-semibold text-[#1a56db] hover:underline text-[13px]"
        >
          {item.supplier}
        </button>
      ),
    },
    {
      key: "date",
      label: "Date Received",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
      renderCell: (item) => item.date || "-",
    },
    {
      key: "truckReg",
      label: "Truck Reg #",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
    },
    {
      key: "quantity",
      label: "Quantity (KG)",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
      renderCell: (item) => item.quantity.toLocaleString(),
    },
    {
      key: "rate",
      label: "Rate/KG (Rs.)",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
    },
    {
      key: "totalCost",
      label: "Total Cost (Rs.)",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <span className="text-slate-900 font-bold text-[13px]">Rs. {item.totalCost.toLocaleString()}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4",
      renderCell: (item) => {
        const statusStyles = {
          Confirmed: "bg-emerald-50 text-emerald-600 border border-emerald-100",
          Pending: "bg-amber-50 text-amber-600 border border-amber-100",
          Draft: "bg-slate-50 text-slate-600 border border-slate-200",
        };
        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[item.status] || statusStyles.Draft}`}
          >
            {item.status}
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
            aria-label={`View ${item.receiptNo}`}
            onClick={() => navigate(`/lpg-receipts/view/${item._id}`)}
            className="text-[#1a56db] hover:text-blue-800 transition-colors"
          >
            <Eye className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label={`Edit ${item.receiptNo}`}
            onClick={() => navigate(`/lpg-receipts/edit/${item._id}`)}
            className="text-[#008951] hover:text-emerald-800 transition-colors"
          >
            <Edit3 className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label={`Delete ${item.receiptNo}`}
            onClick={() => setDeleteModal({ isOpen: true, item })}
            className="text-rose-600 hover:text-rose-800 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
        </div>
      ),
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
              <span className="font-semibold ">LPG Receipts</span>
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
              LPG Receipts
            </h1>
            <p className="text-sm text-tertiary">
              Track incoming LPG tanker deliveries and receipt records
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/lpg-receipts/receive")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-bg-blue px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#007545]"
          >
            <CirclePlus className="h-4 w-4" strokeWidth={3} /> Receive LPG
          </button>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">
                  This Month Receipts
                </p>
                <p className="mt-2 text-2xl font-extrabold text-6th-color">
                  {summaryStats.thisMonthReceipts} Shipments
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-tertiary my-auto">
                  <span className="h-2 w-2 rounded-full bg-[#2563EB]"></span>
                  Total deliveries received
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">
                  Total Quantity Received
                </p>
                <p className="mt-2 text-2xl font-extrabold text-5th-color">
                  {summaryStats.totalQuantity.toLocaleString()} KG
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-tertiary my-auto">
                  <span className="h-2 w-2 rounded-full bg-[#10B981]"></span>
                  May 2025 volume
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">
                  Total Purchase Cost
                </p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">
                  Rs. {summaryStats.totalCost.toLocaleString()}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-tertiary my-auto">
                  <span className="h-2 w-2 rounded-full bg-[#4B5563]"></span>
                  Monthly spend
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">
                  Pending Receipts
                </p>
                <p className="mt-2 text-2xl font-extrabold text-orange">
                  {summaryStats.pendingReceipts}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-tertiary my-auto">
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                  Awaiting confirmation
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
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50/50 py-2.5 pl-8 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-500 focus:border-[#008951] focus:ring-1 focus:ring-[#008951]"
                placeholder="Search by receipt number, supplier, or truck..."
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
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Draft">Draft</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={supplier}
                  onChange={(event) => setSupplier(event.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-48 lg:w-56"
                >
                  {supplierOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
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
            <div className="flex items-center justify-center p-8">
              <svg className="animate-spin h-6 w-6 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-sm text-red-500">Error loading receipts. Please try again.</div>
            </div>
          ) : (
            <GlobalTable
              columns={receiptColumns}
              data={filteredReceipts}
              ariaLabel="LPG Receipts Table"
              className=""
              rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
              emptyContent="No receipts match your search."
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
                toast.success(`${deleteModal.item.receiptNo} deleted successfully`);
                setDeleteModal({ isOpen: false, item: null });
              } catch (err) {
                toast.error('Failed to delete receipt. Please try again.');
              }
            }
          }}
          title="Delete LPG Receipt"
          message="Are you sure you want to delete this LPG receipt? This action cannot be undone."
          itemName={deleteModal.item ? `${deleteModal.item.receiptNo} - ${deleteModal.item.supplier}` : ""}
          isDeleting={deleteMutation.isPending}
        />
      </section>
    </main>
  );
}

export default LpgReceipts;
