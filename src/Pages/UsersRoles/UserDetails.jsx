import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useRoleById } from "../../queries/roles/roles.queries";
import { useUserById } from "../../queries/users/users.queries";

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

function UserDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading, error } = useUserById(id);
  const user = data?.data?.user || data?.data;
  const roleId = user?.roleId || user?.role?._id;
  const { data: roleData } = useRoleById(roleId);
  const selectedRole = roleData?.data?.role || roleData?.data || user?.role;
  const permissions = selectedRole?.permissionsPreview || [];

  if (isLoading) {
    return <main className="flex min-h-full items-center justify-center bg-slate-50 p-8 text-sm text-slate-500">Loading user...</main>;
  }

  if (error || !user) {
    return <main className="flex min-h-full items-center justify-center bg-slate-50 p-8 text-sm text-red-500">Unable to load user.</main>;
  }

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
            <span className="px-1">/</span> User Details
          </p>
          <div>

          <h1 className=" text-2xl font-bold tracking-tight text-BLUE-dark mt-2">
           User Details
          </h1>
          <p className="text-sm text-tertiary">
            View account information and assigned access.
          </p>
          </div>
        </div>
        <button type="button" onClick={() => navigate(`/users-roles/edit/${user._id}`)} className="inline-flex items-center gap-2 rounded-md bg-gradient-bg-blue px-4 py-2 text-sm font-semibold text-white">
          <Pencil className="h-4 w-4" /> Edit User
        </button>
       
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-md border border-slate-200 bg-white shadow-sm">
          <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-BLUE-dark">User Information</h2>
          <dl className="grid gap-5 p-4 sm:grid-cols-2">
            <DetailItem label="Full Name" value={user.fullName} />
            <DetailItem label="Email Address" value={user.emailAddress} />
            <DetailItem label="Phone Number" value={user.phoneNumber} />
            <DetailItem label="CNIC Number" value={user.cnicNumber} />
            <DetailItem label="Username" value={user.username} />
            <DetailItem label="Last Login" value={user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Never"} />
          </dl>
        </section>

        <section className="rounded-md border border-slate-200 bg-white shadow-sm">
          <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-BLUE-dark">Role &amp; Security</h2>
          <dl className="grid gap-5 p-4">
            <DetailItem label="Assigned Role" value={selectedRole?.roleName || user.role?.roleName} />
            <DetailItem label="Linked Employee" value={user.employeeId?.fullName || user.employeeId?.employeeCode} />
            <div>
              <dt className="text-xs font-semibold text-slate-400">Status</dt>
              <dd className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium ${user.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                {user.isActive ? "Active" : "Inactive"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-slate-400">Role Description</dt>
              <dd className="mt-1 text-sm text-BLUE-dark">{selectedRole?.roleDescription || "No role description available."}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-md border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <h2 className="border-b border-slate-100 px-4 py-3 text-base font-bold text-BLUE-dark">Role Permissions</h2>
          <div className="divide-y divide-slate-100 px-4">
            {
            permissions.length === 0 ? (
              <p className="py-4 text-sm text-slate-500">No permissions preview available.</p>
            ) : 
            permissions.map((permission) => {
              const accessLabel = permission.accessLabel || permission.level || permission.access || "No Access";
              const color = accessLabel.toLowerCase().includes("full") ? "emerald" : accessLabel.toLowerCase().includes("view") ? "blue" : "slate";
              return (
                <div key={permission._id || permission.displayName || permission.name} className="flex items-center justify-between gap-3 py-3 text-sm text-BLUE-dark">
                  <span>{permission.displayName || permission.name || permission.module || "—"}</span>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${badgeColors[color]}`}>{accessLabel}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

export default UserDetails;
