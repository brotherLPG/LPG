import { Eye, Pencil, CirclePlus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalTable from "../../utils/GlobalTable";
import { useUsers } from "../../queries/users/users.queries";

const statusStyles = {
  Active: "bg-emerald-50 text-emerald-600",
  Inactive: "bg-slate-100 text-slate-500",
  Suspended: "bg-red-50 text-red-600",
};

function UsersRoles() {

    const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All Roles");
  const [status, setStatus] = useState("All");

  const { data: usersData, isLoading, error } = useUsers({
    search: query,
    role: role === "All Roles" ? undefined : role,
    status: status === "All" ? undefined : status,
  });

  const users = usersData?.data?.items || [];
  console.log(users);
  
  const availableRoles = usersData?.data?.meta?.roles || [];
  const availableStatuses = usersData?.data?.meta?.statuses || [];

  const filteredUsers = useMemo(() => users.filter((user) => {
    const matchesQuery = `${user.fullName} ${user.emailAddress}`.toLowerCase().includes(query.toLowerCase());
    const matchesRole = role === "All Roles" || user.role?.roleName === role;
    const matchesStatus = status === "All" || (user.isActive ? "Active" : "Inactive") === status;
    return matchesQuery && matchesRole && matchesStatus;
  }), [users, query, role, status]);

  // Column definitions for users table
  const userColumns = [
    {
      key: "fullName",
      label: "Name",
      isRowHeader: true,
      className: "text-[13px] font-bold text-tertiary",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <span className="font-semibold text-BLUE-dark text-[13px]">{item.fullName}</span>
      ),
    },
    {
      key: "emailAddress",
      label: "Email Address",
      className: "text-[13px] font-bold text-tertiary",
      cellClassName: "px-4 py-3 text-slate-500 text-[13px] font-regular",
    },
    {
      key: "role",
      label: "Role",
      className: "text-[13px] font-bold text-tertiary",
      cellClassName: "px-4 py-3 text-slate-600 text-[13px] font-medium",
      renderCell: (item) => item.role?.roleName || "—",
    },
    {
      key: "employee",
      label: "Linked Employee",
      className: "text-[13px] font-bold text-tertiary",
      cellClassName: "px-4 py-3 text-tertiary text-[13px] font-regular",
      renderCell: (item) => item.employeeId?.fullName || item.employeeId?.employeeCode || "—",
    },
    {
      key: "status",
      label: "Status",
      className: "text-[13px] font-bold text-tertiary",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[item.isActive ? "Active" : "Inactive"]}`}
        >
          {item.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "lastLogin",
      label: "Last Login",
      className: "text-[13px] font-bold text-tertiary",
      cellClassName: "px-4 py-3 whitespace-nowrap text-tertiary font-regular text-[13px]",
      renderCell: (item) => item.lastLoginAt ? new Date(item.lastLoginAt).toLocaleDateString() : "Never",
    },
    {
      key: "actions",
      label: "Actions",
      className: "text-[13px] font-bold text-tertiary",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`View ${item.fullName}`}
            className="text-blue-500 hover:text-blue-700"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Edit ${item.fullName}`}
            className="text-emerald-500 hover:text-emerald-700"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={`Delete ${item.fullName}`}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <section>
        <p className="text-xs">
          <span
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
          >
            Dashboard
          </span>{" "}
          <span className="px-1">/</span> Users &amp; Roles
        </p>
        <div className="mb-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className=" text-2xl font-bold tracking-tight text-BLUE-dark">
              User Management
            </h1>
            <p className="text-sm text-tertiary">
              Manage users, roles, and access permissions
            </p>
          </div>
          <div className="my-auto ">
            <button
              type="button"
              onClick={() => navigate("/users-roles/add-user")}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-bg-blue px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <CirclePlus className="h-4 w-4" /> Add User
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <label className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Search users by name or email..."
              />
            </label>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-emerald-500"
            >
              <option value="All Roles">All Roles</option>
              {availableRoles.map((r) => (
                <option key={r._id} value={r.roleName}>
                  {r.roleName}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-emerald-500"
            >
              <option value="All">All</option>
              {availableStatuses.map((s) => (
                <option key={s.value} value={s.label}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 overflow-hidden border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <svg className="animate-spin h-6 w-6 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-sm text-red-500">
                Error loading users. Please try again.
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-sm text-slate-500">
                No user data
              </div>
            </div>
          ) : (
            <GlobalTable
              columns={userColumns}
              data={filteredUsers}
              ariaLabel="User management table"
              className=""
              rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
              emptyContent="No users match your search."
            />
          )}
        </div>

        <section className="mt-5">
          <h2 className="mb-2 text-base font-bold text-BLUE-dark">
            Role Configuration Summary
          </h2>
          <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-BLUE-dark">Viewer</h3>
                <p className="mt-1 text-sm text-tertiary">
                  Default operational capabilities and module-level read/write
                  rules.
                </p>
              </div>
              <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-accent-blue">
                2 Users
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate("/users-roles/Permissions")}
              className="mt-4 text-sm font-semibold text-accent-blue hover:text-blue-800"
            >
              Manage Permissions <span aria-hidden="true">›</span>
            </button>
          </article>
        </section>
      </section>
    </main>
  );
}

export default UsersRoles;
