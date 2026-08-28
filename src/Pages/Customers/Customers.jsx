import { Table } from "@heroui/react";
import { Search, PlusCircle, Eye, Edit3, Trash2, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useToast } from "../../utils/GlobalToast";

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
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [paymentTerm, setPaymentTerm] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [customers, setCustomers] = useState(initialCustomers);

  const filteredCustomers = useMemo(() => customers.filter((customer) => {
    const matchesQuery = `${customer.code} ${customer.name}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "All" || customer.status === status;
    // Payment terms filtering logic would go here, omitting for mock simplicity
    return matchesQuery && matchesStatus;
  }), [query, status, customers]);

  const handleDeleteClick = (item) => {
    setDeleteModal({ isOpen: true, item });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.item) {
      setCustomers(customers.filter(c => c.code !== deleteModal.item.code));
      toast.success(`Customer ${deleteModal.item.name} has been deleted successfully`);
      setDeleteModal({ isOpen: false, item: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, item: null });
  };

  const getStatusStyle = (customer) => {
    if (customer.code === "CUST-003") return "bg-amber-50 text-amber-600";
    if (customer.status === "Active") return "bg-emerald-50 text-emerald-600";
    if (customer.status === "Inactive") return "bg-red-50 text-red-600";
    return "bg-slate-50 text-slate-600";
  };

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
        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <label className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                placeholder="Search by code or company name..."
              />
            </label>
            <div className="relative">
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-600 outline-none focus:border-[#008951] lg:w-48"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={paymentTerm}
                onChange={(event) => setPaymentTerm(event.target.value)}
                className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-600 outline-none focus:border-[#008951] lg:w-48"
              >
                <option value="All">All Payment Terms</option>
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 60">Net 60</option>
                <option value="Cash">Cash</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="Customers Table">
                <Table.Header>
                  <Table.Column className="bg-slate-50/80 text-[13px] font-bold text-slate-700">
                    Code
                  </Table.Column>
                  <Table.Column className="bg-slate-50/80 text-[13px] font-bold text-slate-700">
                    Customer Name
                  </Table.Column>
                  <Table.Column className="bg-slate-50/80 text-[13px] font-bold text-slate-700">
                    Contact Person
                  </Table.Column>
                  <Table.Column className="bg-slate-50/80 text-[13px] font-bold text-slate-700">
                    Phone
                  </Table.Column>
                  <Table.Column className="bg-slate-50/80 text-[13px] font-bold text-slate-700">
                    Credit Limit (Rs.)
                  </Table.Column>
                  <Table.Column className="bg-slate-50/80 text-[13px] font-bold text-slate-700">
                    Outstanding (Rs.)
                  </Table.Column>
                  <Table.Column className="bg-slate-50/80 text-[13px] font-bold text-slate-700">
                    Status
                  </Table.Column>
                  <Table.Column className="bg-slate-50/80 text-[13px] font-bold text-slate-700">
                    Actions
                  </Table.Column>
                </Table.Header>
                <Table.Body
                  items={filteredCustomers}
                  emptyContent="No customers match your search."
                >
                  {(customer) => (
                    <Table.Row key={customer.code} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <Table.Cell>
                        <span className="font-medium text-slate-700 text-[13px]">
                          {customer.code}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <button className="font-semibold text-[#1a56db] hover:underline text-[13px]">
                          {customer.name}
                        </button>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-600 text-[13px] font-medium">
                          {customer.contact}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-500 text-[13px]">
                          {customer.phone}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-700 text-[13px] font-medium">
                          {customer.limit.toLocaleString()}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        {customer.isOverdue ? (
                          <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-bold text-[#e11d48]">
                            {customer.outstanding.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-slate-700 font-bold text-[13px]">
                            {customer.outstanding.toLocaleString()}
                          </span>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusStyle(customer)}`}
                        >
                          {customer.status}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
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
                            onClick={() => handleDeleteClick(customer)}
                            aria-label={`Delete ${customer.name}`}
                            className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
          
          {/* Pagination Footer */}
          <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-end">
              <nav className="isolate inline-flex gap-2 rounded-md" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center rounded-md px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                      currentPage === page
                        ? "bg-[#1a56db] text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, 3))}
                  disabled={currentPage === 3}
                  className="relative inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone and will permanently remove the customer record from the system."
        itemName={deleteModal.item ? `${deleteModal.item.code} - ${deleteModal.item.name}` : ""}
      />
    </main>
  );
}

export default Customers;
