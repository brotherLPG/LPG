import { Search, ShieldCheck, Trash2, Pencil } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalTable from "../../utils/GlobalTable";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useDeleteRole, useRoles } from "../../queries/roles/roles.queries";
import { useToast } from "../../utils/GlobalToast";

function Roles() {
  const navigate = useNavigate();
  const toast = useToast();
  const [roleQuery, setRoleQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, role: null });
  const { data: rolesData, isLoading, error } = useRoles({ page: 1, limit: 100 });
  const roles = rolesData?.data?.items || [];
  const deleteMutation = useDeleteRole();
  

  const filteredRoles = useMemo(() => roles.filter((role) => {
    const roleName = role.roleName || role.name || role.title || role.displayName || "";
    const description = role.roleDescription || role.description || "";
    const matchesSearch = `${roleName} ${description}`.toLowerCase().includes(roleQuery.toLowerCase());
    const matchesRole = roleFilter === "All Roles" || roleName === roleFilter;
    return matchesSearch && matchesRole;
  }), [roles, roleQuery, roleFilter]);

  const handleDeleteConfirm = async () => {
    if (!deleteModal.role) return;

    try {
      await deleteMutation.mutateAsync(deleteModal.role._id);
      toast.success("Role deleted successfully.");
      setDeleteModal({ isOpen: false, role: null });
    } catch (deleteError) {
      toast.error(deleteError.response?.data?.message || "Failed to delete role. Please try again.");
    }
  };

  const roleColumns = [
    {
      key: "roleName",
      label: "Role Name",
      isRowHeader: true,
      className: "text-[13px] font-bold text-tertiary",
      cellClassName: "px-4 py-3",
      renderCell: (role) => (
        <span className="font-semibold text-BLUE-dark text-[13px]">
          {role.roleName || role.name || role.title || "—"}
        </span>
      ),
    },
    {
      key: "roleDescription",
      label: "Description",
      className: "text-[13px] font-bold text-tertiary",
      cellClassName: "px-4 py-3 text-slate-500 text-[13px]",
      renderCell: (role) =>
        role.roleDescription || role.description || "No description",
    },
    {
      key: "permissions",
      label: "Permissions",
      className: "text-[13px] font-bold text-tertiary",
      cellClassName: "px-4 py-3 text-slate-600 text-[13px]",
      renderCell: (role) =>
        role.permissionIds?.length || role.permissions?.length || 0,
    },
    {
      key: "isActive",
      label: "Status",
      className: "text-[13px] font-bold text-tertiary",
      cellClassName: "px-4 py-3",
      renderCell: (role) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${role.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}
        >
          {role.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      className: "text-[13px] font-bold text-tertiary",
      cellClassName: "px-4 py-3 text-slate-500 text-[13px]",
      renderCell: (role) =>
        role.createdAt ? new Date(role.createdAt).toLocaleDateString() : "—",
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-[13px] font-bold text-tertiary justify-center",
      cellClassName: "px-4 py-3",
      renderCell: (role) => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(`/users-roles/Permissions?role=${role._id}`)
            }
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-blue hover:text-blue-800"
          >
            <ShieldCheck className="h-4 w-4" /> Manage Permissions
          </button>
          <button
            type="button"
            onClick={() => navigate(`/users-roles/edit-role/${role._id}`)}
            aria-label={`Edit ${role.roleName || role.name || "role"}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-800"
          >
            <Pencil className="h-4 w-4" /> Edit
          </button>
          <button
            type="button"
            onClick={() => setDeleteModal({ isOpen: true, role })}
            aria-label={`Delete ${role.roleName || role.name || "role"}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={roleQuery}
              onChange={(event) => setRoleQuery(event.target.value)}
              className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="Search roles by name or description..."
            />
          </label>
          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-emerald-500"
          >
            <option value="All Roles">All Roles</option>
            {roles.map((role) => {
              const roleName = role.roleName || role.name || role.title || role.displayName;
              return <option key={role._id} value={roleName}>{roleName}</option>;
            })}
          </select>
        </div>
      </div>

      <div className="mt-5 overflow-hidden border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading roles...</div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-red-500">Error loading roles. Please try again.</div>
        ) : filteredRoles.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No roles match your search.</div>
        ) : (
          <GlobalTable
            columns={roleColumns}
            data={filteredRoles.map((role) => ({ ...role, id: role._id }))}
            ariaLabel="Roles table"
            rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
            emptyContent="No roles available."
          />
        )}
      </div>
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, role: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Role"
        message="Are you sure you want to delete this role? This action cannot be undone."
        itemName={deleteModal.role?.roleName || deleteModal.role?.name || ""}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}

export default Roles;