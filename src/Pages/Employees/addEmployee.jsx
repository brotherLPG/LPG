import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { useCreateEmployee } from "../../queries/employees/employees.queries";
import { useToast } from "../../utils/GlobalToast";

function AddEmployee() {
  const navigate = useNavigate();
  const toast = useToast();
  const [isActive, setIsActive] = useState(true);
  const createMutation = useCreateEmployee();
  const [formData, setFormData] = useState({
    fullName: "",
    departmentName: "",
    jobTitle: "",
    phoneNumber: "",
    emailAddress: "",
    joiningDate: "",
    monthlySalaryAmount: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createMutation.mutateAsync({
        ...formData,
        monthlySalaryAmount: Number(formData.monthlySalaryAmount) || 0,
        joiningDate: formData.joiningDate || null,
        employmentStatus: isActive ? "active" : "inactive",
      });
      toast.success("Employee created successfully!");
      navigate("/employees");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create employee. Please try again.");
    }
  };

  return (
    <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      {/* Header & Breadcrumbs */}
      <div className="mb-6">
        <p className="text-xs mb-2">
          <span
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            Dashboard
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span
            onClick={() => navigate("/employees")}
            className="cursor-pointer font-medium text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            Employees
          </span>{" "}
          <span className="px-1 text-slate-400">/</span>{" "}
          <span className="font-semibold text-slate-600">Add Employee</span>
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Add Employee
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create a new employee profile and assign department details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Employee Information */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-800">
                Employee Information
              </h2>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Employee Code
                </label>
                <input
                  type="text"
                  disabled
                  value="EMP-009 (Auto-generated)"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(event) => handleInputChange("fullName", event.target.value)}
                  placeholder="Enter legal full name"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Father / Husband Name
                </label>
                <input
                  type="text"
                  placeholder="Enter relative full name"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  CNIC Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 37405-1234567-1"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Date of Birth
                  </label>
                  <input
                    type="text"
                    value={formData.departmentName}
                    onChange={(event) => handleInputChange("departmentName", event.target.value)}
                    placeholder="YYYY-MM-DD"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      defaultValue=""
                      className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="" disabled>Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status
                  </label>
                  <div className="flex items-center gap-3">
                    <Switch
                      isSelected={isActive}
                      onValueChange={setIsActive}
                      classNames={{
                        wrapper: isActive ? "bg-[#008951]" : "bg-slate-200",
                      }}
                      size="sm"
                    />
                    <span className={`text-sm font-semibold ${isActive ? "text-[#008951]" : "text-slate-500"}`}>
                      Active Employee
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (lg:col-span-1) */}
        <div className="lg:col-span-1">
          {/* Card 2: Employment Details */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-full">
            <div className="border-b border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-800">
                Employment Details
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Department
                </label>
                <div className="relative">
                  <select
                    defaultValue=""
                    className="w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-10 py-2 text-sm text-slate-700 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="" disabled>Select Department</option>
                    <option value="Operations">Operations</option>
                    <option value="Finance">Finance</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Admin">Admin</option>
                    <option value="Sales">Sales</option>
                    <option value="Security">Security</option>
                    <option value="HR">HR</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Job Title / Designation
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(event) => handleInputChange("jobTitle", event.target.value)}
                  placeholder="e.g. Plant Operator"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Date of Joining
                </label>
                <input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(event) => handleInputChange("joiningDate", event.target.value)}
                  placeholder="YYYY-MM-DD"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Monthly Salary (Rs.)
                </label>
                <input
                  type="number"
                  value={formData.monthlySalaryAmount}
                  onChange={(event) => handleInputChange("monthlySalaryAmount", event.target.value)}
                  placeholder="e.g. 45,000"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Card 3: Contact & Emergency Details */}
        <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-800">
              Contact & Emergency Details
            </h2>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(event) => handleInputChange("phoneNumber", event.target.value)}
                placeholder="e.g. 0300-5550011"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={formData.emailAddress}
                onChange={(event) => handleInputChange("emailAddress", event.target.value)}
                placeholder="e.g. ahmad.h@brotherlpg.com"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Emergency Contact Name
              </label>
              <input
                type="text"
                placeholder="e.g. Muhammad Hassan (Brother)"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Emergency Contact Phone
              </label>
              <input
                type="text"
                placeholder="e.g. 0301-9998877"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Home Address
              </label>
              <input
                type="text"
                placeholder="Street Address, Sector/Area, City"
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>
        </div>

      {/* Bottom Action Bar */}
      <div className="mt-6 flex justify-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-3">
        <button
          type="button"
          onClick={() => navigate("/employees")}
          className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg bg-[#008951] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#007545]"
        >
          {createMutation.isPending ? "Saving..." : "Save Profile"}
        </button>
      </div>
      </form>
    </main>
  );
}

export default AddEmployee;
