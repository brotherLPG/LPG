import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEmployeeById } from "../../queries/employees/employees.queries";
import { usePermissions } from "../../contexts/PermissionContext";

function DetailItem({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm text-slate-700">{value || "-"}</dd>
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
      <main className="flex min-h-full items-center justify-center bg-slate-50 p-8 text-sm text-slate-500">
        Loading employee...
      </main>
    );
  }

  if (error || !employee) {
    return (
      <main className="flex min-h-full flex-col items-center justify-center gap-4 bg-slate-50 p-8 text-sm text-red-500">
        <p>Unable to load employee.</p>
        <button
          type="button"
          onClick={() => navigate("/employees")}
          className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 font-semibold text-slate-600 shadow-sm"
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
    <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs">
            <button type="button" onClick={() => navigate("/dashboard")} className="font-medium text-slate-400 hover:text-slate-600">
              Dashboard
            </button>
            <span className="px-1 text-slate-400">/</span>
            <button type="button" onClick={() => navigate("/employees")} className="font-medium text-slate-400 hover:text-slate-600">
              Employees
            </button>
            <span className="px-1 text-slate-400">/</span>
            <span className="font-semibold text-slate-600">Employee Details</span>
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{employee.fullName}</h1>
          <p className="mt-1 text-sm text-slate-500">Employee profile, employment details, and contact information</p>
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
        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Employee Information</h2>
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

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Employment Details</h2>
          <dl className="grid gap-5 p-5 sm:grid-cols-2">
            <DetailItem label="Department" value={employee.departmentLabel} />
            <DetailItem label="Job Title" value={employee.jobTitle} />
            <DetailItem label="Date of Joining" value={formatDate(employee.joiningDate)} />
            <DetailItem label="Monthly Salary" value={employee.monthlySalaryAmount ? `Rs. ${employee.monthlySalaryAmount.toLocaleString()}` : undefined} />
          </dl>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Contact Details</h2>
          <dl className="grid gap-5 p-5 sm:grid-cols-2">
            <DetailItem label="Phone Number" value={employee.phoneNumber} />
            <DetailItem label="Email Address" value={employee.emailAddress} />
          </dl>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Emergency Contact</h2>
          <dl className="grid gap-5 p-5 sm:grid-cols-2">
            <DetailItem label="Emergency Contact Name" value={employee.emergencyContactName} />
            <DetailItem label="Emergency Contact Phone" value={employee.emergencyContactPhone} />
          </dl>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-slate-800">Address</h2>
          <dl className="grid gap-5 p-5 sm:grid-cols-1">
            <DetailItem label="Home Address" value={employee.homeAddress} />
          </dl>
        </section>
      </div>
    </main>
  );
}

export default EmployeeDetails;
