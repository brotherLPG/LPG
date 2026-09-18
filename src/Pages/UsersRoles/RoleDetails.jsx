import {
  KeyRound,
  Layers,
  Pencil,
  Shield,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useRoleById } from "../../queries/roles/roles.queries";
import { usePermissions } from "../../contexts/PermissionContext";

function getInitials(name) {
  if (!name) return "R";
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

function actionLabel(name) {
  return String(name || "")
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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

function RoleDetails() {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const { id } = useParams();
  const { data, isLoading, error } = useRoleById(id);
  const role = data?.data?.role || data?.data;
  const permissionsPreview = role?.permissionsPreview || [];
  const permissionMatrix = role?.permissionMatrix || [];

  if (isLoading) {
    return (
      <main className="flex min-h-full items-center justify-center bg-[#F8FAFC] p-8 text-sm text-slate-500">
        Loading role...
      </main>
    );
  }

  if (error || !role) {
    return (
      <main className="flex min-h-full items-center justify-center bg-[#F8FAFC] p-8 text-sm text-red-500">
        Unable to load role.
      </main>
    );
  }

  const roleName = role.roleName || role.name || "Role";
  const isActive = role.isActive !== false;
  const userCount = role.userCount != null ? Number(role.userCount) : 0;
  const permissionIdCount =
    role.permissionIds?.length || role.defaultPermissionIds?.length || 0;
  const grantedActions = permissionMatrix.reduce(
    (count, moduleEntry) =>
      count +
      (moduleEntry.actions || []).filter((action) => action.granted === true)
        .length,
    0
  );

  const preferredActions = ["create", "read", "update", "delete", "approve", "export"];
  const discoveredActions = [
    ...new Set(
      permissionMatrix.flatMap((moduleEntry) =>
        (moduleEntry.actions || []).map((action) =>
          String(action.actionName || "").toLowerCase()
        )
      )
    ),
  ].filter(Boolean);
  const matrixActions = [
    ...preferredActions.filter((action) => discoveredActions.includes(action)),
    ...discoveredActions.filter((action) => !preferredActions.includes(action)),
  ];
  const actionColumns = matrixActions.length
    ? matrixActions
    : ["create", "read", "update", "delete"];

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
            <span className="font-semibold text-slate-600">Role Details</span>
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
            {roleName}
          </h1>
          <p className="mt-1 text-sm text-tertiary">
            Role information, assigned users, and module access permissions
          </p>
        </div>
        {can("roles", "update") && (
          <button
            type="button"
            onClick={() => navigate(`/users-roles/edit-role/${role._id}`)}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-bg-blue px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8]"
          >
            <Pencil className="h-4 w-4" /> Edit Role
          </button>
        )}
      </div>

      <section className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-primary px-5 py-6 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold text-white ring-2 ring-white/20">
                {getInitials(roleName)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-white">{roleName}</h2>
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
                <p className="mt-1 max-w-xl text-sm text-white/80">
                  {role.roleDescription || "No description available."}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-white/85 sm:justify-end">
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {userCount} user{userCount === 1 ? "" : "s"} assigned
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Layers className="h-4 w-4" />
                {permissionsPreview.length} modules
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={ShieldCheck}
          label="Role Status"
          value={isActive ? "Active" : "Inactive"}
          tone={isActive ? "emerald" : "slate"}
        />
        <StatCard
          icon={Users}
          label="Users Assigned"
          value={String(userCount)}
          tone="blue"
        />
        <StatCard
          icon={Shield}
          label="Modules with Access"
          value={String(permissionsPreview.length)}
          tone="amber"
        />
        <StatCard
          icon={KeyRound}
          label="Granted Actions"
          value={String(grantedActions || permissionIdCount)}
          tone="slate"
        />
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-[16px] font-bold text-BLUE-dark">
              Role Information
            </h2>
          </div>
          <dl className="grid gap-3 p-5 sm:grid-cols-2">
            <DetailItem label="Role Name" value={roleName} />
            <DetailItem label="Users Assigned" value={String(userCount)} />
            
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
            <div className="sm:col-span-2">
              <DetailItem
                label="Description"
                value={role.roleDescription || "No description available."}
              />
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-[16px] font-bold text-BLUE-dark">
              Permission Summary
            </h2>
          </div>
          <dl className="grid gap-3 p-5 sm:grid-cols-2">
            <DetailItem
              label="Modules with Access"
              value={String(permissionsPreview.length)}
            />
            <DetailItem
              label="Granted Actions"
              value={String(grantedActions)}
            />
            <DetailItem
              label="Total Permission IDs"
              value={String(permissionIdCount)}
            />
            <DetailItem
              label="Last Updated"
              value={role.updatedAt ? formatDateTime(role.updatedAt) : "—"}
            />
            <div className="sm:col-span-2">
              <DetailItem label="Coverage">
                {permissionsPreview.length > 0
                  ? `${permissionsPreview.length} modules configured for this role`
                  : "No module access configured yet"}
              </DetailItem>
            </div>
          </dl>
        </section>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-bold text-BLUE-dark">
              Module Access
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Access levels granted to the {roleName} role
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            {permissionsPreview.length} modules
          </span>
        </div>

        {permissionsPreview.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">
            No permissions preview available for this role.
          </p>
        ) : (
          <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
            {permissionsPreview.map((permission) => {
              const accessLabel =
                permission.accessLabel ||
                permission.level ||
                permission.access ||
                "No Access";
              return (
                <div
                  key={
                    permission._id ||
                    permission.moduleName ||
                    permission.displayName
                  }
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/60 px-3.5 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-BLUE-dark">
                      {permission.displayName ||
                        permission.moduleName ||
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

      <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-[16px] font-bold text-BLUE-dark">
            Permission Matrix
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Action-level access by module
          </p>
        </div>
        {permissionMatrix.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">
            No permission matrix available.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Module</th>
                  {actionColumns.map((actionName) => (
                    <th key={actionName} className="px-4 py-3">
                      {actionLabel(actionName)}
                    </th>
                  ))}
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
                      {actionColumns.map((actionName) => {
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
        )}
      </section>
    </main>
  );
}

export default RoleDetails;
