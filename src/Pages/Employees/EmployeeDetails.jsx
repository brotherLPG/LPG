import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEmployeeById } from "../../queries/employees/employees.queries";
import { usePermissions } from "../../contexts/PermissionContext";

function DetailItem({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-slate-400 dark:text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-slate-700 dark:text-gray-300">{value || "-"}</dd>
    </div>
  );
}

function EmployeeDetails() {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const { id } = useParams();
  const { data, isLoading, error } = useEmployeeById(id);
  const employee = data?.data;

  if (isLoading) {
    return (
      <main className="flex min-h-full items-center justify-center bg-slate-50 dark:bg-gray-800 p-8 text-sm text-slate-500 dark:text-gray-400">
        Loading employee...
      </main>
    );
  }

  if (error || !employee) {
    return (
      <main className="flex min-h-full flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-gray-800 p-8 text-sm text-red-500 dark:text-red-400">
        <p>Unable to load employee.</p>
        <button
          type="button"
          onClick={() => navigate("/employees")}
          className="inline-flex items-center gap-2 rounded-md bg-white dark:bg-gray-900 px-3 py-2 font-semibold text-slate-600 dark:text-gray-400 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Employees
        </button>
      </main>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <main className="min-h-full bg-slate-50 dark:bg-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs">
            <button type="button" onClick={() => navigate("/dashboard")} className="font-medium text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-400">
              Dashboard
            </button>
            <span className="px-1 text-slate-400 dark:text-gray-500">/</span>
            <button type="button" onClick={() => navigate("/employees")} className="font-medium text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-400">
              Employees
            </button>
            <span className="px-1 text-slate-400 dark:text-gray-500">/</span>
            <span className="font-semibold text-slate-600 dark:text-gray-400">Employee Details</span>
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-gray-100">{employee.fullName}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">Employee profile, employment details, and contact information</p>
        </div>
        <div className="flex gap-2">
          {can("employees", "update") && (
          <button type="button" onClick={() => navigate(`/employees/edit/${employee._id}`)} className="inline-flex items-center gap-2 rounded-md bg-[#008951] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
            <Pencil className="h-4 w-4" /> Edit Employee
          </button>
          )}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
          <h2 className="border-b border-slate-100 dark:border-gray-800 px-4 py-3 text-base font-bold text-slate-800 dark:text-gray-100">Employee Information</h2>
          <dl className="grid gap-5 p-5 sm:grid-cols-2">
            <DetailItem label="Employee Code" value={employee.employeeCode} />
            <DetailItem label="Full Name" value={employee.fullName} />
            <DetailItem label="Father/Husband Name" value={employee.fatherHusbandName} />
            <DetailItem label="CNIC Number" value={employee.cnicNumber} />
            <DetailItem label="Date of Birth" value={formatDate(employee.dateOfBirth)} />
            <DetailItem label="Gender" value={employee.genderLabel} />
            <DetailItem label="Employment Status" value={employee.employmentStatusLabel} />
          </dl>
        </section>

        <section className="rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
          <h2 className="border-b border-slate-100 dark:border-gray-800 px-4 py-3 text-base font-bold text-slate-800 dark:text-gray-100">Employment Details</h2>
          <dl className="grid gap-5 p-5 sm:grid-cols-2">
            <DetailItem label="Department" value={employee.departmentLabel} />
            <DetailItem label="Job Title" value={employee.jobTitle} />
            <DetailItem label="Date of Joining" value={formatDate(employee.joiningDate)} />
            <DetailItem label="Monthly Salary" value={employee.monthlySalaryAmount ? `Rs. ${employee.monthlySalaryAmount.toLocaleString()}` : undefined} />
          </dl>
        </section>

        <section className="rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
          <h2 className="border-b border-slate-100 dark:border-gray-800 px-4 py-3 text-base font-bold text-slate-800 dark:text-gray-100">Contact Details</h2>
          <dl className="grid gap-5 p-5 sm:grid-cols-2">
            <DetailItem label="Phone Number" value={employee.phoneNumber} />
            <DetailItem label="Email Address" value={employee.emailAddress} />
          </dl>
        </section>

        <section className="rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
          <h2 className="border-b border-slate-100 dark:border-gray-800 px-4 py-3 text-base font-bold text-slate-800 dark:text-gray-100">Emergency Contact</h2>
          <dl className="grid gap-5 p-5 sm:grid-cols-2">
            <DetailItem label="Emergency Contact Name" value={employee.emergencyContactName} />
            <DetailItem label="Emergency Contact Phone" value={employee.emergencyContactPhone} />
          </dl>
        </section>

        <section className="rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm lg:col-span-2">
          <h2 className="border-b border-slate-100 dark:border-gray-800 px-4 py-3 text-base font-bold text-slate-800 dark:text-gray-100">Address</h2>
          <dl className="grid gap-5 p-5 sm:grid-cols-1">
            <DetailItem label="Home Address" value={employee.homeAddress} />
          </dl>
        </section>
      </div>
    </main>
  );
}

export default EmployeeDetails;
