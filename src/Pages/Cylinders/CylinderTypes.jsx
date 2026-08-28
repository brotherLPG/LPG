import { PlusCircle, Eye, Edit3, Trash2, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalTable from "../../utils/GlobalTable";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useToast } from "../../utils/GlobalToast";

const initialCylinderTypes = [
  { code: "CYL-001", name: "Commercial LPG 11KG", capacity: "11.0 KG", tare: "8.5 KG", price: "Rs. 2,850", status: "Active" },
  { code: "CYL-002", name: "Commercial LPG 22KG", capacity: "22.0 KG", tare: "15.0 KG", price: "Rs. 5,500", status: "Active" },
  { code: "CYL-003", name: "Industrial LPG 45KG", capacity: "45.0 KG", tare: "33.0 KG", price: "Rs. 11,200", status: "Active" },
  { code: "CYL-004", name: "Domestic LPG 5KG", capacity: "5.0 KG", tare: "4.2 KG", price: "Rs. 1,450", status: "Active" },
  { code: "CYL-005", name: "Commercial LPG 11KG (Old)", capacity: "11.0 KG", tare: "9.0 KG", price: "Rs. 2,650", status: "Inactive" },
  { code: "CYL-006", name: "Industrial LPG 50KG", capacity: "50.0 KG", tare: "38.0 KG", price: "Rs. 12,500", status: "Active" },
  { code: "CYL-007", name: "Domestic LPG 3KG", capacity: "3.0 KG", tare: "2.8 KG", price: "Rs. 950", status: "Active" },
];

function CylinderTypes() {
  const navigate = useNavigate();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [capacity, setCapacity] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [cylinderTypes, setCylinderTypes] = useState(initialCylinderTypes);

  const filteredCylinders = useMemo(() => cylinderTypes.filter((cyl) => {
    const matchesQuery = `${cyl.code} ${cyl.name}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "All" || cyl.status === status;
    const matchesCapacity = capacity === "All" || cyl.capacity === capacity;
    return matchesQuery && matchesStatus && matchesCapacity;
  }), [query, status, capacity, cylinderTypes]);

  const handleDeleteClick = (item) => {
    setDeleteModal({ isOpen: true, item });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.item) {
      setCylinderTypes(cylinderTypes.filter(c => c.code !== deleteModal.item.code));
      toast.success(`Cylinder type ${deleteModal.item.name} has been deleted successfully`);
      setDeleteModal({ isOpen: false, item: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, item: null });
  };

  // Column definitions for cylinder types table
  const cylinderTypeColumns = [
    {
      key: "code",
      label: "Type Code",
      isRowHeader: true,
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <span className="font-bold text-slate-800 text-[13px]">{item.code}</span>
      ),
    },
    {
      key: "name",
      label: "Type Name",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <button className="font-semibold text-[#1a56db] hover:underline text-[13px]">
          {item.name}
        </button>
      ),
    },
    {
      key: "capacity",
      label: "Capacity (KG)",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3 text-slate-600 text-[13px] font-normal",
    },
    {
      key: "tare",
      label: "Tare Weight (KG)",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3 text-slate-600 text-[13px] font-normal",
    },
    {
      key: "price",
      label: "Selling Price",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <span className="text-slate-900 font-bold text-[13px]">{item.price}</span>
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
              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
              : "bg-slate-100 text-slate-600 border border-slate-200"
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
            className="flex items-center gap-1.5 rounded-full bg-blue-50/70 border border-blue-200/60 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" /> View
          </button>
          <button
            type="button"
            aria-label={`Edit ${item.name}`}
            className="flex items-center gap-1.5 rounded-full bg-emerald-50/70 border border-emerald-200/60 px-3 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-100 transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" /> Edit
          </button>
          <button
            type="button"
            onClick={() => handleDeleteClick(item)}
            aria-label={`Delete ${item.name}`}
            className="flex items-center gap-1.5 rounded-full bg-rose-50/70 border border-rose-200/60 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
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
              <span className="font-semibold text-slate-700">
                Cylinder Types
              </span>
            </p>
            <h1 className="mt-2 text-[28px] font-bold tracking-tight text-slate-900">
              Cylinder Types
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage cylinder specifications and pricing
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/cylinders/add-type")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#008951] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#007545]"
          >
            <PlusCircle className="h-4 w-4" /> Add Cylinder Type
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
                placeholder="Search by type code or name..."
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
                  <option value="Active">Status: Active</option>
                  <option value="Inactive">Status: Inactive</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={capacity}
                  onChange={(event) => setCapacity(event.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-48 lg:w-56"
                >
                  <option value="All">Capacity: All</option>
                  <option value="3.0 KG">3.0 KG</option>
                  <option value="5.0 KG">5.0 KG</option>
                  <option value="11.0 KG">11.0 KG</option>
                  <option value="22.0 KG">22.0 KG</option>
                  <option value="45.0 KG">45.0 KG</option>
                  <option value="50.0 KG">50.0 KG</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <GlobalTable
            columns={cylinderTypeColumns}
            data={filteredCylinders}
            ariaLabel="Cylinder Types Table"
            className=""
            rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
            emptyContent="No cylinder types match your search."
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
        title="Delete Cylinder Type"
        message="Are you sure you want to delete this cylinder type? This action cannot be undone and will permanently remove the cylinder type from the system."
        itemName={deleteModal.item ? `${deleteModal.item.code} - ${deleteModal.item.name}` : ""}
      />
    </main>
  );
}

export default CylinderTypes;
