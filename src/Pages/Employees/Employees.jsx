import { Plus, Eye, Edit3, Trash2, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import GlobalTable from "../../utils/GlobalTable";
import { useEmployees, useDeleteEmployee } from "../../queries/employees/employees.queries";
import { useToast } from "../../utils/GlobalToast";

function Employees() {
  const navigate = useNavigate();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });

  const { data: employeesData, isLoading, error } = useEmployees({
    search: query || undefined,
    employmentStatus: status === "All" ? undefined : status.toLowerCase(),
    page: currentPage,
    limit: 10,
  });
  const deleteMutation = useDeleteEmployee();
  const employees = employeesData?.data?.items || [];
  const pagination = employeesData?.data?.pagination || { total: 0, page: 1, totalPages: 1 };
  const departments = [...new Set(employees.map((employee) => employee.departmentName).filter(Boolean))];

  const filteredEmployees = useMemo(() => employees
    .filter((employee) => department === "All" || employee.departmentName === department)
    .map((employee) => ({
      ...employee,
      code: employee.employeeCode,
      id: employee._id,
      name: employee.fullName,
      department: employee.departmentName || "-",
      phone: employee.phoneNumber || "-",
      salary: employee.monthlySalaryAmount || 0,
      status: employee.employmentStatus,
    })), [employees, department]);

  const handleDeleteConfirm = async () => {
    if (!deleteModal.item) return;

    try {
      await deleteMutation.mutateAsync(deleteModal.item._id);
      toast.success(`Employee ${deleteModal.item.name} has been deleted successfully`);
      setDeleteModal({ isOpen: false, item: null });
    } catch (deleteError) {
      toast.error(deleteError.response?.data?.message || "Failed to delete employee. Please try again.");
    }
  };

  // Column definitions for employees table
  const employeeColumns = [
    {
      key: "code",
      label: "Code",
      isRowHeader: true,
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <span className="font-bold text-slate-800 text-[13px]">
          {item.code}
        </span>
      ),
    },
    {
      key: "name",
      label: "Full Name",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <button className="flex flex-row  items-start font-bold text-[#1a56db] hover:underline text-[13px] text-left leading-tight">
          <span>{item.name.split(" ")[0]}</span>
          <span className="ms-1">{item.name.split(" ").slice(1).join(" ")}</span>
        </button>
      ),
    },
    {
      key: "department",
      label: "Department",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
    },
    {
      key: "jobTitle",
      label: "Job Title",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
    },
    {
      key: "phone",
      label: "Phone",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4 text-slate-600 text-[13px] font-medium",
    },
    {
      key: "salary",
      label: "Monthly Salary",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <span className="text-slate-900 font-bold text-[13px]">
          Rs. {item.salary.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-4",
      renderCell: (item) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            item.status === "active"
              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
              : "bg-amber-50 text-amber-600 border border-amber-100"
          }`}
        >
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className:
        "bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-center pr-6",
      cellClassName: "px-4 py-4 pr-6",
      renderCell: (item) => (
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            aria-label={`View ${item.name}`}
            className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Eye className="h-4 w-4" strokeWidth={2.5} /> View
          </button>
          <button
            type="button"
            onClick={() => navigate(`/employees/edit/${item._id}`)}
            aria-label={`Edit ${item.name}`}
            className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-100 transition-colors"
          >
            <Edit3 className="h-4 w-4" strokeWidth={2.5} /> Edit
          </button>
          <button
            type="button"
            onClick={() => setDeleteModal({ isOpen: true, item })}
            aria-label={`Delete ${item.name}`}
            className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2.5} /> Delete
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
              <span className="font-semibold text-slate-700">Employees</span>
            </p>
            <h1 className="mt-2 text-[28px] font-bold tracking-tight text-slate-900">
              Employees
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage plant staff, operators, and personnel records
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/employees/add")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#008951] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#007545]"
          >
            <Plus className="h-4 w-4" strokeWidth={3} /> Add Employee
          </button>
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
                placeholder="Search by code or employee name..."
              />
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  value={department}
                  onChange={(event) => setDepartment(event.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-48 lg:w-56"
                >
                  <option value="All">Department: All</option>
                  {departments.map((name) => <option key={name} value={name}>Department: {name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-[#008951] sm:w-40 lg:w-44"
                >
                  <option value="All">Status: All</option>
                  <option value="Active">Status: Active</option>
                  <option value="Terminated">Status: Terminated</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {isLoading ? <div className="p-8 text-center text-sm text-slate-500">Loading employees...</div> : error ? <div className="p-8 text-center text-sm text-red-500">Error loading employees. Please try again.</div> : <GlobalTable
            columns={employeeColumns}
            data={filteredEmployees}
            ariaLabel="Employees Table"
            className=""
            rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
            emptyContent="No employees match your search."
            pagination={true}
            rowsPerPage={10}
            totalCount={pagination.total}
            page={currentPage}
            onPageChange={setCurrentPage}
          />}
        </div>
      </section>
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
        itemName={deleteModal.item ? `${deleteModal.item.code} - ${deleteModal.item.name}` : ""}
        isDeleting={deleteMutation.isPending}
      />
    </main>
  );
}

export default Employees;
