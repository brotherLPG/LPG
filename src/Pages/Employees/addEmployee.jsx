import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useCreateEmployee, useEmployeeFormOptions } from "../../queries/employees/employees.queries";
import { useToast } from "../../utils/GlobalToast";

function AddEmployee() {
  const navigate = useNavigate();
  const toast = useToast();
  const [isActive, setIsActive] = useState(true);
  const createMutation = useCreateEmployee();
  const { data: formOptions, isLoading: optionsLoading } = useEmployeeFormOptions();

  // Refs for required fields
  const fullNameRef = useRef(null);
  const cnicNumberRef = useRef(null);
  const phoneNumberRef = useRef(null);

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    }
  };

  // Error states
  const [fullNameError, setFullNameError] = useState("");
  const [cnicNumberError, setCnicNumberError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    fatherHusbandName: "",
    cnicNumber: "",
    dateOfBirth: "",
    gender: "",
    departmentName: "",
    jobTitle: "",
    joiningDate: "",
    monthlySalaryAmount: "",
    phoneNumber: "",
    emailAddress: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    homeAddress: "",
  });

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 4) return digits;
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  };

  const formatCnicNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 13);
    if (digits.length <= 5) return digits;
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
  };

  const handleInputChange = (field, value) => {
    const nextValue = field === "phoneNumber" ? formatPhoneNumber(value) : field === "cnicNumber" ? formatCnicNumber(value) : value;
    setFormData((previous) => ({ ...previous, [field]: nextValue }));

    // Clear errors on change
    if (field === 'fullName') setFullNameError("");
    if (field === 'cnicNumber') setCnicNumberError("");
    if (field === 'phoneNumber') setPhoneNumberError("");
  };

  const validateForm = () => {
    let hasError = false;

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setFullNameError("Full name must contain at least 2 characters");
      fullNameRef.current?.focus();
      hasError = true;
    }

    const cnicDigits = formData.cnicNumber.replace(/\D/g, "");
    if (!cnicDigits || cnicDigits.length !== 13) {
      setCnicNumberError("CNIC must be exactly 13 digits (e.g. 35201-1234567-9)");
      if (!hasError) cnicNumberRef.current?.focus();
      hasError = true;
    }

    if (!formData.phoneNumber.trim()) {
      setPhoneNumberError("Phone number is required");
      if (!hasError) phoneNumberRef.current?.focus();
      hasError = true;
    }

    return !hasError;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createMutation.mutateAsync({
        fullName: formData.fullName,
        fatherHusbandName: formData.fatherHusbandName,
        cnicNumber: formData.cnicNumber,
        dateOfBirth: formData.dateOfBirth || null,
        gender: formData.gender,
        departmentName: formData.departmentName,
        jobTitle: formData.jobTitle,
        joiningDate: formData.joiningDate || null,
        monthlySalaryAmount: Number(formData.monthlySalaryAmount) || 0,
        phoneNumber: formData.phoneNumber,
        emailAddress: formData.emailAddress,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone,
        homeAddress: formData.homeAddress,
        employmentStatus: isActive ? "active" : "inactive",
      });
      toast.success("Employee created successfully!");
      navigate("/employees");
    } catch (error) {
      const firstError = error?.response?.data?.errors?.[0];
      const mainMessage = error?.response?.data?.message;
      const errorMessage = firstError
        ? `${firstError.path}: ${firstError.message}`
        : mainMessage || "Failed to create employee. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <main className="min-h-full bg-[#F8FAFC] dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      {/* Header & Breadcrumbs */}
      <div className="mb-6">
        <p className="text-xs mb-2">
          <span
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer font-medium text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-400 transition-colors duration-200"
          >
            Dashboard
          </span>{" "}
          <span className="px-1 text-slate-400 dark:text-gray-500">/</span>{" "}
          <span
            onClick={() => navigate("/employees")}
            className="cursor-pointer font-medium text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-400 transition-colors duration-200"
          >
            Employees
          </span>{" "}
          <span className="px-1 text-slate-400 dark:text-gray-500">/</span>{" "}
          <span className="font-semibold text-slate-600 dark:text-gray-400">Add Employee</span>
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-gray-100">
          Add Employee
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
          Create a new employee profile and assign department details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Employee Information */}
          <div className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 dark:border-gray-700 p-4">
              <h2 className="text-sm font-semibold text-slate-800 dark:text-gray-100">
                Employee Information
              </h2>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">
                  Employee Code
                </label>
                <input
                  type="text"
                  disabled
                  value={formOptions?.data?.nextEmployeeCode || "Loading..."}
                  className="w-full rounded-md border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 px-3 py-2 text-sm text-slate-500 dark:text-gray-400 outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">
                  Full Name <span className="text-rose-500 dark:text-rose-400">*</span>
                </label>
                <input
                  ref={fullNameRef}
                  autoFocus
                  type="text"
                  value={formData.fullName}
                  onChange={(event) => handleInputChange("fullName", event.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, phoneNumberRef)}
                  placeholder="Enter legal full name"
                  className={`w-full rounded-md border bg-white dark:bg-gray-900 px-3 py-2 text-sm text-slate-900 dark:text-gray-100 outline-none focus:ring-2 ${
                    fullNameError
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
                      : "border-slate-200 dark:border-gray-700 focus:border-[#008951] focus:ring-emerald-100"
                  }`}
                />
                {fullNameError && (
                  <p className="mt-1.5 text-xs text-rose-500 dark:text-rose-400">{fullNameError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">
                  Father / Husband Name
                </label>
                <input
                  type="text"
                  value={formData.fatherHusbandName}
                  onChange={(event) => handleInputChange("fatherHusbandName", event.target.value)}
                  placeholder="Enter relative full name"
                  className="w-full rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-slate-900 dark:text-gray-100 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">
                  CNIC Number
                </label>
                <input
                  ref={cnicNumberRef}
                  type="text"
                  value={formData.cnicNumber}
                  onChange={(event) => handleInputChange("cnicNumber", event.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, phoneNumberRef)}
                  placeholder="e.g. 35201-1234567-9"
                  maxLength={15}
                  className="w-full rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-slate-900 dark:text-gray-100 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
                {cnicNumberError && (
                  <p className="mt-1 text-xs text-red-500">{cnicNumberError}</p>
                )}
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(event) => handleInputChange("dateOfBirth", event.target.value)}
                    className="w-full rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-slate-900 dark:text-gray-100 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      value={formData.gender}
                      onChange={(event) => handleInputChange("gender", event.target.value)}
                      disabled={optionsLoading}
                      className="w-full appearance-none rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-3 pr-10 py-2 text-sm text-slate-700 dark:text-gray-300 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="" disabled>Select gender</option>
                      {formOptions?.data?.genders?.map((gender) => (
                        <option key={gender.value} value={gender.value}>
                          {gender.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-gray-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={isActive ? "active" : "inactive"}
                      onChange={(event) => setIsActive(event.target.value === "active")}
                      disabled={optionsLoading}
                      className="w-full appearance-none rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-3 pr-10 py-2 text-sm text-slate-700 dark:text-gray-300 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                    >
                      {formOptions?.data?.statuses?.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (lg:col-span-1) */}
        <div className="lg:col-span-1">
          {/* Card 2: Employment Details */}
          <div className="rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden h-full">
            <div className="border-b border-slate-200 dark:border-gray-700 p-4">
              <h2 className="text-sm font-semibold text-slate-800 dark:text-gray-100">
                Employment Details
              </h2>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">
                  Department
                </label>
                <div className="relative">
                  <select
                    value={formData.departmentName}
                    onChange={(event) => handleInputChange("departmentName", event.target.value)}
                    disabled={optionsLoading}
                    className="w-full appearance-none rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-3 pr-10 py-2 text-sm text-slate-700 dark:text-gray-300 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="" disabled>Select Department</option>
                    {formOptions?.data?.departments?.map((dept) => (
                      <option key={dept.value} value={dept.value}>
                        {dept.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-gray-500 pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">
                  Job Title / Designation
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(event) => handleInputChange("jobTitle", event.target.value)}
                  placeholder="e.g. Plant Operator"
                  className="w-full rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-slate-900 dark:text-gray-100 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">
                  Date of Joining
                </label>
                <input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(event) => handleInputChange("joiningDate", event.target.value)}
                  placeholder="YYYY-MM-DD"
                  className="w-full rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-slate-900 dark:text-gray-100 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">
                  Monthly Salary (Rs.)
                </label>
                <input
                  type="number"
                  value={formData.monthlySalaryAmount}
                  onChange={(event) => handleInputChange("monthlySalaryAmount", event.target.value)}
                  placeholder="e.g. 45,000"
                  className="w-full rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-slate-900 dark:text-gray-100 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Card 3: Contact & Emergency Details */}
        <div className="lg:col-span-3 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 dark:border-gray-700 p-4">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-gray-100">
              Contact & Emergency Details
            </h2>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">
                Phone Number <span className="text-rose-500 dark:text-rose-400">*</span>
              </label>
              <input
                ref={phoneNumberRef}
                type="text"
                value={formData.phoneNumber}
                onChange={(event) => handleInputChange("phoneNumber", event.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="e.g. 0321-5678901"
                className={`w-full rounded-md border bg-white dark:bg-gray-900 px-3 py-2 text-sm text-slate-900 dark:text-gray-100 outline-none focus:ring-2 ${
                  phoneNumberError
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
                    : "border-slate-200 dark:border-gray-700 focus:border-[#008951] focus:ring-emerald-100"
                }`}
              />
              {phoneNumberError && (
                <p className="mt-1.5 text-xs text-rose-500 dark:text-rose-400">{phoneNumberError}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={formData.emailAddress}
                onChange={(event) => handleInputChange("emailAddress", event.target.value)}
                placeholder="e.g. ahmad.h@brotherlpg.com"
                className="w-full rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-slate-900 dark:text-gray-100 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">
                Emergency Contact Name
              </label>
              <input
                type="text"
                value={formData.emergencyContactName}
                onChange={(event) => handleInputChange("emergencyContactName", event.target.value)}
                placeholder="e.g. Muhammad Hassan (Brother)"
                className="w-full rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-slate-900 dark:text-gray-100 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">
                Emergency Contact Phone
              </label>
              <input
                type="text"
                value={formData.emergencyContactPhone}
                onChange={(event) => handleInputChange("emergencyContactPhone", event.target.value)}
                placeholder="e.g. 0301-9998877"
                className="w-full rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-slate-900 dark:text-gray-100 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1.5">
                Home Address
              </label>
              <input
                type="text"
                value={formData.homeAddress}
                onChange={(event) => handleInputChange("homeAddress", event.target.value)}
                placeholder="Street Address, Sector/Area, City"
                className="w-full rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-slate-900 dark:text-gray-100 outline-none focus:border-[#008951] focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>
        </div>

      {/* Bottom Action Bar */}
      <div className="mt-6 flex justify-end gap-3 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm lg:col-span-3">
        <button
          type="button"
          onClick={() => navigate("/employees")}
          className="rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-5 py-2 text-sm font-medium text-slate-700 dark:text-gray-300 transition hover:bg-slate-50 dark:hover:bg-gray-800"
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
