import { Plus, Eye, Edit3, Trash2, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalTable from "../../utils/GlobalTable";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import {
  useExpenses,
  useDeleteExpense,
} from "../../queries/expenses/expenses.queries";
import { useToast } from "../../utils/GlobalToast";

function Expenses() {
  const navigate = useNavigate();
  const toast = useToast();

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });

  const { data: expensesResponse, isLoading, error } = useExpenses({
    search: query || undefined,
    page: currentPage,
    limit: 10,
  });

  const deleteMutation = useDeleteExpense();

  const expenses = expensesResponse?.data?.items || [];
  const pagination = expensesResponse?.data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };
  const summary = expensesResponse?.data?.summary || {};
  const meta = expensesResponse?.data?.meta || {};

  const categories = meta.categories || [];
  const statuses = meta.statuses || [];

  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const matchesCategory = categoryFilter === "All" || exp.categoryName === categoryFilter;
      const matchesStatus = statusFilter === "All" || exp.expenseStatus === statusFilter;
      return matchesCategory && matchesStatus;
    });
  }, [expenses, categoryFilter, statusFilter]);

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "paid":
        return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      case "pending":
        return "bg-amber-50 text-amber-600 border border-amber-100";
      default:
        return "bg-slate-50 text-slate-600 border border-slate-200";
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.item) return;
    try {
      await deleteMutation.mutateAsync(deleteModal.item._id);
      toast.success(`Expense ${deleteModal.item.expenseNumber} deleted successfully`);
      setDeleteModal({ isOpen: false, item: null });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete expense. Please try again.");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
  };

  const expenseColumns = [
    {
      key: "expenseNumber",
      label: "Expense #",
      isRowHeader: true,
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-nowrap whitespace-nowrap",
      cellClassName: "px-4 py-4 text-nowrap whitespace-nowrap",
      renderCell: (item) => (
        <span className="font-bold text-slate-800 text-[13px]">{item.expenseNumber}</span>
      ),
    },
    {
      key: "expenseDate",
      label: "Date",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-nowrap whitespace-nowrap",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium text-nowrap whitespace-nowrap",
      renderCell: (item) => formatDate(item.expenseDate),
    },
    {
      key: "categoryName",
      label: "Category",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-nowrap whitespace-nowrap",
      cellClassName: "px-4 py-4 text-nowrap whitespace-nowrap",
      renderCell: (item) => (
        <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
          {item.categoryName || "-"}
        </span>
      ),
    },
    {
      key: "expenseDescription",
      label: "Description",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-nowrap whitespace-nowrap",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium text-nowrap whitespace-nowrap",
      renderCell: (item) => (
        <span className="truncate max-w-48 block" title={item.expenseDescription}>
          {item.expenseDescription || "-"}
        </span>
      ),
    },
    {
      key: "expenseAmount",
      label: "Amount (Rs.)",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-nowrap whitespace-nowrap",
      cellClassName: "px-4 py-4 text-nowrap whitespace-nowrap",
      renderCell: (item) => (
        <span className="text-slate-900 font-bold text-[13px]">
          Rs. {(item.expenseAmount || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "paymentMethodLabel",
      label: "Method",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-nowrap whitespace-nowrap",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium text-nowrap whitespace-nowrap",
      renderCell: (item) => item.paymentMethodLabel || "-",
    },
    {
      key: "paidFromAccountName",
      label: "Account",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-nowrap whitespace-nowrap",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium text-nowrap whitespace-nowrap",
      renderCell: (item) => (
        <span className="truncate max-w-40 block" title={item.paidFromAccountName}>
          {item.paidFromAccountName || "-"}
        </span>
      ),
    },
    {
      key: "expenseStatus",
      label: "Status",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-nowrap whitespace-nowrap",
      cellClassName: "px-4 py-4 text-nowrap whitespace-nowrap",
      renderCell: (item) => (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeStyle(item.expenseStatus)}`}>
          {item.expenseStatusLabel || item.expenseStatus || "-"}
        </span>
      ),
    },
    {
      key: "approvedByName",
      label: "Approved By",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-nowrap whitespace-nowrap",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium text-nowrap whitespace-nowrap",
      renderCell: (item) => (
        <span className={!item.approvedByName ? "text-slate-400 italic" : ""}>
          {item.approvedByName || "—"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-nowrap whitespace-nowrap pr-6",
      cellClassName: "px-4 py-4 pr-6 text-nowrap whitespace-nowrap",
      renderCell: (item) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`View ${item.expenseNumber}`}
            onClick={() => navigate(`/expenses/view/${item._id}`)}
            className="flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" strokeWidth={2.5} /> View
          </button>
          <button
            type="button"
            aria-label={`Edit ${item.expenseNumber}`}
            onClick={() => navigate(`/expenses/edit/${item._id}`)}
            className="flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-100 transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" strokeWidth={2.5} /> Edit
          </button>
          <button
            type="button"
            aria-label={`Delete ${item.expenseNumber}`}
            onClick={() => setDeleteModal({ isOpen: true, item })}
            className="flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} /> Delete
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
                className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
              >
                Dashboard
              </span>{" "}
              <span className="px-1 text-slate-400">/</span>{" "}
              <span className="font-semibold text-slate-700">Expenses</span>
            </p>
            <h1 className="mt-2 text-[28px] font-bold tracking-tight text-slate-900">
              Expenses
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track and manage plant operational expenses and payments
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/expenses/add")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#008951] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#007545]"
          >
            <Plus className="h-4 w-4" strokeWidth={3} /> Add Expense
          </button>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-tertiary">This Month Total</p>
              <p className="mt-2 text-2xl font-extrabold text-accent-blue">
                Rs. {(summary.thisMonthTotalAmount || 0).toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-tertiary">
                {summary.thisMonthCount || 0} expenses
              </p>
            </div>
          </div>

          {(summary.categoryCards || []).slice(0, 3).map((card, idx) => {
            const colors = [
              "text-orange",
              "text-error",
              "text-slate-900",
            ];
            return (
              <div key={idx} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div>
                  <p className="text-sm font-semibold text-tertiary">{card.categoryName}</p>
                  <p className={`mt-2 text-2xl font-extrabold ${colors[idx] || "text-slate-900"}`}>
                    Rs. {(card.amount || 0).toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-tertiary">{card.count || 0} expenses</p>
                </div>
              </div>
            );
          })}

          {/* Fallback cards if no categoryCards from API */}
          {(summary.categoryCards || []).map((category) => (
            <>
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div>
                  <p className="text-sm font-semibold text-tertiary">Total Records</p>
                  <p className="mt-2 text-2xl font-extrabold text-orange">
                    {pagination.total || 0}
                  </p>
                  <p className="mt-1 text-xs text-tertiary">All time expenses</p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div>
                  <p className="text-sm font-semibold text-tertiary">Paid</p>
                  <p className="mt-2 text-2xl font-extrabold text-[#008951]">
                    {expenses.filter(e => e.expenseStatus === "paid").length}
                  </p>
                  <p className="mt-1 text-xs text-tertiary">Paid expenses</p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div>
                  <p className="text-sm font-semibold text-tertiary">Pending</p>
                  <p className="mt-2 text-2xl font-extrabold text-amber-500">
                    {expenses.filter(e => e.expenseStatus === "pending").length}
                  </p>
                  <p className="mt-1 text-xs text-tertiary">Pending expenses</p>
                </div>
              </div>
            </>
          ))}
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
                placeholder="Search by expense number or description..."
              />
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(event) => {
                    setCategoryFilter(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-48 lg:w-56"
                >
                  <option value="All">Category: All</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.categoryName}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-40 lg:w-44"
                >
                  <option value="All">Status: All</option>
                  {statuses.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
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
            <div className="p-8 text-center text-sm text-slate-500">Loading expenses...</div>
          ) : error ? (
            <div className="p-8 text-center text-sm text-red-500">
              Error loading expenses. Please try again.
            </div>
          ) : (
            <GlobalTable
              columns={expenseColumns}
              data={filteredExpenses}
              ariaLabel="Expenses Table"
              className=""
              rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
              emptyContent="No expenses match your search."
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
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        itemName={deleteModal.item ? `${deleteModal.item.expenseNumber} – ${deleteModal.item.expenseDescription || ""}` : ""}
        isDeleting={deleteMutation.isPending}
      />
    </main>
  );
}

export default Expenses;
