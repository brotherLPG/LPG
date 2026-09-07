import { CirclePlus, Eye, Edit3, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalTable from "../../utils/GlobalTable";

const mockAssets = [
  {
    _id: "1",
    assetCode: "FA-001",
    category: "Plant Equipment",
    purchaseDate: "2024-01-15",
    purchaseCost: 2500000,
    depreciationMethod: "Straight Line",
    bookValue: 2250000,
    location: "Zone-A",
    status: "Active",
  },
  {
    _id: "2",
    assetCode: "FA-002",
    category: "Vehicles",
    purchaseDate: "2024-02-20",
    purchaseCost: 1800000,
    depreciationMethod: "Reducing Balance",
    bookValue: 1620000,
    location: "Zone-B",
    status: "Active",
  },
  {
    _id: "3",
    assetCode: "FA-003",
    category: "Office Equipment",
    purchaseDate: "2024-03-10",
    purchaseCost: 500000,
    depreciationMethod: "Straight Line",
    bookValue: 475000,
    location: "Zone-A",
    status: "Active",
  },
  {
    _id: "4",
    assetCode: "FA-004",
    category: "Plant Equipment",
    purchaseDate: "2024-04-05",
    purchaseCost: 3200000,
    depreciationMethod: "Straight Line",
    bookValue: 3040000,
    location: "Zone-C",
    status: "Under Maintenance",
  },
  {
    _id: "5",
    assetCode: "FA-005",
    category: "Furniture",
    purchaseDate: "2024-05-12",
    purchaseCost: 750000,
    depreciationMethod: "Straight Line",
    bookValue: 712500,
    location: "Zone-A",
    status: "Active",
  },
  {
    _id: "6",
    assetCode: "FA-006",
    category: "Vehicles",
    purchaseDate: "2024-06-18",
    purchaseCost: 2100000,
    depreciationMethod: "Reducing Balance",
    bookValue: 1995000,
    location: "Zone-B",
    status: "Active",
  },
  {
    _id: "7",
    assetCode: "FA-007",
    category: "Plant Equipment",
    purchaseDate: "2024-07-22",
    purchaseCost: 1500000,
    depreciationMethod: "Straight Line",
    bookValue: 1425000,
    location: "Zone-C",
    status: "Retired",
  },
];

function Assets() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [status, setStatus] = useState("All");

  const categoryOptions = [
    { label: "All", value: "All" },
    { label: "Plant Equipment", value: "Plant Equipment" },
    { label: "Vehicles", value: "Vehicles" },
    { label: "Office Equipment", value: "Office Equipment" },
    { label: "Furniture", value: "Furniture" },
  ];

  const locationOptions = [
    { label: "All", value: "All" },
    { label: "Zone-A", value: "Zone-A" },
    { label: "Zone-B", value: "Zone-B" },
    { label: "Zone-C", value: "Zone-C" },
  ];

  const statusOptions = [
    { label: "All", value: "All" },
    { label: "Active", value: "Active" },
    { label: "Under Maintenance", value: "Under Maintenance" },
    { label: "Retired", value: "Retired" },
  ];

  const mappedAssets = useMemo(() => mockAssets.map((asset) => {
    const purchaseDate = asset.purchaseDate ? new Date(asset.purchaseDate) : null;

    return {
      _id: asset._id,
      assetCode: asset.assetCode,
      category: asset.category,
      date: purchaseDate
        ? `${purchaseDate.getDate().toString().padStart(2, '0')}/${(purchaseDate.getMonth() + 1).toString().padStart(2, '0')}/${purchaseDate.getFullYear()}`
        : "",
      purchaseCost: asset.purchaseCost,
      depreciationMethod: asset.depreciationMethod,
      bookValue: asset.bookValue,
      location: asset.location,
      status: asset.status,
    };
  }), []);

  const filteredAssets = useMemo(() => mappedAssets.filter((asset) => {
    const matchesQuery = `${asset.assetCode} ${asset.category}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All" || asset.category === category;
    const matchesLocation = location === "All" || asset.location === location;
    const matchesStatus = status === "All" || asset.status === status;
    return matchesQuery && matchesCategory && matchesLocation && matchesStatus;
  }), [query, category, location, status, mappedAssets]);

  const summaryStats = useMemo(() => {
    const totalAssetValue = mappedAssets.reduce((sum, asset) => sum + (asset.purchaseCost || 0), 0);
    const totalBookValue = mappedAssets.reduce((sum, asset) => sum + (asset.bookValue || 0), 0);
    const thisYearDepreciation = totalAssetValue - totalBookValue;
    const activeCount = mappedAssets.filter(a => a.status === "Active").length;

    return {
      totalAssetValue,
      thisYearDepreciation,
      netBookValue: totalBookValue,
      activeAssets: activeCount,
    };
  }, [mappedAssets]);

  const assetColumns = [
    {
      key: "assetCode",
      label: "Asset Code",
      isRowHeader: true,
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <span className="font-bold text-slate-800 text-[13px]">{item.assetCode}</span>
      ),
    },
    {
      key: "category",
      label: "Category",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
      renderCell: (item) => item.category,
    },
    {
      key: "date",
      label: "Purchase Date",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
      renderCell: (item) => item.date || "-",
    },
    {
      key: "purchaseCost",
      label: "Purchase Cost (Rs.)",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
      renderCell: (item) => item.purchaseCost.toLocaleString(),
    },
    {
      key: "depreciationMethod",
      label: "Depreciation Method",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
      renderCell: (item) => item.depreciationMethod,
    },
    {
      key: "bookValue",
      label: "Book Value (Rs.)",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <span className="text-slate-900 font-bold text-[13px]">Rs. {item.bookValue.toLocaleString()}</span>
      ),
    },
    {
      key: "location",
      label: "Location",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
      renderCell: (item) => item.location,
    },
    {
      key: "status",
      label: "Status",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4",
      renderCell: (item) => {
        const statusStyles = {
          Active: "bg-emerald-50 text-emerald-600 border border-emerald-100",
          "Under Maintenance": "bg-amber-50 text-amber-600 border border-amber-100",
          Retired: "bg-slate-50 text-slate-600 border border-slate-200",
        };
        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[item.status] || statusStyles.Active}`}
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
            aria-label={`View ${item.assetCode}`}
            onClick={() => navigate(`/assets/view/${item._id}`)}
            className="text-[#1a56db] hover:text-blue-800 transition-colors"
          >
            <Eye className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label={`Edit ${item.assetCode}`}
            onClick={() => navigate(`/assets/edit/${item._id}`)}
            className="text-[#008951] hover:text-emerald-800 transition-colors"
          >
            <Edit3 className="h-4 w-4" strokeWidth={2.5} />
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
              <span className="font-semibold ">Fixed Assets</span>
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
              Fixed Assets
            </h1>
            <p className="text-sm text-tertiary">
              Track and manage company fixed assets and depreciation
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/assets/add")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-bg-blue px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#007545]"
          >
            <CirclePlus className="h-4 w-4" strokeWidth={3} /> Add Asset
          </button>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">
                  Total Asset Value
                </p>
                <p className="mt-2 text-2xl font-extrabold text-6th-color">
                  Rs. {summaryStats.totalAssetValue.toLocaleString()}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-tertiary my-auto">
                  <span className="h-2 w-2 rounded-full bg-[#2563EB]"></span>
                  Total purchase cost
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">
                  This Year Depreciation
                </p>
                <p className="mt-2 text-2xl font-extrabold text-5th-color">
                  Rs. {summaryStats.thisYearDepreciation.toLocaleString()}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-tertiary my-auto">
                  <span className="h-2 w-2 rounded-full bg-[#10B981]"></span>
                  Accumulated depreciation
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">
                  Net Book Value
                </p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">
                  Rs. {summaryStats.netBookValue.toLocaleString()}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-tertiary my-auto">
                  <span className="h-2 w-2 rounded-full bg-[#4B5563]"></span>
                  Current asset value
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
                placeholder="Search by asset code or category..."
              />
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-40 lg:w-44"
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-40 lg:w-44"
                >
                  {locationOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-40 lg:w-44"
                >
                  {statusOptions.map((opt) => (
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
          <GlobalTable
            columns={assetColumns}
            data={filteredAssets}
            ariaLabel="Fixed Assets Table"
            className=""
            rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
            emptyContent="No assets match your search."
            pagination={false}
          />
        </div>
      </section>
    </main>
  );
}

export default Assets;
