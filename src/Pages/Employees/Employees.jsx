import { Table } from "@heroui/react";
import { Plus, Eye, Edit3, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const initialEmployees = [
  { code: "EMP-001", name: "Ahmad Hassan", department: "Operations", jobTitle: "Plant Operator", phone: "0300-5550011", salary: "Rs. 45,000", status: "Active" },
  { code: "EMP-002", name: "Fatima Zahra", department: "Finance", jobTitle: "Accountant", phone: "0321-4441122", salary: "Rs. 65,000", status: "Active" },
  { code: "EMP-003", name: "Muhammad Bilal", department: "Maintenance", jobTitle: "Technician", phone: "0333-8882233", salary: "Rs. 40,000", status: "Active" },
  { code: "EMP-004", name: "Ayesha Siddiqui", department: "Admin", jobTitle: "Office Manager", phone: "0345-1113344", salary: "Rs. 55,000", status: "Active" },
  { code: "EMP-005", name: "Usman Ali", department: "Operations", jobTitle: "Filling Operator", phone: "0312-7774455", salary: "Rs. 42,000", status: "Active" },
  { code: "EMP-006", name: "Zainab Rashid", department: "Sales", jobTitle: "Sales Executive", phone: "0301-9995566", salary: "Rs. 50,000", status: "On Leave" },
  { code: "EMP-007", name: "Tariq Mehmood", department: "Security", jobTitle: "Guard Supervisor", phone: "0311-5556677", salary: "Rs. 35,000", status: "Active" },
  { code: "EMP-008", name: "Sana Pervez", department: "HR", jobTitle: "HR Officer", phone: "0322-3337788", salary: "Rs. 58,000", status: "Active" },
];

function Employees() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("Active");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEmployees = useMemo(() => initialEmployees.filter((emp) => {
    const matchesQuery = `${emp.code} ${emp.name}`.toLowerCase().includes(query.toLowerCase());
    const matchesDept = department === "All" || emp.department === department;
    const matchesStatus = status === "All" || emp.status === status;
    return matchesQuery && matchesDept && matchesStatus;
  }), [query, department, status]);

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
                  <option value="Operations">Department: Operations</option>
                  <option value="Finance">Department: Finance</option>
                  <option value="Maintenance">Department: Maintenance</option>
                  <option value="Admin">Department: Admin</option>
                  <option value="Sales">Department: Sales</option>
                  <option value="Security">Department: Security</option>
                  <option value="HR">Department: HR</option>
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
                  <option value="On Leave">Status: On Leave</option>
                  <option value="Inactive">Status: Inactive</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="Employees Table">
                <Table.Header>
                  <Table.Column className="bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700">
                    Code
                  </Table.Column>
                  <Table.Column className="bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700">
                    Full Name
                  </Table.Column>
                  <Table.Column className="bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700">
                    Department
                  </Table.Column>
                  <Table.Column className="bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700">
                    Job Title
                  </Table.Column>
                  <Table.Column className="bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700">
                    Phone
                  </Table.Column>
                  <Table.Column className="bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700">
                    Monthly Salary
                  </Table.Column>
                  <Table.Column className="bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700">
                    Status
                  </Table.Column>
                  <Table.Column className="bg-slate-50/80 px-4 py-4 text-[13px] font-bold text-slate-700 text-right pr-6">
                    Actions
                  </Table.Column>
                </Table.Header>
                <Table.Body
                  items={filteredEmployees}
                  emptyContent="No employees match your search."
                >
                  {(emp) => (
                    <Table.Row key={emp.code} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <Table.Cell className="px-4 py-4">
                        <span className="font-bold text-slate-800 text-[13px]">
                          {emp.code}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="px-4 py-4">
                        <button className="flex flex-col items-start font-bold text-[#1a56db] hover:underline text-[13px] text-left leading-tight">
                          <span>{emp.name.split(' ')[0]}</span>
                          <span>{emp.name.split(' ').slice(1).join(' ')}</span>
                        </button>
                      </Table.Cell>
                      <Table.Cell className="px-4 py-4">
                        <span className="text-slate-600 text-[13px] font-medium">
                          {emp.department}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="px-4 py-4">
                        <span className="text-slate-600 text-[13px] font-medium">
                          {emp.jobTitle}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="px-4 py-4">
                        <span className="text-slate-600 text-[13px] font-medium">
                          {emp.phone}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="px-4 py-4">
                        <span className="text-slate-900 font-bold text-[13px]">
                          {emp.salary}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            emp.status === "Active" 
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                              : "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}
                        >
                          {emp.status}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="px-4 py-4 pr-6">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            type="button"
                            aria-label={`View ${emp.name}`}
                            className="text-[#1a56db] hover:text-blue-800 transition-colors"
                          >
                            <Eye className="h-4 w-4" strokeWidth={2.5} />
                          </button>
                          <button
                            type="button"
                            aria-label={`Edit ${emp.name}`}
                            className="text-[#008951] hover:text-emerald-800 transition-colors"
                          >
                            <Edit3 className="h-4 w-4" strokeWidth={2.5} />
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
          <div className="flex items-center justify-between border-t border-slate-200 bg-[#F8FAFC]/50 px-4 py-4 sm:px-6">
            <div className="hidden sm:block">
              <p className="text-sm text-slate-500">
                Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of{" "}
                <span className="font-medium">24</span> plant personnel
              </p>
            </div>
            <div className="flex flex-1 justify-between sm:justify-end">
              <nav className="isolate inline-flex gap-2" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[1, 2].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-[#0f4bb8] text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, 2))}
                  disabled={currentPage === 2}
                  className="relative inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Employees;
