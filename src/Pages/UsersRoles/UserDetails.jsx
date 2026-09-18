import {
  Clock,
  Mail,
  Pencil,
  Phone,
  Shield,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useRoleById } from "../../queries/roles/roles.queries";
import { useUserById } from "../../queries/users/users.queries";
import { usePermissions } from "../../contexts/PermissionContext";

function getInitials(name) {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function accessTone(label) {
  const text = String(label || "").toLowerCase();
  if (text.includes("full")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  }
  if (text.includes("view") || text.includes("read")) {
    return "bg-blue-50 text-blue-700 border-blue-100";
  }
  if (text.includes("no access") || text.includes("none")) {
    return "bg-slate-100 text-slate-500 border-slate-200";
  }
  return "bg-amber-50 text-amber-700 border-amber-100";
}

function DetailItem({ label, value, children }) {
  return (
    <div className="rounded-lg bg-slate-50/80 px-3.5 py-3">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-BLUE-dark wrap-break-word">
        {children || value || "—"}
      </dd>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    emerald: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
    amber: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2 ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="truncate text-lg font-bold text-BLUE-dark">{value}</p>
        </div>
      </div>
    </div>
  );
}

function UserDetails() {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const { id } = useParams();
  const { data, isLoading, error } = useUserById(id);
  const user = data?.data?.user || data?.data;
  const roleId = user?.roleId || user?.role?._id;
  const { data: roleData } = useRoleById(roleId);
  const selectedRole = roleData?.data?.role || roleData?.data || user?.role;
  const permissions = selectedRole?.permissionsPreview || [];
  const permissionMatrix = selectedRole?.permissionMatrix || [];

  if (isLoading) {
    return (
      <main className="flex min-h-full items-center justify-center bg-[#F8FAFC] p-8 text-sm text-slate-500">
        Loading user...
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="flex min-h-full items-center justify-center bg-[#F8FAFC] p-8 text-sm text-red-500">
        Unable to load user.
      </main>
    );
  }

  const roleName = selectedRole?.roleName || user.role?.roleName || "Unassigned";
  const employeeName =
    user.employeeId?.fullName || user.employeeId?.employeeCode || "";
  const employeeId = user.employeeId?._id || user.employeeId;
  const isActive = Boolean(user.isActive);
  const grantedActions = permissionMatrix.reduce(
    (count, moduleEntry) =>
      count +
      (moduleEntry.actions || []).filter((action) => action.granted === true)
        .length,
    0
  );

  return (
    <main className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs mb-2">
            <span
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
            >
              Dashboard
            </span>
            <span className="px-1 text-slate-400">/</span>
            <span
              onClick={() => navigate("/users-roles")}
              className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
            >
              Users &amp; Roles
            </span>
            <span className="px-1 text-slate-400">/</span>
            <span className="font-semibold text-slate-600">User Details</span>
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
            {user.fullName || "User Details"}
          </h1>
          <p className="mt-1 text-sm text-tertiary">
            Account information, assigned role, and module access
          </p>
        </div>
        {can("users", "update") && (
          <button
            type="button"
            onClick={() => navigate(`/users-roles/edit/${user._id}`)}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-bg-blue px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8]"
          >
            <Pencil className="h-4 w-4" /> Edit User
          </button>
        )}
      </div>

      <section className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-primary px-5 py-6 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold text-white ring-2 ring-white/20">
                {getInitials(user.fullName)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-white">
                    {user.fullName || "—"}
                  </h2>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      isActive
                        ? "bg-emerald-400/20 text-emerald-100"
                        : "bg-white/15 text-slate-200"
                    }`}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-white/80">
                  {user.username ? `@${user.username}` : "No username"}
                </p>
                <p className="mt-1 text-sm text-white/70">{roleName}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-white/85 sm:justify-end">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                {user.emailAddress || "No email"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-4 w-4" />
                {user.phoneNumber || "No phone"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={ShieldCheck}
          label="Account Status"
          value={isActive ? "Active" : "Inactive"}
          tone={isActive ? "emerald" : "slate"}
        />
        <StatCard icon={Shield} label="Assigned Role" value={roleName} tone="blue" />
        <StatCard
          icon={Clock}
          label="Last Login"
          value={user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "Never"}
          tone="amber"
        />
        <StatCard
          icon={UserRound}
          label="Module Access"
          value={`${permissions.length} permission${permissions.length === 1 ? "" : "s"}`}
          tone="slate"
        />
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-[16px] font-bold text-BLUE-dark">
              Account Information
            </h2>
          </div>
          <dl className="grid gap-3 p-5 sm:grid-cols-2">
            <DetailItem label="Full Name" value={user.fullName} />
            <DetailItem label="Username" value={user.username} />
            <DetailItem label="Email Address" value={user.emailAddress} />
            <DetailItem label="Phone Number" value={user.phoneNumber} />
            <DetailItem label="CNIC Number" value={user.cnicNumber} />
            <DetailItem
              label="Last Login"
              value={
                user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "Never"
              }
            />
           
          </dl>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-[16px] font-bold text-BLUE-dark">
              Role &amp; Security
            </h2>
          </div>
          <dl className="grid gap-3 p-5 sm:grid-cols-2">
            <DetailItem label="Assigned Role">
              {roleId && can("roles", "read") ? (
                <button
                  type="button"
                  onClick={() => navigate(`/users-roles/view-role/${roleId}`)}
                  className="text-accent-blue hover:underline"
                >
                  {roleName}
                </button>
              ) : (
                roleName
              )}
            </DetailItem>
            <DetailItem label="Linked Employee">
              {employeeName && employeeId && can("employees", "read") ? (
                <button
                  type="button"
                  onClick={() => navigate(`/employees/view/${employeeId}`)}
                  className="text-accent-blue hover:underline"
                >
                  {employeeName}
                </button>
              ) : (
                employeeName || "Not linked"
              )}
            </DetailItem>
            <DetailItem label="Status">
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </DetailItem>
            <DetailItem
              label="Granted Actions"
              value={grantedActions ? String(grantedActions) : "—"}
            />
            <div className="sm:col-span-2">
              <DetailItem
                label="Role Description"
                value={
                  selectedRole?.roleDescription ||
                  "No role description available."
                }
              />
            </div>
          </dl>
        </section>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-bold text-BLUE-dark">
              Role Permissions
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Access granted through the {roleName} role
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            {permissions.length} modules
          </span>
        </div>

        {permissions.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">
            No permissions preview available for this role.
          </p>
        ) : (
          <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
            {permissions.map((permission) => {
              const accessLabel =
                permission.accessLabel ||
                permission.level ||
                permission.access ||
                "No Access";
              return (
                <div
                  key={
                    permission._id ||
                    permission.displayName ||
                    permission.name ||
                    permission.module
                  }
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/60 px-3.5 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-BLUE-dark">
                      {permission.displayName ||
                        permission.name ||
                        permission.module ||
                        "—"}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">Module access</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${accessTone(accessLabel)}`}
                  >
                    {accessLabel}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {permissionMatrix.length > 0 && (
        <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-[16px] font-bold text-BLUE-dark">
              Permission Matrix
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Create, read, update, and delete access by module
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Module</th>
                  <th className="px-4 py-3">Create</th>
                  <th className="px-4 py-3">Read</th>
                  <th className="px-4 py-3">Update</th>
                  <th className="px-4 py-3">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {permissionMatrix.map((moduleEntry) => {
                  const actions = Object.fromEntries(
                    (moduleEntry.actions || []).map((action) => [
                      String(action.actionName || "").toLowerCase(),
                      action.granted === true,
                    ])
                  );
                  return (
                    <tr key={moduleEntry.moduleName} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium text-BLUE-dark">
                        {moduleEntry.displayName || moduleEntry.moduleName}
                      </td>
                      {["create", "read", "update", "delete"].map((actionName) => {
                        const hasAction = (moduleEntry.actions || []).some(
                          (action) =>
                            String(action.actionName || "").toLowerCase() ===
                            actionName
                        );
                        if (!hasAction) {
                          return (
                            <td key={actionName} className="px-4 py-3 text-slate-300">
                              —
                            </td>
                          );
                        }
                        const granted = actions[actionName] === true;
                        return (
                          <td key={actionName} className="px-4 py-3">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                granted
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {granted ? "Yes" : "No"}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}

export default UserDetails;
