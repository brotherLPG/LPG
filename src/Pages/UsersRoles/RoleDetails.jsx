import { Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useRoleById } from "../../queries/roles/roles.queries";
import { usePermissions } from "../../contexts/PermissionContext";

const badgeColors = {
  emerald: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
  slate: "bg-slate-100 text-slate-500",
};

function DetailItem({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm text-BLUE-dark">{value || "—"}</dd>
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
      <main className="flex min-h-full items-center justify-center bg-slate-50 p-8 text-sm text-slate-500">
        Loading role...
      </main>
    );
  }

  if (error || !role) {
    return (
      <main className="flex min-h-full items-center justify-center bg-slate-50 p-8 text-sm text-red-500">
        Unable to load role.
      </main>
    );
  }

  const roleName = role.roleName || role.name || "Role";

  return (
    <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
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
            <span className="px-1">/</span> Role Details
          </p>
          <div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-BLUE-dark">
              Role Details
            </h1>
            <p className="text-sm text-tertiary">
              View role information and module access permissions.
            </p>
          </div>
        </div>
        {can("roles", "update") && (
          <button
            type="button"
            onClick={() => navigate(`/users-roles/edit-role/${role._id}`)}
            className="inline-flex items-center gap-2 rounded-md bg-gradient-bg-blue px-4 py-2 text-sm font-semibold text-white"
          >
            <Pencil className="h-4 w-4" /> Edit Role
          </button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-md border border-slate-200 bg-white shadow-sm">
          <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-BLUE-dark">
            Role Information
          </h2>
          <dl className="grid gap-5 p-4 sm:grid-cols-2">
            <DetailItem label="Role Name" value={roleName} />
            <DetailItem
              label="Users Assigned"
              value={
                role.userCount != null ? String(role.userCount) : "—"
              }
            />
            <DetailItem
              label="Created"
              value={
                role.createdAt
                  ? new Date(role.createdAt).toLocaleString()
                  : "—"
              }
            />
            <DetailItem
              label="Last Updated"
              value={
                role.updatedAt
                  ? new Date(role.updatedAt).toLocaleString()
                  : "—"
              }
            />
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold text-slate-400">Status</dt>
              <dd
                className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                  role.isActive
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {role.isActive ? "Active" : "Inactive"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold text-slate-400">
                Description
              </dt>
              <dd className="mt-1 text-sm text-BLUE-dark">
                {role.roleDescription || "No description available."}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-md border border-slate-200 bg-white shadow-sm">
          <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-BLUE-dark">
            Permission Summary
          </h2>
          <dl className="grid gap-5 p-4">
            <DetailItem
              label="Modules with Access"
              value={String(permissionsPreview.length)}
            />
            <DetailItem
              label="Granted Actions"
              value={String(
                permissionMatrix.reduce(
                  (count, moduleEntry) =>
                    count +
                    (moduleEntry.actions || []).filter(
                      (action) => action.granted === true
                    ).length,
                  0
                )
              )}
            />
            <DetailItem
              label="Total Permission IDs"
              value={String(
                role.permissionIds?.length ||
                  role.defaultPermissionIds?.length ||
                  0
              )}
            />
          </dl>
        </section>

        <section className="rounded-md border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-BLUE-dark">
            Module Access
          </h2>
          <div className="divide-y divide-slate-100 px-4">
            {permissionsPreview.length === 0 ? (
              <p className="py-4 text-sm text-slate-500">
                No permissions preview available.
              </p>
            ) : (
              permissionsPreview.map((permission) => {
                const accessLabel =
                  permission.accessLabel ||
                  permission.level ||
                  permission.access ||
                  "No Access";
                const color = accessLabel.toLowerCase().includes("full")
                  ? "emerald"
                  : accessLabel.toLowerCase().includes("view")
                    ? "blue"
                    : "slate";
                return (
                  <div
                    key={
                      permission._id ||
                      permission.moduleName ||
                      permission.displayName
                    }
                    className="flex items-center justify-between gap-3 py-3 text-sm text-BLUE-dark"
                  >
                    <span>
                      {permission.displayName ||
                        permission.moduleName ||
                        "—"}
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${badgeColors[color]}`}
                    >
                      {accessLabel}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="rounded-md border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-BLUE-dark">
            Permission Matrix
          </h2>
          {permissionMatrix.length === 0 ? (
            <p className="px-4 py-4 text-sm text-slate-500">
              No permission matrix available.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Module</th>
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
                    const cells = ["create", "read", "update", "delete"];
                    return (
                      <tr key={moduleEntry.moduleName}>
                        <td className="px-4 py-3 font-medium text-BLUE-dark">
                          {moduleEntry.displayName || moduleEntry.moduleName}
                        </td>
                        {cells.map((actionName) => {
                          const hasAction = (moduleEntry.actions || []).some(
                            (action) =>
                              String(action.actionName || "").toLowerCase() ===
                              actionName
                          );
                          if (!hasAction) {
                            return (
                              <td
                                key={actionName}
                                className="px-4 py-3 text-slate-300"
                              >
                                —
                              </td>
                            );
                          }
                          const granted = actions[actionName] === true;
                          return (
                            <td key={actionName} className="px-4 py-3">
                              <span
                                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                  granted
                                    ? "bg-emerald-50 text-emerald-600"
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
      </div>
    </main>
  );
}

export default RoleDetails;
