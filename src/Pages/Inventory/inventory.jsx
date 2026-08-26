import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Search, Eye, Edit3, ChevronDown } from "lucide-react";
import GlobalTable from "../../utils/GlobalTable";

const initialInventory = [
  { code: "FILLED-CYL-11KG", name: "Filled 11.8KG Domestic", category: "Filled Cylinder", volume: "11.8 KG", current: 185, min: 50, max: 400, status: "In Stock" },
  { code: "FILLED-CYL-22KG", name: "Filled 22.0KG Commercial", category: "Filled Cylinder", volume: "22.0 KG", current: 157, min: 30, max: 250, status: "In Stock" },
  { code: "EMPTY-CYL-11KG", name: "Empty 11.8KG Domestic", category: "Empty Cylinder", volume: "11.8 KG", current: 45, min: 100, max: 500, status: "Low Stock" },
  { code: "EMPTY-CYL-22KG", name: "Empty 22.0KG Commercial", category: "Empty Cylinder", volume: "22.0 KG", current: 92, min: 40, max: 300, status: "In Stock" },
  { code: "VALVE-KIT-11KG", name: "Standard Brass Valves (11KG)", category: "Spare Parts", volume: "N/A", current: 18, min: 30, max: 150, status: "Low Stock" },
  { code: "SEAL-RING-STD", name: "Rubber Seal Rings Standard", category: "Consumables", volume: "N/A", current: 320, min: 100, max: 1000, status: "In Stock" },
  { code: "SAFETY-CAP-UNI", name: "Plastic Safety Caps (Yellow)", category: "Consumables", volume: "N/A", current: 420, min: 150, max: 1200, status: "In Stock" },
  { code: "O-RING-SET", name: "Manifold O-Ring Refill Kit", category: "Spare Parts", volume: "N/A", current: 4, min: 10, max: 50, status: "Low Stock" },
];

function Inventory() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredData = useMemo(() => initialInventory.filter((item) => {
    const matchesQuery = `${item.code} ${item.name}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All" || item.category === category;
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesQuery && matchesCategory && matchesStatus;
  }), [query, category, statusFilter]);

  const columns = [
    {
      key: "code",
      label: "Item Code",
      isRowHeader: true,
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 border-x border-slate-100",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <span className="font-semibold text-slate-800 text-[13px]">{item.code}</span>
      ),
    },
    {
      key: "name",
      label: "Item Name",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 border-x border-slate-100",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <button className="font-semibold text-[#1a56db] hover:underline text-[13px]">
          {item.name}
        </button>
      ),
    },
    {
      key: "category",
      label: "Category",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 border-x border-slate-100",
      cellClassName: "px-4 py-3 text-slate-600 text-sm",
    },
    {
      key: "volume",
      label: "Cyl. Volume",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 border-x border-slate-100",
      cellClassName: "px-4 py-3 text-slate-600 text-sm",
    },
    {
      key: "current",
      label: "Current Qty",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 border-x border-slate-100",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <span className={`text-[13px] font-bold ${item.status === 'Low Stock' ? 'text-amber-600' : 'text-slate-900'}`}>
          {item.current}
        </span>
      ),
    },
    {
      key: "min",
      label: "Min Stock",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 border-x border-slate-100",
      cellClassName: "px-4 py-3 text-slate-600 text-sm",
    },
    {
      key: "max",
      label: "Max Stock",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 border-x border-slate-100",
      cellClassName: "px-4 py-3 text-slate-600 text-sm",
    },
    {
      key: "status",
      label: "Status",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 border-x border-slate-100",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            item.status === "In Stock"
              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
              : "bg-amber-100 text-amber-800 border border-amber-200"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 border-x border-slate-100",
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
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-xs font-semibold text-slate-600">Filled 11KG Cylinders</h3>
          <p className="mt-2 text-2xl font-bold text-emerald-600">185 Units</p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            Normal operational levels
          </div>
        </div>
        
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-xs font-semibold text-slate-600">Filled 22KG Cylinders</h3>
          <p className="mt-2 text-2xl font-bold text-emerald-600">157 Units</p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            Ready for commercial delivery
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-600">Empty 11KG Cylinders</h3>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">Low Stock</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-500">45 Units</p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-amber-500"></span>
            Requires bulk collection run
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-xs font-semibold text-slate-600">Empty 22KG Cylinders</h3>
          <p className="mt-2 text-2xl font-bold text-slate-900">92 Units</p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            Sufficient for next 2 batches
          </div>
        </div>
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
              <option value="All">Category: All</option>
              <option value="Filled Cylinder">Category: Filled Cylinder</option>
              <option value="Empty Cylinder">Category: Empty Cylinder</option>
              <option value="Spare Parts">Category: Spare Parts</option>
              <option value="Consumables">Category: Consumables</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-48"
            >
              <option value="All">Stock Status: All</option>
              <option value="In Stock">Stock Status: In Stock</option>
              <option value="Low Stock">Stock Status: Low Stock</option>
              <option value="Out of Stock">Stock Status: Out of Stock</option>
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
          rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
          emptyContent="No inventory items match your search."
          pagination={true}
          rowsPerPage={5}
        />
      </div>
    </main>
  );
}

export default Inventory;
