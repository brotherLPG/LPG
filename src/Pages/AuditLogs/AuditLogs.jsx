import React, { useMemo, useState } from "react";
import {
  Search,
  CalendarDays,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import GlobalTable from "../../utils/GlobalTable";

function AuditLogs() {
  const navigate = useNavigate();
  // =========================================================
  // DATA
  // =========================================================

  const auditLogs = [
    {
      id: 1,
      timestamp: "21 Aug 2026 09:15:22",
      user: "Muhammad Ahmad",
      action: "Login",
      module: "System",
      entity: "—",
      entityId: "—",
      ip: "192.168.1.10",
    },
    {
      id: 2,
      timestamp: "21 Aug 2026 09:02:05",
      user: "Muhammad Ahmad",
      action: "Create",
      module: "Sale",
      entity: "INV-9082",
      entityId: "1012",
      ip: "192.168.1.10",
    },
    {
      id: 3,
      timestamp: "21 Aug 2026 08:45:12",
      user: "Fatima Zahra",
      action: "Update",
      module: "Payment",
      entity: "PAY-0312",
      entityId: "312",
      ip: "192.168.1.15",
    },
    {
      id: 4,
      timestamp: "21 Aug 2026 08:30:00",
      user: "Fatima Zahra",
      action: "Login",
      module: "System",
      entity: "—",
      entityId: "—",
      ip: "192.168.1.15",
    },
    {
      id: 5,
      timestamp: "20 Aug 2026 17:50:33",
      user: "Usman Ali",
      action: "Create",
      module: "BillingBatch",
      entity: "FB-0234",
      entityId: "234",
      ip: "192.168.1.22",
    },
    {
      id: 6,
      timestamp: "20 Aug 2026 17:05:15",
      user: "Usman Ali",
      action: "Update",
      module: "StorageTank",
      entity: "TNK-001",
      entityId: "1",
      ip: "192.168.1.22",
    },
    {
      id: 7,
      timestamp: "20 Aug 2026 16:32:10",
      user: "Zainab Rashid",
      action: "Create",
      module: "Sale",
      entity: "INV-9981",
      entityId: "1981",
      ip: "192.168.1.18",
    },
    {
      id: 8,
      timestamp: "20 Aug 2026 14:35:00",
      user: "Muhammad Ahmad",
      action: "Delete",
      module: "Expense",
      entity: "EXP-4310",
      entityId: "610",
      ip: "192.168.1.10",
    },
    {
      id: 9,
      timestamp: "20 Aug 2026 13:45:00",
      user: "Ayesha Siddiqui",
      action: "Export",
      module: "Customer",
      entity: "—",
      entityId: "—",
      ip: "192.168.1.12",
    },
    {
      id: 10,
      timestamp: "19 Aug 2026 16:00:00",
      user: "System",
      action: "Auto Backup",
      module: "System",
      entity: "—",
      entityId: "—",
      ip: "127.0.0.1",
    },

    // Additional records for pagination testing
    {
      id: 11,
      timestamp: "19 Aug 2026 15:45:22",
      user: "Muhammad Ahmad",
      action: "Create",
      module: "Product",
      entity: "PRD-102",
      entityId: "102",
      ip: "192.168.1.10",
    },
    {
      id: 12,
      timestamp: "19 Aug 2026 14:32:11",
      user: "Fatima Zahra",
      action: "Update",
      module: "Customer",
      entity: "CUS-201",
      entityId: "201",
      ip: "192.168.1.15",
    },
    {
      id: 13,
      timestamp: "19 Aug 2026 13:20:45",
      user: "Usman Ali",
      action: "Create",
      module: "Purchase",
      entity: "PUR-442",
      entityId: "442",
      ip: "192.168.1.22",
    },
    {
      id: 14,
      timestamp: "19 Aug 2026 12:10:20",
      user: "Zainab Rashid",
      action: "Update",
      module: "Inventory",
      entity: "INV-120",
      entityId: "120",
      ip: "192.168.1.18",
    },
    {
      id: 15,
      timestamp: "19 Aug 2026 11:02:15",
      user: "Ayesha Siddiqui",
      action: "Export",
      module: "Report",
      entity: "—",
      entityId: "—",
      ip: "192.168.1.12",
    },
    {
      id: 16,
      timestamp: "18 Aug 2026 17:44:12",
      user: "Muhammad Ahmad",
      action: "Login",
      module: "System",
      entity: "—",
      entityId: "—",
      ip: "192.168.1.10",
    },
    {
      id: 17,
      timestamp: "18 Aug 2026 16:31:00",
      user: "Fatima Zahra",
      action: "Delete",
      module: "Product",
      entity: "PRD-101",
      entityId: "101",
      ip: "192.168.1.15",
    },
    {
      id: 18,
      timestamp: "18 Aug 2026 15:20:00",
      user: "Usman Ali",
      action: "Create",
      module: "Sale",
      entity: "INV-8892",
      entityId: "8892",
      ip: "192.168.1.22",
    },
    {
      id: 19,
      timestamp: "18 Aug 2026 14:10:32",
      user: "Zainab Rashid",
      action: "Update",
      module: "Payment",
      entity: "PAY-889",
      entityId: "889",
      ip: "192.168.1.18",
    },
    {
      id: 20,
      timestamp: "18 Aug 2026 13:05:22",
      user: "System",
      action: "Auto Backup",
      module: "System",
      entity: "—",
      entityId: "—",
      ip: "127.0.0.1",
    },
  ];

  // =========================================================
  // STATE
  // =========================================================

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState("All Users");
  const [selectedModule, setSelectedModule] = useState("All Modules");
  const [selectedAction, setSelectedAction] = useState("All Actions");

  // =========================================================
  // FILTER OPTIONS
  // =========================================================

  const users = [
    "All Users",
    "Muhammad Ahmad",
    "Fatima Zahra",
    "Usman Ali",
    "Zainab Rashid",
    "Ayesha Siddiqui",
    "System",
  ];

  const modules = [
    "All Modules",
    "System",
    "Sale",
    "Payment",
    "BillingBatch",
    "StorageTank",
    "Expense",
    "Customer",
    "Product",
    "Purchase",
    "Inventory",
    "Report",
  ];

  const actions = [
    "All Actions",
    "Login",
    "Create",
    "Update",
    "Delete",
    "Export",
    "Auto Backup",
  ];

  // =========================================================
  // FILTER DATA
  // =========================================================

  const filteredLogs = useMemo(() => {
    const query = search.toLowerCase().trim();

    return auditLogs.filter((log) => {
      const matchesSearch =
        !query ||
        log.user.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.module.toLowerCase().includes(query) ||
        log.entity.toLowerCase().includes(query) ||
        log.entityId.toLowerCase().includes(query) ||
        log.ip.toLowerCase().includes(query);

      const matchesUser =
        selectedUser === "All Users" ||
        log.user === selectedUser;

      const matchesModule =
        selectedModule === "All Modules" ||
        log.module === selectedModule;

      const matchesAction =
        selectedAction === "All Actions" ||
        log.action === selectedAction;

      return (
        matchesSearch &&
        matchesUser &&
        matchesModule &&
        matchesAction
      );
    });
  }, [
    search,
    selectedUser,
    selectedModule,
    selectedAction,
  ]);

  // =========================================================
  // ACTION STYLE
  // =========================================================

  const getActionClass = (action) => {
    switch (action) {
      case "Create":
        return "text-emerald-500";

      case "Update":
        return "text-blue-600";

      case "Delete":
        return "text-red-500";

      case "Export":
        return "text-amber-500";

      case "Login":
        return "text-slate-700";

      case "Auto Backup":
        return "text-slate-600";

      default:
        return "text-slate-600";
    }
  };

  // Column definitions for audit logs table
  const auditLogColumns = [
    {
      key: "timestamp",
      label: "Timestamp",
      isRowHeader: true,
      className: "bg-slate-50/80 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <span className="text-slate-500 text-[13px]">{item.timestamp}</span>
      ),
    },
    {
      key: "user",
      label: "User",
      className: "bg-slate-50/80 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <span className="font-medium text-slate-700 text-[13px]">{item.user}</span>
      ),
    },
    {
      key: "action",
      label: "Action",
      className: "bg-slate-50/80 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (item) => (
        <span className={`font-semibold text-[13px] ${getActionClass(item.action)}`}>
          {item.action}
        </span>
      ),
    },
    {
      key: "module",
      label: "Module",
      className: "bg-slate-50/80 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3 text-slate-600 text-[13px]",
    },
    {
      key: "entity",
      label: "Entity Description",
      className: "bg-slate-50/80 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3 text-slate-500 text-[13px]",
    },
    {
      key: "entityId",
      label: "Entity ID",
      className: "bg-slate-50/80 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3",
      renderCell: (item) =>
        item.entityId === "—" ? (
          <span className="text-slate-400 text-[13px]">—</span>
        ) : (
          <span className="font-medium text-blue-600 text-[13px]">{item.entityId}</span>
        ),
    },
    {
      key: "ip",
      label: "IP Address",
      className: "bg-slate-50/80 text-[13px] font-bold text-slate-700",
      cellClassName: "px-4 py-3 text-slate-500 text-[13px]",
    },
  ];

  // =========================================================
  // RESET FILTERS
  // =========================================================

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const handleUserChange = (value) => {
    setSelectedUser(value);
  };

  const handleModuleChange = (value) => {
    setSelectedModule(value);
  };

  const handleActionChange = (value) => {
    setSelectedAction(value);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <section>

        <div className="text-xs">
          <span onClick={() => navigate("/dashboard")}
            className="cursor-pointer font-medium text-4th-color transition-colors duration-200"
          >Dashboard</span>
          <span className="px-1">/</span>
          <span>
            Audit Logs
          </span>
        </div>

        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-BLUE-dark">
            Audit Trail
          </h1>

          <p className="text-sm text-tertiary">
            Complete activity log for compliance and security review
          </p>
        </div>

        {/* =====================================================
            FILTERS CARD
        ====================================================== */}

        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">

            {/* SEARCH */}

            <label className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) =>
                  handleSearchChange(e.target.value)
                }
                placeholder="Search by entity ID or user..."
                className="
                  w-70
                  rounded-md
                  border
                  border-slate-200
                  py-2
                  pl-9
                  pr-3
                  text-sm
                  text-slate-700
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-[#008951]
                  focus:ring-2
                  focus:ring-emerald-100
                "
              />
            </label>

            {/* USER */}

            <div className="relative">
              <select
                value={selectedUser}
                onChange={(e) =>
                  handleUserChange(e.target.value)
                }
                className="
                  w-full
                  appearance-none
                  rounded-md
                  border
                  border-slate-200
                  bg-white
                  pl-3
                  pr-10
                  py-2
                  text-sm
                  text-slate-600
                  outline-none
                  focus:border-[#008951]
                "
              >
                {users.map((user) => (
                  <option
                    key={user}
                    value={user}
                  >
                    {user}
                  </option>
                ))}
              </select>

              <ChevronDown
                className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>

            {/* MODULE */}

            <div className="relative">
              <select
                value={selectedModule}
                onChange={(e) =>
                  handleModuleChange(e.target.value)
                }
                className="
                  w-full
                  appearance-none
                  rounded-md
                  border
                  border-slate-200
                  bg-white
                  pl-3
                  pr-10
                  py-2
                  text-sm
                  text-slate-600
                  outline-none
                  focus:border-[#008951]
                "
              >
                {modules.map((module) => (
                  <option
                    key={module}
                    value={module}
                  >
                    {module}
                  </option>
                ))}
              </select>

              <ChevronDown
                className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>

            {/* ACTION */}

            <div className="relative">
              <select
                value={selectedAction}
                onChange={(e) =>
                  handleActionChange(e.target.value)
                }
                className="
                  w-full
                  appearance-none
                  rounded-md
                  border
                  border-slate-200
                  bg-white
                  pl-3
                  pr-10
                  py-2
                  text-sm
                  text-slate-600
                  outline-none
                  focus:border-[#008951]
                "
              >
                {actions.map((action) => (
                  <option
                    key={action}
                    value={action}
                  >
                    {action}
                  </option>
                ))}
              </select>

              <ChevronDown
                className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>

            {/* DATE */}

            <button
              type="button"
              className="
                flex
                h-9
                items-center
                gap-1.5
                rounded-md
                border
                border-slate-200
                bg-white
                px-2
                text-sm
                text-slate-600
                hover:bg-slate-50 
                w-64
                
              "
            >
              <CalendarDays
                className="h-4 w-4 text-slate-500"
              />

              <span>
                Aug 19, 2026 - Aug 21, 2026
              </span>

              <ChevronDown
                className="h-4 w-4 text-slate-400"
              />
            </button>
          </div>
        </div>

        {/* ===================================================
            TABLE
        ==================================================== */}

        <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <GlobalTable
            columns={auditLogColumns}
            data={filteredLogs}
            ariaLabel="Audit logs"
            className="w-full"
            rowClassName="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
            emptyContent="No audit logs found."
            pagination={true}
            rowsPerPage={10}
          />
        </div>
      </section>
    </main>
  );
}

export default AuditLogs;