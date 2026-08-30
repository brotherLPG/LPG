import { PlusCircle, Eye, Edit3, Trash2, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalTable from "../../utils/GlobalTable";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useToast } from "../../utils/GlobalToast";
import { useSuppliers, useDeleteSupplier } from "../../queries/suppliers/suppliers.queries";

// Data comes from API via react-query

function Suppliers() {
  const navigate = useNavigate();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [paymentTerm, setPaymentTerm] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [suppliersState, setSuppliersState] = useState([]);

  const { data: suppliersData, isLoading, error } = useSuppliers({
    search: query,
    isActive: status === "All" ? undefined : status === "Active",
    page: currentPage,
    limit: 10,
  });

  const deleteMutation = useDeleteSupplier();

  const suppliers = suppliersData?.data?.items || [];
  const pagination = suppliersData?.data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const mappedSuppliers = useMemo(() => {
    return suppliers.map((s) => ({
      code: s.supplierCode,
      name: s.supplierName,
      contact: s.contactPersonName,
      phone: s.phoneNumber,
      email: s.emailAddress,
      address: s.businessAddress,
      taxNumber: s.taxRegistrationNumber,
      limit: null,
      paymentTermDays: s.paymentTermDays,
      outstanding: s.openingBalanceAmount,
      status: s.isActive ? "Active" : "Inactive",
      _id: s._id,
    }));
  }, [suppliers]);

  const handleDeleteClick = (item) => {
    setDeleteModal({ isOpen: true, item });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.item) {
      const id = deleteModal.item._id;
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success(`Supplier ${deleteModal.item.name} has been deleted successfully`);
          setDeleteModal({ isOpen: false, item: null });
        },
        onError: () => {
          toast.error("Failed to delete supplier. Please try again.");
        }
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, item: null });
  };

  // Column definitions for suppliers table
  const supplierColumns = [
    {
      key: "code",
      label: "Supplier Code",
      isRowHeader: true,
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <span className="font-bold text-slate-800 text-[13px]">{item.code}</span>
      ),
    },
    {
      key: "name",
      label: "Supplier Name",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <button className="font-semibold text-[#1a56db] hover:underline text-[13px]">
          {item.name}
        </button>
      ),
    },
    {
      key: "contact",
      label: "Contact Person",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3 text-slate-600 text-[13px] font-medium",
    },
    {
      key: "phone",
      label: "Phone",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3 text-slate-600 text-[13px]",
    },
    {
      key: "paymentTermDays",
      label: "Payment Terms",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3 text-slate-600 text-[13px]",
    },
    {
      key: "outstanding",
      label: "Outstanding Payable",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <span className="text-slate-900 font-bold text-[13px]">{item.outstanding?.toLocaleString?.() || item.outstanding}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            item.status === "Active"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-rose-50 text-rose-600"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`View ${item.name}`}
            className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" /> View
          </button>
          <button
            type="button"
            onClick={() => navigate(`/suppliers/edit/${item._id}`)}
            aria-label={`Edit ${item.name}`}
            className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-100 transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" /> Edit
          </button>
          <button
            type="button"
            onClick={() => handleDeleteClick(item)}
            aria-label={`Delete ${item.name}`}
            className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
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
              <span className="font-semibold text-slate-700">Suppliers</span>
            </p>
            <h1 className="mt-2 text-[28px] font-bold tracking-tight text-slate-900">
              Suppliers
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage LPG suppliers and purchase accounts
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/suppliers/add")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#008951] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#007545]"
          >
            <PlusCircle className="h-4 w-4" /> Add Supplier
          </button>
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
                placeholder="Search by supplier code, company, or contact person..."
              />
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-40 lg:w-44"
                >
                  <option value="All">Status: All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
              {/* <div className="relative">
                <select
                  value={paymentTerm}
                  onChange={(event) => setPaymentTerm(event.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-48 lg:w-56"
                >
                  <option value="All">Payment Terms: All</option>
                  <option value="Net 15">Payment Terms: Net 15</option>
                  <option value="Net 30">Payment Terms: Net 30</option>
                  <option value="Net 45">Payment Terms: Net 45</option>
                  <option value="Cash On Delivery">
                    Payment Terms: Cash On Delivery
                  </option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div> */}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <svg
                className="animate-spin h-6 w-6 text-slate-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-sm text-red-500">
                Error loading suppliers. Please try again.
              </div>
            </div>
          ) : (
            <GlobalTable
              columns={supplierColumns}
              data={mappedSuppliers}
              ariaLabel="Suppliers Table"
              className=""
              rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
              emptyContent="No suppliers match your search."
              pagination={true}
              rowsPerPage={pagination.limit || 10}
              totalCount={pagination.total}
              page={currentPage}
              onPageChange={(p) => setCurrentPage(p)}
            />
          )}
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Supplier"
        message="Are you sure you want to delete this supplier? This action cannot be undone and will permanently remove the supplier record from the system."
        itemName={
          deleteModal.item
            ? `${deleteModal.item.code} - ${deleteModal.item.name}`
            : ""
        }
        isDeleting={deleteMutation.isPending}
      />
    </main>
  );
}

export default Suppliers;
