import { CirclePlus, Eye, Edit3, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalTable from "../../utils/GlobalTable";

const initialReceipts = [
  { receiptNo: "REC-001", supplier: "Pakistan Petroleum Ltd.", date: "2025-05-15", truckReg: "LEA-4521", quantity: 45000, rate: 285, totalCost: 12825000, status: "Confirmed" },
  { receiptNo: "REC-002", supplier: "Sui Northern Gas Pipelines", date: "2025-05-18", truckReg: "LHR-8832", quantity: 38000, rate: 290, totalCost: 11020000, status: "Confirmed" },
  { receiptNo: "REC-003", supplier: "Attock Refinery Ltd.", date: "2025-05-20", truckReg: "ISB-2991", quantity: 52000, rate: 275, totalCost: 14300000, status: "Draft" },
  { receiptNo: "REC-004", supplier: "Byco Petroleum Pakistan", date: "2025-05-22", truckReg: "RWP-5678", quantity: 41000, rate: 280, totalCost: 11480000, status: "Confirmed" },
  { receiptNo: "REC-005", supplier: "Parco LPG Division", date: "2025-05-25", truckReg: "KHI-1234", quantity: 48000, rate: 282, totalCost: 13536000, status: "Pending" },
  { receiptNo: "REC-006", supplier: "National Refinery Limited", date: "2025-05-28", truckReg: "MUL-7890", quantity: 36000, rate: 288, totalCost: 10368000, status: "Confirmed" },
  { receiptNo: "REC-007", supplier: "Hi-Q LPG Pakistan", date: "2025-05-30", truckReg: "FSD-3456", quantity: 25000, rate: 295, totalCost: 7375000, status: "Pending" },
];

function LpgReceipts() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [supplier, setSupplier] = useState("All");

  const filteredReceipts = useMemo(() => initialReceipts.filter((receipt) => {
    const matchesQuery = `${receipt.receiptNo} ${receipt.supplier} ${receipt.truckReg}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "All" || receipt.status === status;
    const matchesSupplier = supplier === "All" || receipt.supplier === supplier;
    return matchesQuery && matchesStatus && matchesSupplier;
  }), [query, status, supplier]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalQuantity = initialReceipts.reduce((sum, receipt) => sum + receipt.quantity, 0);
    const totalCost = initialReceipts.reduce((sum, receipt) => sum + receipt.totalCost, 0);
    const confirmedCount = initialReceipts.filter(r => r.status === "Confirmed").length;
    const pendingCount = initialReceipts.filter(r => r.status === "Pending").length;
    const draftCount = initialReceipts.filter(r => r.status === "Draft").length;

    return {
      thisMonthReceipts: initialReceipts.length,
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
        <button className="font-semibold text-[#1a56db] hover:underline text-[13px]">
          {item.supplier}
        </button>
      ),
    },
    {
      key: "date",
      label: "Date Received",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
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
            className="text-[#1a56db] hover:text-blue-800 transition-colors"
          >
            <Eye className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label={`Edit ${item.receiptNo}`}
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
                placeholder="Search by receipt number, supplier, or date..."
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
                  <option value="All">Supplier: All</option>
                  <option value="Pakistan Petroleum Ltd.">
                    Pakistan Petroleum Ltd.
                  </option>
                  <option value="Sui Northern Gas Pipelines">
                    Sui Northern Gas Pipelines
                  </option>
                  <option value="Attock Refinery Ltd.">
                    Attock Refinery Ltd.
                  </option>
                  <option value="Byco Petroleum Pakistan">
                    Byco Petroleum Pakistan
                  </option>
                  <option value="Parco LPG Division">Parco LPG Division</option>
                  <option value="National Refinery Limited">
                    National Refinery Limited
                  </option>
                  <option value="Hi-Q LPG Pakistan">Hi-Q LPG Pakistan</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <GlobalTable
            columns={receiptColumns}
            data={filteredReceipts}
            ariaLabel="LPG Receipts Table"
            className=""
            rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
            emptyContent="No receipts match your search."
            pagination={true}
            rowsPerPage={7}
          />
        </div>
      </section>
    </main>
  );
}

export default LpgReceipts;
