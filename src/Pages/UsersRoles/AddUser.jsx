import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../api/users.api";
import { useRoles } from "../../queries/roles/roles.queries";
import { useEmployees } from "../../queries/employees/employees.queries";
import { useToast } from "../../utils/GlobalToast";


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
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "",
    cnic: "", username: "", password: "", confirmPassword: "",
    role: "", employee: "", status: true,
  });

  const { data: rolesData } = useRoles({ page: 1, limit: 100 });
  const { data: employeesData } = useEmployees({ page: 1, limit: 100 });
  const roles = rolesData?.data?.items || [];
  const employees = employeesData?.data?.items || [];

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
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const handleSubmit = async (event) => {
    event.preventDefault();

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

      const response = await createUser(userData);
      toast.success("User created successfully!");
      navigate("/users-roles");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user. Please try again.");
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
                    value={form.fullName}
                    onChange={update("fullName")}
                    className={inputClass}
                    placeholder="Bilal Hassan"
                  />
                </Field>
                <Field label="Email Address" required>
                  <input
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    className={inputClass}
                    placeholder="bilal.hassan@almanida-lpg.pk"
                  />
                </Field>
                <Field label="Phone Number" required>
                  <input
                    value={form.phone}
                    onChange={update("phone")}
                    className={inputClass}
                    placeholder="0321-5678901"
                  />
                </Field>
                <Field
                  label="CNIC Number"
                  required
                  hint="13-digit Pakistan National ID Card number."
                >
                  <input
                    value={form.cnic}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        cnic: formatCnic(event.target.value),
                      }))
                    }
                    className={inputClass}
                    placeholder="35201-1234567-9"
                  />
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
                    value={form.username}
                    onChange={update("username")}
                    className={`${inputClass} sm:col-span-2`}
                    placeholder="bilal.hassan"
                  />
                </Field>
                <Field label="Password" required>
                  <span className="relative block">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={update("password")}
                      className={`${inputClass} pr-8`}
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
                  <select
                    value={form.role}
                    onChange={update("role")}
                    className={selectClass}
                  >
                    <option value="">
                      Select the Assigned Role
                    </option>
                    {roles.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.name || r.roleName || r.title || r.displayName}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Linked Employee">
                  <select
                    value={form.employee}
                    onChange={update("employee")}
                    className={selectClass}
                  >
                    <option value="">Not linked</option>
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.fullName} ({employee.employeeCode})
                      </option>
                    ))}
                  </select>
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
