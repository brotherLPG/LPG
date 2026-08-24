import { Check, ChevronDown, Folder } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const modules = [
  "Dashboard",
  "Customers",
  "Suppliers",
  "Cylinder Types",
  "Storage Tanks",
  "LPG Receipts",
  "Filling Batches",
  "Inventory",
  "Sales",
  "Sales Returns",
  "Expenses",
  "Payments",
  "Accounts",
  "Employees",
  "Maintenance Assets",
  "Maintenance Records",
  "Fixed Assets",
  "Notifications",
  "Settings",
  "Audit Logs",
];
const actions = ["View", "Create", "Edit", "Delete", "Approve", "Export"];
const createPermissions = (value) =>
  Object.fromEntries(
    modules.map((module) => [
      module,
      Object.fromEntries(actions.map((action) => [action, value])),
    ]),
  );

function RolePermissions() {
  const navigate = useNavigate();
  const [allPermissions, setAllPermissions] = useState(true);
  const [permissions, setPermissions] = useState(() => createPermissions(true));
  const togglePermission = (module, action) =>
    setPermissions((current) => ({
      ...current,
      [module]: { ...current[module], [action]: !current[module][action] },
    }));
  const toggleAllPermissions = () => {
    const nextValue = !allPermissions;
    setAllPermissions(nextValue);
    setPermissions(createPermissions(nextValue));
  };

  return (
    <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <section>
        <div className="mb-5">
          <p className="text-xs">
            <span
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
            >
              Dashboard
            </span>{" "}
            <span> /</span>{" "}
            <span
              onClick={() => navigate("/users-roles")}
              className="cursor-pointer font-medium text-4th-color transition-colors duration-200 px-1"
            >
              Users &amp; Roles
            </span>{" "}
            <span className="px-1">/</span> Role: Administrator
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-800">
            Role Permissions - Administrator
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Configure module-level access permissions for the Administrator role
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center my-auto">
              <p className="text-sm font-semibold text-tertiary">
                Switch Role Profile:
              </p>
              <button
                type="button"
                className="inline-flex w-fit items-center gap-2 rounded-md border border-[#1E40AF] ms-2 bg-white px-3 py-2 text-sm font-semibold text-accent-blue hover:bg-slate-50"
              >
                Administrator
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <label className="flex items-center gap-2 text-sm font-regular text-tertiary">
              Select All Permissions
              <input
                aria-label="Select all permissions"
                type="checkbox"
                checked={allPermissions}
                onChange={toggleAllPermissions}
                className="peer sr-only"
              />
              <span className="relative h-5 w-9 cursor-pointer rounded-full bg-slate-200 transition peer-checked:bg-emerald-500 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition peer-checked:after:translate-x-4" />
            </label>
          </div>
        </div>
        <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-190 text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-tertiary text-sm font-bold">
                    System Module
                  </th>
                  {actions.map((action) => (
                    <th
                      key={action}
                      className="px-3 py-3 text-center text-tertiary text-sm font-bold"
                    >
                      {action}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modules.map((module) => (
                  <tr
                    key={module}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                  >
                    <td className="px-4 py-2.5 font-medium text-slate-600 flex items-center my-auto">
                      <span className="mr-2 text-accent-blue">
                        <Folder className="w-6 h-6" />
                      </span>
                      <span className="font-semibold text-sm text-BLUE-dark">
                        {module}
                      </span>
                    </td>
                    {actions.map((action) => {
                      const isGranted = permissions[module][action];
                      return (
                        <td key={action} className="px-3 py-2.5 text-center">
                          <button
                            type="button"
                            aria-pressed={isGranted}
                            aria-label={`${isGranted ? "Remove" : "Grant"} ${action} permission for ${module}`}
                            onClick={() => togglePermission(module, action)}
                            className={`inline-flex h-4 w-4 items-center justify-center rounded border transition ${isGranted ? "border-emerald-400 bg-emerald-50 text-emerald-500" : "border-slate-300 bg-white text-transparent hover:border-emerald-400"}`}
                          >
                            <Check className="h-3 w-3 stroke-3" />
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-md border border-[#1E40AF] bg-white px-4 py-2 text-sm font-semibold text-accent-blue hover:bg-blue-50"
          >
            Reset to Default
          </button>
          <button
            type="button"
            className="rounded-md bg-gradient-bg-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800"
          >
            Save Permissions
          </button>
        </div>
      </section>
    </main>
  );
}

export default RolePermissions;
