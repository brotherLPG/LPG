import { Search, PlusCircle, Eye, Edit3, Trash2, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalTable from "../../utils/GlobalTable";

const initialCustomers = [
  { code: "CUST-001", name: "Islamabad Gas Agency", contact: "Faisal Malik", phone: "0300-5551234", limit: 500000, outstanding: 175000, status: "Active" },
  { code: "CUST-002", name: "Karachi LPG Distributors", contact: "Tariq Mahmood", phone: "0321-4448765", limit: 1200000, outstanding: 845000, status: "Active" },
  { code: "CUST-003", name: "Lahore Fuel Traders", contact: "Kamran Shah", phone: "0333-8889900", limit: 800000, outstanding: 950000, status: "Active", isOverdue: true },
  { code: "CUST-004", name: "Khyber Gas Supply", contact: "Sher Khan", phone: "0312-7773322", limit: 600000, outstanding: 120000, status: "Active" },
  { code: "CUST-005", name: "Faisalabad Cylinder Co.", contact: "Bilal Anwar", phone: "0345-1112233", limit: 400000, outstanding: 390000, status: "Active" },
  { code: "CUST-006", name: "Multan Oasis LPG", contact: "Zahid Siddiqui", phone: "0301-9998877", limit: 300000, outstanding: 0, status: "Inactive" },
  { code: "CUST-007", name: "Peshawar Fuel Services", contact: "Asif Afridi", phone: "0311-5556677", limit: 500000, outstanding: 45000, status: "Active" },
  { code: "CUST-008", name: "Rawalpindi Gas Traders", contact: "Waqas Butt", phone: "0322-3334455", limit: 600000, outstanding: 180000, status: "Active" },
];

function Customers() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [paymentTerm, setPaymentTerm] = useState("All");

  const filteredCustomers = useMemo(() => initialCustomers.filter((customer) => {
    const matchesQuery = `${customer.code} ${customer.name}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "All" || customer.status === status;
    // Payment terms filtering logic would go here, omitting for mock simplicity
    return matchesQuery && matchesStatus;
  }), [query, status]);

  const getStatusStyle = (customer) => {
    if (customer.code === "CUST-003") return "bg-amber-50 text-amber-600";
    if (customer.status === "Active") return "bg-emerald-50 text-emerald-600";
    if (customer.status === "Inactive") return "bg-rose-50 text-rose-600";
    return "bg-slate-50 text-slate-600";
  };

  const customerColumns = [
    {
      key: "code",
      label: "Code",
      isRowHeader: true,
      headerClassName: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (customer) => (
        <span className="font-bold text-slate-800 text-[13px]">
          {customer.code}
        </span>
      ),
      render: (customer) => (
        <span className="font-bold text-slate-800 text-[13px]">
          {customer.code}
        </span>
      )
    },
    {
      key: "name",
      label: "Customer Name",
      headerClassName: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (customer) => (
        <button className="font-semibold text-[#1a56db] hover:underline text-[13px]">
          {customer.name}
        </button>
      ),
      render: (customer) => (
        <button className="font-semibold text-[#1a56db] hover:underline text-[13px]">
          {customer.name}
        </button>
      )
    },
    {
      key: "contact",
      label: "Contact Person",
      headerClassName: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (customer) => (
        <span className="text-slate-600 text-[13px] font-medium">
          {customer.contact}
        </span>
      ),
      render: (customer) => (
        <span className="text-slate-600 text-[13px] font-medium">
          {customer.contact}
        </span>
      )
    },
    {
      key: "phone",
      label: "Phone",
      headerClassName: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (customer) => (
        <span className="text-slate-600 text-[13px]">
          {customer.phone}
        </span>
      ),
      render: (customer) => (
        <span className="text-slate-600 text-[13px]">
          {customer.phone}
        </span>
      )
    },
    {
      key: "limit",
      label: "Credit Limit (Rs.)",
      headerClassName: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (customer) => (
        <span className="text-slate-800 font-medium text-[13px]">
          {customer.limit.toLocaleString()}
        </span>
      ),
      render: (customer) => (
        <span className="text-slate-800 font-medium text-[13px]">
          {customer.limit.toLocaleString()}
        </span>
      )
    },
    {
      key: "outstanding",
      label: "Outstanding (Rs.)",
      headerClassName: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (customer) => (
        customer.isOverdue ? (
          <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-bold text-rose-600">
            {customer.outstanding.toLocaleString()}
          </span>
        ) : (
          <span className="text-slate-900 font-bold text-[13px]">
            {customer.outstanding.toLocaleString()}
          </span>
        )
      ),
      render: (customer) => (
        customer.isOverdue ? (
          <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-bold text-rose-600">
            {customer.outstanding.toLocaleString()}
          </span>
        ) : (
          <span className="text-slate-900 font-bold text-[13px]">
            {customer.outstanding.toLocaleString()}
          </span>
        )
      )
    },
    {
      key: "status",
      label: "Status",
      headerClassName: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (customer) => (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusStyle(customer)}`}>
          {customer.status}
        </span>
      ),
      render: (customer) => (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusStyle(customer)}`}>
          {customer.status}
        </span>
      )
    },
    {
      key: "actions",
      label: "Actions",
      headerClassName: "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (customer) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`View ${customer.name}`}
            className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" /> View
          </button>
          <button
            type="button"
            aria-label={`Edit ${customer.name}`}
            className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-100 transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" /> Edit
          </button>
          <button
            type="button"
            aria-label={`Delete ${customer.name}`}
            className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      ),
      render: (customer) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`View ${customer.name}`}
            className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" /> View
          </button>
          <button
            type="button"
            aria-label={`Edit ${customer.name}`}
            className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-100 transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" /> Edit
          </button>
          <button
            type="button"
            aria-label={`Delete ${customer.name}`}
            className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <section>
        {/* Header & Breadcrumbs */}
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs">
              <span
                onClick={() => navigate("/dashboard")}
                className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
              >
                Dashboard
              </span>{" "}
              <span className="px-1 text-slate-400">/</span>{" "}
              <span className="font-semibold text-slate-600">Customers</span>
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-800">
              Customers
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage customer credit terms, records, and outstanding debt statuses
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/customers/add")}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#008951] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <PlusCircle className="h-4 w-4" /> Add Customer
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
                placeholder="Search by code or company name..."
              />
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-40 lg:w-44"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={paymentTerm}
                  onChange={(event) => setPaymentTerm(event.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-48 lg:w-56"
                >
                  <option value="All">All Payment Terms</option>
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 60">Net 60</option>
                  <option value="Cash">Cash</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <GlobalTable
            columns={customerColumns}
            data={filteredCustomers}
            ariaLabel="Customers Table"
            rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
            emptyContent="No customers match your search."
            pagination={true}
            rowsPerPage={5}
          />
        </div>
      </section>
    </main>
  );
}

export default Customers;
