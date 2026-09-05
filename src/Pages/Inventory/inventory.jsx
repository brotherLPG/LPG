import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Search, Eye, Edit3, ChevronDown, Trash2 } from "lucide-react";
import GlobalTable from "../../utils/GlobalTable";
import { useInventoryItems, useDeleteInventoryItem } from "../../queries/inventory/inventory.queries";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useToast } from "../../utils/GlobalToast";


function Inventory() {
  const navigate = useNavigate();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });

  const { data: inventoryData, isLoading, error } = useInventoryItems({ search: query, page: 1, limit: 100 });
  const deleteMutation = useDeleteInventoryItem();

  const filteredData = useMemo(() => {
    const items = inventoryData?.data?.items || [];
    return items.filter((item) => {
      const matchesQuery = `${item.itemCode} ${item.itemName}`.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All" || item.categoryLabel === category;
      const matchesStatus = statusFilter === "All" || item.stockStatusLabel === statusFilter;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [inventoryData, query, category, statusFilter]);

  const handleDeleteClick = (item) => {
    setDeleteModal({ isOpen: true, item });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.item) {
      const id = deleteModal.item._id;
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success(`Inventory item ${deleteModal.item.itemName} has been deleted successfully`);
          setDeleteModal({ isOpen: false, item: null });
        },
        onError: () => {
          toast.error("Failed to delete inventory item. Please try again.");
        }
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, item: null });
  };

  const categories = inventoryData?.data?.meta?.categories || [];
  const stockStatuses = inventoryData?.data?.meta?.stockStatuses || [];
  const cylinderCards = inventoryData?.data?.summary?.cylinderCards || [];

  const columns = [
    {
      key: "code",
      label: "Item Code",
      isRowHeader: true,
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 border-x border-slate-100 whitespace-nowrap",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <span className="font-semibold text-slate-800 text-[13px] whitespace-nowrap text-nowrap">
          {item.itemCode}
        </span>
      ),
    },
    {
      key: "name",
      label: "Item Name",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 border-x border-slate-100 whitespace-nowrap",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <button className="font-semibold text-[#1a56db] hover:underline text-[13px] whitespace-nowrap">
          {item.itemName}
        </button>
      ),
    },
    {
      key: "category",
      label: "Category",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 border-x border-slate-100 whitespace-nowrap text-nowrap",
      cellClassName:
        "px-4 py-3 text-slate-600 text-sm whitespace-nowrap text-nowrap",
      renderCell: (item) => item.categoryLabel,
    },
    {
      key: "volume",
      label: "Cyl. Volume",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 border-x border-slate-100 whitespace-nowrap",
      cellClassName:
        "px-4 py-3 text-slate-600 text-sm whitespace-nowrap text-nowrap",
      renderCell: (item) => item.cylinderVolume,
    },
    {
      key: "current",
      label: "Current Qty",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 border-x border-slate-100  whitespace-nowrap text-nowrap",
      cellClassName: "px-4 py-3 whitespace-nowrap text-nowrap",
      renderCell: (item) => (
        <span
          className={`text-[13px] font-bold ${item.stockStatusLabel === "Low Stock" ? "text-amber-600" : "text-slate-900"}`}
        >
          {item.currentQuantity}
        </span>
      ),
    },
    {
      key: "min",
      label: "Min Stock",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 border-x border-slate-100  whitespace-nowrap text-nowrap",
      cellClassName:
        "px-4 py-3 text-slate-600 text-sm whitespace-nowrap text-nowrap  whitespace-nowrap text-nowrap",
      renderCell: (item) => item.minimumStockLevel,
    },
    {
      key: "max",
      label: "Max Stock",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 border-x border-slate-100  whitespace-nowrap text-nowrap",
      cellClassName:
        "px-4 py-3 text-slate-600 text-sm whitespace-nowrap text-nowrap",
      renderCell: (item) => item.maximumStockLevel,
    },
    {
      key: "status",
      label: "Status",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 border-x border-slate-100 ",
      cellClassName: "px-4 py-3 whitespace-nowrap text-nowrap",
      renderCell: (item) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            item.stockStatusLabel === "In Stock"
              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
              : item.stockStatusLabel === "Low Stock"
                ? "bg-amber-100 text-amber-800 border border-amber-200"
                : "bg-red-50 text-red-600 border border-red-100"
          }`}
        >
          {item.stockStatusLabel}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 border-x border-slate-100",
      cellClassName: "px-4 py-3 whitespace-nowrap text-nowrap",
      renderCell: (item) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(`/inventory/view/${item._id}`)}
            aria-label={`View ${item.itemName}`}
            className="flex items-center gap-1.5 rounded-full bg-blue-50/70 border border-blue-200/60 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" /> View
          </button>
          <button
            type="button"
            onClick={() => navigate(`/inventory/edit/${item._id}`)}
            aria-label={`Edit ${item.itemName}`}
            className="flex items-center gap-1.5 rounded-full bg-emerald-50/70 border border-emerald-200/60 px-3 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-100 transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" /> Edit
          </button>
          {/* <button
            type="button"
            onClick={() => handleDeleteClick(item)}
            aria-label={`Delete ${item.itemName}`}
            className="flex items-center gap-1.5 rounded-full bg-rose-50/70 border border-rose-200/60 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button> */}
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs mb-2">
            <span
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
            >
              Dashboard
            </span>{" "}
            <span className="px-1 text-slate-400">/</span>{" "}
            <span className="font-semibold text-slate-700">Inventory</span>
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Inventory Management
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Track cylinder stock levels, spare parts, and system accessories
          </p>
        </div>
        <button
          onClick={() => navigate("/inventory/add")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#008951] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#007545]"
        >
          <PlusCircle className="h-4 w-4" /> Add Inventory Item
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cylinderCards.map((card) => (
          <div
            key={card.itemId}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-600">
                {card.title}
              </h3>
              {card.stockStatusLabel === "Low Stock" && (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Low Stock
                </span>
              )}
              {card.stockStatusLabel === "Out of Stock" && (
                <span className="bg-red-100 text-red-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Out of Stock
                </span>
              )}
            </div>
            <p
              className={`mt-2 text-2xl font-bold ${
                card.stockStatusLabel === "In Stock"
                  ? "text-emerald-600"
                  : card.stockStatusLabel === "Low Stock"
                    ? "text-amber-500"
                    : "text-red-500"
              }`}
            >
              {card.currentQuantity} Units
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
              <span
                className={`h-2 w-2 rounded-full ${
                  card.stockStatusLabel === "In Stock"
                    ? "bg-emerald-500"
                    : card.stockStatusLabel === "Low Stock"
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
              ></span>
              {card.hint}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <label className="relative flex-1 w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-md border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-500 focus:border-[#008951] focus:ring-1 focus:ring-[#008951]"
            placeholder="Search by item code or description..."
          />
        </label>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-48"
            >
              <option value="All">All Category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.label}>
                  {cat.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-48"
            >
              <option value="All">All Status</option>
              {stockStatuses.map((status) => (
                <option key={status.value} value={status.label}>
                  {status.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <GlobalTable
          columns={columns}
          data={filteredData}
          ariaLabel="Inventory Table"
          className=""
          rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors whitespace-nowrap text-nowrap"
          emptyContent="No inventory items match your search."
          pagination={true}
          rowsPerPage={10}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Inventory Item"
        message="Are you sure you want to delete this inventory item? This action cannot be undone and will permanently remove the item from the system."
        itemName={deleteModal.item ? `${deleteModal.item.itemCode} - ${deleteModal.item.itemName}` : ""}
      />
    </main>
  );
}

export default Inventory;
