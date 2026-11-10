import { Eye, EyeOff } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRoles } from "../../queries/roles/roles.queries";
import { useEmployees } from "../../queries/employees/employees.queries";
import { useCreateUser } from "../../queries/users/users.queries";
import { useToast } from "../../utils/GlobalToast";
import SearchableCustomerSelect from "../../components/SearchableCustomerSelect";


const badgeColors = {
  emerald: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
  slate: "bg-slate-100 text-slate-500",
};

const statusStyles = {
  Active: "bg-emerald-50 text-emerald-700",
  Inactive: "bg-slate-100 text-slate-600",
  Suspended: "bg-red-50 text-red-700",
};

const statusDotColors = {
  Active: "bg-emerald-500",
  Inactive: "bg-slate-400",
  Suspended: "bg-red-500",
};

function Field({ label, required, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-BLUE-dark text-[13px] font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
      {hint && (
        <span className="mt-1 block text-[11px] text-4th-color">{hint}</span>
      )}
    </label>
  );
}

const formatCnic = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 13);
  const parts = [digits.slice(0, 5), digits.slice(5, 12), digits.slice(12, 13)]
    .filter(Boolean);

  return parts.join("-");
};

function AddUser() {
  const navigate = useNavigate();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const createMutation = useCreateUser();

  // Refs for required fields
  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const cnicRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  // Error states
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [cnicError, setCnicError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "",
    cnic: "", username: "", password: "", confirmPassword: "",
    role: "", employee: "", status: true,
  });

  const { data: rolesData } = useRoles({ page: 1, limit: 100 });
  const { data: employeesData } = useEmployees({ page: 1, limit: 100 });
  const roles = rolesData?.data?.items || [];
  const employees = employeesData?.data?.items || [];

  const roleOptions = roles.map((role) => ({
    _id: role._id,
    label: role.name || role.roleName || role.title || role.displayName,
    searchText: `${role.name || ""} ${role.roleName || ""} ${role.title || ""} ${role.displayName || ""}`.toLowerCase(),
  }));
  const employeeOptions = employees.map((employee) => ({
    _id: employee._id,
    label: `${employee.fullName} (${employee.employeeCode})`,
    searchText: `${employee.fullName || ""} ${employee.employeeCode || ""}`.toLowerCase(),
  }));

  const selectedRole = roles.find((currentRole) => currentRole._id === form.role);
  const permissionRows = Array.isArray(selectedRole?.permissionsPreview)
    ? selectedRole.permissionsPreview.map((permission) => {
        const level = permission.accessLabel || permission.level || permission.access || permission.accessLevel || "No Access";
        const color = level.toLowerCase().includes("full")
          ? "emerald"
          : level.toLowerCase().includes("view")
            ? "blue"
            : "slate";

        return [
          permission.displayName || permission.name || permission.module || permission.permissionName || permission.label,
          level,
          color,
        ];
      })
    : [];

  const inputClass =
    "w-full rounded border border-[#E5E7EB] bg-white px-2.5 py-2 text-[13px] text-BLUE-dark outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const selectClass =
    "w-full rounded border border-[#E5E7EB] bg-[#F9FAFB] px-2.5 py-2 text-[13px] text-BLUE-dark outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));

    // Clear errors on change
    if (key === 'fullName') setFullNameError("");
    if (key === 'email') setEmailError("");
    if (key === 'phone') setPhoneError("");
    if (key === 'cnic') setCnicError("");
    if (key === 'username') setUsernameError("");
    if (key === 'password') setPasswordError("");
  };

  const validateForm = () => {
    let hasError = false;

    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      setFullNameError("Full name must contain at least 2 characters");
      fullNameRef.current?.focus();
      hasError = true;
    }

    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setEmailError("Invalid email address");
      if (!hasError) emailRef.current?.focus();
      hasError = true;
    }

    if (!form.phone.trim()) {
      setPhoneError("Phone number is required");
      if (!hasError) phoneRef.current?.focus();
      hasError = true;
    }

    if (!form.cnic.trim()) {
      setCnicError("CNIC number is required");
      if (!hasError) cnicRef.current?.focus();
      hasError = true;
    }

    if (!form.username.trim() || form.username.trim().length < 3) {
      setUsernameError("Username must be at least 3 characters");
      if (!hasError) usernameRef.current?.focus();
      hasError = true;
    } else if (!/^[a-zA-Z][a-zA-Z0-9._]*$/.test(form.username)) {
      setUsernameError("Username must start with a letter and contain only letters, numbers, dots or underscores");
      if (!hasError) usernameRef.current?.focus();
      hasError = true;
    }

    if (!form.password.trim() || form.password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      if (!hasError) passwordRef.current?.focus();
      hasError = true;
    }

    return !hasError;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Password and Confirm Password do not match.");
      return;
    }

    if (!form.role || !roles.some((currentRole) => currentRole._id === form.role)) {
      toast.error("Please select a valid role.");
      return;
    }

    try {
      setLoading(true);

      const userData = {
        fullName: form.fullName,
        emailAddress: form.email,
        phoneNumber: form.phone,
        cnicNumber: form.cnic.replace(/\D/g, ""),
        username: form.username,
        password: form.password,
        confirmPassword: form.confirmPassword,
        roleId: form.role,
        employeeId: form.employee,
        isActive: form.status,
      };

      await createMutation.mutateAsync(userData);
      toast.success("User created successfully!");
      navigate("/users-roles");
    } catch (error) {
      const firstError = error?.response?.data?.errors?.[0];
      const mainMessage = error?.response?.data?.message;
      const errorMessage = firstError
        ? `${firstError.path}: ${firstError.message}`
        : mainMessage || "Failed to create user. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <p className="text-xs">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
            >
              Dashboard
            </button>
            <span className="px-1">/</span>
            <button
              type="button"
              onClick={() => navigate("/users-roles")}
              className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
            >
              Users &amp; Roles
            </button>
            <span className="px-1">/</span> Add User
          </p>
          <h1 className=" text-2xl font-bold tracking-tight text-BLUE-dark mt-2">
            Add User
          </h1>
          <p className="text-sm text-tertiary">
            Create a new system user account and assign role permissions
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.65fr_1fr]">
          <div className="space-y-3">
            <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
              <h2 className="border-b border-slate-100 px-3 py-2 text-[16px] font-bold text-BLUE-dark">
                User Information
              </h2>
              <div className="grid gap-x-2.5 gap-y-2.5 p-3 sm:grid-cols-2">
                <Field label="Full Name" required>
                  <input
                    ref={fullNameRef}
                    value={form.fullName}
                    onChange={update("fullName")}
                    className={`${inputClass} ${fullNameError ? "border-red-400 focus:border-red-500 focus:ring-red-100" : ""}`}
                    placeholder="Bilal Hassan"
                  />
                  {fullNameError && (
                    <span className="mt-1 block text-[11px] text-red-500">{fullNameError}</span>
                  )}
                </Field>
                <Field label="Email Address" required>
                  <input
                    ref={emailRef}
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    className={`${inputClass} ${emailError ? "border-red-400 focus:border-red-500 focus:ring-red-100" : ""}`}
                    placeholder="bilal.hassan@almanida-lpg.pk"
                  />
                  {emailError && (
                    <span className="mt-1 block text-[11px] text-red-500">{emailError}</span>
                  )}
                </Field>
                <Field label="Phone Number" required>
                  <input
                    ref={phoneRef}
                    value={form.phone}
                    onChange={update("phone")}
                    className={`${inputClass} ${phoneError ? "border-red-400 focus:border-red-500 focus:ring-red-100" : ""}`}
                    placeholder="0321-5678901"
                  />
                  {phoneError && (
                    <span className="mt-1 block text-[11px] text-red-500">{phoneError}</span>
                  )}
                </Field>
                <Field
                  label="CNIC Number"
                  required
                  hint="13-digit Pakistan National ID Card number."
                >
                  <input
                    ref={cnicRef}
                    value={form.cnic}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        cnic: formatCnic(event.target.value),
                      }))
                    }
                    className={`${inputClass} ${cnicError ? "border-red-400 focus:border-red-500 focus:ring-red-100" : ""}`}
                    placeholder="35201-1234567-9"
                  />
                  {cnicError && (
                    <span className="mt-1 block text-[11px] text-red-500">{cnicError}</span>
                  )}
                </Field>
              </div>
            </section>

            <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
              <h2 className="border-b border-slate-100 px-3 py-2 text-[16px] font-bold text-BLUE-dark">
                Login Credentials
              </h2>
              <div className="grid gap-x-2.5 gap-y-2.5 p-3 sm:grid-cols-2">
                <Field label="Username" required>
                  <input
                    ref={usernameRef}
                    value={form.username}
                    onChange={update("username")}
                    className={`${inputClass} sm:col-span-2 ${usernameError ? "border-red-400 focus:border-red-500 focus:ring-red-100" : ""}`}
                    placeholder="bilal.hassan"
                  />
                  {usernameError && (
                    <span className="mt-1 block text-[11px] text-red-500">{usernameError}</span>
                  )}
                </Field>
                <Field label="Password" required>
                  <span className="relative block">
                    <input
                      ref={passwordRef}
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={update("password")}
                      className={`${inputClass} pr-8 ${passwordError ? "border-red-400 focus:border-red-500 focus:ring-red-100" : ""}`}
                      placeholder="********"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </span>
                  {passwordError && (
                    <span className="mt-1 block text-[11px] text-red-500">{passwordError}</span>
                  )}
                </Field>
                <Field label="Confirm Password" required>
                  <span className="relative block">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={update("confirmPassword")}
                      className={`${inputClass} pr-8`}
                      placeholder="********"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={13} />
                      ) : (
                        <Eye size={13} />
                      )}
                    </button>
                  </span>
                </Field>
              </div>
            </section>
          </div>

          <div className="space-y-3">
            <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
              <h2 className="border-b border-slate-100 px-3 py-2 text-[16px] font-bold text-BLUE-dark">
                Role &amp; Security Config
              </h2>
              <div className="space-y-2.5 p-3">
                <Field label="Assigned Role" required>
                  <SearchableCustomerSelect
                    customers={roleOptions}
                    value={form.role}
                    onChange={(option) => update("role")({ target: { value: option?._id || "" } })}
                    placeholder="Select the Assigned Role"
                    getLabel={(option) => option.label}
                    getSearchText={(option) => option.searchText || option.label.toLowerCase()}
                    emptyText="No role found"
                  />
                </Field>
                <Field label="Linked Employee">
                  <SearchableCustomerSelect
                    customers={employeeOptions}
                    value={form.employee}
                    onChange={(option) => update("employee")({ target: { value: option?._id || "" } })}
                    placeholder="Not linked"
                    getLabel={(option) => option.label}
                    getSearchText={(option) => option.searchText || option.label.toLowerCase()}
                    emptyText="No employee found"
                  />
                </Field>
                <p className="rounded bg-slate-50 px-2 py-2 text-[12px] leading-3 ">
                  <span>Role Description:</span>
                  <span className="text-4th-color ms-2">
                    {selectedRole?.roleDescription ||
                      "No role description available."}
                  </span>
                </p>
                <Field label="Status">
                  <span className="relative block">
                    <span
                      className={`pointer-events-none absolute left-3 top-1/2 z-10 h-1.5 w-1.5 -translate-y-1/2 rounded-full ${statusDotColors[form.status ? "Active" : "Inactive"]}`}
                    />
                    <select
                      value={String(form.status)}
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          status: e.target.value === "true",
                        }))
                      }
                      className={`${selectClass} pl-6 ${statusStyles[form.status ? "Active" : "Inactive"]}`}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </span>
                </Field>
              </div>
            </section>

            <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
              <h2 className="border-b border-slate-100 px-3 py-2 text-[16px] font-bold text-BLUE-dark">
                Role Permissions Preview
              </h2>
              <div className="divide-y divide-slate-100 px-3 h-80 overflow-auto">
                {permissionRows.length === 0 ? (
                  <p className="py-3 text-[13px] text-slate-500">
                    No permissions preview available.
                  </p>
                ) : (
                  permissionRows.map(([name, level, color]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between py-3 text-[13px] font-medium text-BLUE-dark "
                    >
                      <span>{name}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${badgeColors[color]}`}
                      >
                        {level}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate("/users-roles")}
            className="rounded border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-gradient-bg-blue px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AddUser;
