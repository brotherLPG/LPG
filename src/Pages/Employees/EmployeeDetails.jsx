import { ArrowLeft, Pencil, User, Users, Fingerprint, Cake, Briefcase, Wallet, Building2, CalendarDays, Phone, Mail, HeartPulse, MapPin, BadgeCheck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEmployeeById } from "../../queries/employees/employees.queries";
import { usePermissions } from "../../contexts/PermissionContext";

function DetailItem({ label, value, icon: Icon }) {
  return (
    <div>
      <div className="flex items-start gap-3 rounded-xl border border-slate-100 dark:border-gray-800 bg-linear-to-br from-slate-50 to-white dark:from-gray-800/60 dark:to-gray-900/40 px-4 py-3 transition hover:border-blue-200 dark:hover:border-blue-800">
        {Icon && (
          <div className="mt-0.5 shrink-0 rounded-lg bg-blue-100/80 dark:bg-blue-900/50 p-1.5">
            <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        )}
        <div className="min-w-0">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">{label}</dt>
          <dd className="mt-0.5 wrap-break-word text-sm font-semibold text-slate-800 dark:text-gray-200">{value || "-"}</dd>
        </div>
      </div>
    </div>
  );
}

function EmployeeDetails() {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const { id } = useParams();
  const { data, isLoading, error } = useEmployeeById(id);
  const employee = data?.data;
  const statusValue = employee?.employmentStatusLabel || employee?.employmentStatus || "Active";
  const isActive = statusValue.toLowerCase() === "active";
  const initials = (employee?.fullName || "?").split(" ").map((n) => n[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();

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

      {/* Hero profile card */}
      <div className="mb-6 rounded-2xl border border-blue-200 dark:border-blue-800 bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950/60 dark:to-blue-900/40 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-200/70 dark:bg-blue-800/60 text-lg font-extrabold text-blue-700 dark:text-blue-300">
              {initials}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">Employee Profile</p>
              <p className="text-xl font-extrabold text-blue-800 dark:text-blue-200">{employee.fullName || "—"}</p>
              <p className="mt-0.5 text-sm text-slate-600 dark:text-gray-400">{employee.employeeCode || "—"}{employee.departmentLabel ? ` • ${employee.departmentLabel}` : ""}</p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold ${isActive ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'}`}>
            <BadgeCheck className="h-4 w-4" /> {statusValue}
          </span>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-gray-800 px-4 py-3"><User className="h-4 w-4 text-blue-600 dark:text-blue-400" /><h2 className="text-base font-bold text-slate-800 dark:text-gray-100">Personal Information</h2></div>
          <dl className="grid gap-5 p-5 sm:grid-cols-2">
            
            
            <DetailItem label="Father/Husband Name" value={employee.fatherHusbandName} icon={Users} />
            <DetailItem label="CNIC Number" value={employee.cnicNumber} icon={Fingerprint} />
            <DetailItem label="Date of Birth" value={formatDate(employee.dateOfBirth)} icon={Cake} />
            <DetailItem label="Gender" value={employee.genderLabel} icon={User} />
            
          </dl>
        </section>

        <section className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-gray-800 px-4 py-3"><Briefcase className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /><h2 className="text-base font-bold text-slate-800 dark:text-gray-100">Employment Details</h2></div>
          <dl className="grid gap-5 p-5 sm:grid-cols-2">
            
            <DetailItem label="Job Title" value={employee.jobTitle} icon={Briefcase} />
            <DetailItem label="Date of Joining" value={formatDate(employee.joiningDate)} icon={CalendarDays} />
            <DetailItem label="Monthly Salary" value={employee.monthlySalaryAmount ? `Rs. ${employee.monthlySalaryAmount.toLocaleString()}` : undefined} icon={Wallet} />
          </dl>
        </section>

        <section className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-gray-800 px-4 py-3"><Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" /><h2 className="text-base font-bold text-slate-800 dark:text-gray-100">Contact Details</h2></div>
          <dl className="grid gap-5 p-5 sm:grid-cols-2">
            <DetailItem label="Phone Number" value={employee.phoneNumber} icon={Phone} />
            <DetailItem label="Email Address" value={employee.emailAddress} icon={Mail} />
          </dl>
        </section>

        <section className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-gray-800 px-4 py-3"><HeartPulse className="h-4 w-4 text-amber-600 dark:text-amber-400" /><h2 className="text-base font-bold text-slate-800 dark:text-gray-100">Emergency Contact</h2></div>
          <dl className="grid gap-5 p-5 sm:grid-cols-2">
            <DetailItem label="Emergency Contact Name" value={employee.emergencyContactName} icon={User} />
            <DetailItem label="Emergency Contact Phone" value={employee.emergencyContactPhone} icon={Phone} />
          </dl>
        </section>

        <section className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-gray-800 px-4 py-3"><MapPin className="h-4 w-4 text-slate-600 dark:text-slate-300" /><h2 className="text-base font-bold text-slate-800 dark:text-gray-100">Address</h2></div>
          <dl className="grid gap-5 p-5 sm:grid-cols-1">
            <DetailItem label="Home Address" value={employee.homeAddress} icon={MapPin} />
          </dl>
        </section>
      </div>
    </main>
  );
}

export default EmployeeDetails;
