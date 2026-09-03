import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePermissions } from "../../queries/permissions/permissions.queries";
import { useRoleById, useUpdateRole } from "../../queries/roles/roles.queries";
import { useToast } from "../../utils/GlobalToast";

function UpdateRole() {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const { data: roleData, isLoading: isRoleLoading, error: roleError } = useRoleById(id);
  const { data: permissionsData, isLoading: arePermissionsLoading } = usePermissions();
  const updateMutation = useUpdateRole();
  const permissions = permissionsData?.data || [];
  const role = roleData?.data?.role || roleData?.data;
  const [formData, setFormData] = useState({ roleName: "", roleDescription: "", isActive: true });
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    if (!role) return;
    const rolePermissions = role.permissionIds || role.permissions || role.permissionsPreview || [];
    setFormData({
      roleName: role.roleName || role.name || role.title || "",
      roleDescription: role.roleDescription || role.description || "",
      isActive: role.isActive !== false,
    });
    setSelectedPermissions(rolePermissions.map((permission) => (
      typeof permission === "string" ? permission : permission._id || permission.permissionId
    )).filter(Boolean));
  }, [role]);

  const permissionsByModule = useMemo(() => permissions.reduce((groups, permission) => {
    const moduleName = permission.moduleName || "Other";
    groups[moduleName] = [...(groups[moduleName] || []), permission];
    return groups;
  }, {}), [permissions]);

  const togglePermission = (permissionId) => {
    setSelectedPermissions((current) => current.includes(permissionId)
      ? current.filter((id) => id !== permissionId)
      : [...current, permissionId]);
  };

  const allPermissionsSelected =
    permissions.length > 0 && selectedPermissions.length === permissions.length;

  const toggleAllPermissions = () => {
    setSelectedPermissions(
      allPermissionsSelected ? [] : permissions.map((permission) => permission._id),
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateMutation.mutateAsync({
        id,
        data: { ...formData, permissionIds: selectedPermissions },
      });
      toast.success("Role updated successfully!");
      navigate("/users-roles");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role. Please try again.");
    }
  };

  if (isRoleLoading) return <main className="min-h-full bg-slate-50 p-8 text-center text-sm text-slate-500">Loading role...</main>;
  if (roleError || !role) return <main className="min-h-full bg-slate-50 p-8 text-center text-sm text-red-500">Unable to load role.</main>;

  return (
    <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
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
          <span className="px-1">/</span> Update Role
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          Update Role
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update role details and assigned permissions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-5">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-slate-800">
            Role Details
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              Role Name <span className="text-red-500">*</span>
              <input
                required
                value={formData.roleName}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    roleName: event.target.value,
                  }))
                }
                className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Status
              <select
                value={formData.isActive ? "true" : "false"}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    isActive: event.target.value === "true",
                  }))
                }
                className="mt-1.5 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-normal outline-none focus:border-blue-500"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </label>
            <label className="text-sm font-semibold text-slate-700 md:col-span-2">
              Description
              <textarea
                value={formData.roleDescription}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    roleDescription: event.target.value,
                  }))
                }
                rows="3"
                className="mt-1.5 w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-sm font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-slate-800">Permissions</h2>
            <label className="flex items-center gap-2 text-sm font-normal text-slate-600">
              Select All Permissions
              <input
                aria-label="Select all permissions"
                type="checkbox"
                checked={allPermissionsSelected}
                onChange={toggleAllPermissions}
                disabled={arePermissionsLoading || permissions.length === 0}
                className="peer sr-only"
              />
              <span className="relative h-5 w-9 cursor-pointer rounded-full bg-slate-200 transition peer-checked:bg-emerald-500 peer-disabled:cursor-not-allowed peer-disabled:opacity-60 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition peer-checked:after:translate-x-4" />
            </label>
          </div>
          {arePermissionsLoading ? (
            <p className="text-sm text-slate-500">Loading permissions...</p>
          ) : (
            Object.entries(permissionsByModule).map(
              ([moduleName, modulePermissions]) => (
                <div
                  key={moduleName}
                  className="border-b border-slate-100 py-3 last:border-0"
                >
                  <h3 className="mb-2 text-sm font-semibold capitalize text-slate-700">
                    {moduleName}
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {modulePermissions.map((permission) => (
                      <label
                        key={permission._id}
                        className="flex items-center gap-2 text-sm text-slate-600"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permission._id)}
                          onChange={() => togglePermission(permission._id)}
                        />
                        {permission.permissionName}
                      </label>
                    ))}
                  </div>
                </div>
              ),
            )
          )}
        </section>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/users-roles")}
            className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="rounded-md bg-gradient-bg-blue px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {updateMutation.isPending ? "Saving..." : "Update Role"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default UpdateRole;
