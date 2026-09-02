import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Switch } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { useEmployeeById, useUpdateEmployee } from "../../queries/employees/employees.queries";
import { useToast } from "../../utils/GlobalToast";

function UpdateEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const { data, isLoading, error } = useEmployeeById(id);
  const updateMutation = useUpdateEmployee();
  const [isActive, setIsActive] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    departmentName: "",
    jobTitle: "",
    phoneNumber: "",
    emailAddress: "",
    joiningDate: "",
    monthlySalaryAmount: "",
  });

  useEffect(() => {
    const employee = data?.data;
    if (!employee) return;

    setFormData({
      fullName: employee.fullName || "",
      departmentName: employee.departmentName || "",
      jobTitle: employee.jobTitle || "",
      phoneNumber: employee.phoneNumber || "",
      emailAddress: employee.emailAddress || "",
      joiningDate: employee.joiningDate ? employee.joiningDate.slice(0, 10) : "",
      monthlySalaryAmount: employee.monthlySalaryAmount ?? "",
    });
    setIsActive(employee.employmentStatus === "active");
  }, [data]);

  const handleInputChange = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateMutation.mutateAsync({
        id,
        data: {
          ...formData,
          monthlySalaryAmount: Number(formData.monthlySalaryAmount) || 0,
          joiningDate: formData.joiningDate || null,
          employmentStatus: isActive ? "active" : "inactive",
        },
      });
      toast.success("Employee updated successfully!");
      navigate("/employees");
    } catch (updateError) {
      toast.error(updateError.response?.data?.message || "Failed to update employee. Please try again.");
    }
  };

  if (isLoading) {
    return <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8"><div className="py-12 text-center text-sm text-slate-500">Loading employee data...</div></main>;
  }

  if (error) {
    return <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8"><div className="py-12 text-center text-sm text-red-500">Error loading employee data. Please try again.</div></main>;
  }

  return (
    <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <p className="mb-2 text-xs">
          <span onClick={() => navigate("/dashboard")} className="cursor-pointer font-medium text-slate-400 hover:text-slate-600">Dashboard</span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span onClick={() => navigate("/employees")} className="cursor-pointer font-medium text-slate-400 hover:text-slate-600">Employees</span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span className="font-semibold text-slate-600">Edit Employee</span>
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Employee</h1>
        <p className="mt-1 text-sm text-slate-500">Update employee profile and department details</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-4"><h2 className="text-sm font-semibold text-slate-800">Employee Information</h2></div>
            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Employee Code</label>
                <input disabled value={data?.data?.employeeCode || ""} className="w-full cursor-not-allowed rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Full Name <span className="text-rose-500">*</span></label>
                <input required value={formData.fullName} onChange={(event) => handleInputChange("fullName", event.target.value)} placeholder="Enter legal full name" className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Father / Husband Name</label>
                <input placeholder="Enter relative full name" className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">CNIC Number</label>
                <input placeholder="e.g. 37405-1234567-1" className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100" />
              </div>
              <div className="grid grid-cols-1 gap-5 md:col-span-2 md:grid-cols-3">
                <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Date of Birth</label><input placeholder="YYYY-MM-DD" className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100" /></div>
                <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Gender</label><div className="relative"><select defaultValue="" className="w-full appearance-none rounded-md border border-slate-200 bg-white py-2 pl-3 pr-10 text-sm text-slate-700 outline-none"><option value="" disabled>Select gender</option><option>Male</option><option>Female</option><option>Other</option></select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /></div></div>
                <div><label className="mb-2 block text-sm font-medium text-slate-700">Status</label><div className="flex items-center gap-3"><Switch isSelected={isActive} onValueChange={setIsActive} classNames={{ wrapper: isActive ? "bg-[#008951]" : "bg-slate-200" }} size="sm" /><span className={`text-sm font-semibold ${isActive ? "text-[#008951]" : "text-slate-500"}`}>{isActive ? "Active Employee" : "Inactive Employee"}</span></div></div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="h-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-4"><h2 className="text-sm font-semibold text-slate-800">Employment Details</h2></div>
            <div className="space-y-5 p-5">
              <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Department</label><div className="relative"><select value={formData.departmentName} onChange={(event) => handleInputChange("departmentName", event.target.value)} className="w-full appearance-none rounded-md border border-slate-200 bg-white py-2 pl-3 pr-10 text-sm text-slate-700 outline-none"><option value="">Select Department</option><option>Operations</option><option>Finance</option><option>Maintenance</option><option>Admin</option><option>Sales</option><option>Security</option><option>HR</option></select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /></div></div>
              <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Job Title / Designation</label><input value={formData.jobTitle} onChange={(event) => handleInputChange("jobTitle", event.target.value)} placeholder="e.g. Plant Operator" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#008951]" /></div>
              <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Date of Joining</label><input type="date" value={formData.joiningDate} onChange={(event) => handleInputChange("joiningDate", event.target.value)} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#008951]" /></div>
              <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Monthly Salary (Rs.)</label><input type="number" value={formData.monthlySalaryAmount} onChange={(event) => handleInputChange("monthlySalaryAmount", event.target.value)} placeholder="e.g. 45,000" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#008951]" /></div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-3">
          <div className="border-b border-slate-200 p-4"><h2 className="text-sm font-semibold text-slate-800">Contact & Emergency Details</h2></div>
          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
            <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Phone Number <span className="text-rose-500">*</span></label><input required value={formData.phoneNumber} onChange={(event) => handleInputChange("phoneNumber", event.target.value)} placeholder="e.g. 0300-5550011" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#008951]" /></div>
            <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Email Address</label><input type="email" value={formData.emailAddress} onChange={(event) => handleInputChange("emailAddress", event.target.value)} placeholder="e.g. ahmad.h@brotherlpg.com" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#008951]" /></div>
            <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Emergency Contact Name</label><input placeholder="e.g. Muhammad Hassan (Brother)" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#008951]" /></div>
            <div><label className="mb-1.5 block text-sm font-medium text-slate-700">Emergency Contact Phone</label><input placeholder="e.g. 0301-9998877" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#008951]" /></div>
            <div className="md:col-span-2"><label className="mb-1.5 block text-sm font-medium text-slate-700">Home Address</label><input placeholder="Street Address, Sector/Area, City" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#008951]" /></div>
          </div>
        </div>

        <div className="flex justify-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-3">
          <button type="button" onClick={() => navigate("/employees")} className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700">Cancel</button>
          <button type="submit" disabled={updateMutation.isPending} className="rounded-lg bg-[#008951] px-6 py-2 text-sm font-medium text-white disabled:opacity-60">{updateMutation.isPending ? "Saving..." : "Update Profile"}</button>
        </div>
      </form>
    </main>
  );
}

export default UpdateEmployee;
