import { CirclePlus, Eye, Edit3, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalTable from "../../utils/GlobalTable";

const mockMaintenanceRecords = [
  {
    _id: "1",
    maintenanceNo: "MNT-2026-0067",
    assetName: "Bulk Storage Compressor",
    type: "Corrective",
    date: "2026-08-20",
    problemDescription: "Abnormal vibration detected during operation",
    workPerformed: "Replaced worn bearing assembly and realigned drive shaft",
    cost: 45000,
    nextMaintenance: "2026-11-15",
    performedBy: "Muhammad Bilal - Tech Lead",
  },
  {
    _id: "2",
    maintenanceNo: "MNT-2026-0066",
    assetName: "Transfer Pump Unit",
    type: "Preventive",
    date: "2026-08-18",
    problemDescription: "Routine scheduled maintenance",
    workPerformed: "Cleaned filters and checked pressure settings",
    cost: 25000,
    nextMaintenance: "2026-11-18",
    performedBy: "Ahmed Khan - Technician",
  },
  {
    _id: "3",
    maintenanceNo: "MNT-2026-0065",
    assetName: "Filling Machine FM-02",
    type: "Emergency",
    date: "2026-08-15",
    problemDescription: "Unexpected shutdown during filling cycle",
    workPerformed: "Replaced faulty sensor and recalibrated system",
    cost: 75000,
    nextMaintenance: "2026-11-15",
    performedBy: "Sara Ahmed - Engineer",
  },
  {
    _id: "4",
    maintenanceNo: "MNT-2026-0064",
    assetName: "Control Panel CP-03",
    type: "Preventive",
    date: "2026-08-12",
    problemDescription: "Quarterly inspection and calibration",
    workPerformed: "Updated firmware and tested all safety interlocks",
    cost: 15000,
    nextMaintenance: "2026-11-12",
    performedBy: "Usman Ali - Electrician",
  },
  {
    _id: "5",
    maintenanceNo: "MNT-2026-0063",
    assetName: "Safety Valve SV-201",
    type: "Corrective",
    date: "2026-08-10",
    problemDescription: "Pressure relief valve not sealing properly",
    workPerformed: "Replaced valve seat and tested pressure settings",
    cost: 35000,
    nextMaintenance: "2026-11-10",
    performedBy: "Muhammad Bilal - Tech Lead",
  },
  {
    _id: "6",
    maintenanceNo: "MNT-2026-0062",
    assetName: "Storage Tank T-101",
    type: "Preventive",
    date: "2026-08-08",
    problemDescription: "Annual tank inspection and certification",
    workPerformed: "Visual inspection, thickness measurement, and certification",
    cost: 50000,
    nextMaintenance: "2027-08-08",
    performedBy: "External Inspector",
  },
];

function MaintenanceRecords() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [asset, setAsset] = useState("All");
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");

  const assetOptions = [
    { label: "All Assets", value: "All" },
    { label: "Bulk Storage Compressor", value: "Bulk Storage Compressor" },
    { label: "Transfer Pump Unit", value: "Transfer Pump Unit" },
    { label: "Filling Machine FM-02", value: "Filling Machine FM-02" },
    { label: "Control Panel CP-03", value: "Control Panel CP-03" },
  ];

  const typeOptions = [
    { label: "All Types", value: "All" },
    { label: "Preventive", value: "Preventive" },
    { label: "Corrective", value: "Corrective" },
    { label: "Emergency", value: "Emergency" },
    { label: "Predictive", value: "Predictive" },
  ];

  const statusOptions = [
    { label: "All Statuses", value: "All" },
    { label: "Completed", value: "Completed" },
    { label: "Pending", value: "Pending" },
    { label: "In Progress", value: "In Progress" },
  ];

  const mappedRecords = useMemo(() => mockMaintenanceRecords.map((record) => {
    const maintenanceDate = record.date ? new Date(record.date) : null;
    const nextDate = record.nextMaintenance ? new Date(record.nextMaintenance) : null;

    return {
      _id: record._id,
      maintenanceNo: record.maintenanceNo,
      assetName: record.assetName,
      type: record.type,
      date: maintenanceDate
        ? `${maintenanceDate.getDate().toString().padStart(2, '0')}/${(maintenanceDate.getMonth() + 1).toString().padStart(2, '0')}/${maintenanceDate.getFullYear()}`
        : "",
      problemDescription: record.problemDescription,
      workPerformed: record.workPerformed,
      cost: record.cost,
      nextMaintenance: nextDate
        ? `${nextDate.getDate().toString().padStart(2, '0')}/${(nextDate.getMonth() + 1).toString().padStart(2, '0')}/${nextDate.getFullYear()}`
        : "",
      performedBy: record.performedBy,
      status: "Completed",
    };
  }), []);

  const filteredRecords = useMemo(() => mappedRecords.filter((record) => {
    const matchesQuery = `${record.maintenanceNo} ${record.assetName} ${record.performedBy}`.toLowerCase().includes(query.toLowerCase());
    const matchesAsset = asset === "All" || record.assetName === asset;
    const matchesType = type === "All" || record.type === type;
    const matchesStatus = status === "All" || record.status === status;
    return matchesQuery && matchesAsset && matchesType && matchesStatus;
  }), [query, asset, type, status, mappedRecords]);

  const summaryStats = useMemo(() => {
    const totalRecords = mappedRecords.length;
    const pendingCount = mappedRecords.filter(r => r.status === "Pending").length;
    const completedThisMonth = mappedRecords.filter(r => r.status === "Completed").length;
    const totalCost = mappedRecords.reduce((sum, record) => sum + (record.cost || 0), 0);

    return {
      totalRecords,
      pendingMaintenance: pendingCount,
      completedThisMonth,
      totalCost,
    };
  }, [mappedRecords]);

  const recordColumns = [
    {
      key: "maintenanceNo",
      label: "Maint. #",
      isRowHeader: true,
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <span className="font-bold text-slate-800 text-[13px]">{item.maintenanceNo}</span>
      ),
    },
    {
      key: "assetName",
      label: "Asset Name",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
      renderCell: (item) => item.assetName,
    },
    {
      key: "type",
      label: "Type",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
      renderCell: (item) => item.type,
    },
    {
      key: "date",
      label: "Date",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
      renderCell: (item) => item.date || "-",
    },
    {
      key: "problemDescription",
      label: "Problem Description",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
      renderCell: (item) => (
        <span className="truncate max-w-50 block" title={item.problemDescription}>
          {item.problemDescription}
        </span>
      ),
    },
    {
      key: "workPerformed",
      label: "Work Performed",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
      renderCell: (item) => (
        <span className="truncate max-w-50 block" title={item.workPerformed}>
          {item.workPerformed}
        </span>
      ),
    },
    {
      key: "cost",
      label: "Cost (Rs.)",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <span className="text-slate-900 font-bold text-[13px]">Rs. {item.cost.toLocaleString()}</span>
      ),
    },
    {
      key: "nextMaintenance",
      label: "Next Maint.",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
      renderCell: (item) => item.nextMaintenance || "-",
    },
    {
      key: "performedBy",
      label: "Performed By",
      className: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
      renderCell: (item) => item.performedBy,
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
            aria-label={`View ${item.maintenanceNo}`}
            onClick={() => navigate(`/maintenance-records/view/${item._id}`)}
            className="text-[#1a56db] hover:text-blue-800 transition-colors"
          >
            <Eye className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label={`Edit ${item.maintenanceNo}`}
            onClick={() => navigate(`/maintenance-records/edit/${item._id}`)}
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
              <span className="font-semibold ">Maintenance Records</span>
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
              Maintenance Records
            </h1>
            <p className="text-sm text-tertiary">
              Track and manage all maintenance activities and service logs
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/maintenance-records/add")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-bg-blue px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#007545]"
          >
            <CirclePlus className="h-4 w-4" strokeWidth={3} /> Add Record
          </button>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">
                  Total Records
                </p>
                <p className="mt-2 text-2xl font-extrabold text-6th-color">
                  {summaryStats.totalRecords}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-tertiary my-auto">
                  <span className="h-2 w-2 rounded-full bg-[#2563EB]"></span>
                  All maintenance logs
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">
                  Pending Maintenance
                </p>
                <p className="mt-2 text-2xl font-extrabold text-5th-color">
                  {summaryStats.pendingMaintenance}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-tertiary my-auto">
                  <span className="h-2 w-2 rounded-full bg-[#10B981]"></span>
                  Scheduled This Month
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600">
                  Completed This Month
                </p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">
                  {summaryStats.completedThisMonth}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-tertiary my-auto">
                  <span className="h-2 w-2 rounded-full bg-[#4B5563]"></span>
                  Rs. {summaryStats.totalCost.toLocaleString()} Total Cost
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
                placeholder="Search maintenance registry..."
              />
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  value={asset}
                  onChange={(event) => setAsset(event.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-40 lg:w-44"
                >
                  {assetOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-40 lg:w-44"
                >
                  {typeOptions.map((opt) => (
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
            columns={recordColumns}
            data={filteredRecords}
            ariaLabel="Maintenance Records Table"
            className=""
            rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
            emptyContent="No maintenance records match your search."
            pagination={true}
            rowsPerPage={6}
          />
        </div>
      </section>
    </main>
  );
}

export default MaintenanceRecords;
