import { Table } from "@heroui/react";
import { Eye, Pencil, CirclePlus , Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const users = [
  { name: "Muhammad Ahmad", email: "admin@almanida-lpg.pk", role: "Administrator", employee: "Ahmad Hassan", status: "Active", login: "21 Aug 2026 09:15" },
  { name: "Fatima Zahra", email: "fatima@almanida-lpg.pk", role: "Finance Manager", employee: "Fatima Zahra", status: "Active", login: "21 Aug 2026 08:30" },
  { name: "Usman Ali", email: "usman@almanida-lpg.pk", role: "Plant Operator", employee: "Usman Ali", status: "Active", login: "20 Aug 2026 17:45" },
  { name: "Zainab Rashid", email: "zainab@almanida-lpg.pk", role: "Sales Executive", employee: "Zainab Rashid", status: "Active", login: "20 Aug 2026 16:20" },
  { name: "Ayesha Siddiqui", email: "ayesha@almanida-lpg.pk", role: "Office Manager", employee: "Ayesha Siddiqui", status: "Active", login: "19 Aug 2026" },
  { name: "Guest User", email: "guest.user@almanida-lpg.pk", role: "Viewer", employee: "—", status: "Inactive", login: "Never" },
  { name: "Test Account", email: "test.account@almanida-lpg.pk", role: "Viewer", employee: "—", status: "Suspended", login: "01 Aug 2026" },
];

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

  const filteredUsers = useMemo(() => users.filter((user) => {
    const matchesQuery = `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase());
    const matchesRole = role === "All Roles" || user.role === role;
    const matchesStatus = status === "All" || user.status === status;
    return matchesQuery && matchesRole && matchesStatus;
  }), [query, role, status]);

  return (
    <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <section>
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs">
              <span
                onClick={() => navigate("/dashboard")}
                className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
              >
                Dashboard
              </span>{" "}
              <span className="px-1">/</span> Users &amp; Roles
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-800">
              User Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage users, roles, and access permissions
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-bg-blue px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <CirclePlus className="h-4 w-4" /> Add User
          </button>
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
              <option>All Roles</option>
              <option>Administrator</option>
              <option>Finance Manager</option>
              <option>Plant Operator</option>
              <option>Sales Executive</option>
              <option>Office Manager</option>
              <option>Viewer</option>
            </select>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-emerald-500"
            >
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Suspended</option>
            </select>
          </div>
        </div>

        <div className="mt-5 overflow-hidden border border-slate-200 bg-white shadow-sm">
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="User management table">
                <Table.Header>
                  <Table.Column className="text-[13px] font-bold text-tertiary">
                    Name
                  </Table.Column>
                  <Table.Column className="text-[13px] font-bold text-tertiary">
                    Email Address
                  </Table.Column>
                  <Table.Column className="text-[13px] font-bold text-tertiary">
                    Role
                  </Table.Column>
                  <Table.Column className="text-[13px] font-bold text-tertiary">
                    Linked Employee
                  </Table.Column>
                  <Table.Column className="text-[13px] font-bold text-tertiary">
                    Status
                  </Table.Column>
                  <Table.Column className="text-[13px] font-bold text-tertiary">
                    Last Login
                  </Table.Column>
                  <Table.Column className="text-[13px] font-bold text-tertiary">
                    Actions
                  </Table.Column>
                </Table.Header>
                <Table.Body
                  items={filteredUsers}
                  emptyContent="No users match your search."
                >
                  {(user) => (
                    <Table.Row key={user.email}>
                      <Table.Cell>
                        <span className="font-semibold text-BLUE-dark text-[13px]">
                          {user.name}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-500 text-[13px] font-regular">
                          {user.email}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-slate-600 text-[13px] font-medium">
                          {user.role}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-tertiary text-[13px] font-regular">
                          {user.employee}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[user.status]}`}
                        >
                          {user.status}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="whitespace-nowrap text-tertiary font-regular text-[13px]">
                          {user.login}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label={`View ${user.name}`}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Edit ${user.name}`}
                            className="text-emerald-500 hover:text-emerald-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Delete ${user.name}`}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
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
              onClick={() => navigate("/users-roles/administrator")}
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
