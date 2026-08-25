import { PlusCircle, Eye, Edit3, Trash2, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalTable from "../../utils/GlobalTable";

const initialSuppliers = [
  { code: "SUP-001", name: "Pakistan Petroleum Ltd.", contact: "Irfan Qureshi", phone: "021-35681901", terms: "Net 30", outstanding: "Rs. 1,250,000", status: "Active" },
  { code: "SUP-002", name: "Sui Northern Gas Pipelines", contact: "Asim Masood", phone: "042-99201451", terms: "Net 15", outstanding: "Rs. 3,400,000", status: "Active" },
  { code: "SUP-003", name: "Attock Refinery Ltd.", contact: "Jamil Khan", phone: "051-5487041", terms: "Net 30", outstanding: "Rs. 0", status: "Active" },
  { code: "SUP-004", name: "Byco Petroleum Pakistan", contact: "Zubair Ahmad", phone: "021-11122209", terms: "Cash On Delivery", outstanding: "Rs. 450,000", status: "Inactive" },
  { code: "SUP-005", name: "Parco LPG Division", contact: "Noman Shah", phone: "021-35090100", terms: "Net 45", outstanding: "Rs. 2,150,000", status: "Active" },
  { code: "SUP-006", name: "National Refinery Limited", contact: "Sohail Abbas", phone: "021-35064135", terms: "Net 30", outstanding: "Rs. 890,000", status: "Active" },
  { code: "SUP-007", name: "Hi-Q LPG Pakistan", contact: "Yasir Habib", phone: "042-11144455", terms: "Net 15", outstanding: "Rs. 120,000", status: "Active" },
];

function Suppliers() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [paymentTerm, setPaymentTerm] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSuppliers = useMemo(() => initialSuppliers.filter((supplier) => {
    const matchesQuery = `${supplier.code} ${supplier.name} ${supplier.contact}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "All" || supplier.status === status;
    const matchesTerms = paymentTerm === "All" || supplier.terms === paymentTerm;
    return matchesQuery && matchesStatus && matchesTerms;
  }), [query, status, paymentTerm]);

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
      key: "terms",
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
        <span className="text-slate-900 font-bold text-[13px]">{item.outstanding}</span>
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
            aria-label={`Edit ${item.name}`}
            className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-100 transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" /> Edit
          </button>
          <button
            type="button"
            aria-label={`Delete ${item.name}`}
            className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delet
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
                  <option value="Active">Status: Active</option>
                  <option value="Inactive">Status: Inactive</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={paymentTerm}
                  onChange={(event) => setPaymentTerm(event.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-48 lg:w-56"
                >
                  <option value="All">Payment Terms: All</option>
                  <option value="Net 15">Payment Terms: Net 15</option>
                  <option value="Net 30">Payment Terms: Net 30</option>
                  <option value="Net 45">Payment Terms: Net 45</option>
                  <option value="Cash On Delivery">Payment Terms: Cash On Delivery</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <GlobalTable
            columns={supplierColumns}
            data={filteredSuppliers}
            ariaLabel="Suppliers Table"
            className=""
            rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
            emptyContent="No suppliers match your search."
            pagination={true}
            rowsPerPage={5}
          />
        </div>
      </section>
    </main>
  );
}

export default Suppliers;
