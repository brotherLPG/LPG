import { Table } from "@heroui/react";
import { Search, PlusCircle, Eye, Edit3, Trash2, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useToast } from "../../utils/GlobalToast";
import { useCustomers, useDeleteCustomer } from "../../queries/customers/customers.queries";


function Customers() {
  const navigate = useNavigate();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  // const [paymentTerm, setPaymentTerm] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  
  const { data: customersData, isLoading, error } = useCustomers({
    search: query,
    isActive: status === "All" ? undefined : status === "Active",
    page: currentPage,
    limit: 10,
  });
  
  const deleteMutation = useDeleteCustomer();
  
  const customers = customersData?.data?.items || [];
  const pagination = customersData?.data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const filteredCustomers = useMemo(() => {
    // API handles filtering, so we just return the customers as-is
    return customers.map(customer => ({
      code: customer.customerCode,
      name: customer.customerName,
      contact: customer.contactPersonName,
      phone: customer.phoneNumber,
      email: customer.emailAddress,
      address: customer.billingAddress,
      taxNumber: customer.taxRegistrationNumber,
      limit: customer.creditLimitAmount,
      paymentTermDays: customer.paymentTermDays,
      outstanding: customer.openingBalanceAmount,
      status: customer.isActive ? "Active" : "Inactive",
      _id: customer._id,
    }));
  }, [customers]);

  const handleDeleteClick = (item) => {
    setDeleteModal({ isOpen: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.item) {
      try {
        await deleteMutation.mutateAsync(deleteModal.item._id);
        toast.success(`Customer ${deleteModal.item.name} has been deleted successfully`);
        setDeleteModal({ isOpen: false, item: null });
      } catch (error) {
        toast.error("Failed to delete customer. Please try again.");
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, item: null });
  };

  const getStatusStyle = (customer) => {
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
              Manage customer credit terms, records, and outstanding debt
              statuses
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
                placeholder="Search by code or customer name..."
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
            {/* <div className="relative">
              <select
                value={paymentTerm}
                onChange={(event) => setPaymentTerm(event.target.value)}
                className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-600 outline-none focus:border-[#008951] lg:w-48"
              >
                <option value="All">All Payment Terms</option>
                <option value="15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 60">Net 60</option>
                <option value="Cash">Cash</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div> */}
          </div>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <svg className="animate-spin h-6 w-6 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-sm text-red-500">
                Error loading customers. Please try again.
              </div>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-sm text-slate-500">
                No customer data
              </div>
            </div>
          ) : (
            <Table className="w-full h-[350px] max-h-[350px] overflow-auto bg-white">
              <Table.ScrollContainer className="overflow-x-auto">
                <Table.Content
                  aria-label="Customers Table"
                  className="min-w-[1200px]"
                >
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
                    <Table.Column className="bg-slate-50/80 text-[13px] font-bold text-center text-slate-700">
                      Status
                    </Table.Column>
                    <Table.Column className="bg-slate-50/80 text-[13px] font-bold text-center text-slate-700">
                      Actions
                    </Table.Column>
                  </Table.Header>
                  <Table.Body
                    items={filteredCustomers}
                    emptyContent="No customers match your search."
                  >
                    {(customer) => (
                      <Table.Row
                        key={customer._id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                      >
                        <Table.Cell>
                          <span className="font-medium text-slate-700 text-[13px]">
                            {customer.code}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <button
                            type="button"
                            onClick={() => navigate(`/customers/view/${customer._id}`)}
                            className="font-semibold text-[#1a56db] hover:underline text-[13px]"
                          >
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
                            {customer.limit?.toLocaleString() || 0}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <span className="text-slate-700 font-bold text-[13px]">
                            {customer.outstanding?.toLocaleString() || 0}
                          </span>
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
                              onClick={() => navigate(`/customers/view/${customer._id}`)}
                              aria-label={`View ${customer.name}`}
                              className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
                            >
                              <Eye className="h-3.5 w-3.5" /> View
                            </button>
                            <button
                              type="button"
                              onClick={() => navigate(`/customers/edit/${customer._id}`)}
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
          )}

          {/* Pagination Footer */}
          <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
            <div className="text-sm text-slate-500">
              Showing {filteredCustomers.length} of {pagination.total} customers
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-end">
              <nav
                className="isolate inline-flex gap-2 rounded-md"
                aria-label="Pagination"
              >
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1,
                ).map((page) => (
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
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, pagination.totalPages),
                    )
                  }
                  disabled={currentPage === pagination.totalPages}
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

export default Customers;
